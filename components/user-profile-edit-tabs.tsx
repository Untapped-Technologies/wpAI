'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatPhoneNumberAsTyping, stripPhoneNumber } from '@/lib/utils/phone'
import { Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ImageUpload from './image-upload'

interface UserProfileEditTabsProps {
  profileData: {
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
  locationData?: any
  notificationData?: any
  onSave: (updatedData: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

interface UserType {
  id: string
  label: string | null
  description: string | null
  country_code?: string | null
}

export default function UserProfileEditTabs({
  profileData,
  locationData,
  notificationData,
  onSave,
  onCancel,
  isLoading = false
}: UserProfileEditTabsProps) {
  const [userTypes, setUserTypes] = useState<UserType[]>([])
  const [loadingUserTypes, setLoadingUserTypes] = useState(true)

  // Store phone number as digits only in formData, but display formatted version
  const [phoneDisplayValue, setPhoneDisplayValue] = useState(() => {
    const phone = profileData.basic_info.phone_number || ''
    return formatPhoneNumberAsTyping(phone)
  })

  const [formData, setFormData] = useState({
    basic_info: {
      display_name: profileData.basic_info.display_name,
      email: profileData.basic_info.email,
      phone_number: stripPhoneNumber(profileData.basic_info.phone_number || ''),
      user_type_id: profileData.basic_info.user_type_id || '',
      bio: profileData.basic_info.bio
    },
    preferences: {
      city: profileData.preferences.city,
      state: profileData.preferences.state,
      country: profileData.preferences.country,
      postalCode: profileData.preferences.postalCode,
      smsNotifs: profileData.preferences.smsNotifs,
      emailNotifs: profileData.preferences.emailNotifs,
      avatar: profileData.preferences.avatar
    },
    profile_picture: profileData.profile_picture
  })

  // Fetch user types from API filtered by country code
  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        setLoadingUserTypes(true)
        // Get country code from user's preferences, default to 'US' if not set
        const countryCode = formData.preferences.country || 'US'
        const url = `/api/usertypes?country_code=${encodeURIComponent(countryCode)}`

        console.log('Fetching user types with country:', countryCode)
        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          console.log('User types fetched:', data)
          setUserTypes(data || [])
        } else {
          const errorText = await response.text()
          console.error(
            'Failed to fetch user types:',
            response.status,
            errorText
          )
        }
      } catch (error) {
        console.error('Error fetching user types:', error)
      } finally {
        setLoadingUserTypes(false)
      }
    }

    fetchUserTypes()
  }, [formData.preferences.country])

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section as keyof typeof prev]
      return {
        ...prev,
        [section]: {
          ...(typeof sectionData === 'object' && sectionData !== null
            ? sectionData
            : {}),
          [field]: value
        }
      }
    })
  }

  const handleImageChange = (url: string | null) => {
    setFormData(prev => ({
      ...prev,
      profile_picture: url
    }))
  }

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      profile_picture: null
    }))
  }

  const handlePostalCodeLookup = async (postalCode: string) => {
    if (!postalCode || postalCode.length < 5) {
      return // Don't look up if postal code is too short (need at least 5 digits)
    }

    try {
      const response = await fetch(
        `/api/location/postal-code?code=${postalCode}`
      )

      // Check if response is OK before parsing
      if (!response.ok) {
        if (response.status === 404) {
          // Postal code not found - silently ignore, user can fill manually
          console.log('Postal code not found in database')
        }
        return
      }

      const result = await response.json()

      if (result.success && result.data) {
        const { city, state, country } = result.data

        // Auto-populate the location fields
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            city: city || prev.preferences.city,
            state: state || prev.preferences.state,
            country: country || prev.preferences.country
          }
        }))

        toast.success('Location information auto-filled!')
      }
    } catch (error) {
      console.error('Failed to lookup postal code:', error)
      // Don't show error toast to avoid annoying the user
    }
  }

  const handlePhoneNumberChange = (value: string) => {
    // Format the display value as user types
    const formatted = formatPhoneNumberAsTyping(value)
    setPhoneDisplayValue(formatted)

    // Store only digits in formData
    const digitsOnly = stripPhoneNumber(value)
    handleInputChange('basic_info', 'phone_number', digitsOnly)
  }

  const handleSave = async () => {
    // Ensure phone_number is stored as digits only before saving
    const dataToSave = {
      ...formData,
      basic_info: {
        ...formData.basic_info,
        phone_number: stripPhoneNumber(formData.basic_info.phone_number)
      }
    }
    await onSave(dataToSave)
  }

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={onCancel}
                  variant="outline"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Profile Picture Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Picture
              </h3>
              <ImageUpload
                currentImage={formData.profile_picture}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                isLoading={isLoading}
              />
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={formData.basic_info.display_name}
                    onChange={e =>
                      handleInputChange(
                        'basic_info',
                        'display_name',
                        e.target.value
                      )
                    }
                    placeholder="Enter your display name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    value={phoneDisplayValue}
                    onChange={e => handlePhoneNumberChange(e.target.value)}
                    placeholder="(555) 123-4567"
                    maxLength={14}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.basic_info.email}
                    disabled
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                    placeholder="Email address"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email address cannot be changed after registration
                  </p>
                </div>
                <div>
                  <Label htmlFor="user_type_id">User Type</Label>
                  {loadingUserTypes ? (
                    <div className="h-10 w-full rounded-md border border-input bg-gray-50 flex items-center px-3 text-sm text-gray-500">
                      Loading user types...
                    </div>
                  ) : (
                    <Select
                      value={
                        formData.basic_info.user_type_id
                          ? formData.basic_info.user_type_id
                          : '__none__'
                      }
                      onValueChange={value =>
                        handleInputChange(
                          'basic_info',
                          'user_type_id',
                          value === '__none__' ? null : value
                        )
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger id="user_type_id">
                        <SelectValue placeholder="Select a user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {userTypes.length > 0 ? (
                          userTypes.map(userType => (
                            <SelectItem key={userType.id} value={userType.id}>
                              {userType.label || 'Unnamed Type'}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="__empty__" disabled>
                            No user types available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {!loadingUserTypes && userTypes.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      No user types found for your country. Please check your
                      location settings.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.basic_info.bio}
                  onChange={e =>
                    handleInputChange('basic_info', 'bio', e.target.value)
                  }
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </div>

            {/* Location Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.preferences.city}
                    onChange={e =>
                      handleInputChange('preferences', 'city', e.target.value)
                    }
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.preferences.state}
                    onChange={e =>
                      handleInputChange('preferences', 'state', e.target.value)
                    }
                    placeholder="Enter your state"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.preferences.country}
                    onChange={e =>
                      handleInputChange(
                        'preferences',
                        'country',
                        e.target.value
                      )
                    }
                    placeholder="Enter your country"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.preferences.postalCode}
                    onChange={e => {
                      const value = e.target.value
                      handleInputChange('preferences', 'postalCode', value)
                      // Auto-populate location data when postal code changes
                      handlePostalCodeLookup(value)
                    }}
                    placeholder="Enter your postal code"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailNotifs"
                    checked={formData.preferences.emailNotifs}
                    onCheckedChange={checked =>
                      handleInputChange('preferences', 'emailNotifs', checked)
                    }
                  />
                  <Label htmlFor="emailNotifs">Email Notifications</Label>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smsNotifs"
                    checked={formData.preferences.smsNotifs}
                    onCheckedChange={checked =>
                      handleInputChange('preferences', 'smsNotifs', checked)
                    }
                  />
                  <Label htmlFor="smsNotifs">SMS Notifications</Label>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
