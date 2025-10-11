/**
 * Utility functions for debugging and handling preferences data
 */

export interface LocationData {
  address?: string
  city?: string
  state?: string
  postalCode?: string
  phone?: string
  email?: string
}

export interface NotificationData {
  emailNotifs?: boolean
  smsNotifs?: boolean
  campaignUpdates?: boolean
  voterMessages?: boolean
  policyAlerts?: boolean
  eventReminders?: boolean
}

export interface PreferencesData {
  location?: LocationData
  notifications?: NotificationData
  candidate_profile?: any
  [key: string]: any
}

/**
 * Safely extract location data from preferences
 */
export function extractLocationData(preferences: any): LocationData {
  if (!preferences) {
    return {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
      email: ''
    }
  }

  // Try multiple possible structures
  const locationData =
    preferences.location || preferences.contact || preferences.address || {}

  return {
    address: locationData.address || '',
    city: locationData.city || '',
    state: locationData.state || '',
    postalCode: locationData.postalCode || '',
    phone: locationData.phone || '',
    email: locationData.email || ''
  }
}

/**
 * Safely extract notification data from preferences
 */
export function extractNotificationData(preferences: any): NotificationData {
  if (!preferences) {
    return {
      emailNotifs: true,
      smsNotifs: false,
      campaignUpdates: true,
      voterMessages: true,
      policyAlerts: true,
      eventReminders: true
    }
  }

  // Try multiple possible structures
  const notificationData =
    preferences.notifications ||
    preferences.notificationSettings ||
    preferences.communication ||
    {}

  return {
    emailNotifs: notificationData.emailNotifs ?? true,
    smsNotifs: notificationData.smsNotifs ?? false,
    campaignUpdates: notificationData.campaignUpdates ?? true,
    voterMessages: notificationData.voterMessages ?? true,
    policyAlerts: notificationData.policyAlerts ?? true,
    eventReminders: notificationData.eventReminders ?? true
  }
}

/**
 * Validate preferences data structure
 */
export function validatePreferences(preferences: any): boolean {
  if (!preferences || typeof preferences !== 'object') {
    return false
  }

  // Check if it has at least some expected structure
  const hasLocation =
    preferences.location && typeof preferences.location === 'object'
  const hasNotifications =
    preferences.notifications && typeof preferences.notifications === 'object'
  const hasCandidateProfile =
    preferences.candidate_profile &&
    typeof preferences.candidate_profile === 'object'

  return hasLocation || hasNotifications || hasCandidateProfile
}

