import { NextResponse } from 'next/server';
import { createRoute } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email';
import {
  validateAndSanitize,
  registrationSchema,
  detectSqlInjection,
  sanitizeInput,
} from '@/lib/validation';

// This route handles user registration
export async function POST(request: Request) {
  try {
    console.log('[Registration] Starting registration process');
    console.log('[Registration] Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
    });

    const rawBody = await request.json();
    console.log('[Registration] Received request body');

    // Validate and sanitize input
    const { name, email, password } = validateAndSanitize(registrationSchema, rawBody);
    console.log('[Registration] Input validated successfully');

    // Additional security checks
    if (detectSqlInjection(name) || detectSqlInjection(email)) {
      console.warn('[Registration] SQL injection attempt detected');
      return new Response(JSON.stringify({ error: 'Invalid input detected' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    console.log('[Registration] Inputs sanitized');

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[Registration] Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error. Please contact support.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    console.log('[Registration] Creating Supabase client');
    const supabase = createRoute();
    console.log('[Registration] Supabase client created successfully');

    // Sign up with Supabase Auth (no email confirmation required)
    console.log('[Registration] Attempting to sign up user');
    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        data: {
          name: sanitizedName,
          email: sanitizedEmail,
        },
      },
    });

    if (error) {
      console.error('[Registration] Signup error:', error);
      console.error('[Registration] Error details:', {
        message: error.message,
        status: error.status,
        name: error.name,
      });

      // Handle specific error cases
      if (error.message.includes('already registered')) {
        return new Response(
          JSON.stringify({ error: 'An account with this email already exists' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }

      return new Response(JSON.stringify({ error: error.message || 'Failed to create user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!data.user) {
      return new Response(JSON.stringify({ error: 'User creation failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send welcome email (non-blocking)
    // Don't await to prevent email errors from blocking registration
    sendWelcomeEmail(data.user.email || email, name).catch((emailError) => {
      console.error('Failed to send welcome email:', emailError);
      // Email failure should not affect registration success
    });

    // Return success message
    return new Response(
      JSON.stringify({
        message: 'Registration successful! You can now sign in.',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: sanitizedName,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    console.error('[Registration] Unexpected error in registration:', error);
    console.error('[Registration] Error stack:', error.stack);
    console.error('[Registration] Error type:', typeof error);
    console.error('[Registration] Error details:', {
      message: error.message,
      name: error.name,
      cause: error.cause,
    });

    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

// Add route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
