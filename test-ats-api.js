/**
 * Test script for ATS Analyzer API
 * This script tests the /api/analyze/resume endpoint
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testATSAnalyzer() {
  console.log('🧪 Testing ATS Analyzer API...\n');

  // Create a sample resume text file for testing
  const sampleResume = `
John Doe
Software Engineer

EXPERIENCE
Senior Software Engineer at Tech Corp (2020-2024)
- Developed web applications using React and Node.js
- Led a team of 5 developers
- Implemented CI/CD pipelines

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2016-2020)

SKILLS
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Git
`;

  const sampleJobDescription = `
We are looking for a Senior Software Engineer with experience in:
- React and Node.js development
- Team leadership
- CI/CD implementation
- AWS cloud services
- Docker containerization
`;

  try {
    // Create a temporary test file
    const testFilePath = path.join(__dirname, 'test-resume.txt');
    fs.writeFileSync(testFilePath, sampleResume);

    // Create FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));
    formData.append('jobDescription', sampleJobDescription);

    // Make request to API
    const response = await fetch('http://localhost:3000/api/analyze/resume', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    const result = await response.json();

    // Clean up test file
    fs.unlinkSync(testFilePath);

    if (response.ok) {
      console.log('✅ API Test Successful!\n');
      console.log('📊 Results:');
      console.log('─────────────────────────────────────');
      console.log(`Overall Score: ${result.score}%`);
      console.log('\nSection Scores:');
      Object.entries(result.analysis.sectionScores).forEach(([section, score]) => {
        console.log(`  - ${section}: ${score}%`);
      });
      console.log(`\nFormatting Score: ${result.analysis.formattingScore}%`);
      console.log(`\nKeywords Found: ${result.analysis.keywordMatch.found.length}`);
      console.log(`Keywords Missing: ${result.analysis.keywordMatch.missing.length}`);

      if (result.improvements.critical.length > 0) {
        console.log('\n⚠️  Critical Improvements:');
        result.improvements.critical.forEach((imp) => console.log(`  - ${imp}`));
      }

      if (result.improvements.aiSuggestions.length > 0) {
        console.log('\n💡 AI Suggestions:');
        result.improvements.aiSuggestions.forEach((sug) => console.log(`  - ${sug}`));
      }

      console.log('\n✅ ATS Analyzer is working correctly!');
    } else {
      console.error('❌ API Test Failed!');
      console.error('Status:', response.status);
      console.error('Error:', result.error);
      if (result.details) {
        console.error('Details:', result.details);
      }
    }
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

// Run the test
testATSAnalyzer();
