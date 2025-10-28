'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Edit3,
  Save,
  X,
  Shield,
  FileText,
  Activity,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  created_at: string;
  last_sign_in_at?: string;
}

interface UserStats {
  templates_created: number;
  documents_generated: number;
  last_activity: string;
}

interface ActivityItem {
  id: string;
  title: string;
  type: string;
  action: 'created' | 'updated';
  created_at: string;
  updated_at: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  website?: string;
  bio?: string;
}

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState('profile');

  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!authUser) {
        router.push('/auth/signin?redirectTo=/profile');
      } else {
        loadUserProfile();
      }
    }
  }, [authUser, authLoading, router]);

  const loadUserProfile = async () => {
    try {
      if (!authUser) return;

      const profile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || '',
        avatar_url: authUser.user_metadata?.avatar_url || '',
        bio: authUser.user_metadata?.bio || '',
        location: authUser.user_metadata?.location || '',
        phone: authUser.user_metadata?.phone || '',
        website: authUser.website || '',
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at || undefined,
      };

      setUserProfile(profile);
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        website: profile.website || '',
      });

      let documentsCount = 0;
      let templatesCount = 0;
      let lastActivity = authUser.created_at;

      try {
        // Get documents count and data
        const documentsResult = await supabase
          .from('documents')
          .select('id, created_at')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false });
        
        documentsCount = documentsResult.data?.length || 0;
        
        if (documentsResult.data && documentsResult.data.length > 0) {
          lastActivity = documentsResult.data[0].created_at;
        }
      } catch (error) {
        console.warn('Documents table not found or accessible:', error);
      }

      try {
        // Get templates count
        const templatesResult = await supabase
          .from('templates')
          .select('id, created_at')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false });
        
        templatesCount = templatesResult.data?.length || 0;
        
        // Update last activity if template is more recent
        if (templatesResult.data && templatesResult.data.length > 0) {
          const templateDate = new Date(templatesResult.data[0].created_at);
          const currentLastActivity = new Date(lastActivity);
          if (templateDate > currentLastActivity) {
            lastActivity = templatesResult.data[0].created_at;
          }
        }
      } catch (error) {
        console.warn('Templates table not found or accessible:', error);
      }

      setStats({
        templates_created: templatesCount,
        documents_generated: documentsCount,
        last_activity: lastActivity,
      });

      // Load recent activity
      await loadRecentActivity();
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    }
  };

  const loadRecentActivity = async () => {
    if (!authUser) return;
    
    setLoadingActivity(true);
    try {
      const activities: ActivityItem[] = [];

      // Fetch recent documents
      try {
        const { data: documents, error: docsError } = await supabase
          .from('documents')
          .select('id, title, type, created_at, updated_at')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!docsError && documents) {
          documents.forEach((doc) => {
            activities.push({
              id: doc.id,
              title: doc.title,
              type: doc.type,
              action: 'created',
              created_at: doc.created_at,
              updated_at: doc.updated_at,
            });
          });
        }
      } catch (error) {
        console.warn('Could not fetch documents:', error);
      }

      // Fetch recent templates
      try {
        const { data: templates, error: templatesError } = await supabase
          .from('templates')
          .select('id, title, type, created_at, updated_at')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!templatesError && templates) {
          templates.forEach((template) => {
            activities.push({
              id: template.id,
              title: template.title,
              type: `${template.type} template`,
              action: 'created',
              created_at: template.created_at,
              updated_at: template.updated_at,
            });
          });
        }
      } catch (error) {
        console.warn('Could not fetch templates:', error);
      }

      // Sort by creation date (most recent first) and take top 15
      const sortedActivities = activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 15);

      setRecentActivity(sortedActivities);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userProfile) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, GIF, or WebP image',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploadingAvatar(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${userProfile.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        if (uploadError.message?.includes('Bucket not found')) {
          throw new Error('Storage bucket not configured. Please contact support or check the setup guide.');
        }
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
        },
      });

      if (updateError) throw updateError;

      setUserProfile((prev) => (prev ? { ...prev, avatar_url: publicUrl } : null));

      toast({
        title: 'Success',
        description: 'Profile picture updated successfully',
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);

      let errorMessage = 'Failed to upload profile picture';
      if (error.message?.includes('Storage bucket not configured')) {
        errorMessage = 'Profile picture upload is not configured yet. Please check the setup guide.';
      } else if (error.message?.includes('Bucket not found')) {
        errorMessage = 'Storage bucket not found. Please create the "avatars" bucket in Supabase Storage.';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!userProfile) return;

    try {
      setSaving(true);

      const { error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          website: formData.website,
        },
      });

      if (error) throw error;

      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              name: formData.name,
              bio: formData.bio,
              location: formData.location,
              phone: formData.phone,
              website: formData.website,
            }
          : null,
      );

      setEditing(false);
      toast({ title: 'Success', description: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!userProfile) return;

    setFormData({
      name: userProfile.name || '',
      bio: userProfile.bio || '',
      location: userProfile.location || '',
      phone: userProfile.phone || '',
      website: userProfile.website || '',
    });
    setEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (formData.name && formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Please enter a valid URL starting with http:// or https://';
    }

    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getCompletionPercentage = () => {
    if (!userProfile) return 0;
    let completed = 1; // email is always there
    if (userProfile.name) completed++;
    if (userProfile.bio) completed++;
    if (userProfile.location) completed++;
    if (userProfile.phone) completed++;
    if (userProfile.website) completed++;
    if (userProfile.avatar_url) completed++;
    return Math.round((completed / 7) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  };

  let content: React.ReactNode;

  if (authLoading) {
    content = (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  } else if (!authUser || !userProfile) {
    content = (
      <div className="text-center">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  } else {
    content = (
      <TooltipProvider>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            {!editing ? (
              <Button onClick={() => setEditing(true)} className="hover-lift">
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="hover-lift">
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="hover-lift">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Profile Completion Progress */}
          <Card className="card-sky">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm text-muted-foreground">{getCompletionPercentage()}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Complete your profile to unlock all features
              </p>
            </CardContent>
          </Card>

          {/* Main Content with Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Profile Form */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="hover-lift">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                            <AvatarImage src={userProfile.avatar_url} alt={userProfile.name} />
                            <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {userProfile.name ? getInitials(userProfile.name) : <User className="h-8 w-8" />}
                            </AvatarFallback>
                          </Avatar>
                          {editing && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={uploadingAvatar}
                                >
                                  {uploadingAvatar ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                  ) : (
                                    <Camera className="h-5 w-5" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Change profile picture</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl">{userProfile.name || 'Anonymous User'}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Mail className="mr-2 h-4 w-4" />
                            {userProfile.email}
                          </CardDescription>
                          {userProfile.bio && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {userProfile.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <User className="mr-2 h-5 w-5" />
                          Basic Information
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                              Full Name {formErrors.name && <span className="text-destructive">*</span>}
                            </Label>
                            {editing ? (
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter your full name"
                                className={formErrors.name ? 'border-destructive' : ''}
                              />
                            ) : (
                              <p className="text-sm text-muted-foreground py-2 px-3 bg-muted rounded-md">
                                {userProfile.name || 'Not provided'}
                              </p>
                            )}
                            {formErrors.name && (
                              <p className="text-xs text-destructive flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {formErrors.name}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Email Address</Label>
                            <p className="text-sm text-muted-foreground py-2 px-3 bg-muted rounded-md flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {userProfile.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Phone className="mr-2 h-5 w-5" />
                          Contact Information
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">
                              Phone Number {formErrors.phone && <span className="text-destructive">*</span>}
                            </Label>
                            {editing ? (
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                placeholder="+1 (555) 123-4567"
                                className={formErrors.phone ? 'border-destructive' : ''}
                              />
                            ) : (
                              <p className="text-sm text-muted-foreground py-2 px-3 bg-muted rounded-md flex items-center">
                                {userProfile.phone ? (
                                  <>
                                    <Phone className="h-4 w-4 mr-2" />
                                    {userProfile.phone}
                                  </>
                                ) : (
                                  'Not provided'
                                )}
                              </p>
                            )}
                            {formErrors.phone && (
                              <p className="text-xs text-destructive flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {formErrors.phone}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                            {editing ? (
                              <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                                placeholder="City, Country"
                              />
                            ) : (
                              <p className="text-sm text-muted-foreground py-2 px-3 bg-muted rounded-md flex items-center">
                                {userProfile.location ? (
                                  <>
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {userProfile.location}
                                  </>
                                ) : (
                                  'Not provided'
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <Label htmlFor="website" className="text-sm font-medium">
                            Website {formErrors.website && <span className="text-destructive">*</span>}
                          </Label>
                          {editing ? (
                            <Input
                              id="website"
                              value={formData.website}
                              onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                              placeholder="https://yourwebsite.com"
                              className={formErrors.website ? 'border-destructive' : ''}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground py-2 px-3 bg-muted rounded-md flex items-center">
                              {userProfile.website ? (
                                <>
                                  <Globe className="h-4 w-4 mr-2" />
                                  <a
                                    href={userProfile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {userProfile.website}
                                  </a>
                                </>
                              ) : (
                                'Not provided'
                              )}
                            </p>
                          )}
                          {formErrors.website && (
                            <p className="text-xs text-destructive flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {formErrors.website}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-medium">
                          Bio {formErrors.bio && <span className="text-destructive">*</span>}
                        </Label>
                        {editing ? (
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about yourself, your interests, and what you do..."
                            rows={4}
                            className={`resize-none ${formErrors.bio ? 'border-destructive' : ''}`}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground py-3 px-3 bg-muted rounded-md min-h-[100px]">
                            {userProfile.bio || 'No bio provided'}
                          </p>
                        )}
                        {formErrors.bio && (
                          <p className="text-xs text-destructive flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.bio}
                          </p>
                        )}
                        {editing && (
                          <p className="text-xs text-muted-foreground">
                            {formData.bio.length}/500 characters
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Activity Stats */}
                  <Card className="card-mint hover-lift">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-5 w-5" />
                        Activity Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Documents Created</span>
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          {stats?.documents_generated || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Templates Used</span>
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          {stats?.templates_created || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Last Activity</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {stats?.last_activity ? formatDate(stats.last_activity) : 'Never'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="card-sky hover-lift">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="mr-2 h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start hover-lift"
                        onClick={() => router.push('/templates')}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Browse Templates
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start hover-lift"
                        onClick={() => router.push('/resume')}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create Resume
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start hover-lift"
                        onClick={() => router.push('/settings')}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Account Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Your recent document creation and template usage activity
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadRecentActivity}
                      disabled={loadingActivity}
                      className="hover-lift"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loadingActivity ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingActivity ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="ml-3 text-muted-foreground">Loading activity...</span>
                    </div>
                  ) : recentActivity.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start creating documents and templates to see your activity here.
                      </p>
                      <Button onClick={() => router.push('/resume')} className="hover-lift">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create Your First Document
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {recentActivity.map((activity, index) => {
                        const isRecent = new Date().getTime() - new Date(activity.created_at).getTime() < 24 * 60 * 60 * 1000;
                        const wasUpdated = activity.created_at !== activity.updated_at;
                        
                        return (
                          <div
                            key={`${activity.id}-${index}`}
                            className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                {activity.type.includes('resume') && (
                                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                )}
                                {activity.type.includes('presentation') && (
                                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                  </div>
                                )}
                                {activity.type.includes('letter') && (
                                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  </div>
                                )}
                                {activity.type.includes('cv') && (
                                  <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                  </div>
                                )}
                                {activity.type.includes('template') && !activity.type.includes('resume') && !activity.type.includes('presentation') && !activity.type.includes('letter') && !activity.type.includes('cv') && (
                                  <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium truncate">{activity.title}</h4>
                                  {isRecent && (
                                    <Badge variant="secondary" className="text-xs">
                                      New
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {activity.type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">
                                    {wasUpdated ? 'Updated' : 'Created'} {formatRelativeTime(wasUpdated ? activity.updated_at : activity.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="hover-lift"
                                      onClick={() => {
                                        if (activity.type.includes('template')) {
                                          router.push(`/templates/${activity.id}/edit`);
                                        } else if (activity.type === 'presentation') {
                                          router.push(`/presentation/view/${activity.id}`);
                                        } else {
                                          // For other document types, redirect to the appropriate page
                                          router.push(`/${activity.type}`);
                                        }
                                      }}
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View/Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Your account details and security information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Member Since</Label>
                      <div className="flex items-center p-3 bg-muted rounded-lg">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{formatDate(userProfile.created_at)}</span>
                      </div>
                    </div>
                    {userProfile.last_sign_in_at && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Last Sign In</Label>
                        <div className="flex items-center p-3 bg-muted rounded-lg">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{formatDate(userProfile.last_sign_in_at)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => router.push('/settings')}
                      className="hover-lift"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Manage Account Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 page-with-header">
        <div className="container mx-auto px-4 py-8 max-w-5xl">{content}</div>
      </main>
    </div>
  );
}
