// Note: This parser is currently not used due to Next.js bundling issues with mammoth
// The parsing is done directly in the API route using require()
// Keeping this file for potential future use or other contexts

export async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
