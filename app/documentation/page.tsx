'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteHeader } from '@/components/site-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Sparkles,
  FileText,
  Presentation,
  Mail,
  Award,
  BarChart3,
  Download,
  Palette,
  Zap,
  Users,
  Shield,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Code,
  Settings,
  Star,
  Rocket,
  Search,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Clock,
  TrendingUp,
} from 'lucide-react';

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter content based on search query
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results: any[] = [];

    // Search in document types
    documentTypes.forEach((doc) => {
      if (
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query)
      ) {
        results.push({ type: 'Document Type', item: doc, tab: 'getting-started' });
      }
    });

    // Search in features
    platformFeatures.forEach((feature) => {
      if (
        feature.title.toLowerCase().includes(query) ||
        feature.description.toLowerCase().includes(query)
      ) {
        results.push({ type: 'Feature', item: feature, tab: 'features' });
      }
    });

    // Search in guides
    guides.forEach((guide) => {
      if (
        guide.title.toLowerCase().includes(query) ||
        guide.description.toLowerCase().includes(query)
      ) {
        results.push({ type: 'Guide', item: guide, tab: 'guides' });
      }
    });

    // Search in FAQs
    faqs.forEach((faq) => {
      if (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      ) {
        results.push({ type: 'FAQ', item: faq, tab: 'faq' });
      }
    });

    return results;
  }, [searchQuery]);

  // Copy to clipboard function
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Auto-focus search with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('doc-search')?.focus();
      }
    };

    // On load, check for hash to set initial tab
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    if (hash && ['getting-started', 'features', 'guides', 'api', 'faq'].includes(hash)) {
      setActiveTab(hash);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keep URL hash in sync when switching tabs (without page jump)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const newHash = `#${activeTab}`;
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <SiteHeader />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 mesh-gradient opacity-20"></div>
        <div className="floating-orb w-96 h-96 sunset-gradient opacity-10 top-20 -right-32 animate-pulse"></div>
        <div className="floating-orb w-72 h-72 ocean-gradient opacity-15 bottom-20 -left-24 animate-pulse"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-blue-200/30 mb-6 animate-fade-in">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold bolt-gradient-text">
                Complete Documentation
              </span>
            </div>

            <h1 className="modern-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              <span className="bolt-gradient-text">Documentation</span> & Guides
            </h1>

            <p className="modern-body text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
              Everything you need to know about using docverse to create professional documents
              with AI-powered tools
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="doc-search"
                  type="text"
                  placeholder="Search documentation... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl glass-effect border border-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {filteredContent && filteredContent.length > 0 && (
                <div className="mt-2 p-4 rounded-xl glass-effect border border-blue-200/30 max-h-96 overflow-y-auto animate-fade-in">
                  <p className="text-sm text-muted-foreground mb-3">
                    Found {filteredContent.length} result{filteredContent.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-2">
                    {filteredContent.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveTab(result.tab);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors flex items-start gap-3 group"
                      >
                        <Badge variant="outline" className="mt-0.5">
                          {result.type}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-semibold group-hover:text-blue-600 transition-colors">
                            {result.item.title || result.item.question}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.item.description || result.item.answer}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredContent && filteredContent.length === 0 && (
                <div className="mt-2 p-4 rounded-xl glass-effect border border-blue-200/30 animate-fade-in">
                  <p className="text-sm text-muted-foreground text-center">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { label: 'Document Types', value: '6+', icon: FileText },
                { label: 'Features', value: '20+', icon: Sparkles },
                { label: 'Templates', value: '50+', icon: Palette },
                { label: 'Active Users', value: '10K+', icon: Users },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl glass-effect border border-blue-200/20 hover:border-blue-300/40 transition-all group"
                >
                  <stat.icon className="h-5 w-5 text-blue-600 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-bold bolt-gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-lg pb-4 mb-8 -mt-4">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-2 gap-2 shadow-lg">
                <TabsTrigger
                  value="getting-started"
                  className="text-xs sm:text-sm py-3 data-[state=active]:bolt-gradient data-[state=active]:text-white transition-all"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Getting Started</span>
                  <span className="sm:hidden">Start</span>
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="text-xs sm:text-sm py-3 data-[state=active]:bolt-gradient data-[state=active]:text-white transition-all"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Features</span>
                  <span className="sm:hidden">Features</span>
                </TabsTrigger>
                <TabsTrigger
                  value="guides"
                  className="text-xs sm:text-sm py-3 data-[state=active]:bolt-gradient data-[state=active]:text-white transition-all"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Guides</span>
                  <span className="sm:hidden">Guides</span>
                </TabsTrigger>
                <TabsTrigger
                  value="api"
                  className="text-xs sm:text-sm py-3 data-[state=active]:bolt-gradient data-[state=active]:text-white transition-all"
                >
                  <Code className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">API Reference</span>
                  <span className="sm:hidden">API</span>
                </TabsTrigger>
                <TabsTrigger
                  value="faq"
                  className="text-xs sm:text-sm py-3 data-[state=active]:bolt-gradient data-[state=active]:text-white transition-all"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">FAQ</span>
                  <span className="sm:hidden">FAQ</span>
                </TabsTrigger>
              </TabsList>

              {/* Breadcrumb */}
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Documentation</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium capitalize">
                  {activeTab.replace('-', ' ')}
                </span>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/documentation#${activeTab}`;
                    navigator.clipboard.writeText(url);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 1500);
                  }}
                  className="ml-2 px-2 py-1 rounded-md border hover:bg-muted transition-colors"
                  title="Copy link to this section"
                >
                  {copiedLink ? 'Copied!' : 'Copy link'}
                </button>
              </div>
            </div>

            {/* Getting Started Tab */}
            <TabsContent value="getting-started" className="space-y-8 animate-fade-in">
              <Card className="glass-effect border-blue-200/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl mb-2">
                        <Rocket className="h-6 w-6 text-blue-600" />
                        Welcome to docverse
                      </CardTitle>
                      <CardDescription className="text-base">
                        Get up and running in minutes with our AI-powered document creation platform
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      5 min read
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-base">
                      docverse is an advanced AI-powered platform that helps you create professional
                      documents including resumes, CVs, cover letters, presentations, and more. Our
                      intelligent tools leverage cutting-edge AI to generate high-quality,
                      ATS-optimized content in seconds.
                    </p>
                  </div>

                  {/* Quick Start Steps */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Quick Start Guide
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quickStartSteps.map((step, index) => (
                        <div
                          key={index}
                          className="flex gap-4 p-5 rounded-xl glass-effect border border-blue-200/20 hover:border-blue-300/40 hover:shadow-lg transition-all group cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bolt-gradient flex items-center justify-center text-white font-bold flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1.5 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                              {step.title}
                              <step.icon className="h-4 w-4 text-blue-600" />
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 p-5 bg-gradient-to-r from-yellow-50/80 to-amber-50/80 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-xl border border-yellow-200/40 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1.5">
                          💡 Pro Tip
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                          Create an account to save your documents, access them from any device, and
                          unlock premium features like unlimited exports and advanced AI customization!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Types Grid */}
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Available Document Types</h2>
                  <p className="text-muted-foreground">
                    Choose from our wide range of AI-powered document generators
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documentTypes.map((doc, index) => (
                    <Card
                      key={index}
                      className="glass-effect border-blue-200/20 hover:border-blue-300/40 transition-all hover:scale-105 hover:shadow-xl group cursor-pointer overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
                      <CardHeader className="relative">
                        <div
                          className={`w-14 h-14 rounded-xl ${doc.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                        >
                          <doc.icon className="h-7 w-7 text-white" />
                        </div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {doc.title}
                        </CardTitle>
                        <CardDescription className="leading-relaxed">
                          {doc.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="mb-4">
                          {doc.badge}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full group-hover:bolt-gradient group-hover:text-white transition-all"
                        >
                          Learn More <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6 animate-fade-in">
              <Card className="glass-effect border-purple-200/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                    Platform Features
                  </CardTitle>
                  <CardDescription className="text-base">
                    Discover the powerful features that make docverse the best choice for document
                    creation
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {platformFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="p-6 rounded-xl glass-effect border border-purple-200/20 hover:border-purple-300/40 hover:shadow-lg transition-all group cursor-pointer"
                      >
                        <div
                          className={`w-14 h-14 rounded-lg ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}
                        >
                          <feature.icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {feature.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="text-xs group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides" className="space-y-6 animate-fade-in">
              <Card className="glass-effect border-green-200/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BookOpen className="h-6 w-6 text-green-600" />
                    How-To Guides
                  </CardTitle>
                  <CardDescription className="text-base">
                    Step-by-step tutorials to help you master docverse
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {guides.map((guide, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border-none bg-muted/30 rounded-xl px-5 hover:bg-muted/50 transition-colors"
                      >
                        <AccordionTrigger className="hover:no-underline py-5">
                          <div className="flex items-center gap-3 text-left">
                            <div
                              className={`w-10 h-10 rounded-lg ${guide.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
                            >
                              <guide.icon className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-semibold text-base">{guide.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-5">
                          <div className="pl-12 space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {guide.description}
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                              {guide.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="text-muted-foreground">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Reference Tab */}
            <TabsContent value="api" className="space-y-6 animate-fade-in">
              <Card className="glass-effect border-indigo-200/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Code className="h-6 w-6 text-indigo-600" />
                    API Reference
                  </CardTitle>
                  <CardDescription className="text-base">
                    Technical documentation for developers integrating with docverse
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                  <div className="p-5 bg-muted/50 rounded-xl border border-indigo-200/20 shadow-sm">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-base">
                      <Shield className="h-5 w-5 text-indigo-600" />
                      Authentication
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      All API requests require authentication using your API key.
                    </p>
                    <div className="relative group">
                      <div className="bg-background/80 p-4 rounded-lg font-mono text-sm border border-indigo-200/20">
                        Authorization: Bearer YOUR_API_KEY
                      </div>
                      <button
                        onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')}
                        className="absolute top-2 right-2 p-2 rounded-md bg-muted/80 hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                        title="Copy to clipboard"
                      >
                        {copiedCode === 'auth' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Available Endpoints</h3>
                    <div className="space-y-4">
                      {apiEndpoints.map((endpoint, index) => (
                        <div
                          key={index}
                          className="p-5 rounded-xl glass-effect border border-indigo-200/20 hover:border-indigo-300/40 hover:shadow-lg transition-all group"
                        >
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <Badge
                              variant={endpoint.method === 'GET' ? 'outline' : 'default'}
                              className={`font-mono font-semibold ${
                                endpoint.method === 'POST'
                                  ? 'bg-green-600 text-white'
                                  : 'border-indigo-300'
                              }`}
                            >
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm font-mono bg-muted/50 px-3 py-1 rounded-md flex-1">
                              {endpoint.endpoint}
                            </code>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            {endpoint.description}
                          </p>
                          {endpoint.example && (
                            <details className="mt-3">
                              <summary className="text-sm font-semibold cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-2">
                                <Code className="h-4 w-4" />
                                View Example Request
                              </summary>
                              <div className="mt-3 relative group/code">
                                <div className="bg-background/80 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-indigo-200/20">
                                  <pre className="text-muted-foreground">{endpoint.example}</pre>
                                </div>
                                <button
                                  onClick={() =>
                                    copyToClipboard(endpoint.example || '', `endpoint-${index}`)
                                  }
                                  className="absolute top-2 right-2 p-2 rounded-md bg-muted/80 hover:bg-muted transition-colors opacity-0 group-hover/code:opacity-100"
                                  title="Copy to clipboard"
                                >
                                  {copiedCode === `endpoint-${index}` ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API Resources Card */}
                  <div className="p-5 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-200/40">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-indigo-600" />
                      Additional Resources
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <ChevronRight className="h-4 w-4" />
                        <span>API Rate Limits & Best Practices</span>
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <ChevronRight className="h-4 w-4" />
                        <span>Webhook Integration Guide</span>
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <ChevronRight className="h-4 w-4" />
                        <span>Error Handling & Status Codes</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6 animate-fade-in">
              <Card className="glass-effect border-amber-200/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <HelpCircle className="h-6 w-6 text-amber-600" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription className="text-base">
                    Find answers to common questions about docverse
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`faq-${index}`}
                        className="border-none bg-muted/30 rounded-xl px-5 hover:bg-muted/50 transition-colors"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-5">
                          <span className="font-semibold text-base pr-4">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-5">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Support Section */}
              <Card className="glass-effect border-blue-200/30 overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Users className="h-6 w-6 text-blue-600" />
                    Need More Help?
                  </CardTitle>
                  <CardDescription className="text-base">
                    Can't find what you're looking for? Our support team is here to help!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto py-6 flex-col gap-3 hover:border-blue-300 hover:shadow-lg transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="font-semibold">Email Support</span>
                      <span className="text-sm text-muted-foreground">support@docverse.com</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-6 flex-col gap-3 hover:border-purple-300 hover:shadow-lg transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <span className="font-semibold">Community Forum</span>
                      <span className="text-sm text-muted-foreground">Join our community</span>
                    </Button>
                  </div>
                  
                  {/* Additional Support Info */}
                  <div className="mt-6 p-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/40">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-blue-600" />
                      Premium Support
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      Upgrade to our premium plan for priority support with faster response times and
                      dedicated account management.
                    </p>
                    <Button size="sm" className="bolt-gradient text-white">
                      View Premium Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

// Data arrays
const quickStartSteps = [
  {
    title: 'Choose Document Type',
    description: 'Select from Resume, CV, Cover Letter, Presentation, or Diagram',
    icon: FileText,
  },
  {
    title: 'Fill Your Information',
    description: 'Add your details - all fields are optional, AI helps with the rest',
    icon: Sparkles,
  },
  {
    title: 'Generate with AI',
    description: 'Let our AI create a professional, ATS-optimized document',
    icon: Zap,
  },
  {
    title: 'Download & Share',
    description: 'Export as PDF, Word, or PowerPoint and start using!',
    icon: Download,
  },
];

const documentTypes = [
  {
    title: 'Resume Builder',
    description: 'Create ATS-optimized resumes with AI-powered content generation',
    icon: FileText,
    gradient: 'sunset-gradient',
    badge: 'Most Popular',
  },
  {
    title: 'CV Generator',
    description: 'Build comprehensive CVs for academic and research positions',
    icon: BookOpen,
    gradient: 'ocean-gradient',
    badge: 'Academic',
  },
  {
    title: 'Cover Letters',
    description: 'Generate compelling cover letters tailored to job descriptions',
    icon: Mail,
    gradient: 'forest-gradient',
    badge: 'Job Applications',
  },
  {
    title: 'Presentations',
    description: 'Create stunning presentations with AI-generated content and layouts',
    icon: Presentation,
    gradient: 'cosmic-gradient',
    badge: 'Business',
  },
  {
    title: 'Certificates',
    description: 'Design professional certificates for awards and achievements',
    icon: Award,
    gradient: 'bolt-gradient',
    badge: 'Recognition',
  },
  {
    title: 'Diagrams',
    description: 'Generate flowcharts, mind maps, and technical diagrams',
    icon: BarChart3,
    gradient: 'sunset-gradient',
    badge: 'Technical',
  },
];

const platformFeatures = [
  {
    title: 'AI-Powered Generation',
    description:
      'Advanced AI understands your requirements and generates professional content instantly',
    icon: Sparkles,
    gradient: 'sunset-gradient',
    tags: ['Smart', 'Fast', 'Accurate'],
  },
  {
    title: 'ATS Optimization',
    description:
      'Resumes optimized for Applicant Tracking Systems to improve your job application success',
    icon: CheckCircle,
    gradient: 'forest-gradient',
    tags: ['Job Ready', 'Optimized'],
  },
  {
    title: 'Multiple Export Formats',
    description: 'Download documents in PDF, DOCX, PPTX, and more formats',
    icon: Download,
    gradient: 'ocean-gradient',
    tags: ['PDF', 'Word', 'PowerPoint'],
  },
  {
    title: 'Template Library',
    description: 'Access professionally designed templates for every document type',
    icon: Palette,
    gradient: 'cosmic-gradient',
    tags: ['Professional', 'Modern'],
  },
  {
    title: 'Real-Time Preview',
    description: 'See changes instantly as you edit with live document preview',
    icon: Zap,
    gradient: 'bolt-gradient',
    tags: ['Live', 'Interactive'],
  },
  {
    title: 'Secure & Private',
    description: 'Your documents are encrypted and stored securely with enterprise-grade security',
    icon: Shield,
    gradient: 'sunset-gradient',
    tags: ['Encrypted', 'Private'],
  },
];

const guides = [
  {
    title: 'Creating Your First Resume',
    description: 'Learn how to build a professional resume from scratch',
    icon: FileText,
    gradient: 'sunset-gradient',
    steps: [
      'Navigate to the Resume Builder from the main menu',
      'Choose between Quick Generate or Guided Mode',
      'Fill in your personal information, work experience, and skills',
      'Select a professional template that matches your industry',
      'Review and customize the AI-generated content',
      'Download your resume in PDF or DOCX format',
    ],
  },
  {
    title: 'Analyzing Resume with ATS',
    description: 'Use our ATS analyzer to optimize your resume for job applications',
    icon: BarChart3,
    gradient: 'ocean-gradient',
    steps: [
      'Upload your existing resume or paste the content',
      'Optionally provide the job description you are targeting',
      'Click "Analyze" to get ATS compatibility score',
      'Review the detailed feedback on keywords, formatting, and content',
      'Implement the suggested improvements',
      'Re-analyze to track your progress',
    ],
  },
  {
    title: 'Building a Presentation',
    description: 'Create engaging presentations with AI assistance',
    icon: Presentation,
    gradient: 'cosmic-gradient',
    steps: [
      'Go to the Presentation Generator',
      'Enter your topic and presentation goals',
      'Specify the number of slides you need',
      'Choose a visual theme and color scheme',
      'Review the AI-generated outline and content',
      'Customize slides with your own images and text',
      'Export as PPTX for PowerPoint or Google Slides',
    ],
  },
  {
    title: 'Using Templates',
    description: 'Leverage pre-built templates for faster document creation',
    icon: Palette,
    gradient: 'forest-gradient',
    steps: [
      'Browse the Template Gallery from the main menu',
      'Filter templates by category, industry, or style',
      'Preview templates before selection',
      'Click "Use Template" to start editing',
      'Replace placeholder content with your information',
      'Save and download your customized document',
    ],
  },
];

const apiEndpoints = [
  {
    method: 'POST',
    endpoint: '/api/generate/resume',
    description: 'Generate a resume based on provided information',
    example: `{
  "name": "John Doe",
  "experience": [...],
  "skills": [...],
  "template": "modern"
}`,
  },
  {
    method: 'POST',
    endpoint: '/api/analyze/resume',
    description: 'Analyze a resume for ATS compatibility',
    example: `{
  "resumeText": "...",
  "jobDescription": "..."
}`,
  },
  {
    method: 'POST',
    endpoint: '/api/generate/presentation',
    description: 'Generate a presentation based on topic and requirements',
    example: `{
  "topic": "AI in Healthcare",
  "slides": 10,
  "style": "professional"
}`,
  },
  {
    method: 'GET',
    endpoint: '/api/templates',
    description: 'Retrieve available templates',
    example: null,
  },
];

const faqs = [
  {
    question: 'Is docverse free to use?',
    answer:
      'Yes! docverse offers a generous free tier that includes basic document generation, templates, and exports. Premium features like unlimited exports, advanced AI customization, and priority support are available with our paid plans.',
  },
  {
    question: 'How does the ATS optimization work?',
    answer:
      'Our ATS (Applicant Tracking System) analyzer scans your resume for common issues that prevent it from passing through automated screening systems. It checks for proper formatting, relevant keywords, appropriate section headers, and compatibility with major ATS platforms.',
  },
  {
    question: 'Can I edit documents after AI generation?',
    answer:
      'Absolutely! All AI-generated content is fully editable. You can modify text, change formatting, add or remove sections, and customize every aspect of your document using our intuitive editor.',
  },
  {
    question: 'What file formats can I export to?',
    answer:
      'We support multiple export formats including PDF (recommended for job applications), DOCX (Microsoft Word), PPTX (PowerPoint), and plain text. Some formats may require a premium subscription.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, security is our top priority. All data is encrypted in transit and at rest. We never share your personal information or documents with third parties. You can delete your data at any time from your account settings.',
  },
  {
    question: 'Can I use docverse for commercial purposes?',
    answer:
      'Yes, all documents generated with docverse are yours to use for any purpose, including commercial applications. Our business plan offers additional features specifically designed for teams and organizations.',
  },
  {
    question: 'How accurate is the AI-generated content?',
    answer:
      'Our AI is trained on millions of professional documents and follows industry best practices. However, we always recommend reviewing and customizing the generated content to ensure it accurately represents your unique experience and goals.',
  },
  {
    question: 'Do you offer customer support?',
    answer:
      'Yes! Free users have access to email support and our community forum. Premium subscribers get priority email support with faster response times. We also offer live chat support for enterprise customers.',
  },
];
