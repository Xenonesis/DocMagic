import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Slide = {
  title: string;
  content?: string;
  bullets?: string[];
};

type RequestData = {
  slides: Slide[];
  template: string;
  fileName: string;
};

const getTemplateColors = (template: string) => {
  const colors = {
    'modern-business': { background: 'F8FAFC', textColor: '1E3A8A', accentColor: '3B82F6' },
    'creative-gradient': { background: 'FCF8FF', textColor: '7C2D92', accentColor: 'A855F7' },
    'minimalist-pro': { background: 'F9FAFB', textColor: '374151', accentColor: '6B7280' },
    'tech-modern': { background: '0F172A', textColor: 'FFFFFF', accentColor: '06B6D4' },
    'elegant-dark': { background: '111827', textColor: 'FFFFFF', accentColor: 'FBBF24' },
    'startup-pitch': { background: 'F0FDF4', textColor: '065F46', accentColor: '10B981' }
  };
  return colors[template as keyof typeof colors] || colors['modern-business'];
};

export async function POST(request: NextRequest) {
  try {
    const { slides, template, fileName } = await request.json() as RequestData;

    if (!slides || !slides.length) {
      return NextResponse.json({ error: 'No slides provided' }, { status: 400 });
    }

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    slides.forEach((slide, index) => {
      const pptxSlide = pptx.addSlide();
      const templateStyles = getTemplateColors(template);

      // Set slide background
      pptxSlide.background = { color: templateStyles.background };

      // Add title
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: 12,
        h: 1.2,
        fontSize: 32,
        bold: true,
        color: templateStyles.textColor,
        fontFace: 'Arial'
      });

      // Add content
      if (slide.content) {
        pptxSlide.addText(slide.content, {
          x: 0.5,
          y: 2,
          w: 12,
          h: 2,
          fontSize: 18,
          color: templateStyles.textColor,
          fontFace: 'Arial'
        });
      }

      // Add bullets if available
      if (slide.bullets) {
        pptxSlide.addText(slide.bullets, {
          x: 0.5,
          y: 4,
          w: 12,
          h: 3,
          fontSize: 16,
          bullet: true,
          color: templateStyles.textColor,
          fontFace: 'Arial'
        });
      }

      // Add slide number
      pptxSlide.addText(`${index + 1}`, {
        x: 12.5,
        y: 6.8,
        w: 0.5,
        h: 0.3,
        fontSize: 12,
        color: templateStyles.accentColor,
        align: 'center'
      });
    });

    // Generate PPTX file as base64
    const pptxData = await pptx.write({ outputType: 'base64' }) as string;
    const buffer = Buffer.from(pptxData, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${fileName}.pptx"`,
      },
    });
  } catch (error) {
    console.error('Error generating PPTX:', error);
    return NextResponse.json(
      { error: 'Failed to generate PowerPoint file' },
      { status: 500 }
    );
  }
}
