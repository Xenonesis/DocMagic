/**
 * Simple test to verify pdf-parse works
 */

import * as pdfParse from 'pdf-parse';
import fs from 'fs';

async function testPdfParse() {
  console.log('Testing pdf-parse import...\n');
  
  // Create a simple text file to test
  const testText = 'This is a test resume.\n\nEXPERIENCE\nSoftware Engineer at Tech Corp\n\nSKILLS\nJavaScript, React, Node.js';
  
  console.log('✅ pdf-parse imported successfully');
  console.log('Type:', typeof pdfParse);
  console.log('Is function:', typeof pdfParse === 'function');
  console.log('Keys:', Object.keys(pdfParse));
  console.log('Has default:', 'default' in pdfParse);
  console.log('Default type:', typeof pdfParse.default);
  
  // Test with a simple buffer
  try {
    const buffer = Buffer.from(testText);
    console.log('\n✅ Buffer created successfully');
    console.log('Buffer length:', buffer.length);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPdfParse();
