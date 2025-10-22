import { type NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Prompt and type are required' },
        { status: 400 }
      );
    }

    // Create type-specific prompts
    const systemPrompts = {
      resume: `You are an expert resume template creator. Create a professional resume template based on the user's description. Return a JSON object with:
- title: A descriptive title for the template
- description: A brief description of the template
- content: A structured object with resume sections like personalInfo, summary, experience, education, skills, etc.

Make the template modern, ATS-friendly, and professional.`,

      cv: `You are an expert CV template creator. Create an academic CV template based on the user's description. Return a JSON object with:
- title: A descriptive title for the template
- description: A brief description of the template  
- content: A structured object with CV sections like personalInfo, summary, education, research, publications, awards, etc.

Make the template suitable for academic and research positions.`,

      letter: `You are an expert cover letter template creator. Create a professional cover letter template based on the user's description. Return a JSON object with:
- title: A descriptive title for the template
- description: A brief description of the template
- content: A structured object with letter sections like header, salutation, introduction, body, conclusion, closing, etc.

Make the template professional and persuasive.`,

      presentation: `You are an expert presentation template creator. Create a professional presentation template based on the user's description. Return a JSON object with:
- title: A descriptive title for the template
- description: A brief description of the template
- content: A structured object with presentation elements like title, slides array with content, themes, layouts, etc.

Make the template engaging and visually appealing.`
    };

    const systemPrompt = systemPrompts[type as keyof typeof systemPrompts];
    if (!systemPrompt) {
      return NextResponse.json(
        { error: 'Invalid template type' },
        { status: 400 }
      );
    }

    const userPrompt = `User request: ${prompt}\n\nPlease return only valid JSON without any markdown formatting or additional text.`;

    const generatedTemplate = await generateAIResponse({
      systemPrompt,
      userPrompt,
      temperature: 0.7,
      maxTokens: 3000,
    });

    // Validate the response structure
    if (!generatedTemplate.title || !generatedTemplate.content) {
      return NextResponse.json(
        { error: 'Invalid template structure generated' },
        { status: 500 }
      );
    }

    return NextResponse.json(generatedTemplate);

  } catch (error) {
    console.error('Error generating AI template:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
