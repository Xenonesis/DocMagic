'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';

export function ReportGenerator() {
  const [reportData, setReportData] = useState({
    title: '',
    subtitle: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    executiveSummary: '',
    sections: [] as { title: string; content: string }[],
    reportType: 'business',
  });

  const addSection = () => {
    setReportData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: '' }],
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Title *</Label>
              <Input
                placeholder="Q4 2024 Business Report"
                value={reportData.title}
                onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Report Type</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={reportData.reportType}
                onChange={(e) => setReportData(prev => ({ ...prev, reportType: e.target.value }))}
              >
                <option value="business">Business Report</option>
                <option value="proposal">Business Proposal</option>
                <option value="analysis">Analysis Report</option>
                <option value="financial">Financial Report</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input
                placeholder="John Doe"
                value={reportData.author}
                onChange={(e) => setReportData(prev => ({ ...prev, author: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={reportData.date}
                onChange={(e) => setReportData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Executive Summary</Label>
            <Textarea
              placeholder="Provide a brief overview of the report..."
              value={reportData.executiveSummary}
              onChange={(e) => setReportData(prev => ({ ...prev, executiveSummary: e.target.value }))}
              rows={6}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sections</h3>
              <Button onClick={addSection} variant="outline" size="sm">Add Section</Button>
            </div>
            {reportData.sections.map((section, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <Input
                  placeholder={`Section ${index + 1} Title`}
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...reportData.sections];
                    newSections[index].title = e.target.value;
                    setReportData(prev => ({ ...prev, sections: newSections }));
                  }}
                />
                <Textarea
                  placeholder="Section content..."
                  value={section.content}
                  onChange={(e) => {
                    const newSections = [...reportData.sections];
                    newSections[index].content = e.target.value;
                    setReportData(prev => ({ ...prev, sections: newSections }));
                  }}
                  rows={4}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <div className="bg-white dark:bg-gray-900 p-12 rounded-lg border min-h-[800px]">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4 pb-8 border-b-2">
                <h1 className="text-4xl font-bold">{reportData.title || 'Report Title'}</h1>
                <p className="text-gray-600">{reportData.author || 'Author Name'}</p>
                <p className="text-sm text-gray-500">{reportData.date}</p>
              </div>

              {reportData.executiveSummary && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{reportData.executiveSummary}</p>
                </div>
              )}

              {reportData.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-2xl font-bold mb-4">{section.title || `Section ${index + 1}`}</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button className="bolt-gradient text-white">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
