'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, X } from 'lucide-react'
import { useState } from 'react'

interface UserProfileEditTabsProps {
  profileData: {
    basic_info: {
      display_name: string
      email: string
      user_type_id: string
      bio: string
    }
    preferences: {
      city: string
      state: string
      country: string
      postalCode: string
      timezone: string
      smsNotifs: boolean
      emailNotifs: boolean
      avatar: string
    }
  }
  locationData?: any
  notificationData?: any
  onSave: (updatedData: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function UserProfileEditTabs({
  profileData,
  locationData,
  notificationData,
  onSave,
  onCancel,
  isLoading = false
}: UserProfileEditTabsProps) {
  const [formData, setFormData] = useState({
    basic_info: {
      display_name: profileData.basic_info.display_name,
      email: profileData.basic_info.email,
      user_type_id: profileData.basic_info.user_type_id,
      bio: profileData.basic_info.bio
    },
    preferences: {
      city: profileData.preferences.city,
      state: profileData.preferences.state,
      country: profileData.preferences.country,
      postalCode: profileData.preferences.postalCode,
      timezone: profileData.preferences.timezone,
      smsNotifs: profileData.preferences.smsNotifs,
      emailNotifs: profileData.preferences.emailNotifs,
      avatar: profileData.preferences.avatar
    }
  })

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    await onSave(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg">
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.basic_info.email}
                    onChange={e =>
                      handleInputChange('basic_info', 'email', e.target.value)
                    }
                    placeholder="Enter your email"
                  />
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
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={formData.preferences.timezone}
                    onChange={e =>
                      handleInputChange(
                        'preferences',
                        'timezone',
                        e.target.value
                      )
                    }
                    placeholder="Enter your timezone"
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smsNotifs"
                    checked={formData.preferences.smsNotifs}
                    onCheckedChange={checked =>
                      handleInputChange('preferences', 'smsNotifs', checked)
                    }
                  />
                  <Label htmlFor="smsNotifs">SMS Notifications</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
