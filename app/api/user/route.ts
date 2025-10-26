import { createRoute } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const supabase = createRoute();

  // Get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized', user: null },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  }

  const { data, error } = await supabase
    .from('users')
    .select('*, subscription:subscriptions(*)')
    .eq('email', session.user.email)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'User not found', user: null }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      email: session.user.email,
      id: session.user.id,
    },
    subscription: data.subscription || null,
  });
}
