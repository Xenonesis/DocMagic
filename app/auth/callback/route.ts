import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  
  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/signin?error=${error}&message=${encodeURIComponent(errorDescription || error)}`
    );
  }

  // Handle PKCE flow (code parameter)
  if (code) {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              console.error('Error setting cookie:', error);
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              console.error('Error removing cookie:', error);
            }
          },
        },
      }
    );
    
    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Error exchanging code:', exchangeError);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/signin?error=exchange_failed&message=${encodeURIComponent(exchangeError.message)}`
        );
      }

      if (data.session) {
        console.log('✅ PKCE OAuth successful:', data.user?.email);
        
        // Get redirectTo parameter from URL
        const redirectTo = requestUrl.searchParams.get('redirectTo') || '/';
        const redirectUrl = `${requestUrl.origin}${redirectTo}`;
        
        console.log('Redirecting to:', redirectUrl);
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error: any) {
      console.error('Unexpected error in code exchange:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/signin?error=unexpected&message=${encodeURIComponent(error.message)}`
      );
    }
  }

  // No code and no error - likely implicit flow, redirect to intended page
  // The client-side will handle the hash fragment
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/';
  const redirectUrl = `${requestUrl.origin}${redirectTo}`;
  
  console.log('No code parameter, redirecting (implicit flow) to:', redirectUrl);
  return NextResponse.redirect(redirectUrl);
}
