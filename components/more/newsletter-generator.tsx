'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Plus } from 'lucide-react';

export function NewsletterGenerator() {
  const [newsletterData, setNewsletterData] = useState({
    companyName: '',
    header: '',
    subheader: '',
    articles: [] as { title: string; content: string }[],
    footer: '',
    primaryColor: '#3b82f6',
  });

  const addArticle = () => {
    setNewsletterData(prev => ({
      ...prev,
      articles: [...prev.articles, { title: '', content: '' }],
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
              <Label>Company Name</Label>
              <Input
                placeholder="Your Company"
                value={newsletterData.companyName}
                onChange={(e) => setNewsletterData(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={newsletterData.primaryColor}
                onChange={(e) => setNewsletterData(prev => ({ ...prev, primaryColor: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Header Text</Label>
              <Input
                placeholder="Monthly Newsletter - December 2024"
                value={newsletterData.header}
                onChange={(e) => setNewsletterData(prev => ({ ...prev, header: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Subheader</Label>
              <Input
                placeholder="Your monthly digest of news and updates"
                value={newsletterData.subheader}
                onChange={(e) => setNewsletterData(prev => ({ ...prev, subheader: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Articles</h3>
              <Button onClick={addArticle} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            </div>
            {newsletterData.articles.map((article, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <Input
                  placeholder="Article Title"
                  value={article.title}
                  onChange={(e) => {
                    const newArticles = [...newsletterData.articles];
                    newArticles[index].title = e.target.value;
                    setNewsletterData(prev => ({ ...prev, articles: newArticles }));
                  }}
                />
                <Textarea
                  placeholder="Article content..."
                  value={article.content}
                  onChange={(e) => {
                    const newArticles = [...newsletterData.articles];
                    newArticles[index].content = e.target.value;
                    setNewsletterData(prev => ({ ...prev, articles: newArticles }));
                  }}
                  rows={4}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Footer Text</Label>
            <Textarea
              placeholder="Contact us at info@example.com | Unsubscribe"
              value={newsletterData.footer}
              onChange={(e) => setNewsletterData(prev => ({ ...prev, footer: e.target.value }))}
              rows={2}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <div className="bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white shadow-lg">
              <div className="p-8" style={{ backgroundColor: newsletterData.primaryColor, color: 'white' }}>
                <h1 className="text-3xl font-bold">{newsletterData.companyName || 'Company Name'}</h1>
                <h2 className="text-xl mt-2">{newsletterData.header || 'Newsletter Title'}</h2>
                <p className="text-sm mt-1 opacity-90">{newsletterData.subheader}</p>
              </div>

              <div className="p-8 space-y-6">
                {newsletterData.articles.map((article, index) => (
                  <div key={index} className="pb-6 border-b last:border-0">
                    <h3 className="text-xl font-bold mb-2">{article.title || `Article ${index + 1}`}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{article.content}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 text-center text-sm text-gray-600">
                <p className="whitespace-pre-wrap">{newsletterData.footer}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button className="bolt-gradient text-white">
              <Download className="mr-2 h-4 w-4" />
              Export HTML
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
