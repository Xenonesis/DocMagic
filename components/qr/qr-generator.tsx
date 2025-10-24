"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Download, 
  QrCode,
  Link2,
  Mail,
  Phone,
  User,
  Wifi,
  MapPin,
  CreditCard,
  MessageSquare,
  Calendar,
  FileText,
  Palette,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCodeStyling from "qr-code-styling";

const qrTypes = [
  { value: "url", label: "Website URL", icon: Link2, description: "Link to a website" },
  { value: "text", label: "Plain Text", icon: FileText, description: "Any text content" },
  { value: "email", label: "Email", icon: Mail, description: "Email address" },
  { value: "phone", label: "Phone", icon: Phone, description: "Phone number" },
  { value: "sms", label: "SMS", icon: MessageSquare, description: "Text message" },
  { value: "wifi", label: "WiFi", icon: Wifi, description: "WiFi credentials" },
  { value: "vcard", label: "Contact", icon: User, description: "Contact information" },
  { value: "location", label: "Location", icon: MapPin, description: "GPS coordinates" },
];

const dotStyles = [
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rounded" },
  { value: "square", label: "Square" },
  { value: "extra-rounded", label: "Extra Rounded" },
];

const cornerSquareStyles = [
  { value: "dot", label: "Dot" },
  { value: "square", label: "Square" },
  { value: "extra-rounded", label: "Extra Rounded" },
];

const cornerDotStyles = [
  { value: "dot", label: "Dot" },
  { value: "square", label: "Square" },
];

