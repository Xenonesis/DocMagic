export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { generateDiagram } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, diagramType = 'flowchart' } = body;

    console.log('Diagram generation request:', { prompt, diagramType });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400 }
      );
    }

    const diagram = await generateDiagram({ prompt, diagramType });
    
    console.log('Diagram generated successfully:', {
      hasCode: !!diagram.code,
      hasTitle: !!diagram.title,
      type: diagram.type
    });

    // Ensure the response has the expected format
    if (!diagram.code) {
      throw new Error('Generated diagram is missing code');
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error('Error generating diagram:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to generate diagram',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}