# Web3 Wallet Authentication Setup Guide

This guide will help you set up Web3 wallet authentication (Ethereum and Solana) for your docverse application using Supabase.

## Overview

Web3 authentication allows users to sign in using their cryptocurrency wallets:

- **Ethereum**: MetaMask and other EIP-4361 compatible wallets
- **Solana**: Phantom and other SIWS compatible wallets

## Prerequisites

1. A Supabase project (get one at [supabase.com](https://supabase.com))
2. MetaMask browser extension (for Ethereum testing)
3. Phantom browser extension (for Solana testing)

## Step 1: Enable Web3 Authentication in Supabase

### For Ethereum (Sign-In with Ethereum - SIWE/EIP-4361)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Scroll down to **Web3 Wallet** section
4. Toggle **Enable Sign in with Ethereum**
5. Configure the following settings:
   - **Enabled**: ON
   - **Rate Limits**: Set according to your needs (default is fine)
6. Click **Save**

### For Solana (Sign-In with Solana - SIWS)

1. In the same **Web3 Wallet** section
2. Toggle **Enable Sign in with Solana**
3. Configure the following settings:
   - **Enabled**: ON
   - **Rate Limits**: Set according to your needs (default is fine)
4. Click **Save**

## Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Enable Web3 Authentication
NEXT_PUBLIC_ENABLE_WEB3_AUTH=true

# Your existing Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

## Step 3: Install Required Browser Extensions

### For Ethereum Testing

1. Install [MetaMask](https://metamask.io/download/)
2. Create or import a wallet
3. Make sure you're on a supported network (Ethereum Mainnet, Goerli, etc.)

### For Solana Testing

1. Install [Phantom Wallet](https://phantom.app/)
2. Create or import a wallet
3. Make sure you have some SOL for testing (use devnet for testing)

## Step 4: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to the sign-in page: `http://localhost:3000/auth/signin`

3. You should see two new buttons:
   - **Sign in with Ethereum** (with Ethereum logo)
   - **Sign in with Solana** (with Solana logo)

4. Click on either button and follow the wallet prompts to authenticate

## How It Works

### Ethereum Authentication Flow

1. User clicks "Sign in with Ethereum"
2. MetaMask prompts user to connect their wallet
3. A message is generated following EIP-4361 standard
4. User signs the message with their private key
5. The signature is verified and user is authenticated
6. User is redirected to the app

### Solana Authentication Flow

1. User clicks "Sign in with Solana"
2. Phantom prompts user to connect their wallet
3. A message is generated following SIWS standard
4. User signs the message with their private key
5. The signature is verified and user is authenticated
6. User is redirected to the app

## Security Considerations

1. **Message Signing**: Both implementations use cryptographic signatures to verify wallet ownership
2. **Nonce**: Each sign-in request includes a unique nonce to prevent replay attacks
3. **Timestamp**: Messages include timestamps to prevent old signatures from being reused
4. **Domain Binding**: Messages are bound to your domain to prevent phishing

## Backend Verification (Production)

For production use, you should verify signatures on your backend:

1. Create an API route to verify Web3 signatures
2. Validate the signature matches the message and address
3. Check the nonce hasn't been used before
4. Verify the timestamp is recent
5. Create or update the user session in Supabase

Example API route structure:

```typescript
// app/api/auth/web3/verify/route.ts
export async function POST(request: Request) {
  const { address, signature, message, provider } = await request.json();

  // Verify signature
  // Check nonce
  // Validate timestamp
  // Create Supabase session

  return Response.json({ success: true });
}
```

## Troubleshooting

### "MetaMask Not Found" or "Phantom Wallet Not Found"

- Make sure the browser extension is installed
- Try refreshing the page
- Check if the extension is enabled
- Try a different browser

### Signature Verification Failed

- Make sure you're using the correct network
- Check that your Supabase configuration is correct
- Verify the Web3 provider is enabled in Supabase Dashboard

### Connection Issues

- Check your internet connection
- Make sure the wallet extension is unlocked
- Try disconnecting and reconnecting the wallet
- Clear browser cache and cookies

## Additional Resources

- [EIP-4361: Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361)
- [Sign-In with Solana (SIWS)](https://github.com/phantom/sign-in-with-solana)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Phantom Documentation](https://docs.phantom.app/)

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Review the Supabase logs in your dashboard
3. Open an issue on the GitHub repository
4. Join our community Discord for help

## Next Steps

- Implement backend signature verification
- Add support for more wallet providers
- Implement wallet connection persistence
- Add multi-wallet support
- Integrate with your user profile system
