'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthUser } from '@/hooks/useAuthUser'
import { useUserProfile } from '@/hooks/useUserProfile'
import {
  extractLocationData,
  extractNotificationData
} from '@/lib/utils/debugPreferences'
import { stripPhoneNumber } from '@/lib/utils/phone'
import { Clock, CreditCard, User } from 'lucide-react'
import PaymentHistory, { PaymentTransaction } from './payment-history'
import PlanSelectionPanel from './plan-selection-panel'
import UserProfileEditTabs from './user-profile-edit-tabs'
import UserProfileHeader from './user-profile-header'
import UserProfileSections from './user-profile-sections'

interface UserProfileData {
  basic_info: {
    display_name: string
    email: string
    phone_number: string
    user_type_id: string | null
    bio: string
  }
  preferences: {
    city: string
    state: string
    country: string
    postalCode: string
    smsNotifs: boolean
    emailNotifs: boolean
    avatar: string
  }
  profile_picture?: string | null
}

interface UserProfileProps {
  userId: string
}

const TABS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <User className="w-6 h-6" />,
    description: 'Personal information and preferences'
  },
  {
    id: 'payments',
    label: 'Payment History',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Transaction history and billing'
  },
  {
    id: 'upgrade',
    label: 'Upgrade',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Choose a plan and upgrade your membership'
  }
]