export function QRGenerator() {
  const [qrType, setQrType] = useState("url");
  const [qrData, setQrData] = useState("");
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Styling options
  const [dotStyle, setDotStyle] = useState("rounded");
  const [cornerSquareStyle, setCornerSquareStyle] = useState("extra-rounded");
  const [cornerDotStyle, setCornerDotStyle] = useState("dot");
  const [dotsColor, setDotsColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [cornerSquareColor, setCornerSquareColor] = useState("#000000");
  const [cornerDotColor, setCornerDotColor] = useState("#000000");
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(10);
  
  // Type-specific fields
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsNumber, setSmsNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [vcardUrl, setVcardUrl] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize QR Code
    const qr = new QRCodeStyling({
      width: size,
      height: size,
      data: "",
      margin: margin,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "Q"
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0
      },
      dotsOptions: {
        color: dotsColor,
        type: dotStyle as any
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      cornersSquareOptions: {
        color: cornerSquareColor,
        type: cornerSquareStyle as any,
      },
      cornersDotOptions: {
        color: cornerDotColor,
        type: cornerDotStyle as any,
      }
    });
    
    setQrCode(qr);
  }, []);

  const generateQRData = () => {
    switch (qrType) {
      case "url":
        return qrData;
      case "text":
        return qrData;
      case "email":
        return `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "phone":
        return `tel:${phoneNumber}`;
      case "sms":
        return `sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}`;
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nORG:${vcardOrg}\nURL:${vcardUrl}\nEND:VCARD`;
      case "location":
        return `geo:${latitude},${longitude}`;
      default:
        return qrData;
    }
  };

  const handleGenerate = () => {
    const data = generateQRData();
    
    if (!data || data.trim() === "") {
      toast({
        title: "Data Required",
        description: "Please enter the required information",
        variant: "destructive",
      });
      return;
    }

    if (qrCode && qrRef.current) {
      qrCode.update({
        width: size,
        height: size,
        data: data,
        margin: margin,
        dotsOptions: {
          color: dotsColor,
          type: dotStyle as any
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        cornersSquareOptions: {
          color: cornerSquareColor,
          type: cornerSquareStyle as any,
        },
        cornersDotOptions: {
          color: cornerDotColor,
          type: cornerDotStyle as any,
        }
      });
      
      // Clear previous QR code
      qrRef.current.innerHTML = "";
      qrCode.append(qrRef.current);
      setIsGenerated(true);
      
      toast({
        title: "✨ QR Code Generated!",
        description: "Your QR code is ready to download",
      });
    }
  };

  const handleDownload = (format: "png" | "svg") => {
    if (!qrCode || !isGenerated) return;
    
    qrCode.download({
      name: `qrcode-${Date.now()}`,
      extension: format
    });
    
    toast({
      title: "✅ Download Started",
      description: `Your QR code is being downloaded as ${format.toUpperCase()}`,
    });
  };

  const handleCopy = async () => {
    const data = generateQRData();
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "📋 Copied!",
        description: "QR code data copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const renderInputFields = () => {
    const typeInfo = qrTypes.find(t => t.value === qrType);
    const Icon = typeInfo?.icon || FileText;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">{typeInfo?.label} Details</h3>
        </div>
        
        {qrType === "url" && (
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
            />
          </div>
        )}
        
        {qrType === "text" && (
          <div className="space-y-2">
            <Label htmlFor="text">Text Content</Label>
            <Textarea
              id="text"
              placeholder="Enter any text..."
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {qrType === "email" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailBody">Message (Optional)</Label>
              <Textarea
                id="emailBody"
                placeholder="Email message"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}
        
        {qrType === "phone" && (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        )}
        
        {qrType === "sms" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="smsNumber">Phone Number</Label>
              <Input
                id="smsNumber"
                type="tel"
                placeholder="+1234567890"
                value={smsNumber}
                onChange={(e) => setSmsNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smsMessage">Message</Label>
              <Textarea
                id="smsMessage"
                placeholder="Text message"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}
        
        {qrType === "wifi" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="ssid">Network Name (SSID)</Label>
              <Input
                id="ssid"
                placeholder="WiFi Network Name"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifiPassword">Password</Label>
              <Input
                id="wifiPassword"
                type="password"
                placeholder="WiFi Password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="encryption">Encryption</Label>
              <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                <SelectTrigger id="encryption">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        {qrType === "vcard" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="vcardName">Full Name</Label>
              <Input
                id="vcardName"
                placeholder="John Doe"
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vcardPhone">Phone</Label>
              <Input
                id="vcardPhone"
                type="tel"
                placeholder="+1234567890"
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vcardEmail">Email</Label>
              <Input
                id="vcardEmail"
                type="email"
                placeholder="john@example.com"
                value={vcardEmail}
                onChange={(e) => setVcardEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vcardOrg">Organization (Optional)</Label>
              <Input
                id="vcardOrg"
                placeholder="Company Name"
                value={vcardOrg}
                onChange={(e) => setVcardOrg(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vcardUrl">Website (Optional)</Label>
              <Input
                id="vcardUrl"
                type="url"
                placeholder="https://example.com"
                value={vcardUrl}
                onChange={(e) => setVcardUrl(e.target.value)}
              />
            </div>
          </>
        )}
        
        {qrType === "location" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="37.7749"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="-122.4194"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6 mt-6">
          {/* QR Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <QrCode className="h-4 w-4 text-yellow-500" />
              QR Code Type
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {qrTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                      qrType === type.value
                        ? "ring-2 ring-blue-500 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setQrType(type.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Input Fields */}
          {renderInputFields()}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            className="w-full bolt-gradient text-white font-semibold py-6 rounded-xl hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Generate QR Code
          </Button>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-6 mt-6">
          <div className="space-y-6">
            {/* Size and Margin */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Size (px)</Label>
                <Input
                  id="size"
                  type="number"
                  min="100"
                  max="1000"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value) || 300)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margin">Margin</Label>
                <Input
                  id="margin"
                  type="number"
                  min="0"
                  max="50"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value) || 10)}
                />
              </div>
            </div>

            {/* Dot Style */}
            <div className="space-y-2">
              <Label htmlFor="dotStyle">Dot Style</Label>
              <Select value={dotStyle} onValueChange={setDotStyle}>
                <SelectTrigger id="dotStyle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dotStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Corner Styles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cornerSquare">Corner Square</Label>
                <Select value={cornerSquareStyle} onValueChange={setCornerSquareStyle}>
                  <SelectTrigger id="cornerSquare">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cornerSquareStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cornerDot">Corner Dot</Label>
                <Select value={cornerDotStyle} onValueChange={setCornerDotStyle}>
                  <SelectTrigger id="cornerDot">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cornerDotStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-500" />
                Colors
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dotsColor">Dots Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="dotsColor"
                      type="color"
                      value={dotsColor}
                      onChange={(e) => setDotsColor(e.target.value)}
                      className="w-16 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={dotsColor}
                      onChange={(e) => setDotsColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bgColor">Background</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="bgColor"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-16 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cornerSquareColor">Corner Square</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="cornerSquareColor"
                      type="color"
                      value={cornerSquareColor}
                      onChange={(e) => setCornerSquareColor(e.target.value)}
                      className="w-16 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={cornerSquareColor}
                      onChange={(e) => setCornerSquareColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cornerDotColor">Corner Dot</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="cornerDotColor"
                      type="color"
                      value={cornerDotColor}
                      onChange={(e) => setCornerDotColor(e.target.value)}
                      className="w-16 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={cornerDotColor}
                      onChange={(e) => setCornerDotColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* QR Code Preview */}
      {isGenerated && (
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <QrCode className="h-5 w-5 text-yellow-500" />
            Your QR Code
          </h3>
          
          <div className="flex flex-col items-center gap-4">
            <Card className="p-6 bg-white dark:bg-gray-900">
              <div ref={qrRef} className="flex items-center justify-center" />
            </Card>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => handleDownload("png")}
                className="bolt-gradient text-white font-semibold px-6 hover:scale-105 transition-transform"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <Button
                onClick={() => handleDownload("svg")}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform"
              >
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Data
                  </>
                )}
              </Button>
              <Button
                onClick={handleGenerate}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
