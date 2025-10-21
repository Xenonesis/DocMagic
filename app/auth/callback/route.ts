import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/';
  const activity = requestUrl.searchParams.get('activity');

  if (code) {
    const cookieStore = cookies();
    
    // Create a server-side Supabase client with proper cookie handling
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
              // Handle cookie setting errors (e.g., in middleware)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // Handle cookie removal errors
            }
          },
        },
      }
    );
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/signin?error=auth_failed`
        );
      }

      // Build the redirect URL with parameters
      let finalRedirect = redirectTo;
      if (activity) {
        finalRedirect += `${redirectTo.includes('?') ? '&' : '?'}activity=${activity}`;
      }

      // Successful authentication - redirect to the intended page
      return NextResponse.redirect(`${requestUrl.origin}${finalRedirect}`);
    } catch (error) {
      console.error('Unexpected error in auth callback:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/signin?error=unexpected_error`
      );
    }
  }

  // No code provided - redirect to sign in
  return NextResponse.redirect(`${requestUrl.origin}/auth/signin`);
}
