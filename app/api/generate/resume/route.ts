export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { generateResume } from '@/lib/gemini';
import {
  validateAndSanitize,
  resumeGenerationSchema,
  detectSqlInjection,
  sanitizeInput,
} from '@/lib/validation';
import { createRoute } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // Validate and sanitize input
    const { prompt, name, email } = validateAndSanitize(resumeGenerationSchema, rawBody);

    // Additional security checks - only check non-empty fields
    if (
      (prompt && detectSqlInjection(prompt)) ||
      (name && detectSqlInjection(name)) ||
      (email && detectSqlInjection(email))
    ) {
      return NextResponse.json({ error: 'Invalid input detected' }, { status: 400 });
    }

    // Sanitize inputs - provide defaults for empty values
    const sanitizedPrompt = prompt ? sanitizeInput(prompt) : 'Create a professional resume';
    const sanitizedName = name ? sanitizeInput(name) : '';
    const sanitizedEmail = email ? sanitizeInput(email) : '';

    const resume = await generateResume({
      prompt: sanitizedPrompt,
      name: sanitizedName,
      email: sanitizedEmail,
    });

    return NextResponse.json(resume);
  } catch (error: any) {
    console.error('Error generating resume:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate resume' },
      { status: 500 },
    );
  }
}
