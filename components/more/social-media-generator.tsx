'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';

const platforms = {
  instagram: { name: 'Instagram Post', width: 1080, height: 1080 },
  'instagram-story': { name: 'Instagram Story', width: 1080, height: 1920 },
  facebook: { name: 'Facebook Post', width: 1200, height: 630 },
  twitter: { name: 'Twitter Post', width: 1200, height: 675 },
  linkedin: { name: 'LinkedIn Post', width: 1200, height: 627 },
  pinterest: { name: 'Pinterest Pin', width: 1000, height: 1500 },
};

export function SocialMediaGenerator() {
  const [graphicData, setGraphicData] = useState({
    platform: 'instagram' as keyof typeof platforms,
    headline: '',
    subheadline: '',
    bodyText: '',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    layout: 'centered',
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform</h3>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={graphicData.platform}
              onChange={(e) => setGraphicData(prev => ({ ...prev, platform: e.target.value as any }))}
            >
              {Object.entries(platforms).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500">
              Size: {platforms[graphicData.platform].width} × {platforms[graphicData.platform].height}px
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Content</h3>
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input
                placeholder="Your Main Message"
                value={graphicData.headline}
                onChange={(e) => setGraphicData(prev => ({ ...prev, headline: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Subheadline</Label>
              <Input
                placeholder="Supporting text"
                value={graphicData.subheadline}
                onChange={(e) => setGraphicData(prev => ({ ...prev, subheadline: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Body Text</Label>
              <Textarea
                placeholder="Additional information..."
                value={graphicData.bodyText}
                onChange={(e) => setGraphicData(prev => ({ ...prev, bodyText: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Design</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={graphicData.backgroundColor}
                  onChange={(e) => setGraphicData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={graphicData.textColor}
                  onChange={(e) => setGraphicData(prev => ({ ...prev, textColor: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Layout</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={graphicData.layout}
                  onChange={(e) => setGraphicData(prev => ({ ...prev, layout: e.target.value }))}
                >
                  <option value="centered">Centered</option>
                  <option value="left">Left Aligned</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-center bg-gray-100 p-8 rounded-lg">
              <div
                className="shadow-2xl flex items-center justify-center p-8"
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  aspectRatio: `${platforms[graphicData.platform].width}/${platforms[graphicData.platform].height}`,
                  backgroundColor: graphicData.backgroundColor,
                  color: graphicData.textColor,
                }}
              >
                <div className={`text-${graphicData.layout === 'centered' ? 'center' : graphicData.layout} space-y-4 max-w-md`}>
                  <h1 className="text-4xl font-bold">{graphicData.headline || 'Your Headline'}</h1>
                  {graphicData.subheadline && (
                    <h2 className="text-2xl">{graphicData.subheadline}</h2>
                  )}
                  {graphicData.bodyText && (
                    <p className="text-lg whitespace-pre-wrap">{graphicData.bodyText}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button className="bolt-gradient text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Graphic
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