export default function UserProfile({ userId }: UserProfileProps) {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)
  const [locationData, setLocationData] = useState<any>(null)
  const [notificationData, setNotificationData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const router = useRouter()
  const {
    data: userProfile,
    loading: profileLoading,
    error: profileError
  } = useUserProfile()
  const { data: authUser } = useAuthUser()

  useEffect(() => {
    if (userProfile) {
      // Transform the data to match our interface
      const transformedData: UserProfileData = {
        basic_info: {
          display_name: userProfile.display_name || '',
          email: userProfile.email || '',
          phone_number: userProfile.phone_number || '',
          user_type_id: userProfile.user_type_id || '',
          bio: userProfile.bio || ''
        },
        preferences: userProfile.preferences || {
          city: '',
          state: '',
          country: 'US',
          postalCode: '',
          smsNotifs: true,
          emailNotifs: true,
          avatar: ''
        },
        profile_picture: userProfile.profile_picture || null
      }
      setProfileData(transformedData)
    }
  }, [userProfile])

  useEffect(() => {
    if (profileError) {
      toast.error('Failed to load profile data')
    }
  }, [profileError])

  useEffect(() => {
    if (userProfile?.preferences) {
      const location = extractLocationData(userProfile.preferences)
      const notifications = extractNotificationData(userProfile.preferences)
      setLocationData(location)
      setNotificationData(notifications)
    }
  }, [userProfile])

  // Fetch payment history
  useEffect(() => {
    fetchPaymentHistory()
  }, [userId])

  // Listen for payment success event to refresh
  useEffect(() => {
    const handlePaymentSuccess = () => {
      // Refresh payment history after successful payment or sync
      setTimeout(() => {
        fetchPaymentHistory()
      }, 2000) // Wait a bit for webhook/sync to process
    }

    window.addEventListener('payment-success', handlePaymentSuccess)
    return () => {
      window.removeEventListener('payment-success', handlePaymentSuccess)
    }
  }, [])

  const fetchPaymentHistory = async () => {
    try {
      setPaymentLoading(true)
      setPaymentError(null)
      const response = await fetch('/api/user/payment-history')

      if (!response.ok) {
        throw new Error('Failed to fetch payment history')
      }

      const data = await response.json()

      if (data.success) {
        setTransactions(data.transactions || [])
        if (data.message) {
          console.log(data.message)
        }
      } else {
        throw new Error(data.error || 'Failed to fetch payment history')
      }
    } catch (err) {
      console.error('Error fetching payment history:', err)
      setPaymentError(
        err instanceof Error ? err.message : 'Failed to fetch payment history'
      )
      toast.error('Failed to load payment history')
    } finally {
      setPaymentLoading(false)
    }
  }

  // Extract current plan info from transactions
  const getCurrentPlanInfo = () => {
    // Find the most recent successful subscription transaction
    const subscriptionTransaction = transactions
      .filter(
        t =>
          t.paymentType === 'subscription' &&
          t.status === 'succeeded' &&
          t.plan_id
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]

    if (subscriptionTransaction) {
      return {
        planId: subscriptionTransaction.plan_id,
        stripePriceId: subscriptionTransaction.stripe_price_id,
        productName: subscriptionTransaction.productName,
        productDescription: subscriptionTransaction.productDescription
      }
    }
    return null
  }

  const createDefaultProfileData = (): UserProfileData => {
    // Use email from userProfile first, then fallback to authUser
    const email = userProfile?.email || authUser?.email || ''

    return {
      basic_info: {
        display_name: '',
        email: email,
        phone_number: '',
        user_type_id: userProfile?.user_type_id || null,
        bio: ''
      },
      preferences: {
        city: '',
        state: '',
        country: 'US',
        postalCode: '',
        smsNotifs: true,
        emailNotifs: true,
        avatar: ''
      },
      profile_picture: null
    }
  }

  const handleEditProfile = () => {
    // If no profile data exists, create default data structure
    if (!profileData) {
      const defaultData = createDefaultProfileData()
      setProfileData(defaultData)
    }
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    // If we were editing a new profile and user cancels, reset profileData to null
    if (!userProfile) {
      setProfileData(null)
    }
  }

  const handleSaveProfile = async (updatedData: any) => {
    setIsSaving(true)
    try {
      // Transform the nested data structure to match API expectations
      // Don't include user_type_id if it's an empty string (UUID fields can't be empty strings)
      // Strip phone number formatting - store only digits
      const apiData: any = {
        display_name: updatedData.basic_info?.display_name,
        phone_number: stripPhoneNumber(updatedData.basic_info?.phone_number || ''),
        bio: updatedData.basic_info?.bio,
        preferences: updatedData.preferences,
        profile_picture: updatedData.profile_picture
      }

      // Only include user_type_id if it's not empty (UUID fields can't be empty strings)
      const userTypeId = updatedData.basic_info?.user_type_id
      if (
        userTypeId &&
        userTypeId !== null &&
        typeof userTypeId === 'string' &&
        userTypeId.trim() !== ''
      ) {
        apiData.user_type_id = userTypeId
      }

      console.log('Sending profile data:', apiData)

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Profile save failed:', response.status, errorText)
        throw new Error(`Failed to save profile: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to save profile')
      }

      toast.success('Profile updated successfully!')
      setProfileData(updatedData)
      setIsEditing(false)

      // Invalidate cache to refresh data
      import('@/hooks/useUserProfile').then(
        ({ invalidateUserProfileCache }) => {
          invalidateUserProfileCache()
        }
      )

      // Navigate to new prompt screen after successful profile update
      router.push('/newprompt')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to save profile'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Loading Profile</h2>
            <p className="text-gray-600">
              Please wait while we load your profile data...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render edit mode if editing (even if profileData was just created as default)
  if (isEditing && profileData) {
    return (
      <UserProfileEditTabs
        profileData={profileData}
        locationData={locationData}
        notificationData={notificationData}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
        isLoading={isSaving}
      />
    )
  }

  // Show "no profile" message only if not editing
  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Profile Found</h2>
            <p className="text-gray-600 mb-4">
              It looks like you haven't completed your profile yet.
            </p>
            <Button onClick={handleEditProfile} className="w-full">
              Complete Your Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <UserProfileHeader
          profileData={profileData}
          onEditProfile={handleEditProfile}
          planInfo={getCurrentPlanInfo()}
        />

        <div className="flex gap-8">
          {/* Vertical Tabs */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1 p-4">
                  {TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.icon}
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs text-gray-500">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <Card className="bg-white border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="ml-2">
                      {TABS.find(tab => tab.id === activeTab)?.label}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserProfileSections
                    profileData={profileData}
                    location={locationData}
                    notifications={notificationData}
                  />
                </CardContent>
              </Card>
            )}
            {activeTab === 'payments' && (
              <PaymentHistory
                transactions={transactions}
                loading={paymentLoading}
                error={paymentError}
                onRefresh={fetchPaymentHistory}
              />
            )}
            {activeTab === 'upgrade' && (
              <Card className="bg-white border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="ml-2">
                      {TABS.find(tab => tab.id === activeTab)?.label}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PlanSelectionPanel />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
