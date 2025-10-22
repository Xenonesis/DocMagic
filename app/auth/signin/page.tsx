"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getActivityDescription } from "@/lib/auth-utils";
import {
  Sparkles,
  Zap,
  Star,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Wand2,
  Check,
  Loader2,
  MousePointer2,
  Fingerprint,
  Shield,
} from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string>("/");
  const [activity, setActivity] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  // Handle mount and URL parameters
  useEffect(() => {
    setMounted(true);

    // Get redirect parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirectTo');
    const activityParam = urlParams.get('activity');

    if (redirectParam) {
      setRedirectTo(decodeURIComponent(redirectParam));
    }
    if (activityParam) {
      setActivity(decodeURIComponent(activityParam));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const activityDescription = activity ? ` You can now ${activity.replace('_', ' ')}.` : '';
        toast({
          title: "Welcome back! ✨",
          description: `You've successfully signed in to docverse.${activityDescription}`,
        });

        // Redirect to the intended page (auth-provider handles refresh)
        router.push(redirectTo);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-8">
      {/* Enhanced background elements with parallax effect */}
      <div className="absolute inset-0 mesh-gradient opacity-20 animate-pulse-glow"></div>

      {/* Animated floating orbs with staggered delays */}
      <div className="floating-orb w-32 h-32 sm:w-48 sm:h-48 bolt-gradient opacity-15 top-20 -left-24 animate-float delay-100"></div>
      <div className="floating-orb w-24 h-24 sm:w-36 sm:h-36 bolt-gradient opacity-20 bottom-20 -right-18 animate-float delay-300"></div>
      <div className="floating-orb w-40 h-40 sm:w-56 sm:h-56 bolt-gradient opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float delay-500"></div>

      {/* Enhanced grid pattern with animation */}
      <div
        className="absolute inset-0 opacity-[0.02] animate-subtle-shimmer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23000000' fill-opacity='1'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
        }}
      />

      <div
        className={`w-full max-w-md mx-4 relative z-10 transition-all duration-1000 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Enhanced card with advanced glass effect */}
        <div className="glass-effect p-6 sm:p-8 rounded-2xl shadow-2xl border border-yellow-400/20 relative overflow-hidden group hover:border-yellow-400/40 transition-all duration-500 hover:shadow-3xl backdrop-blur-xl">
          {/* Enhanced shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

          {/* Magnetic border effect */}
          <div className="absolute inset-0 rounded-2xl border border-yellow-400/10 group-hover:border-yellow-400/30 transition-all duration-500 animate-pulse-glow"></div>

          {/* Enhanced decorative elements with micro-interactions */}
          <div className="absolute top-4 right-4 group-hover:scale-125 transition-transform duration-300">
            <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse group-hover:animate-bounce" />
          </div>
          <div className="absolute bottom-4 left-4 group-hover:scale-125 transition-transform duration-300">
            <Star
              className="h-4 w-4 text-blue-500 animate-spin group-hover:animate-pulse"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <MousePointer2 className="h-3 w-3 text-purple-500 animate-bounce" />
          </div>

          <div className="relative z-10">
            {/* Enhanced header with advanced animations */}
            <div
              className={`text-center mb-6 sm:mb-8 transition-all duration-700 delay-200 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {/* Professional badge with hover effects */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4 badge-bg group hover:scale-105 transition-all duration-300 cursor-pointer">
                <Zap className="h-4 w-4 text-yellow-500 group-hover:animate-pulse transition-transform duration-300" />
                <span className="text-sm font-medium bolt-gradient-text">
                  {activity ? `Sign in to ${getActivityDescription(activity)}` : "Welcome Back"}
                </span>
                <Wand2 className="h-4 w-4 text-blue-500 group-hover:animate-spin transition-transform duration-300" />
              </div>

              {/* Modern heading with enhanced typography */}
              <h1 className="modern-display text-2xl sm:text-3xl font-bold mb-2 text-shadow-professional animate-fade-in-up">
                Sign In to{" "}
                <span className="bolt-gradient-text animate-text-glow">
                  docverse
                </span>
              </h1>
              <p className="modern-body text-muted-foreground text-sm sm:text-base animate-fade-in-up delay-100">
                {activity
                  ? `Continue to ${getActivityDescription(activity)} with AI assistance`
                  : "Continue creating magical documents with AI"
                }
              </p>
            </div>

            {/* Enhanced Google Sign-In Button */}
            <div
              className={`transition-all duration-500 delay-300 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Button
                type="button"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    console.log('🚀 Starting Google OAuth...');
                    // Build callback URL with redirectTo parameter
                    const callbackUrl = new URL('/auth/callback', window.location.origin);
                    if (redirectTo && redirectTo !== '/') {
                      callbackUrl.searchParams.set('redirectTo', redirectTo);
                    }
                    
                    const { data, error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: callbackUrl.toString(),
                        queryParams: {
                          access_type: 'offline',
                          prompt: 'consent',
                        },
                      },
                    });
                    
                    if (error) {
                      console.error('❌ OAuth initiation error:', error);
                      throw error;
                    }
                    
                    console.log('✅ OAuth initiated, redirecting to Google...');
                  } catch (error: any) {
                    console.error("Google sign in error:", error);
                    toast({
                      title: "Sign In Failed",
                      description: error.message || "Failed to sign in with Google. Please try again.",
                      variant: "destructive",
                    });
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="w-full glass-effect border-yellow-400/30 hover:border-yellow-400/60 font-semibold py-4 sm:py-5 rounded-xl relative text-base sm:text-lg shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Sign in with Google"
              >
                <div className="flex items-center justify-center gap-3 relative z-20">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-semibold professional-text">Continue with Google</span>
                </div>
                
                {/* Enhanced effects matching the site style */}
                <div className="absolute inset-0 shimmer opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-xl"></div>
                
                {/* Particle effects on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-2 left-8 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                  <div className="absolute top-3 right-8 w-1 h-1 bg-green-400 rounded-full animate-ping delay-100"></div>
                  <div className="absolute bottom-2 left-12 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-200"></div>
                  <div className="absolute bottom-3 right-12 w-1 h-1 bg-red-400 rounded-full animate-ping delay-300"></div>
                </div>
                
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-xl border border-yellow-400/20 group-hover:border-yellow-400/40 transition-all duration-300"></div>
              </Button>
            </div>

            {/* Divider */}
            <div
              className={`relative transition-all duration-500 delay-400 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-yellow-400/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground glass-effect rounded-full">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Enhanced email field with advanced interactions */}
              <div
                className={`space-y-2 transition-all duration-500 delay-500 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Label
                  htmlFor="email"
                  className={`text-sm font-medium flex items-center gap-2 professional-text transition-all duration-300 ${
                    focusedField === "email" ? "text-yellow-600 scale-105" : ""
                  }`}
                >
                  <Mail
                    className={`h-4 w-4 text-muted-foreground transition-all duration-300 ${
                      focusedField === "email"
                        ? "text-yellow-500 animate-pulse"
                        : ""
                    }`}
                  />
                  Email Address
                  {email && email.includes("@") && (
                    <Check className="h-3 w-3 text-green-500 animate-scale-in" />
                  )}
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your email"
                    required
                    className="glass-effect border-yellow-400/30 focus:border-yellow-400/60 focus:ring-yellow-400/20 pl-4 pr-4 py-3 text-sm sm:text-base transition-all duration-300 hover:border-yellow-400/50 group-hover:shadow-lg"
                    disabled={isLoading}
                  />
                  <div
                    className={`absolute inset-0 rounded-md border pointer-events-none transition-all duration-300 ${
                      focusedField === "email"
                        ? "border-yellow-400/40 shadow-lg shadow-yellow-400/20"
                        : "border-yellow-400/20"
                    }`}
                  ></div>
                  {/* Progress indicator */}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-blue-500 transition-all duration-300 ${
                      email && email.includes("@")
                        ? "w-full"
                        : email
                        ? "w-1/2"
                        : "w-0"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Enhanced password field with better UX */}
              <div
                className={`space-y-2 transition-all duration-500 delay-600 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Label
                  htmlFor="password"
                  className={`text-sm font-medium flex items-center gap-2 professional-text transition-all duration-300 ${
                    focusedField === "password"
                      ? "text-yellow-600 scale-105"
                      : ""
                  }`}
                >
                  <Lock
                    className={`h-4 w-4 text-muted-foreground transition-all duration-300 ${
                      focusedField === "password"
                        ? "text-yellow-500 animate-pulse"
                        : ""
                    }`}
                  />
                  Password
                  {password && password.length >= 6 && (
                    <Shield className="h-3 w-3 text-green-500 animate-scale-in" />
                  )}
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    required
                    className="glass-effect border-yellow-400/30 focus:border-yellow-400/60 focus:ring-yellow-400/20 pl-4 pr-12 py-3 text-sm sm:text-base transition-all duration-300 hover:border-yellow-400/50 group-hover:shadow-lg"
                    disabled={isLoading}
                  />
                  {/* Enhanced toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 hover:rotate-12"
                    disabled={isLoading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <div
                    className={`absolute inset-0 rounded-md border pointer-events-none transition-all duration-300 ${
                      focusedField === "password"
                        ? "border-yellow-400/40 shadow-lg shadow-yellow-400/20"
                        : "border-yellow-400/20"
                    }`}
                  ></div>
                  {/* Progress indicator */}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-blue-500 transition-all duration-300 ${
                      password && password.length >= 6
                        ? "w-full"
                        : password
                        ? "w-1/2"
                        : "w-0"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Enhanced submit button with advanced animations */}
              <div
                className={`transition-all duration-500 delay-700 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Button
                  type="submit"
                  disabled={isLoading || !email.trim() || !password.trim()}
                  className="w-full bolt-gradient text-white font-semibold py-4 sm:py-5 rounded-xl relative text-lg sm:text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                  aria-label="Sign in to your account"
                >
                  <div className="flex items-center justify-center gap-3 relative z-20">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="button-text font-bold">
                          Signing in...
                        </span>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-300"></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 button-icon text-yellow-200" />
                        <span className="button-text font-bold tracking-wide">
                          Sign In
                        </span>
                        <ArrowRight className="h-5 w-5 button-icon text-blue-200" />
                      </>
                    )}
                  </div>

                  {/* Epic button effects overlay */}
                  {!isLoading && (
                    <>
                      <div className="absolute inset-0 shimmer opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-10"></div>

                      {/* Particle effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                        <div className="absolute top-2 left-4 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
                        <div className="absolute top-4 right-6 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-100"></div>
                        <div className="absolute bottom-3 left-6 w-1 h-1 bg-green-300 rounded-full animate-ping delay-200"></div>
                        <div className="absolute bottom-2 right-4 w-1 h-1 bg-purple-300 rounded-full animate-ping delay-300"></div>
                      </div>

                      {/* Enhanced wave effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Enhanced footer with advanced styling */}
            <div
              className={`mt-6 sm:mt-8 text-center transition-all duration-500 delay-800 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="glass-effect p-4 rounded-xl border border-yellow-400/10 hover:border-yellow-400/20 transition-all duration-300 group hover:scale-105">
                <p className="professional-text text-sm text-muted-foreground mb-3">
                  Don&apos;t have an account?
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 text-sm font-medium bolt-gradient-text hover:scale-105 transition-all duration-200 group"
                  aria-label="Create a new account"
                >
                  <Zap className="h-3 w-3 group-hover:animate-pulse group-hover:rotate-12 transition-transform duration-300" />
                  <span>Create Account</span>
                  <Sparkles
                    className="h-3 w-3 group-hover:animate-spin transition-transform duration-300"
                    style={{ animationDuration: "2s" }}
                  />
                </Link>
              </div>
            </div>

            {/* Enhanced navigation link */}
            <div
              className={`mt-4 text-center transition-all duration-500 delay-900 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:bolt-gradient-text transition-all duration-200 group"
                aria-label="Go back to home page"
              >
                <ArrowRight className="h-3 w-3 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Home</span>
                <Fingerprint className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
