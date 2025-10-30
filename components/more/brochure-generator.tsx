'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';

export function BrochureGenerator() {
  const [brochureData, setBrochureData] = useState({
    title: '',
    subtitle: '',
    sections: [] as { title: string; content: string }[],
    foldType: 'tri-fold',
    primaryColor: '#3b82f6',
  });

  const addSection = () => {
    setBrochureData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: '' }],
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brochure Title</Label>
              <Input
                placeholder="Company Brochure"
                value={brochureData.title}
                onChange={(e) => setBrochureData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Fold Type</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={brochureData.foldType}
                onChange={(e) => setBrochureData(prev => ({ ...prev, foldType: e.target.value }))}
              >
                <option value="tri-fold">Tri-Fold</option>
                <option value="bi-fold">Bi-Fold</option>
                <option value="z-fold">Z-Fold</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sections</h3>
              <Button onClick={addSection} variant="outline" size="sm">Add Section</Button>
            </div>
            {brochureData.sections.map((section, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <Input
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...brochureData.sections];
                    newSections[index].title = e.target.value;
                    setBrochureData(prev => ({ ...prev, sections: newSections }));
                  }}
                />
                <Textarea
                  placeholder="Section content..."
                  value={section.content}
                  onChange={(e) => {
                    const newSections = [...brochureData.sections];
                    newSections[index].content = e.target.value;
                    setBrochureData(prev => ({ ...prev, sections: newSections }));
                  }}
                  rows={3}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <div className="bg-white p-8 rounded-lg border">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold">{brochureData.title || 'Brochure Title'}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {brochureData.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-xl font-bold">{section.title}</h3>
                  <p className="text-gray-700">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button className="bolt-gradient text-white">
              <Download className="mr-2 h-4 w-4" />
              Download Brochure
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
