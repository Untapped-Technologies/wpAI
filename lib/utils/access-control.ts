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

    // Get user's current subscription and access level
    const { data: accessData, error: accessError } = await supabase
      .from('user_access_levels')
      .select(
        `
        access_level,
        features,
        limits,
        user_subscriptions!inner(
          status,
          current_period_end,
          plan_id,
          trial_end,
          stripe_subscription_id
        )
      `
      )
      .eq('user_id', userId)
      .single()

    if (accessError || !accessData) {
      // If no access level found, check if user has any subscription
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select(
          'status, current_period_end, plan_id, trial_end, stripe_subscription_id'
        )
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (subscriptionData) {
        // If trial expired and no paid subscription, treat as free
        const trialEnd = subscriptionData as any
        const expiredTrial = trialEnd?.trial_end
          ? Date.now() > new Date(trialEnd.trial_end).getTime()
          : false
        const hasPaid = !!(trialEnd as any)?.stripe_subscription_id
        return {
          level: expiredTrial && !hasPaid ? 'free' : 'basic',
          features: {},
          limits: {},
          subscription: subscriptionData
        }
      }

      return null
    }

    // Evaluate trial expiry for joined subscription
    const sub: any = accessData.user_subscriptions
    let effectiveLevel = accessData.access_level as AccessLevel
    if (sub) {
      const expiredTrial = sub.trial_end
        ? Date.now() > new Date(sub.trial_end).getTime()
        : false
      const hasPaid = !!sub.stripe_subscription_id
      if (expiredTrial && !hasPaid) {
        effectiveLevel = 'free'
      }
    }

    return {
      level: effectiveLevel,
      features: accessData.features || {},
      limits: accessData.limits || {},
      subscription: accessData.user_subscriptions
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
