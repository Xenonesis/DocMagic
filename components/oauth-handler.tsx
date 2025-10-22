"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function OAuthHandler() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check for OAuth session (implicit flow - token in hash, or PKCE - code in query)
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Check if we just came from OAuth (has hash or code in URL)
        const hasHash = window.location.hash.includes('access_token');
        const hasCode = window.location.search.includes('code=');
        
        if ((hasHash || hasCode) && session) {
          console.log('✅ OAuth successful! User:', session.user?.email);
          toast({
            title: "Welcome! ✨",
            description: `Successfully signed in as ${session.user?.email}`,
          });
          
          // Clean up URL
          window.history.replaceState({}, '', '/');
          
          // Refresh to update UI
          router.refresh();
        } else if (hasCode && !session) {
          // PKCE flow - code in URL but no session yet
          console.log('🔄 OAuth code detected, waiting for session...');
          
          // Wait a bit for Supabase to process
          setTimeout(async () => {
            const { data: { session: newSession } } = await supabase.auth.getSession();
            if (newSession) {
              console.log('✅ Session established:', newSession.user?.email);
              toast({
                title: "Welcome! ✨",
                description: `Successfully signed in as ${newSession.user?.email}`,
              });
              window.history.replaceState({}, '', '/');
              router.refresh();
            } else {
              console.error('❌ No session after OAuth');
              toast({
                title: "Sign In Failed",
                description: "Failed to complete Google sign in. Please try again.",
                variant: "destructive",
              });
              window.history.replaceState({}, '', '/auth/signin');
              router.push('/auth/signin');
            }
          }, 1000);
        }
      } catch (error: any) {
        console.error('❌ Error checking OAuth session:', error);
      }
    };
    
    handleOAuthCallback();
  }, [router, supabase.auth, toast]);

  return null; // This component doesn't render anything
}
