"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuthGuard, PROTECTED_ACTIVITIES } from "@/lib/auth-utils";
import { ExportAuthDialog } from "@/components/ui/export-auth-dialog";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award, 
  Link as LinkIcon, 
  Github, 
  Linkedin, 
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Target,
  Zap,
  Brain,
  TrendingUp,
  Plus,
  Trash2,
  Loader2,
  FileText,
  Star,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

type ResumeStep = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'links' | 'review';

interface GuidedResumeGeneratorProps {
  onResumeGenerated?: (resume: any) => void;
}

export function GuidedResumeGenerator({ onResumeGenerated }: GuidedResumeGeneratorProps) {
  const [currentStep, setCurrentStep] = useState<ResumeStep>('personal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepGuidance, setStepGuidance] = useState<any>(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuthGuard();
  const router = useRouter();

  // Form data state
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: ""
  });

  const [professionalSummary, setProfessionalSummary] = useState("");
  
  const [workExperience, setWorkExperience] = useState([{
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: ""
  }]);

  const [education, setEducation] = useState([{
    degree: "",
    institution: "",
    location: "",
    graduationDate: "",
    gpa: "",
    honors: ""
  }]);

  const [skills, setSkills] = useState({
    technical: [] as string[],
    programming: [] as string[],
    tools: [] as string[],
    soft: [] as string[]
  });

  const [projects, setProjects] = useState([{
    name: "",
    description: "",
    technologies: [] as string[],
    link: ""
  }]);

  const [certifications, setCertifications] = useState([{
    name: "",
    issuer: "",
    date: "",
    credential: ""
  }]);

  const [links, setLinks] = useState({
    linkedin: "",
    github: "",
    website: "",
    portfolio: ""
  });

  // State for skills input
  const [newSkill, setNewSkill] = useState({ technical: "", programming: "", tools: "", soft: "" });

  const steps: { id: ResumeStep; title: string; icon: any; description: string }[] = [
    { id: 'personal', title: 'Personal Info', icon: User, description: 'Basic contact information' },
    { id: 'summary', title: 'Professional Summary', icon: FileText, description: 'Your professional overview' },
    { id: 'experience', title: 'Work Experience', icon: Briefcase, description: 'Your work history' },
    { id: 'education', title: 'Education', icon: GraduationCap, description: 'Academic background' },
    { id: 'skills', title: 'Skills', icon: Code, description: 'Technical and soft skills' },
    { id: 'projects', title: 'Projects', icon: Zap, description: 'Notable projects' },
    { id: 'certifications', title: 'Certifications', icon: Award, description: 'Professional certifications' },
    { id: 'links', title: 'Professional Links', icon: LinkIcon, description: 'Online presence' },
    { id: 'review', title: 'Review & Generate', icon: CheckCircle, description: 'Final review' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  // Load step guidance when step changes
  useEffect(() => {
    if (targetRole && currentStep !== 'review') {
      loadStepGuidance();
    }
  }, [currentStep, targetRole]);

  const loadStepGuidance = async () => {
    if (!targetRole) return;

    try {
      const response = await fetch('/api/generate/resume-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep,
          targetRole,
          existingData: getCurrentStepData()
        })
      });

      if (response.ok) {
        const guidance = await response.json();
        setStepGuidance(guidance);
      }
    } catch (error) {
      console.error('Failed to load step guidance:', error);
    }
  };

  const getCurrentStepData = () => {
    switch (currentStep) {
      case 'personal': return personalInfo;
      case 'summary': return professionalSummary;
      case 'experience': return workExperience;
      case 'education': return education;
      case 'skills': return skills;
      case 'projects': return projects;
      case 'certifications': return certifications;
      case 'links': return links;
      default: return null;
    }
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleSignIn = () => {
    const currentPath = window.location.pathname;
    router.push(`/auth/signin?redirectTo=${encodeURIComponent(currentPath)}`);
  };

  const generateResume = async () => {
    // Allow generation without authentication
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate/guided-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo,
          professionalSummary,
          workExperience,
          education,
          skills,
          projects,
          certifications,
          links,
          targetRole,
          jobDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const resume = await response.json();
      
      if (onResumeGenerated) {
        onResumeGenerated(resume);
      }

      toast({
        title: "🎯 ATS-Optimized Resume Generated!",
        description: `Your resume is optimized for ${targetRole} with ${resume.atsScore}% ATS compatibility. ${!isAuthenticated ? 'Sign in to download.' : ''}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addArrayItem = (setter: any, template: any) => {
    setter((prev: any[]) => [...prev, { ...template }]);
  };

  const removeArrayItem = (setter: any, index: number) => {
    setter((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  const updateArrayItem = (setter: any, index: number, field: string, value: any) => {
    setter((prev: any[]) => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addSkill = (category: keyof typeof skills, skill: string) => {
    if (skill.trim()) {
      setSkills(prev => ({
        ...prev,
        [category]: [...prev[category], skill.trim()]
      }));
    }
  };

  const removeSkill = (category: keyof typeof skills, index: number) => {
    setSkills(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-start gap-2 overflow-x-auto pb-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all whitespace-nowrap",
                currentStep === step.id
                  ? "bolt-gradient text-white shadow-lg scale-105"
                  : index < currentStepIndex
                  ? "bg-black dark:bg-black text-white dark:text-white border border-black dark:border-black hover:scale-105"
                  : "glass-effect hover:scale-105 hover:border-primary/30"
              )}
              onClick={() => setCurrentStep(step.id)}
            >
              <step.icon className="h-4 w-4" />
              <span className="text-sm font-semibold hidden sm:inline">{step.title}</span>
              <span className="text-sm font-semibold sm:hidden">{index + 1}</span>
              {index < currentStepIndex && currentStep !== step.id && (
                <CheckCircle className="h-4 w-4 ml-1" />
              )}
            </button>
            {index < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bolt-gradient transition-all duration-500 ease-out"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      {/* Step description */}
      <div className="mt-3 text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].description}
        </p>
      </div>
    </div>
  );

  const renderGuidancePanel = () => {
    if (!stepGuidance || currentStep === 'review') return null;

    return (
      <Card className="glass-effect border-blue-400/20 mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-blue-500" />
            AI Guidance for {stepGuidance.stepTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{stepGuidance.description}</p>
          
          {stepGuidance.tips && (
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                <Target className="h-4 w-4 text-green-500" />
                ATS Optimization Tips
              </h4>
              <ul className="space-y-1">
                {stepGuidance.tips.map((tip: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stepGuidance.keywords && (
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Recommended Keywords
              </h4>
              <div className="flex flex-wrap gap-1">
                {stepGuidance.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200/30">
        <div className="flex items-start gap-3">
          <Target className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm mb-2">
              Welcome to the Guided Resume Builder!
            </h3>
            <p className="text-xs text-muted-foreground">
              All fields are optional. Fill in what you have, and our AI will help create a professional, ATS-optimized resume. You can always come back and add more information later.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </Label>
          <Input
            id="name"
            value={personalInfo.name}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, name: e.target.value }))}
            placeholder="John Doe"
            className="glass-effect"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
            placeholder="john@example.com"
            className="glass-effect"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="(555) 123-4567"
            className="glass-effect"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Input
            id="location"
            value={personalInfo.location}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
            placeholder="San Francisco, CA"
            className="glass-effect"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetRole" className="flex items-center gap-2">
            <Target className="h-4 w-4 text-yellow-500" />
            Target Role
          </Label>
          <Input
            id="targetRole"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
            className="glass-effect border-yellow-400/30 focus:border-yellow-400/60"
          />
          <p className="text-xs text-muted-foreground">Optional - This helps AI optimize your resume for ATS systems</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobDescription" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            Job Description (Optional)
          </Label>
          <Textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for better keyword optimization..."
            className="glass-effect min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground">Optional - Paste the job description to get better keyword matching</p>
        </div>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200/30">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-black dark:text-white mb-1">
              Pro Tips for a Great Professional Summary
            </h3>
            <ul className="text-xs text-black dark:text-white space-y-1">
              <li>• Keep it brief: 3-4 sentences maximum</li>
              <li>• Mention your years of experience and key expertise</li>
              <li>• Include 2-3 most relevant skills or achievements</li>
              <li>• Align it with the target role you're applying for</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <FileText className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <Label htmlFor="summary" className="text-base font-semibold">
              Professional Summary
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              A brief overview that captures your professional identity
            </p>
          </div>
        </div>
        <Textarea
          id="summary"
          value={professionalSummary}
          onChange={(e) => setProfessionalSummary(e.target.value)}
          placeholder="Example: Results-driven software engineer with 5+ years of experience in full-stack development. Proven track record of delivering scalable applications that serve millions of users. Seeking to leverage expertise in cloud technologies and agile methodologies to drive innovation at a forward-thinking tech company."
          className="glass-effect min-h-[140px] resize-none text-base leading-relaxed"
        />
      </div>
    </div>
  );

  const renderExperienceStep = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50/50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200/30">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-black dark:text-white mb-1">
              Make Your Experience Stand Out
            </h3>
            <ul className="text-xs text-black dark:text-white space-y-1">
              <li>• Start each bullet point with a strong action verb (Led, Developed, Increased, etc.)</li>
              <li>• Include quantifiable results and metrics whenever possible</li>
              <li>• Focus on achievements, not just responsibilities</li>
              <li>• List most recent experience first</li>
            </ul>
          </div>
        </div>
      </div>
      
      {workExperience.map((exp, index) => (
        <Card key={index} className="glass-effect border-yellow-400/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
              {workExperience.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem(setWorkExperience, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={exp.title}
                  onChange={(e) => updateArrayItem(setWorkExperience, index, 'title', e.target.value)}
                  placeholder="Senior Software Engineer"
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateArrayItem(setWorkExperience, index, 'company', e.target.value)}
                  placeholder="Tech Company Inc."
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => updateArrayItem(setWorkExperience, index, 'location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateArrayItem(setWorkExperience, index, 'startDate', e.target.value)}
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateArrayItem(setWorkExperience, index, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="glass-effect"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  checked={exp.current}
                  onChange={(e) => updateArrayItem(setWorkExperience, index, 'current', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`current-${index}`} className="text-sm">Currently working here</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Job Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateArrayItem(setWorkExperience, index, 'description', e.target.value)}
                placeholder="• Led a team of 5 developers to build a scalable web application that increased user engagement by 40%&#10;• Implemented microservices architecture using Node.js and Docker, reducing system downtime by 60%&#10;• Collaborated with product managers to define technical requirements and deliver features on time"
                className="glass-effect min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Use bullet points, start with action verbs, and include quantifiable achievements
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        onClick={() => addArrayItem(setWorkExperience, {
          title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: ""
        })}
        variant="outline"
        className="w-full glass-effect border-yellow-400/30 hover:border-yellow-400/60"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Experience
      </Button>
    </div>
  );

  const renderEducationStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200/30">
        <div className="flex items-start gap-3">
          <GraduationCap className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-black dark:text-white mb-1">
              Education Guidelines
            </h3>
            <ul className="text-xs text-black dark:text-white space-y-1">
              <li>• List your highest or most relevant degree first</li>
              <li>• Include GPA if it's 3.5 or higher</li>
              <li>• Mention honors, awards, or relevant coursework</li>
              <li>• For recent graduates, education should come before experience</li>
            </ul>
          </div>
        </div>
      </div>
      
      {education.map((edu, index) => (
        <Card key={index} className="glass-effect border-yellow-400/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Education {index + 1}</CardTitle>
              {education.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem(setEducation, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateArrayItem(setEducation, index, 'degree', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateArrayItem(setEducation, index, 'institution', e.target.value)}
                  placeholder="Stanford University"
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={edu.location}
                  onChange={(e) => updateArrayItem(setEducation, index, 'location', e.target.value)}
                  placeholder="Stanford, CA"
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Graduation Date</Label>
                <Input
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) => updateArrayItem(setEducation, index, 'graduationDate', e.target.value)}
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (if 3.5+)</Label>
                <Input
                  value={edu.gpa}
                  onChange={(e) => updateArrayItem(setEducation, index, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Honors/Awards</Label>
                <Input
                  value={edu.honors}
                  onChange={(e) => updateArrayItem(setEducation, index, 'honors', e.target.value)}
                  placeholder="Magna Cum Laude, Dean's List"
                  className="glass-effect"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        onClick={() => addArrayItem(setEducation, {
          degree: "", institution: "", location: "", graduationDate: "", gpa: "", honors: ""
        })}
        variant="outline"
        className="w-full glass-effect border-yellow-400/30 hover:border-yellow-400/60"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Education
      </Button>
    </div>
  );

  const renderSkillsStep = () => {
    return (
      <div className="space-y-6">
        <div className="bg-green-50/50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200/30">
          <div className="flex items-start gap-3">
            <Code className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm text-black dark:text-white mb-1">
                Skills That Get You Noticed
              </h3>
              <p className="text-xs text-black dark:text-white mb-2">
                Add skills in each category. Press Enter or click + to add. Click on a skill to remove it.
              </p>
              <ul className="text-xs text-black dark:text-white space-y-1">
                <li>• <strong>Technical:</strong> Domain-specific skills (e.g., Machine Learning, Cloud Architecture)</li>
                <li>• <strong>Programming:</strong> Languages and frameworks (e.g., Python, React, Node.js)</li>
                <li>• <strong>Tools:</strong> Software and platforms (e.g., Docker, AWS, Git)</li>
                <li>• <strong>Soft:</strong> Interpersonal skills (e.g., Leadership, Communication)</li>
              </ul>
            </div>
          </div>
        </div>
        
        {Object.entries(skills).map(([category, skillList]) => (
          <Card key={category} className="glass-effect border-yellow-400/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg capitalize">{category} Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill[category as keyof typeof newSkill]}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, [category]: e.target.value }))}
                  placeholder={`Add ${category} skill...`}
                  className="glass-effect"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill(category as keyof typeof skills, newSkill[category as keyof typeof newSkill]);
                      setNewSkill(prev => ({ ...prev, [category]: "" }));
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    addSkill(category as keyof typeof skills, newSkill[category as keyof typeof newSkill]);
                    setNewSkill(prev => ({ ...prev, [category]: "" }));
                  }}
                  disabled={!newSkill[category as keyof typeof newSkill].trim()}
                  className="bolt-gradient text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="glass-effect border-yellow-400/30 hover:border-yellow-400/60 group cursor-pointer"
                    onClick={() => removeSkill(category as keyof typeof skills, index)}
                  >
                    {skill}
                    <Trash2 className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderProjectsStep = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-lg border border-indigo-200/30">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-indigo-900 dark:text-indigo-100 mb-1">
              Showcase Your Projects
            </h3>
            <ul className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
              <li>• Highlight projects that demonstrate relevant skills for your target role</li>
              <li>• Include links to GitHub, live demos, or portfolios when available</li>
              <li>• Mention the technologies used and your specific contributions</li>
              <li>• Focus on impact: users reached, problems solved, or metrics improved</li>
            </ul>
          </div>
        </div>
      </div>
      
      {projects.map((project, index) => (
        <Card key={index} className="glass-effect border-yellow-400/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Project {index + 1}</CardTitle>
              {projects.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem(setProjects, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateArrayItem(setProjects, index, 'name', e.target.value)}
                  placeholder="E-commerce Platform"
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Project Link</Label>
                <Input
                  value={project.link}
                  onChange={(e) => updateArrayItem(setProjects, index, 'link', e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="glass-effect"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateArrayItem(setProjects, index, 'description', e.target.value)}
                placeholder="Built a full-stack e-commerce platform that increased sales by 30%. Implemented secure payment processing and real-time inventory management."
                className="glass-effect min-h-[80px] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <Input
                value={project.technologies.join(', ')}
                onChange={(e) => updateArrayItem(setProjects, index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                placeholder="React, Node.js, MongoDB, AWS"
                className="glass-effect"
              />
              <p className="text-xs text-muted-foreground">Separate technologies with commas</p>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        onClick={() => addArrayItem(setProjects, {
          name: "", description: "", technologies: [], link: ""
        })}
        variant="outline"
        className="w-full glass-effect border-yellow-400/30 hover:border-yellow-400/60"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Project
      </Button>
    </div>
  );

  const renderCertificationsStep = () => (
    <div className="space-y-6">
      <div className="bg-orange-50/50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200/30">
        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-orange-100 mb-1">
              Certifications That Matter
            </h3>
            <ul className="text-xs text-gray-700 dark:text-orange-300 space-y-1">
              <li>• Include industry-recognized certifications relevant to your field</li>
              <li>• List most recent or most relevant certifications first</li>
              <li>• Add credential IDs when available for verification</li>
              <li>• Optional: You can skip this section if you don't have certifications</li>
            </ul>
          </div>
        </div>
      </div>
      
      {certifications.map((cert, index) => (
        <Card key={index} className="glass-effect border-yellow-400/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Certification {index + 1}</CardTitle>
              {certifications.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem(setCertifications, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Certification Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateArrayItem(setCertifications, index, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Issuing Organization</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateArrayItem(setCertifications, index, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Date Issued</Label>
                <Input
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateArrayItem(setCertifications, index, 'date', e.target.value)}
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label>Credential ID</Label>
                <Input
                  value={cert.credential}
                  onChange={(e) => updateArrayItem(setCertifications, index, 'credential', e.target.value)}
                  placeholder="ABC123XYZ"
                  className="glass-effect"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        onClick={() => addArrayItem(setCertifications, {
          name: "", issuer: "", date: "", credential: ""
        })}
        variant="outline"
        className="w-full glass-effect border-yellow-400/30 hover:border-yellow-400/60"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Certification
      </Button>
    </div>
  );

  const renderLinksStep = () => (
    <div className="space-y-6">
      <div className="bg-cyan-50/50 dark:bg-cyan-950/20 p-4 rounded-lg border border-cyan-200/30">
        <div className="flex items-start gap-3">
          <LinkIcon className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-cyan-900 dark:text-cyan-100 mb-1">
              Build Your Online Presence
            </h3>
            <p className="text-xs text-cyan-700 dark:text-cyan-300 mb-2">
              Add links to your professional profiles. Make sure your profiles are up-to-date and professional.
            </p>
            <ul className="text-xs text-cyan-700 dark:text-cyan-300 space-y-1">
              <li>• <strong>LinkedIn:</strong> Most important for professional networking</li>
              <li>• <strong>GitHub:</strong> Essential for developers to showcase code</li>
              <li>• <strong>Portfolio:</strong> Great for designers, writers, and creatives</li>
              <li>• <strong>Website:</strong> Personal brand and additional projects</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
        <Label htmlFor="linkedin" className="flex items-center gap-2">
          <Linkedin className="h-4 w-4 text-blue-600" />
          LinkedIn Profile
        </Label>
        <Input
          id="linkedin"
          value={links.linkedin}
          onChange={(e) => setLinks(prev => ({ ...prev, linkedin: e.target.value }))}
          placeholder="https://linkedin.com/in/username"
          className="glass-effect"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="github" className="flex items-center gap-2">
          <Github className="h-4 w-4 text-gray-800" />
          GitHub Profile
        </Label>
        <Input
          id="github"
          value={links.github}
          onChange={(e) => setLinks(prev => ({ ...prev, github: e.target.value }))}
          placeholder="https://github.com/username"
          className="glass-effect"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website" className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-green-600" />
          Personal Website
        </Label>
        <Input
          id="website"
          value={links.website}
          onChange={(e) => setLinks(prev => ({ ...prev, website: e.target.value }))}
          placeholder="https://yourwebsite.com"
          className="glass-effect"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="portfolio" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-purple-600" />
          Portfolio URL
        </Label>
        <Input
          id="portfolio"
          value={links.portfolio}
          onChange={(e) => setLinks(prev => ({ ...prev, portfolio: e.target.value }))}
          placeholder="https://portfolio.com/username"
          className="glass-effect"
        />
      </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <Card className="glass-effect border-yellow-400/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-yellow-500" />
            ATS Optimization Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-black dark:text-white">Target Role: {targetRole}</p>
                <p className="text-sm text-black dark:text-white">
                  Your resume will be optimized for this specific role
                </p>
              </div>
            </div>
            
            {jobDescription && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-black dark:text-white">Job Description Provided</p>
                  <p className="text-sm text-black dark:text-white">
                    Keywords will be extracted for maximum ATS compatibility
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-yellow-400/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Resume Sections Ready
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 glass-effect rounded-lg">
              <User className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Personal Information</p>
                <p className="text-xs text-muted-foreground">{personalInfo.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 glass-effect rounded-lg">
              <FileText className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Professional Summary</p>
                <p className="text-xs text-muted-foreground">
                  {professionalSummary ? `${professionalSummary.substring(0, 30)}...` : "Not provided"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 glass-effect rounded-lg">
              <Briefcase className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Work Experience</p>
                <p className="text-xs text-muted-foreground">{workExperience.length} entries</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 glass-effect rounded-lg">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Education</p>
                <p className="text-xs text-muted-foreground">{education.length} entries</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 glass-effect rounded-lg">
              <Code className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Skills</p>
                <p className="text-xs text-muted-foreground">
                  {Object.values(skills).flat().length} skills listed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 glass-effect rounded-lg">
              <Zap className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Projects</p>
                <p className="text-xs text-muted-foreground">{projects.length} entries</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 glass-effect rounded-lg">
              <Award className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Certifications</p>
                <p className="text-xs text-muted-foreground">{certifications.length} entries</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 glass-effect rounded-lg">
              <LinkIcon className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Professional Links</p>
                <p className="text-xs text-muted-foreground">
                  {Object.values(links).filter(Boolean).length} links provided
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-green-400/20 bg-green-50/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <Shield className="h-5 w-5 text-green-600" />
            ATS Optimization Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-500 mt-1" />
              <p className="text-sm text-black dark:text-white">
                <span className="font-medium">Keyword Optimization:</span> Your resume will be optimized with exact keywords from your target role
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-500 mt-1" />
              <p className="text-sm text-black dark:text-white">
                <span className="font-medium">ATS-Friendly Format:</span> Structured for maximum compatibility with Applicant Tracking Systems
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-500 mt-1" />
              <p className="text-sm text-black dark:text-white">
                <span className="font-medium">Quantified Achievements:</span> Your experience will be enhanced with metrics and results
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-500 mt-1" />
              <p className="text-sm text-black dark:text-white">
                <span className="font-medium">Professional Links:</span> Your online presence will be properly formatted and integrated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal': return renderPersonalInfoStep();
      case 'summary': return renderSummaryStep();
      case 'experience': return renderExperienceStep();
      case 'education': return renderEducationStep();
      case 'skills': return renderSkillsStep();
      case 'projects': return renderProjectsStep();
      case 'certifications': return renderCertificationsStep();
      case 'links': return renderLinksStep();
      case 'review': return renderReviewStep();
      default: return null;
    }
  };

  const isStepValid = () => {
    // All fields are optional now, so all steps are valid
    return true;
  };

  return (
    <div className="space-y-6">
      {renderStepIndicator()}
      
      {renderGuidancePanel()}
      
      {renderCurrentStep()}
      
      <div className="flex justify-between mt-8">
        <Button
          onClick={prevStep}
          variant="outline"
          disabled={currentStepIndex === 0}
          className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep === 'review' ? (
          <Button
            onClick={generateResume}
            disabled={isGenerating || !isStepValid()}
            className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex items-center justify-center gap-2 relative z-10">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating ATS-Optimized Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate ATS-Optimized Resume</span>
                </>
              )}
            </div>
            
            {!isGenerating && (
              <div className="absolute inset-0 shimmer opacity-30"></div>
            )}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      <ExportAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSignIn={handleSignIn}
        exportType="guided-resume"
      />
    </div>
  );
}