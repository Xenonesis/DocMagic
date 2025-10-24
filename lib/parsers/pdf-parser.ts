// Note: This parser is currently not used due to Next.js bundling issues with pdf-parse
// The parsing is done directly in the API route using require()
// Keeping this file for potential future use or other contexts

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(buffer);
  return data.text;
}
