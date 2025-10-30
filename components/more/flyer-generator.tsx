'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Image as ImageIcon, Type, Palette } from 'lucide-react';

interface FlyerData {
  title: string;
  subtitle: string;
  description: string;
  callToAction: string;
  contactInfo: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  template: 'event' | 'sale' | 'announcement' | 'business';
  size: 'letter' | 'a4' | 'poster';
}

export function FlyerGenerator() {
  const [flyerData, setFlyerData] = useState<FlyerData>({
    title: '',
    subtitle: '',
    description: '',
    callToAction: '',
    contactInfo: '',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#3b82f6',
    template: 'event',
    size: 'letter',
  });

  const handleInputChange = (field: keyof FlyerData, value: string) => {
    setFlyerData((prev) => ({ ...prev, [field]: value }));
  };

  const downloadFlyer = () => {
    alert('Flyer download functionality - Export as PDF or PNG');
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
            <h3 className="text-lg font-semibold">Content</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Main Title *</Label>
                <Input
                  id="title"
                  placeholder="Summer Sale Event"
                  value={flyerData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  placeholder="Don't miss out on amazing deals!"
                  value={flyerData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Join us for an unforgettable experience..."
                  value={flyerData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="callToAction">Call to Action</Label>
                <Input
                  id="callToAction"
                  placeholder="Visit us today!"
                  value={flyerData.callToAction}
                  onChange={(e) => handleInputChange('callToAction', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Textarea
                  id="contactInfo"
                  placeholder="Phone: (555) 123-4567&#10;Email: info@example.com&#10;Website: www.example.com"
                  value={flyerData.contactInfo}
                  onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Design Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template">Template Style</Label>
                <select
                  id="template"
                  className="w-full px-3 py-2 border rounded-md"
                  value={flyerData.template}
                  onChange={(e) => handleInputChange('template', e.target.value as any)}
                >
                  <option value="event">Event</option>
                  <option value="sale">Sale/Promotion</option>
                  <option value="announcement">Announcement</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <select
                  id="size"
                  className="w-full px-3 py-2 border rounded-md"
                  value={flyerData.size}
                  onChange={(e) => handleInputChange('size', e.target.value as any)}
                >
                  <option value="letter">Letter (8.5" x 11")</option>
                  <option value="a4">A4</option>
                  <option value="poster">Poster (18" x 24")</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={flyerData.backgroundColor}
                    onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                    className="w-20"
                  />
                  <Input
                    type="text"
                    value={flyerData.backgroundColor}
                    onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={flyerData.textColor}
                    onChange={(e) => handleInputChange('textColor', e.target.value)}
                    className="w-20"
                  />
                  <Input
                    type="text"
                    value={flyerData.textColor}
                    onChange={(e) => handleInputChange('textColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={flyerData.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    className="w-20"
                  />
                  <Input
                    type="text"
                    value={flyerData.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Card className="w-full max-w-2xl overflow-hidden">
                <FlyerPreview flyerData={flyerData} />
              </Card>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={downloadFlyer} className="bolt-gradient text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Flyer
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FlyerPreview({ flyerData }: { flyerData: FlyerData }) {
  return (
    <div
      className="w-full p-12 min-h-[600px] flex flex-col justify-between"
      style={{
        backgroundColor: flyerData.backgroundColor,
        color: flyerData.textColor,
        aspectRatio: flyerData.size === 'poster' ? '18/24' : '8.5/11',
      }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h1
          className="text-5xl font-bold mb-4"
          style={{ color: flyerData.accentColor }}
        >
          {flyerData.title || 'Your Title Here'}
        </h1>
        {flyerData.subtitle && (
          <h2 className="text-2xl font-semibold">{flyerData.subtitle}</h2>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center my-8">
        <div className="max-w-xl text-center space-y-6">
          {flyerData.description && (
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{flyerData.description}</p>
          )}
          {flyerData.callToAction && (
            <div
              className="inline-block px-8 py-4 rounded-lg text-white font-bold text-xl"
              style={{ backgroundColor: flyerData.accentColor }}
            >
              {flyerData.callToAction}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {flyerData.contactInfo && (
        <div className="text-center space-y-2 border-t-2 pt-6" style={{ borderColor: flyerData.accentColor }}>
          <p className="text-sm whitespace-pre-wrap">{flyerData.contactInfo}</p>
        </div>
      )}
    </div>
  );
}
