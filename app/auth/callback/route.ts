import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors from provider
  if (error) {
    console.error('❌ OAuth provider error:', error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/signin?error=${error}&message=${encodeURIComponent(errorDescription || error)}`,
    );
  }

  // For PKCE flow, the code verifier is stored in localStorage by the browser client
  // We need to redirect to a client-side page that can access localStorage
  // and let the Supabase client handle the code exchange automatically
  console.log('🔄 OAuth callback received, redirecting to home for client-side processing');

  // Redirect to home page with the full query string
  // The client-side Supabase will automatically detect and exchange the code
  const redirectUrl = new URL('/', requestUrl.origin);

  // Preserve all query parameters for client-side processing
  requestUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(redirectUrl.toString());
}
