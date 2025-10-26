/**
 * Subscription utilities for checking user subscription status and limits
 */

import { createRoute } from './supabase';

export const SUBSCRIPTION_LIMITS = {
  FREE: {
    MAX_SLIDES: 5,
    MAX_DOCUMENTS: 10,
  },
  PREMIUM: {
    MAX_SLIDES: 30,
    MAX_DOCUMENTS: -1, // unlimited
  },
} as const;

export interface SubscriptionStatus {
  isPremium: boolean;
  maxSlides: number;
  maxDocuments: number;
  status?: string;
  currentPeriodEnd?: string;
}

/**
 * Check if a user has an active premium subscription
 */
export async function checkUserSubscription(userId: string): Promise<SubscriptionStatus> {
  try {
    const supabase = createRoute();

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error || !subscription) {
      // No active subscription - return free tier limits
      return {
        isPremium: false,
        maxSlides: SUBSCRIPTION_LIMITS.FREE.MAX_SLIDES,
        maxDocuments: SUBSCRIPTION_LIMITS.FREE.MAX_DOCUMENTS,
      };
    }

    // Check if subscription is still valid
    const currentPeriodEnd = new Date(subscription.stripe_current_period_end);
    const isValid = currentPeriodEnd > new Date();

    if (!isValid) {
      return {
        isPremium: false,
        maxSlides: SUBSCRIPTION_LIMITS.FREE.MAX_SLIDES,
        maxDocuments: SUBSCRIPTION_LIMITS.FREE.MAX_DOCUMENTS,
      };
    }

    // Active premium subscription
    return {
      isPremium: true,
      maxSlides: SUBSCRIPTION_LIMITS.PREMIUM.MAX_SLIDES,
      maxDocuments: SUBSCRIPTION_LIMITS.PREMIUM.MAX_DOCUMENTS,
      status: subscription.status,
      currentPeriodEnd: subscription.stripe_current_period_end,
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    // On error, default to free tier
    return {
      isPremium: false,
      maxSlides: SUBSCRIPTION_LIMITS.FREE.MAX_SLIDES,
      maxDocuments: SUBSCRIPTION_LIMITS.FREE.MAX_DOCUMENTS,
    };
  }
}

/**
 * Get the maximum allowed slides for a user
 */
export async function getMaxSlidesForUser(userId?: string): Promise<number> {
  if (!userId) {
    return SUBSCRIPTION_LIMITS.FREE.MAX_SLIDES;
  }

  const subscription = await checkUserSubscription(userId);
  return subscription.maxSlides;
}

/**
 * Validate if requested slide count is within user's limits
 */
export async function validateSlideCount(
  requestedSlides: number,
  userId?: string,
): Promise<{ valid: boolean; maxAllowed: number; isPremium: boolean }> {
  const maxSlides = await getMaxSlidesForUser(userId);
  const isPremium = userId ? (await checkUserSubscription(userId)).isPremium : false;

  return {
    valid: requestedSlides <= maxSlides,
    maxAllowed: maxSlides,
    isPremium,
  };
}
