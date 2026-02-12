'use client';

/**
 * Enhanced Resume Generator with All 5 New Features
 * Example integration showing how to use all features together
 */

import { useState, useEffect } from 'react';
import { Download, Sparkles, Save } from 'lucide-react';
import { useResumeDraft } from '@/hooks/useResumeDraft';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Import all 5 new features
import { VoiceInputButton } from '@/components/ui/voice-input-button';
import { TranslationPanel } from '@/components/ui/translation-panel';
import { PersonalizationPanel } from '@/components/ui/personalization-panel';
import { SmartSuggestionsPanel } from '@/components/ui/smart-suggestions-panel';
import { DocumentComparisonPanel } from '@/components/ui/document-comparison-panel';

import type { UserPreferences } from '@/lib/personalization-service';

export function EnhancedResumeGenerator() {
  // Resume data state - start with null to allow restoration
  const [resumeData, setResumeData] = useState<any>(null);

  // Initialize resume data from localStorage or defaults
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedDraft = localStorage.getItem('resumeDraft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Ensure it has the required structure
        if (parsed.personalInfo && parsed.summary !== undefined) {
          setResumeData(parsed);
          return;
        }
      } catch (error) {
        console.error('Error parsing saved draft:', error);
      }
    }
    // Fall back to defaults if no valid draft found
    setResumeData({
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
      },
      summary: '',
      experience: '',
      education: '',
      skills: '',
      projects: '',
    });
  }, []);

  // Auto-save resume draft to localStorage
  const { clearDraft } = useResumeDraft(resumeData, setResumeData, {
    showNotifications: false, // Skip notification since we handle initialization separately
    debounceMs: 1000,
  });

  // User preferences for personalization
  const [preferences, setPreferences] = useState<UserPreferences>({
    industry: 'Technology',
    role: 'Software Engineer',
    experienceLevel: 'mid',
    tonePreference: 'professional',
    stylePreference: 'concise',
    targetAudience: 'Hiring Managers',
  });

  // Track which field is currently being edited
  const [activeField, setActiveField] = useState<string>('summary');

  // Keep a version history for comparison
  const [versionHistory, setVersionHistory] = useState<string[]>([]);

  // Generate full resume content
  const generateFullContent = () => {
    return `
${resumeData.personalInfo.name}
${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}
${resumeData.personalInfo.location}
${resumeData.personalInfo.linkedin ? `LinkedIn: ${resumeData.personalInfo.linkedin}` : ''}
${resumeData.personalInfo.website ? `Website: ${resumeData.personalInfo.website}` : ''}

PROFESSIONAL SUMMARY
${resumeData.summary}

EXPERIENCE
${resumeData.experience}

EDUCATION
${resumeData.education}

SKILLS
${resumeData.skills}

PROJECTS
${resumeData.projects}
`.trim();
  };

  // Handle voice input for specific fields
  const handleVoiceInput = (field: string, transcript: string) => {
    if (field === 'summary' || field === 'experience' || field === 'education' || 
        field === 'skills' || field === 'projects') {
      setResumeData({
        ...resumeData,
        [field]: resumeData[field] + ' ' + transcript,
      });
    }
  };

  // Handle translation
  const handleTranslation = (field: string, translatedContent: string) => {
    if (field === 'summary' || field === 'experience' || field === 'education' || 
        field === 'skills' || field === 'projects') {
      setResumeData({
        ...resumeData,
        [field]: translatedContent,
      });
    }
  };

  // Handle personalization
  const handlePersonalization = (field: string, personalizedContent: string) => {
    if (field === 'summary' || field === 'experience' || field === 'education' || 
        field === 'skills' || field === 'projects') {
      setResumeData({
        ...resumeData,
        [field]: personalizedContent,
      });
    }
  };

  // Save current version to history
  const saveVersion = () => {
    const currentVersion = generateFullContent();
    setVersionHistory([...versionHistory, currentVersion]);
  };

  // Get active field content
  const getActiveFieldContent = () => {
    if (!resumeData) return '';
    const field = activeField as keyof typeof resumeData;
    return typeof resumeData[field] === 'string' ? resumeData[field] : '';
  };

  // Set active field content
  const setActiveFieldContent = (content: string) => {
    if (!resumeData) return;
    const field = activeField as keyof typeof resumeData;
    if (typeof resumeData[field] === 'string') {
      setResumeData({
        ...resumeData,
        [field]: content,
      });
    }
  };

  // Loading state while data is being initialized
  if (!resumeData) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="text-center">
          <p className="text-muted-foreground">Loading resume builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Enhanced Resume Generator</h1>
        <p className="text-muted-foreground">
          Create a professional resume with AI-powered assistance
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={resumeData.personalInfo.name}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, name: e.target.value },
                      })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                      })
                    }
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                      })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                      })
                    }
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="summary" onValueChange={setActiveField}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Professional Summary</CardTitle>
                    <div className="flex gap-2">
                      <VoiceInputButton
                        onTranscript={(text) => handleVoiceInput('summary', text)}
                        buttonSize="sm"
                      />
                      <TranslationPanel
                        content={resumeData.summary}
                        onTranslated={(text) => handleTranslation('summary', text)}
                      />
                      <PersonalizationPanel
                        content={resumeData.summary}
                        documentType="resume"
                        onPersonalized={(text) => handlePersonalization('summary', text)}
                        defaultPreferences={preferences}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={resumeData.summary}
                    onChange={(e) =>
                      setResumeData({ ...resumeData, summary: e.target.value })
                    }
                    placeholder="Write a compelling professional summary that highlights your key qualifications..."
                    className="min-h-[150px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Work Experience</CardTitle>
                    <div className="flex gap-2">
                      <VoiceInputButton
                        onTranscript={(text) => handleVoiceInput('experience', text)}
                        buttonSize="sm"
                      />
                      <TranslationPanel
                        content={resumeData.experience}
                        onTranslated={(text) => handleTranslation('experience', text)}
                      />
                      <PersonalizationPanel
                        content={resumeData.experience}
                        documentType="resume"
                        onPersonalized={(text) => handlePersonalization('experience', text)}
                        defaultPreferences={preferences}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={resumeData.experience}
                    onChange={(e) =>
                      setResumeData({ ...resumeData, experience: e.target.value })
                    }
                    placeholder="List your work experience with company names, positions, dates, and key achievements..."
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Education</CardTitle>
                    <div className="flex gap-2">
                      <VoiceInputButton
                        onTranscript={(text) => handleVoiceInput('education', text)}
                        buttonSize="sm"
                      />
                      <TranslationPanel
                        content={resumeData.education}
                        onTranslated={(text) => handleTranslation('education', text)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={resumeData.education}
                    onChange={(e) =>
                      setResumeData({ ...resumeData, education: e.target.value })
                    }
                    placeholder="List your educational background..."
                    className="min-h-[150px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Skills</CardTitle>
                    <div className="flex gap-2">
                      <VoiceInputButton
                        onTranscript={(text) => handleVoiceInput('skills', text)}
                        buttonSize="sm"
                      />
                      <PersonalizationPanel
                        content={resumeData.skills}
                        documentType="resume"
                        onPersonalized={(text) => handlePersonalization('skills', text)}
                        defaultPreferences={preferences}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={resumeData.skills}
                    onChange={(e) =>
                      setResumeData({ ...resumeData, skills: e.target.value })
                    }
                    placeholder="List your technical and soft skills..."
                    className="min-h-[150px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Projects</CardTitle>
                    <div className="flex gap-2">
                      <VoiceInputButton
                        onTranscript={(text) => handleVoiceInput('projects', text)}
                        buttonSize="sm"
                      />
                      <TranslationPanel
                        content={resumeData.projects}
                        onTranslated={(text) => handleTranslation('projects', text)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={resumeData.projects}
                    onChange={(e) =>
                      setResumeData({ ...resumeData, projects: e.target.value })
                    }
                    placeholder="Describe your notable projects..."
                    className="min-h-[150px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button onClick={saveVersion} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Version
            </Button>
            <DocumentComparisonPanel
              originalContent={versionHistory[versionHistory.length - 1] || ''}
              modifiedContent={generateFullContent()}
              originalLabel="Last Saved"
              modifiedLabel="Current"
            />
            <Button
              className="ml-auto"
              onClick={() => {
                // After successful download, clear the draft
                clearDraft();
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          </div>
        </div>

        {/* Smart Suggestions - Right Side */}
        <div className="space-y-4">
          <SmartSuggestionsPanel
            content={getActiveFieldContent()}
            documentType="resume"
            preferences={preferences}
            onApplySuggestion={(suggestion) => {
              // Apply suggestion to active field
              const currentContent = getActiveFieldContent();
              if (suggestion.original && currentContent.includes(suggestion.original)) {
                const updatedContent = currentContent.replace(
                  suggestion.original,
                  suggestion.suggested
                );
                setActiveFieldContent(updatedContent);
              } else {
                // If no original text, append the suggestion
                setActiveFieldContent(currentContent + '\n' + suggestion.suggested);
              }
            }}
            autoRefresh={false}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded">
                <strong>Voice Input:</strong> Click the microphone icon to dictate content
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-950 rounded">
                <strong>Translation:</strong> Translate your resume to 25+ languages
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded">
                <strong>Personalization:</strong> Adapt content to your industry and style
              </div>
              <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
                <strong>Suggestions:</strong> Get AI recommendations for improvements
              </div>
              <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded">
                <strong>Comparison:</strong> Compare versions to track changes
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
