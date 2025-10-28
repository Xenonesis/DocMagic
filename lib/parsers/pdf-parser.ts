// Note: This parser is currently not used due to Next.js bundling issues with pdf-parse
// The parsing is done directly in the API route using require()
// Keeping this file for potential future use or other contexts

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  // pdf-parse v2 uses a class-based API
  const { PDFParse } = require('pdf-parse');
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text;
}
