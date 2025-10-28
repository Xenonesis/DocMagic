'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useTheme } from 'next-themes';
import { useUsageStats } from '@/hooks/use-usage-stats';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Settings,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Laptop,
  BarChart3,
  BellRing,
  FileText,
  Layout,
  TrendingUp,
  ShieldCheck,
  Headset,
  ExternalLink,
} from 'lucide-react';

type PreferenceKey = 'newDocumentEmails' | 'productUpdates' | 'securityAlerts';

const preferenceDefaults: Record<PreferenceKey, boolean> = {
  newDocumentEmails: true,
  productUpdates: false,
  securityAlerts: true,
};

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [preferences, setPreferences] = useState<Record<PreferenceKey, boolean>>({
    ...preferenceDefaults,
  });
  const {
    documentsCreated,
    templatesUsed,
    templatesCreated,
    successRate,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useUsageStats();

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = useMemo(() => {
    if (!user?.email) return 'DV';
    return user.email.slice(0, 2).toUpperCase();
  }, [user?.email]);

  const displayName = useMemo(() => {
    const metadata = user?.user_metadata ?? {};
    return (
      metadata.name ??
      metadata.full_name ??
      user?.email?.split('@')[0] ??
      'Docverse user'
    );
  }, [user?.email, user?.user_metadata]);

  const planLabel = useMemo(() => {
    const metadata = user?.user_metadata ?? {};
    return (metadata.plan_name ?? metadata.plan ?? 'Free') as string;
  }, [user?.user_metadata]);

  const joinedOn = useMemo(() => {
    if (!user?.created_at) return null;
    try {
      return new Date(user.created_at).toLocaleDateString();
    } catch {
      return null;
    }
  }, [user?.created_at]);

  const activeTheme = (theme ?? 'system') as 'light' | 'dark' | 'system';

  const themeOptions = useMemo(
    () => [
      {
        value: 'light' as const,
        label: 'Light',
        description: 'Bright, clean look that shines in daylight.',
        icon: Sun,
      },
      {
        value: 'dark' as const,
        label: 'Dark',
        description: 'Dimmed palette designed for late-night focus.',
        icon: Moon,
      },
      {
        value: 'system' as const,
        label: 'System',
        description: 'Automatically matches your device preference.',
        icon: Laptop,
      },
    ],
    [],
  );

  const notificationSettings = useMemo(
    () => [
      {
        key: 'newDocumentEmails' as const,
        title: 'Document activity',
        description: 'Be notified when new documents are generated or shared.',
        icon: FileText,
      },
      {
        key: 'productUpdates' as const,
        title: 'Product updates',
        description: 'Hear about new templates, AI features, and best practices.',
        icon: Sparkles,
      },
      {
        key: 'securityAlerts' as const,
        title: 'Security alerts',
        description: 'Get alerted about critical sign-in attempts and policy changes.',
        icon: ShieldCheck,
      },
    ],
    [],
  );

  const usageSummary = useMemo(
    () => [
      {
        label: 'Documents created',
        value: documentsCreated,
        icon: FileText,
        accentClass: 'text-blue-600 dark:text-blue-400',
      },
      {
        label: 'Templates used',
        value: templatesUsed,
        icon: Layout,
        accentClass: 'text-green-600 dark:text-green-400',
      },
      {
        label: 'Templates created',
        value: templatesCreated,
        icon: Sparkles,
        accentClass: 'text-purple-600 dark:text-purple-400',
      },
    ],
    [documentsCreated, templatesUsed, templatesCreated],
  );

  const supportResources = useMemo(
    () => [
      {
        title: 'Knowledge base',
        description: 'Guides, tutorials, and tips for shipping documents faster.',
        icon: ExternalLink,
        action: () => window.open('https://docs.docverse.ai', '_blank', 'noopener'),
        actionLabel: 'Open docs',
      },
      {
        title: 'Contact support',
        description: 'Have a billing or product question? Our team is here to help.',
        icon: Headset,
        action: () => window.open('mailto:support@docverse.ai'),
        actionLabel: 'Email us',
      },
      {
        title: 'Status page',
        description: 'Stay updated on uptime, incidents, and maintenance windows.',
        icon: ShieldCheck,
        action: () => window.open('https://status.docverse.ai', '_blank', 'noopener'),
        actionLabel: 'View status',
      },
    ],
    [],
  );

  const handleResetPreferences = () => {
    setPreferences({ ...preferenceDefaults });
  };

  const updatePreference = (key: PreferenceKey, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleInviteTeam = () => {
    const inviteUrl = `${window.location.origin}/auth/signin?activity=join_team&redirectTo=/settings`;
    const subject = encodeURIComponent('Join me on Docverse');
    const body = encodeURIComponent(
      `Hey! I am using Docverse to generate polished documents in minutes. Join me so we can collaborate on templates together.\n\nClick here to join: ${inviteUrl}`,
    );
    navigator.clipboard.writeText(inviteUrl).then(() => {
      toast({
        title: 'Invite link copied!',
        description: 'Share this link with your team members to invite them to Docverse.',
      });
    }).catch(() => {
      // Fallback: open mailto with the link in body
      window.open(`mailto:?subject=${subject}&body=${body}`);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-500 border-t-transparent"></div>
          <span className="font-medium">Loading your settings...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center">
            <div className="p-8 rounded-3xl border">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Access Your Settings</h1>
                <p className="text-muted-foreground">
                  Sign in to manage your profile, preferences, and account settings
                </p>
              </div>
              <div className="mt-6 grid gap-3">
                <Button
                  onClick={() => router.push('/auth/signin')}
                  className="w-full bg-gradient-to-r from-yellow-400 to-blue-600 text-white font-semibold"
                  size="lg"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Sign in to Docverse
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}
                  className="w-full"
                  size="lg"
                >
                  Back to home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-sm font-medium mb-4">
            <Settings className="h-4 w-4 text-yellow-500" />
            Account settings hub
            <Sparkles className="h-4 w-4 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Shape your{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Docverse experience
            </span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Update profile details, fine-tune preferences, and see how your workspace is performing.
          </p>
        </div>

        <div className="grid gap-7">
          <Card className="overflow-hidden border border-yellow-500/10 bg-gradient-to-br from-background via-background to-blue-500/5">
            <CardHeader className="border-b bg-background/60 backdrop-blur">
              <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Account overview
                </span>
                <Badge variant="outline" className="w-fit text-xs uppercase tracking-wide">
                  {planLabel} plan
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border border-primary/40">
                    <AvatarFallback className="bg-gradient-to-br from-yellow-400/70 to-blue-500/70 text-base font-semibold uppercase text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold leading-tight">{displayName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {joinedOn && (
                      <p className="text-xs text-muted-foreground/80">Member since {joinedOn}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure workspace
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI assisted
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {usageSummary.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border bg-background/60 p-4 text-center shadow-sm transition hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Icon className={cn('h-5 w-5', item.accentClass)} />
                        <span className="text-2xl font-semibold text-foreground">{item.value}</span>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => router.push('/pricing')}
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-500 text-white shadow"
                >
                  Upgrade plan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="border-dashed"
                >
                  Explore templates
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  Appearance & theme
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Preview each theme option and switch instantly.
                </p>
              </div>
              {mounted && (
                <Badge variant="outline" className="w-fit text-xs uppercase">
                  Active: {activeTheme}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-5">
              {!mounted ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={`theme-skeleton-${index}`}
                      className="h-24 animate-pulse rounded-xl bg-muted"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = activeTheme === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTheme(option.value)}
                        className={cn(
                          'group flex h-full w-full flex-col items-start gap-3 rounded-2xl border p-4 text-left transition hover:border-primary/60 hover:shadow-md',
                          isActive && 'border-primary/80 ring-2 ring-primary/20',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition',
                            isActive && 'bg-primary/15 text-primary',
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{option.label}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        {isActive && <Badge className="text-xs">Selected</Badge>}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme('system')}
                  disabled={activeTheme === 'system'}
                >
                  Match system theme
                </Button>
                <p className="text-xs text-muted-foreground">
                  Resolved theme:&nbsp;
                  <span className="font-mono">{mounted ? resolvedTheme : 'Detecting…'}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BellRing className="h-5 w-5 text-orange-500" />
                  Notifications
                </CardTitle>
                <p className="text-sm text-muted-foreground">Choose how Docverse keeps in touch.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleResetPreferences}>
                Reset to defaults
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationSettings.map((setting) => {
                const Icon = setting.icon;
                return (
                  <div
                    key={setting.key}
                    className="flex flex-col gap-3 rounded-2xl border bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-medium">{setting.title}</p>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences[setting.key]}
                      onCheckedChange={(checked) => updatePreference(setting.key, checked)}
                    />
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground">
                Preferences are stored locally today. Workspace-wide notification routing is arriving soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Usage insights
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  See how your documents and templates perform over time.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={refetchStats} disabled={statsLoading}>
                Refresh data
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {statsLoading ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {[1, 2, 3].map((index) => (
                    <div key={`stats-skeleton-${index}`} className="h-24 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : statsError ? (
                <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 text-center text-sm text-destructive">
                  <p className="font-medium">We couldn't load your usage data.</p>
                  <p className="mt-1 text-xs opacity-80">{statsError}</p>
                  <Button className="mt-3" size="sm" variant="outline" onClick={refetchStats}>
                    Try again
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {usageSummary.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="rounded-xl border bg-background/60 p-4 text-center shadow-sm transition hover:shadow-md"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Icon className={cn('h-5 w-5', item.accentClass)} />
                            <span className="text-2xl font-semibold text-foreground">{item.value}</span>
                          </div>
                          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                            {item.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3 rounded-2xl border border-dashed p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        Success rate
                      </span>
                      <Badge variant="outline" className="text-xs uppercase">
                        {successRate}%
                      </Badge>
                    </div>
                    <Progress value={successRate} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">
                      Keep shipping documents consistently to unlock more granular analytics.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Headset className="h-5 w-5 text-blue-500" />
                Resources & support
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Get help, stay informed, and keep things running smoothly.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {supportResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <div
                    key={resource.title}
                    className="flex h-full flex-col justify-between gap-4 rounded-2xl border bg-background/60 p-4 transition hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold">{resource.title}</p>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                    <Button variant="link" className="px-0 text-primary" onClick={resource.action}>
                      {resource.actionLabel}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="rounded-3xl border border-dashed bg-muted/40 p-6 text-center">
            <h2 className="text-lg font-semibold">Invite your team</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Collaborate on shared templates and deliver documents together.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button
                onClick={handleInviteTeam}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                Send invite link
              </Button>
              <Button variant="outline" onClick={() => router.push('/')}>
                Back to home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
