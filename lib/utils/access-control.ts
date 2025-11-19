import { createClient } from '@/lib/supabase/server'

export type AccessLevel = 'free' | 'basic' | 'premium' | 'enterprise'

export type UserAccess = {
  level: AccessLevel
  features: Record<string, any>
  limits: Record<string, any>
  subscription: {
    status: string
    current_period_end: string
    plan_id: string
  } | null
}

export async function getUserAccess(
  userId: string
): Promise<UserAccess | null> {
  try {
    const supabase = await createClient()

    // First, check if user has a subscription (don't filter by status - check all)
    const { data: subscriptionData } = await supabase
      .from('user_subscriptions')
      .select(
        'status, current_period_end, plan_id, trial_end, stripe_subscription_id'
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .maybeSingle()

    // Get plan details to determine access level
    let planData = null
    if (subscriptionData?.plan_id) {
      const { data } = await supabase
        .from('plans')
        .select('id, price_cents, features, limits')
        .eq('id', subscriptionData.plan_id)
        .maybeSingle()
      planData = data
    }

    // Check if user has an access level record
    const { data: accessData } = await supabase
      .from('user_access_levels')
      .select('access_level, features, limits')
      .eq('user_id', userId)
      .maybeSingle()

    // Determine access level
    let accessLevel: AccessLevel = 'free'
    
    // If we have plan data, use it to determine access level
    if (planData) {
      if (planData.price_cents === 0) {
        accessLevel = 'free'
      } else if (planData.price_cents < 2000) {
        accessLevel = 'basic'
      } else if (planData.price_cents < 5000) {
        accessLevel = 'premium'
      } else {
        accessLevel = 'enterprise'
      }
    } else if (accessData) {
      // Use access level from database if plan not found
      accessLevel = accessData.access_level as AccessLevel
    } else if (subscriptionData) {
      // If plan not found and no access level, check if it's a paid subscription
      const hasPaid = !!subscriptionData.stripe_subscription_id
      const expiredTrial = subscriptionData.trial_end
        ? Date.now() > new Date(subscriptionData.trial_end).getTime()
        : false
      accessLevel = expiredTrial && !hasPaid ? 'free' : 'basic'
    }

    // Evaluate trial expiry
    if (subscriptionData) {
      const expiredTrial = subscriptionData.trial_end
        ? Date.now() > new Date(subscriptionData.trial_end).getTime()
        : false
      const hasPaid = !!subscriptionData.stripe_subscription_id
      if (expiredTrial && !hasPaid) {
        accessLevel = 'free'
      }
    }

    return {
      level: accessLevel,
      features: planData?.features || accessData?.features || {},
      limits: planData?.limits || accessData?.limits || {},
      subscription: subscriptionData
    }
  } catch (error) {
    console.error('Error getting user access:', error)
    return null
  }
}

export async function checkFeatureAccess(
  userId: string,
  feature: string
): Promise<boolean> {
  const userAccess = await getUserAccess(userId)

  if (!userAccess) {
    return false
  }

  // Check if feature is enabled
  const featureEnabled = userAccess.features[feature]

  if (featureEnabled === false) {
    return false
  }

  // Check limits if applicable
  const limit = userAccess.limits[feature]
  if (limit !== undefined && limit !== -1) {
    // You would implement usage tracking here
    // For now, we'll assume they have access if the feature is enabled
    return true
  }

  return featureEnabled === true || featureEnabled === -1
}

export async function checkUsageLimit(
  userId: string,
  limitType: string,
  currentUsage: number
): Promise<boolean> {
  const userAccess = await getUserAccess(userId)

  if (!userAccess) {
    return false
  }

  const limit = userAccess.limits[limitType]

  if (limit === -1) {
    return true // Unlimited
  }

  return currentUsage < limit
}

export async function requireAccessLevel(
  userId: string,
  requiredLevel: AccessLevel
): Promise<boolean> {
  const userAccess = await getUserAccess(userId)

  if (!userAccess) {
    return false
  }

  const levelHierarchy: Record<AccessLevel, number> = {
    free: 0,
    basic: 1,
    premium: 2,
    enterprise: 3
  }

  return levelHierarchy[userAccess.level] >= levelHierarchy[requiredLevel]
}

export async function getSubscriptionStatus(userId: string): Promise<{
  isActive: boolean
  isExpired: boolean
  daysUntilExpiry: number | null
  planName: string | null
}> {
  const userAccess = await getUserAccess(userId)

  if (!userAccess || !userAccess.subscription) {
    return {
      isActive: false,
      isExpired: true,
      daysUntilExpiry: null,
      planName: null
    }
  }

  const { status, current_period_end, plan_id } = userAccess.subscription
  const expiryDate = new Date(current_period_end)
  const now = new Date()
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    isActive: status === 'active',
    isExpired: expiryDate < now,
    daysUntilExpiry: daysUntilExpiry > 0 ? daysUntilExpiry : 0,
    planName: plan_id
  }
}
