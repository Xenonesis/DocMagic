import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Disable body parsing to handle FormData properly
export const config = {
  api: {
    bodyParser: false,
  },
};

// AI Configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'meta-llama/llama-4-maverick:free';
const GEMINI_MODEL = 'gemini-2.0-flash-exp';

async function extractTextFromFile(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();

  try {
    // Handle PDF files
    if (fileName.endsWith('.pdf')) {
      // Load pdf-parse dynamically in the API route context
      // pdf-parse v2 uses a class-based API
      const { PDFParse } = require('pdf-parse');
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      return result.text;
    }

    // Handle DOCX files
    if (fileName.endsWith('.docx')) {
      // Load mammoth dynamically in the API route context
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    // Handle DOC files (older format) - fallback to text
    if (fileName.endsWith('.doc')) {
      // For .doc files, we'll try to read as text
      // Note: Full .doc parsing requires more complex libraries
      return buffer.toString('utf-8');
    }

    // Handle TXT files
    if (fileName.endsWith('.txt')) {
      return buffer.toString('utf-8');
    }

    // Default fallback
    return buffer.toString('utf-8');
  } catch (error) {
    console.error('Error extracting text from file:', error);
    // Fallback to basic text extraction
    return buffer.toString('utf-8');
  }
}

function calculateKeywordMatch(jobKeywords, resumeWords) {
  const jobSet = new Set(jobKeywords);
  const resumeSet = new Set(resumeWords);

  const foundKeywords = Array.from(jobSet).filter((kw) => resumeSet.has(kw));
  const missingKeywords = Array.from(jobSet).filter((kw) => !resumeSet.has(kw));

  const score =
    jobSet.size > 0 ? Math.min(100, Math.round((foundKeywords.length / jobSet.size) * 100)) : 0;

  return { found: foundKeywords, missing: missingKeywords, score };
}

function calculateSectionPresence(resumeText) {
  const sections = [
    { name: 'experience', keywords: ['experience', 'work history', 'employment'] },
    { name: 'education', keywords: ['education', 'degree', 'university'] },
    { name: 'skills', keywords: ['skills', 'competencies', 'technologies'] },
    { name: 'summary', keywords: ['summary', 'profile', 'objective'] },
  ];
  const text = resumeText.toLowerCase();

  return sections.map((section) => ({
    name: section.name,
    score: section.keywords.some((kw) => text.includes(kw)) ? 100 : 0,
  }));
}

function calculateFormattingScore(resumeText) {
  const hasBulletPoints = /•|⦿|◦|‣|⁃|∙|○|▪|◾|⦾/.test(resumeText);
  const hasHeadings = /\n\s*[A-Z][A-Z ]+\s*\n/.test(resumeText);
  const hasDates = /(20\d{2}|19\d{2})/.test(resumeText);

  let score = 50;
  if (hasBulletPoints) score += 15;
  if (hasHeadings) score += 15;
  if (hasDates) score += 20;

  return Math.min(100, score);
}

/**
 * Generate AI-powered analysis using OpenRouter (primary) or Gemini (fallback)
 */
async function generateAIAnalysis(resumeText, jobDescription, basicAnalysis) {
  const prompt = `Analyze this resume against the job description and provide detailed ATS optimization suggestions.

RESUME:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

CURRENT ANALYSIS:
- Overall Score: ${basicAnalysis.overallScore}%
- Keyword Match: ${basicAnalysis.keywordMatch.score}%
- Found Keywords: ${basicAnalysis.keywordMatch.found.slice(0, 10).join(', ')}
- Missing Keywords: ${basicAnalysis.keywordMatch.missing.slice(0, 10).join(', ')}

Provide a JSON response with:
{
  "critical": ["array of 2-3 critical improvements needed"],
  "recommended": ["array of 2-3 recommended enhancements"],
  "aiSuggestions": ["array of 3-5 specific, actionable AI-powered suggestions"]
}

Focus on:
1. Specific keyword optimization
2. Section improvements
3. Formatting enhancements
4. ATS compatibility tips
5. Quantifiable achievements recommendations`;

  // Try OpenRouter first
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (openRouterKey) {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'DocMagic ATS Analyzer',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;

        // Extract JSON from markdown if present
        const jsonMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        const jsonText = jsonMatch ? jsonMatch[1].trim() : content.trim();

        return JSON.parse(jsonText);
      }
    }
  } catch (error) {
    console.log('OpenRouter failed, trying Gemini...', error.message);
  }

  // Fallback to Gemini
  try {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (geminiKey) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      // Extract JSON from markdown if present
      const jsonMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      const jsonText = jsonMatch ? jsonMatch[1].trim() : content.trim();

      return JSON.parse(jsonText);
    }
  } catch (error) {
    console.log('Gemini also failed, using basic analysis...', error.message);
  }

  // Fallback to basic analysis if both AI providers fail
  return generateBasicImprovements(basicAnalysis);
}

function generateBasicImprovements(analysis) {
  const critical = [];
  const recommended = [];
  const aiSuggestions = [];

  if (analysis.keywordMatch.score < 70) {
    critical.push(
      `Add ${Math.ceil(analysis.keywordMatch.missing.length * 0.7)} more keywords from the job description.`,
    );
  }

  analysis.sectionScores.forEach((section) => {
    if (section.score === 0) {
      critical.push(`Add a dedicated ${section.name} section.`);
    }
  });

  if (analysis.formattingScore < 70) {
    recommended.push('Improve formatting with clear headings and bullet points.');
  }

  if (analysis.keywordMatch.score < 85) {
    aiSuggestions.push(
      `Consider adding these keywords: ${analysis.keywordMatch.missing.slice(0, 5).join(', ')}.`,
    );
  }
  if (analysis.sectionScores.every((s) => s.score > 0)) {
    aiSuggestions.push('Good job including all key sections! Focus on quantifying achievements.');
  }

  return { critical, recommended, aiSuggestions };
}

export async function POST(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const jobDescription = formData.get('jobDescription');

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume file and job description are required' },
        { status: 400, headers },
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400, headers },
      );
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        },
        { status: 400, headers },
      );
    }

    const resumeText = await extractTextFromFile(file);

    // Validate extracted text
    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            'Could not extract sufficient text from the resume. Please ensure the file is not corrupted or empty.',
        },
        { status: 400, headers },
      );
    }

    const jobKeywords = jobDescription.toLowerCase().match(/\b[\w-]{3,}\b/g) || [];
    const resumeWords = resumeText.toLowerCase().match(/\b[\w-]{3,}\b/g) || [];

    const keywordMatch = calculateKeywordMatch(jobKeywords, resumeWords);
    const sectionScores = calculateSectionPresence(resumeText);
    const formattingScore = calculateFormattingScore(resumeText);

    const overallScore = Math.max(
      20,
      Math.round(
        keywordMatch.score * 0.6 +
          (sectionScores.reduce((sum, s) => sum + s.score, 0) / sectionScores.length) * 0.3 +
          formattingScore * 0.1,
      ),
    );

    // Generate AI-powered improvements
    const basicAnalysis = {
      keywordMatch,
      sectionScores,
      formattingScore,
      overallScore,
    };

    const improvements = await generateAIAnalysis(resumeText, jobDescription, basicAnalysis);

    return NextResponse.json(
      {
        success: true,
        score: overallScore,
        analysis: {
          keywordMatch,
          sectionScores: Object.fromEntries(sectionScores.map((s) => [s.name, s.score])),
          formattingScore,
        },
        improvements,
      },
      { headers },
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500, headers },
    );
  }
}
