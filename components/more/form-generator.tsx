'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Plus, X } from 'lucide-react';

export function FormGenerator() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: [] as { label: string; type: string; required: boolean }[],
  });

  const addField = (type: string) => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, { label: '', type, required: false }],
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Form Title</Label>
              <Input
                placeholder="Contact Form"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Please fill out this form"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Form Fields</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => addField('text')} variant="outline" size="sm">+ Text</Button>
              <Button onClick={() => addField('email')} variant="outline" size="sm">+ Email</Button>
              <Button onClick={() => addField('textarea')} variant="outline" size="sm">+ Textarea</Button>
              <Button onClick={() => addField('select')} variant="outline" size="sm">+ Select</Button>
            </div>
            {formData.fields.map((field, index) => (
              <div key={index} className="flex gap-2 items-center p-3 border rounded">
                <Input
                  placeholder="Field Label"
                  value={field.label}
                  onChange={(e) => {
                    const newFields = [...formData.fields];
                    newFields[index].label = e.target.value;
                    setFormData(prev => ({ ...prev, fields: newFields }));
                  }}
                />
                <span className="text-sm text-gray-500">{field.type}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border">
            <h2 className="text-2xl font-bold mb-2">{formData.title || 'Form Title'}</h2>
            <p className="text-gray-600 mb-6">{formData.description}</p>
            <div className="space-y-4">
              {formData.fields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label>{field.label || `Field ${index + 1}`}</Label>
                  {field.type === 'textarea' ? (
                    <textarea className="w-full p-2 border rounded" rows={3} />
                  ) : (
                    <Input type={field.type} />
                  )}
                </div>
              ))}
              <Button className="bolt-gradient text-white">Submit</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
