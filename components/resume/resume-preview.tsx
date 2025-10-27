import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Linkedin,
  Github,
  Globe,
  Mail,
  Phone,
  MapPin,
  Download,
  Edit,
  Check,
  X,
  Sparkles,
  FileText,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuthGuard } from '@/lib/auth-utils';
// Dynamic imports will be used inside handlers to avoid SSR/prerender issues
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

interface ResumeData {
  name?: string;
  email?: string;
  phone?: string | number;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  portfolio?: string;
  summary?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    date?: string;
    description?: string[];
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    location?: string;
    date?: string;
    gpa?: string;
    honors?: string;
  }>;
  skills?: {
    technical?: string[];
    programming?: string[];
    tools?: string[];
    soft?: string[];
  };
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
    link?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    credential?: string;
  }>;
  atsScore?: number;
  keywordOptimization?: {
    targetKeywords?: string[];
    includedKeywords?: string[];
    density?: string;
  };
}

interface ResumePreviewProps {
  resume: ResumeData;
  template: string;
  onChange?: (newResume: ResumeData) => void;
  onExportPDF?: () => React.MutableRefObject<(() => Promise<void>) | null>;
  onExportWord?: () => React.MutableRefObject<(() => Promise<void>) | null>;
}

export function ResumePreview({ resume, template, onChange, onExportPDF, onExportWord }: ResumePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuthGuard();
  const [editableResume, setEditableResume] = useState<ResumeData>({
    ...resume,
    phone: resume.phone?.toString() || '',
    experience:
      resume.experience?.map((exp) => ({
        ...exp,
        description: exp.description?.map((d) => d || '') || [],
      })) || [],
    education:
      resume.education?.map((edu) => ({
        ...edu,
        date: edu.date || '',
      })) || [],
    skills: resume.skills || {
      technical: [],
      programming: [],
      tools: [],
      soft: [],
    },
    projects:
      resume.projects?.map((proj) => ({
        ...proj,
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || [],
      })) || [],
  });

  function updateField(path: string[], value: any) {
    setEditableResume((prev: ResumeData) => {
      const newResume = { ...prev };
      let current: any = newResume;

      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      if (onChange) onChange(newResume);
      return newResume;
    });
  }

  const EditableText = ({
    value,
    onChange,
    className,
    multiline,
  }: {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    multiline?: boolean;
  }) => {
    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full resize-none bg-transparent border-none p-0 m-0 font-sans text-gray-900 focus:outline-none focus:ring-0',
            className,
          )}
          rows={3}
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'bg-transparent border-none p-0 m-0 font-sans text-gray-900 focus:outline-none focus:ring-0 w-full',
          className,
        )}
      />
    );
  };

  const EditableList = ({
    items,
    onChange,
    className,
  }: {
    items: string[];
    onChange: (newItems: string[]) => void;
    className?: string;
  }) => {
    function updateItem(idx: number, val: string) {
      const newItems = [...items];
      newItems[idx] = val;
      onChange(newItems);
    }
    function addItem() {
      onChange([...items, '']);
    }
    function removeItem(idx: number) {
      const newItems = items.filter((_, i) => i !== idx);
      onChange(newItems);
    }
    return (
      <div className={className}>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center mb-1">
            <EditableText
              value={item}
              onChange={(val) => updateItem(i, val)}
              className="flex-grow"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-red-500 font-bold hover:text-red-700 px-2"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-blue-600 underline text-sm mt-1 hover:text-blue-800"
        >
          + Add
        </button>
      </div>
    );
  };

  const exportToPDF = async () => {
    // Check authentication before downloading
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to download your resume.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);

    try {
      const element = document.getElementById('resume-content');
      if (!element) throw new Error('Resume content element not found');

      // Create an isolated iframe without any stylesheets
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = element.offsetWidth + 'px';
      iframe.style.height = element.offsetHeight + 'px';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Could not access iframe document');

      // Write a minimal HTML structure with no external stylesheets
      iframeDoc.open();
      iframeDoc.write('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>');
      iframeDoc.close();

      // Capture all computed styles from the original element tree
      const captureAndApplyStyles = (originalEl: Element, targetParent: HTMLElement) => {
        if (!(originalEl instanceof HTMLElement)) return null;
        
        const computedStyle = window.getComputedStyle(originalEl);
        const clone = originalEl.cloneNode(false) as HTMLElement;
        
        // Build inline style string from computed styles
        let styleStr = '';
        const importantProps = [
          'display', 'position', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
          'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
          'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
          'border', 'border-width', 'border-style', 'border-color', 'border-radius',
          'color', 'background-color', 'background', 'background-image',
          'font-size', 'font-weight', 'font-family', 'line-height', 'letter-spacing',
          'text-align', 'text-decoration', 'text-transform',
          'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'gap',
          'grid', 'grid-template-columns', 'grid-gap',
          'overflow', 'white-space', 'word-wrap', 'word-break',
          'box-shadow', 'text-shadow', 'opacity', 'z-index'
        ];
        
        importantProps.forEach(prop => {
          const value = computedStyle.getPropertyValue(prop);
          if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
            styleStr += `${prop}:${value};`;
          }
        });
        
        clone.setAttribute('style', styleStr);
        clone.removeAttribute('class');
        clone.removeAttribute('id');
        
        // Copy text content for text nodes
        if (originalEl.childNodes.length > 0) {
          Array.from(originalEl.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
              clone.appendChild(iframeDoc.createTextNode(child.textContent || ''));
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              const childClone = captureAndApplyStyles(child as Element, clone);
              if (childClone) clone.appendChild(childClone);
            }
          });
        }
        
        if (targetParent) {
          targetParent.appendChild(clone);
        }
        
        return clone;
      };

      // Clone the entire element tree with inline styles into the iframe
      const iframeBody = iframeDoc.body;
      iframeBody.style.margin = '0';
      iframeBody.style.padding = '0';
      iframeBody.style.backgroundColor = '#ffffff';
      
      captureAndApplyStyles(element, iframeBody);

      // Wait a bit for the iframe to render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the iframe content with html2canvas
      const canvas = await ((await import('html2canvas')).default)(iframeBody, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      // Remove the iframe
      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL('image/png');

      // A4 dimensions in mm: 210 x 297
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate ratio to fit the image within the PDF
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resume.name?.replace(/\s+/g, '-').toLowerCase() || 'resume'}.pdf`);

      toast({
        title: 'Resume exported!',
        description: 'Your resume has been downloaded as a PDF.',
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export resume to PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Expose export functions to parent via refs
  React.useEffect(() => {
    if (onExportPDF) {
      const ref = onExportPDF();
      ref.current = exportToPDF;
    }
  }, [onExportPDF]);

  React.useEffect(() => {
    if (onExportWord) {
      const ref = onExportWord();
      ref.current = exportToWord;
    }
  }, [onExportWord]);

  const exportToWord = async () => {
    // Check authentication before downloading
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to download your resume.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);

    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Header - Name
              new Paragraph({
                text: resume.name || 'Your Name',
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),
              // Contact Information
              ...(resume.email || resume.phone || resume.location
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 400 },
                      children: [
                        resume.email ? new TextRun({ text: resume.email + ' ' }) : new TextRun(''),
                        resume.phone
                          ? new TextRun({ text: '| ' + resume.phone.toString() + ' ' })
                          : new TextRun(''),
                        resume.location ? new TextRun({ text: '| ' + resume.location }) : new TextRun(''),
                      ],
                    }),
                  ]
                : []),
              // Professional Links
              ...((resume.linkedin || resume.github || resume.website || resume.portfolio)
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 400 },
                      children: [
                        resume.linkedin ? new TextRun({ text: resume.linkedin + ' ' }) : new TextRun(''),
                        resume.github ? new TextRun({ text: '| ' + resume.github + ' ' }) : new TextRun(''),
                        resume.website ? new TextRun({ text: '| ' + resume.website + ' ' }) : new TextRun(''),
                        resume.portfolio ? new TextRun({ text: '| ' + resume.portfolio }) : new TextRun(''),
                      ],
                    }),
                  ]
                : []),
              // Professional Summary
              ...(resume.summary
                ? [
                    new Paragraph({
                      text: 'Professional Summary',
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 200, after: 200 },
                    }),
                    new Paragraph({
                      text: resume.summary,
                      spacing: { after: 400 },
                    }),
                  ]
                : []),
              // Work Experience
              ...(resume.experience && resume.experience.length > 0
                ? [
                    new Paragraph({
                      text: 'Work Experience',
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 200, after: 200 },
                    }),
                    ...resume.experience.flatMap((exp) => [
                      new Paragraph({
                        children: [
                          new TextRun({ text: exp.title || 'Job Title', bold: true }),
                          new TextRun({ text: ' - ' + (exp.company || 'Company Name') }),
                        ],
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text:
                              (exp.location ? exp.location + ' | ' : '') + (exp.date || 'Date Range'),
                            italics: true,
                          }),
                        ],
                        spacing: { after: 100 },
                      }),
                      ...(exp.description || []).map(
                        (desc) =>
                          new Paragraph({
                            text: '• ' + desc,
                            spacing: { after: 100 },
                          }),
                      ),
                      new Paragraph({ text: '', spacing: { after: 200 } }),
                    ]),
                  ]
                : []),
              // Education
              ...(resume.education && resume.education.length > 0
                ? [
                    new Paragraph({
                      text: 'Education',
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 200, after: 200 },
                    }),
                    ...resume.education.flatMap((edu) => [
                      new Paragraph({
                        children: [
                          new TextRun({ text: edu.degree || 'Degree', bold: true }),
                          new TextRun({ text: ' - ' + (edu.institution || 'Institution') }),
                        ],
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text:
                              (edu.location ? edu.location + ' | ' : '') + (edu.date || 'Year'),
                            italics: true,
                          }),
                        ],
                        spacing: { after: 100 },
                      }),
                      ...(edu.gpa
                        ? [
                            new Paragraph({
                              text: 'GPA: ' + edu.gpa,
                              spacing: { after: 100 },
                            }),
                          ]
                        : []),
                      ...(edu.honors
                        ? [
                            new Paragraph({
                              text: edu.honors,
                              spacing: { after: 100 },
                            }),
                          ]
                        : []),
                      new Paragraph({ text: '', spacing: { after: 200 } }),
                    ]),
                  ]
                : []),
              // Skills
              ...(resume.skills
                ? [
                    new Paragraph({
                      text: 'Skills',
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 200, after: 200 },
                    }),
                    ...Object.entries(resume.skills).flatMap(([category, skillList]) =>
                      skillList && (skillList as string[]).length > 0
                        ? [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: category.charAt(0).toUpperCase() + category.slice(1) + ': ',
                                  bold: true,
                                }),
                                new TextRun({ text: (skillList as string[]).join(', ') }),
                              ],
                              spacing: { after: 100 },
                            }),
                          ]
                        : [],
                    ),
                  ]
                : []),
              // Projects
              ...(resume.projects && resume.projects.length > 0
                ? [
                    new Paragraph({
                      text: 'Projects',
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 200, after: 200 },
                    }),
                    ...resume.projects.flatMap((proj) => [
                      new Paragraph({
                        children: [
                          new TextRun({ text: proj.name || 'Project Name', bold: true }),
                          ...(proj.link ? [new TextRun({ text: ' - ' + proj.link })] : []),
                        ],
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        text: proj.description || 'Project description',
                        spacing: { after: 100 },
                      }),
                      ...(proj.technologies && proj.technologies.length > 0
                        ? [
                            new Paragraph({
                              text: 'Technologies: ' + proj.technologies.join(', '),
                              spacing: { after: 100 },
                            }),
                          ]
                        : []),
                      new Paragraph({ text: '', spacing: { after: 200 } }),
                    ]),
                  ]
                : []),
              // Certifications
              ...(resume.certifications && resume.certifications.length > 0
                ? [
                    new Paragraph({
                      text: 'Certifications',
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 200, after: 200 },
                    }),
                    ...resume.certifications.flatMap((cert) => [
                      new Paragraph({
                        children: [
                          new TextRun({ text: cert.name || 'Certification Name', bold: true }),
                          new TextRun({ text: ' - ' + (cert.issuer || 'Issuing Organization') }),
                        ],
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text:
                              (cert.credential ? 'Credential ID: ' + cert.credential + ' | ' : '') +
                              (cert.date || 'Issue Date'),
                            italics: true,
                          }),
                        ],
                        spacing: { after: 100 },
                      }),
                      new Paragraph({ text: '', spacing: { after: 200 } }),
                    ]),
                  ]
                : []),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.name?.replace(/\s+/g, '-').toLowerCase() || 'resume'}.docx`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Resume exported!',
        description: 'Your resume has been downloaded as a Word document.',
      });
    } catch (error) {
      console.error('Error exporting to Word:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export resume to Word. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const renderProfessionalTemplate = () => (
    <div className="w-full h-full bg-white text-gray-900 overflow-auto" id="resume-content">
      <div className="p-6 sm:p-8 max-w-[800px] mx-auto font-sans min-h-[600px]">
        {/* Header Section */}
        <div className="text-center mb-6 border-b border-gray-200 pb-6">
          {isEditing ? (
            <>
              <EditableText
                value={editableResume.name || ''}
                onChange={(val) => updateField(['name'], val)}
                className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center"
              />
              <div className="flex justify-center gap-4 text-sm text-gray-600 mt-2 flex-wrap">
                <EditableText
                  value={editableResume.email || ''}
                  onChange={(val) => updateField(['email'], val)}
                  className="text-center"
                />
                <EditableText
                  value={editableResume.phone?.toString() || ''}
                  onChange={(val) => updateField(['phone'], val)}
                  className="text-center"
                />
                <EditableText
                  value={editableResume.location || ''}
                  onChange={(val) => updateField(['location'], val)}
                  className="text-center"
                />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-800 dark:!shadow-none mb-2">
                {resume.name || 'Your Name'}
              </h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-600 mt-2">
                {resume.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{resume.email}</span>
                  </div>
                )}
                {resume.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{resume.phone.toString()}</span>
                  </div>
                )}
                {resume.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{resume.location}</span>
                  </div>
                )}
              </div>

              {/* Professional Links */}
              {(resume.linkedin || resume.github || resume.website || resume.portfolio) && (
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-600 mt-3">
                  {resume.linkedin && (
                    <a
                      href={resume.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Linkedin className="h-3 w-3" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {resume.github && (
                    <a
                      href={resume.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-700 hover:underline"
                    >
                      <Github className="h-3 w-3" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {resume.website && (
                    <a
                      href={resume.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-green-600 hover:underline"
                    >
                      <Globe className="h-3 w-3" />
                      <span>Website</span>
                    </a>
                  )}
                  {resume.portfolio && (
                    <a
                      href={resume.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-600 hover:underline"
                    >
                      <Globe className="h-3 w-3" />
                      <span>Portfolio</span>
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary Section */}
        {(editableResume.summary || resume.summary) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-800 dark: border-b border-gray-200 pb-2 mb-3">
              Professional Summary
            </h2>
            {isEditing ? (
              <EditableText
                value={editableResume.summary || ''}
                onChange={(val) => updateField(['summary'], val)}
                multiline
                className="text-sm text-gray-700 leading-relaxed"
              />
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-700 leading-relaxed">
                {resume.summary}
              </p>
            )}
          </div>
        )}

        {/* Experience Section */}
        {editableResume.experience?.length || resume.experience?.length ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-800 border-b border-gray-200 pb-2 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {(isEditing ? editableResume.experience : resume.experience)?.map((exp, i) => (
                <div key={i} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      {isEditing ? (
                        <>
                          <EditableText
                            value={exp.title || ''}
                            onChange={(val) =>
                              updateField(['experience', i.toString(), 'title'], val)
                            }
                            className="font-medium text-gray-800 text-base mb-1"
                          />
                          <EditableText
                            value={exp.company || ''}
                            onChange={(val) =>
                              updateField(['experience', i.toString(), 'company'], val)
                            }
                            className="text-sm text-gray-600"
                          />
                          {exp.location && (
                            <EditableText
                              value={exp.location || ''}
                              onChange={(val) =>
                                updateField(['experience', i.toString(), 'location'], val)
                              }
                              className="text-sm text-gray-500"
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <h3 className="font-medium text-gray-800 dark:text-gray-800 text-base">
                            {exp.title || 'Job Title'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-600">
                            {exp.company || 'Company Name'}
                            {exp.location && ` • ${exp.location}`}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      {isEditing ? (
                        <EditableText
                          value={exp.date || ''}
                          onChange={(val) => updateField(['experience', i.toString(), 'date'], val)}
                          className="text-sm text-gray-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          {exp.date || 'Date Range'}
                        </span>
                      )}
                    </div>
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <div className="mt-2">
                      {isEditing ? (
                        <EditableList
                          items={exp.description}
                          onChange={(newDesc) =>
                            updateField(['experience', i.toString(), 'description'], newDesc)
                          }
                        />
                      ) : (
                        <ul className="list-disc text-sm text-gray-700 dark:text-gray-700 pl-5 mt-2 space-y-1">
                          {exp.description.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Education Section */}
        {editableResume.education?.length || resume.education?.length ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-800 border-b border-gray-200 pb-2 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {(isEditing ? editableResume.education : resume.education)?.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div className="flex-1">
                    {isEditing ? (
                      <>
                        <EditableText
                          value={edu.degree || ''}
                          onChange={(val) =>
                            updateField(['education', i.toString(), 'degree'], val)
                          }
                          className="font-medium text-gray-800"
                        />
                        <EditableText
                          value={edu.institution || ''}
                          onChange={(val) =>
                            updateField(['education', i.toString(), 'institution'], val)
                          }
                          className="text-sm text-gray-600"
                        />
                        {edu.location && (
                          <EditableText
                            value={edu.location || ''}
                            onChange={(val) =>
                              updateField(['education', i.toString(), 'location'], val)
                            }
                            className="text-sm text-gray-500"
                          />
                        )}
                        {edu.gpa && (
                          <EditableText
                            value={edu.gpa || ''}
                            onChange={(val) => updateField(['education', i.toString(), 'gpa'], val)}
                            className="text-sm text-gray-500"
                          />
                        )}
                        {edu.honors && (
                          <EditableText
                            value={edu.honors || ''}
                            onChange={(val) =>
                              updateField(['education', i.toString(), 'honors'], val)
                            }
                            className="text-sm text-gray-500"
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-800 dark:text-gray-800">
                          {edu.degree || 'Degree'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-600">
                          {edu.institution || 'Institution'}
                          {edu.location && ` • ${edu.location}`}
                        </p>
                        {edu.gpa && (
                          <p className="text-sm text-gray-500 dark:text-gray-500">GPA: {edu.gpa}</p>
                        )}
                        {edu.honors && (
                          <p className="text-sm text-gray-500 dark:text-gray-500">{edu.honors}</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    {isEditing ? (
                      <EditableText
                        value={edu.date || ''}
                        onChange={(val) => updateField(['education', i.toString(), 'date'], val)}
                        className="text-sm text-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {edu.date || 'Year'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Skills Section */}
        {(editableResume.skills || resume.skills) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-800 border-b border-gray-200 pb-2 mb-3">
              Skills
            </h2>

            {isEditing ? (
              <div className="space-y-3">
                {Object.entries(editableResume.skills || {}).map(([category, skillList]) =>
                  skillList && skillList.length > 0 ? (
                    <div key={category}>
                      <h3 className="font-medium text-gray-700 dark:text-gray-700 capitalize text-sm mb-1">
                        {category}
                      </h3>
                      <EditableList
                        items={skillList as string[]}
                        onChange={(newSkills) => updateField(['skills', category], newSkills)}
                        className="flex flex-wrap gap-2"
                      />
                    </div>
                  ) : null,
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(resume.skills || {}).map(([category, skillList]) =>
                  skillList && (skillList as string[]).length > 0 ? (
                    <div key={category}>
                      <h3 className="font-medium text-gray-700 dark:text-gray-700 capitalize text-sm mb-1">
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(skillList as string[]).map((skill, i) => (
                          <span
                            key={i}
                            className="text-sm bg-gray-100 dark:bg-gray-100 px-3 py-1 rounded-full text-gray-800 dark:text-gray-800 border"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            )}
          </div>
        )}

        {/* Projects Section */}
        {editableResume.projects?.length || resume.projects?.length ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-800 border-b border-gray-200 pb-2 mb-3">
              Projects
            </h2>
            {isEditing ? (
              <div className="space-y-4">
                {editableResume.projects?.map((project, i) => (
                  <div key={i} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <EditableText
                        value={project.name || ''}
                        onChange={(val) => updateField(['projects', i.toString(), 'name'], val)}
                        className="font-medium text-gray-800 mb-1"
                      />
                      {project.link && (
                        <EditableText
                          value={project.link || ''}
                          onChange={(val) => updateField(['projects', i.toString(), 'link'], val)}
                          className="text-xs text-blue-600"
                        />
                      )}
                    </div>
                    <EditableText
                      value={project.description || ''}
                      onChange={(val) =>
                        updateField(['projects', i.toString(), 'description'], val)
                      }
                      multiline
                      className="text-sm text-gray-700"
                    />
                    {project.technologies && (
                      <div className="mt-1">
                        <EditableText
                          value={(project.technologies || []).join(', ')}
                          onChange={(val) =>
                            updateField(['projects', i.toString(), 'technologies'], val.split(', '))
                          }
                          className="text-xs text-gray-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {resume.projects?.map((project, i) => (
                  <div key={i} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-gray-800 dark:text-gray-800">
                        {project.name || 'Project Name'}
                      </h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-600 hover:underline"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-700">
                      {project.description || 'Project description'}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, j) => (
                          <Badge
                            key={j}
                            variant="outline"
                            className="text-xs bg-gray-50 text-gray-600 dark:text-gray-600 border-gray-200"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Certifications Section */}
        {editableResume.certifications?.length || resume.certifications?.length ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-800 border-b border-gray-200 pb-2 mb-3">
              Certifications
            </h2>
            {isEditing ? (
              <div className="space-y-3">
                {editableResume.certifications?.map((cert, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="flex-1">
                      <EditableText
                        value={cert.name || ''}
                        onChange={(val) =>
                          updateField(['certifications', i.toString(), 'name'], val)
                        }
                        className="font-medium text-gray-800"
                      />
                      <EditableText
                        value={cert.issuer || ''}
                        onChange={(val) =>
                          updateField(['certifications', i.toString(), 'issuer'], val)
                        }
                        className="text-sm text-gray-600"
                      />
                      {cert.credential && (
                        <EditableText
                          value={cert.credential || ''}
                          onChange={(val) =>
                            updateField(['certifications', i.toString(), 'credential'], val)
                          }
                          className="text-xs text-gray-500"
                        />
                      )}
                    </div>
                    <div className="text-right">
                      <EditableText
                        value={cert.date || ''}
                        onChange={(val) =>
                          updateField(['certifications', i.toString(), 'date'], val)
                        }
                        className="text-sm text-gray-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {resume.certifications?.map((cert, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 dark:text-gray-800">
                        {cert.name || 'Certification Name'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-600">
                        {cert.issuer || 'Issuing Organization'}
                      </p>
                      {cert.credential && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Credential ID: {cert.credential}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {cert.date || 'Issue Date'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* ATS Score Section (only shown in preview, not editable) */}
        {resume.atsScore && !isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  resume.atsScore >= 90
                    ? 'bg-green-500'
                    : resume.atsScore >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
              >
                {resume.atsScore}
              </div>
              <h3 className="font-medium text-gray-700">ATS Optimization Score</h3>
            </div>

            {resume.keywordOptimization && (
              <div className="text-xs text-gray-600">
                <p>Optimized for: {resume.keywordOptimization.targetKeywords?.join(', ')}</p>
                <p>Keyword density: {resume.keywordOptimization.density}</p>
              </div>
            )}
          </div>
        )}

        {/* Edit Controls */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center gap-1"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              ) : isAuthenticated ? (
                <Download className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToWord}
              className="flex items-center gap-1"
            >
              {isAuthenticated ? <FileText className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              Word
            </Button>
          </div>

          {isEditing ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditableResume({
                    ...resume,
                    phone: resume.phone?.toString() || '',
                    experience:
                      resume.experience?.map((exp) => ({
                        ...exp,
                        description: exp.description?.map((d) => d || '') || [],
                      })) || [],
                    education:
                      resume.education?.map((edu) => ({
                        ...edu,
                        date: edu.date || '',
                      })) || [],
                    skills: resume.skills || {
                      technical: [],
                      programming: [],
                      tools: [],
                      soft: [],
                    },
                    projects:
                      resume.projects?.map((proj) => ({
                        ...proj,
                        name: proj.name || '',
                        description: proj.description || '',
                        technologies: proj.technologies || [],
                      })) || [],
                  });
                  setIsEditing(false);
                }}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit Resume
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Render the appropriate template based on the selected template
  switch (template) {
    case 'modern':
      // You would implement different template styles here
      return renderProfessionalTemplate();
    case 'creative':
      return renderProfessionalTemplate();
    case 'minimalist':
      return renderProfessionalTemplate();
    case 'executive':
      return renderProfessionalTemplate();
    case 'technical':
      return renderProfessionalTemplate();
    case 'professional':
    default:
      return renderProfessionalTemplate();
  }
}
