import { NextRequest, NextResponse } from 'next/server';
import { createRoute } from '@/lib/supabase/server';
import { verifyMessage } from 'ethers';

// Store used nonces (in production, use Redis or database)
const usedNonces = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { address, signature, message, provider, timestamp } = await request.json();

    // Validate required fields
    if (!address || !signature || !message || !provider) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check timestamp (message should be recent, within 5 minutes)
    const messageTime = new Date(timestamp).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - messageTime > fiveMinutes) {
      return NextResponse.json({ error: 'Message expired' }, { status: 401 });
    }

    // Extract nonce from message
    const nonceMatch = message.match(/Nonce: ([a-zA-Z0-9]+)/);
    if (!nonceMatch) {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    const nonce = nonceMatch[1];

    // Check if nonce has been used
    if (usedNonces.has(nonce)) {
      return NextResponse.json({ error: 'Nonce already used' }, { status: 401 });
    }

    // Verify signature based on provider
    let recoveredAddress: string;

    if (provider === 'ethereum') {
      // Verify Ethereum signature
      try {
        recoveredAddress = verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
      } catch (error) {
        console.error('Ethereum signature verification failed:', error);
        return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
      }
    } else if (provider === 'solana') {
      // For Solana, you would use @solana/web3.js to verify
      // This is a simplified version - implement proper Solana verification
      // using nacl.sign.detached.verify in production

      // TODO: Implement Solana signature verification
      // For now, we'll accept it (NOT SECURE FOR PRODUCTION)
      console.warn('Solana signature verification not fully implemented');
      recoveredAddress = address;
    } else {
      return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
    }

    // Mark nonce as used
    usedNonces.add(nonce);

    // Create or get user in Supabase
    const supabase = createRoute();

    // Check if user exists with this wallet address
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // If user doesn't exist, create a new one
    if (!existingUser) {
      const { data: newUser, error: createError } = await supabase.auth.signUp({
        email: `${address.toLowerCase()}@web3.local`,
        password: Math.random().toString(36).substring(2, 15),
        options: {
          data: {
            wallet_address: address.toLowerCase(),
            wallet_provider: provider,
            display_name: `${provider === 'ethereum' ? 'ETH' : 'SOL'} User ${address.slice(0, 6)}`,
          },
        },
      });

      if (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }
    }

    // Sign in the user
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email: `${address.toLowerCase()}@web3.local`,
      password: Math.random().toString(36).substring(2, 15),
    });

    if (signInError) {
      console.error('Error signing in:', signInError);
      return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        address: address.toLowerCase(),
        provider,
      },
      session: sessionData.session,
    });
  } catch (error) {
    console.error('Web3 verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
