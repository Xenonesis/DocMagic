export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { generateGuidedResume } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      personalInfo,
      professionalSummary,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      links,
      targetRole,
      jobDescription,
    } = body;

    // All fields are now optional - generate resume with whatever data is provided
    const resume = await generateGuidedResume({
      personalInfo: personalInfo || {},
      professionalSummary: professionalSummary || '',
      workExperience: workExperience || [],
      education: education || [],
      skills: skills || { technical: [], programming: [], tools: [], soft: [] },
      projects: projects || [],
      certifications: certifications || [],
      links: links || {},
      targetRole: targetRole || 'General Position',
      jobDescription: jobDescription || '',
    });

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error generating guided resume:', error);
    return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
  }
}
