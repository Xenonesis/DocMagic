'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Mail, Phone, Globe, MapPin, Linkedin, Twitter, QrCode } from 'lucide-react';

interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  linkedin: string;
  twitter: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  layout: 'modern' | 'classic' | 'minimal' | 'creative';
}

export function BusinessCardGenerator() {
  const [cardData, setCardData] = useState<BusinessCardData>({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    linkedin: '',
    twitter: '',
    tagline: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    layout: 'modern',
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const generateQRCode = async () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.name}
ORG:${cardData.company}
TITLE:${cardData.title}
TEL:${cardData.phone}
EMAIL:${cardData.email}
URL:${cardData.website}
END:VCARD`;

    try {
      // Dynamically import QRCodeStyling only on client side
      const QRCodeStyling = (await import('qr-code-styling')).default;
      
      const qrCode = new QRCodeStyling({
        width: 200,
        height: 200,
        data: vCardData,
        margin: 0,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'Q'
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 0
        },
        dotsOptions: {
          type: 'rounded',
          color: '#000000'
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
          color: '#000000'
        },
        cornersDotOptions: {
          type: 'dot',
          color: '#000000'
        }
      });
      
      const blob = await qrCode.getRawData('png');
      if (blob) {
        const url = URL.createObjectURL(blob);
        setQrCodeUrl(url);
      }
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const downloadCard = () => {
    const canvas = document.getElementById('business-card-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${cardData.name.replace(/\s+/g, '_')}_business_card.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6 mt-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="Senior Developer"
                  value={cardData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="Tech Corp"
                  value={cardData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="Innovation at its finest"
                  value={cardData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={cardData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={cardData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="www.example.com"
                  value={cardData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State"
                  value={cardData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="linkedin.com/in/johndoe"
                  value={cardData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  placeholder="@johndoe"
                  value={cardData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Design Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Design Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="layout">Layout Style</Label>
                <select
                  id="layout"
                  className="w-full px-3 py-2 border rounded-md"
                  value={cardData.layout}
                  onChange={(e) => handleInputChange('layout', e.target.value as any)}
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={cardData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  type="color"
                  value={cardData.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={generateQRCode} variant="outline">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Card className="w-full max-w-2xl p-8" style={{ aspectRatio: '3.5/2' }}>
                <BusinessCardPreview cardData={cardData} qrCodeUrl={qrCodeUrl} />
              </Card>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={downloadCard} className="bolt-gradient text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Card
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BusinessCardPreview({
  cardData,
  qrCodeUrl,
}: {
  cardData: BusinessCardData;
  qrCodeUrl: string;
}) {
  const getLayoutStyle = () => {
    switch (cardData.layout) {
      case 'modern':
        return (
          <div
            className="w-full h-full rounded-lg p-8 text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${cardData.primaryColor} 0%, ${cardData.secondaryColor} 100%)`,
            }}
          >
            <div className="flex justify-between items-start h-full">
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-3xl font-bold mb-1">{cardData.name || 'Your Name'}</h2>
                  <p className="text-lg opacity-90">{cardData.title || 'Your Title'}</p>
                  <p className="text-sm opacity-80 font-semibold mt-1">
                    {cardData.company || 'Company Name'}
                  </p>
                  {cardData.tagline && (
                    <p className="text-xs opacity-70 italic mt-2">{cardData.tagline}</p>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  {cardData.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{cardData.email}</span>
                    </div>
                  )}
                  {cardData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{cardData.phone}</span>
                    </div>
                  )}
                  {cardData.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{cardData.website}</span>
                    </div>
                  )}
                </div>
              </div>
              {qrCodeUrl && (
                <div className="bg-white p-2 rounded-lg">
                  <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24" />
                </div>
              )}
            </div>
          </div>
        );

      case 'classic':
        return (
          <div className="w-full h-full bg-white border-4 p-8" style={{ borderColor: cardData.primaryColor }}>
            <div className="text-center space-y-4">
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: cardData.primaryColor }}>
                  {cardData.name || 'Your Name'}
                </h2>
                <p className="text-lg text-gray-700">{cardData.title || 'Your Title'}</p>
                <p className="text-md font-semibold text-gray-600">{cardData.company || 'Company Name'}</p>
              </div>
              <div className="border-t-2 pt-4" style={{ borderColor: cardData.primaryColor }}>
                <div className="space-y-1 text-sm text-gray-600">
                  {cardData.email && <p>{cardData.email}</p>}
                  {cardData.phone && <p>{cardData.phone}</p>}
                  {cardData.website && <p>{cardData.website}</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="w-full h-full bg-white p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-light mb-1" style={{ color: cardData.primaryColor }}>
                {cardData.name || 'Your Name'}
              </h2>
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                {cardData.title || 'Your Title'}
              </p>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              {cardData.email && <p>{cardData.email}</p>}
              {cardData.phone && <p>{cardData.phone}</p>}
              {cardData.website && <p>{cardData.website}</p>}
            </div>
          </div>
        );

      case 'creative':
        return (
          <div
            className="w-full h-full text-white p-8 relative overflow-hidden"
            style={{
              background: `linear-gradient(45deg, ${cardData.primaryColor} 0%, ${cardData.secondaryColor} 50%, ${cardData.primaryColor} 100%)`,
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">{cardData.name || 'Your Name'}</h2>
              <p className="text-lg opacity-90 mb-4">{cardData.title || 'Your Title'}</p>
              <div className="space-y-1 text-sm opacity-80">
                {cardData.email && <p>{cardData.email}</p>}
                {cardData.phone && <p>{cardData.phone}</p>}
                {cardData.website && <p>{cardData.website}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="w-full h-full">{getLayoutStyle()}</div>;
}
