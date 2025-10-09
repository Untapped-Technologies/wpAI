'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Bell,
  Calendar,
  FileText,
  Mail,
  MapPin,
  Phone,
  Save,
  Target,
  User,
  X
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface CandidateProfileEditTabsProps {
  profileData: {
    basic_info: {
      fullName: string
      office: string
      district: string
      party: string
      website: string
      bio: string
      jurisdiction: string[]
    }
    key_issues: {
      issue1: string
      issue2: string
      issue3: string
    }
    policies: {
      policy1: string
      policy2: string
      policy3: string
    }
  }
  locationData?: {
    address: string
    city: string
    state: string
    zipCode: string
    phone: string
    email: string
  }
  notificationData?: {
    emailNotifications: boolean
    smsNotifications: boolean
    campaignUpdates: boolean
    voterMessages: boolean
    policyAlerts: boolean
    eventReminders: boolean
  }
  onSave: (updatedData: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const TABS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <User className="w-4 h-4" />,
    description: 'Basic candidate information'
  },
  {
    id: 'issues',
    label: 'Key Issues',
    icon: <Target className="w-4 h-4" />,
    description: 'Priority issues and policies'
  },
  {
    id: 'location',
    label: 'Location',
    icon: <MapPin className="w-4 h-4" />,
    description: 'Contact and location details'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell className="w-4 h-4" />,
    description: 'Communication preferences'
  }
]

export default function CandidateProfileEditTabs({
  profileData,
  locationData,
  notificationData,
  onSave,
  onCancel,
  isLoading = false
}: CandidateProfileEditTabsProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    basic_info: {
      fullName: profileData.basic_info.fullName || '',
      office: profileData.basic_info.office || '',
      district: profileData.basic_info.district || '',
      party: profileData.basic_info.party || '',
      website: profileData.basic_info.website || '',
      bio: profileData.basic_info.bio || '',
      jurisdiction: profileData.basic_info.jurisdiction || []
    },
    key_issues: {
      issue1: profileData.key_issues.issue1 || '',
      issue2: profileData.key_issues.issue2 || '',
      issue3: profileData.key_issues.issue3 || ''
    },
    policies: {
      policy1: profileData.policies.policy1 || '',
      policy2: profileData.policies.policy2 || '',
      policy3: profileData.policies.policy3 || ''
    },
    // Additional fields for location and notifications from preferences
    location: {
      address: locationData?.address || '',
      city: locationData?.city || '',
      state: locationData?.state || '',
      zipCode: locationData?.zipCode || '',
      phone: locationData?.phone || '',
      email: locationData?.email || ''
    },
    notifications: {
      emailNotifications: notificationData?.emailNotifications ?? true,
      smsNotifications: notificationData?.smsNotifications ?? false,
      campaignUpdates: notificationData?.campaignUpdates ?? true,
      voterMessages: notificationData?.voterMessages ?? true,
      policyAlerts: notificationData?.policyAlerts ?? true,
      eventReminders: notificationData?.eventReminders ?? true
    }
  })

  const handleInputChange = (
    section: string,
    field: string,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleJurisdictionChange = (jurisdiction: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      basic_info: {
        ...prev.basic_info,
        jurisdiction: checked
          ? [...prev.basic_info.jurisdiction, jurisdiction]
          : prev.basic_info.jurisdiction.filter(j => j !== jurisdiction)
      }
    }))
  }

  const handleSave = async () => {
    try {
      await onSave(formData)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const isFormValid = () => {
    return (
      formData.basic_info.fullName.trim() &&
      formData.basic_info.office.trim() &&
      formData.basic_info.district.trim() &&
      formData.basic_info.jurisdiction.length > 0 &&
      formData.key_issues.issue1.trim() &&
      formData.key_issues.issue2.trim() &&
      formData.key_issues.issue3.trim() &&
      formData.policies.policy1.trim() &&
      formData.policies.policy2.trim() &&
      formData.policies.policy3.trim()
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.basic_info.fullName}
                  onChange={e =>
                    handleInputChange('basic_info', 'fullName', e.target.value)
                  }
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="office">Office Sought *</Label>
                <Input
                  id="office"
                  value={formData.basic_info.office}
                  onChange={e =>
                    handleInputChange('basic_info', 'office', e.target.value)
                  }
                  placeholder="e.g., Mayor, City Council, State Representative"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="district">District/Area *</Label>
                <Input
                  id="district"
                  value={formData.basic_info.district}
                  onChange={e =>
                    handleInputChange('basic_info', 'district', e.target.value)
                  }
                  placeholder="e.g., District 5, Ward 3"
                />
              </div>
              <div>
                <Label htmlFor="party">Political Party</Label>
                <Input
                  id="party"
                  value={formData.basic_info.party}
                  onChange={e =>
                    handleInputChange('basic_info', 'party', e.target.value)
                  }
                  placeholder="e.g., Democratic, Republican, Independent"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Campaign Website</Label>
              <Input
                id="website"
                value={formData.basic_info.website}
                onChange={e =>
                  handleInputChange('basic_info', 'website', e.target.value)
                }
                placeholder="https://your-campaign-website.com"
              />
            </div>

            <div>
              <Label>Jurisdiction Level *</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {['Local', 'State', 'Federal'].map(level => (
                  <label
                    key={level}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={formData.basic_info.jurisdiction.includes(level)}
                      onCheckedChange={checked =>
                        handleJurisdictionChange(level, checked as boolean)
                      }
                    />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Brief Bio (150 words max)</Label>
              <Textarea
                id="bio"
                value={formData.basic_info.bio}
                onChange={e =>
                  handleInputChange('basic_info', 'bio', e.target.value)
                }
                placeholder="Tell voters about yourself, your background, and why you're running..."
                maxLength={150}
                rows={4}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.basic_info.bio.length}/150 characters
              </div>
            </div>
          </div>
        )

      case 'issues':
        return (
          <div className="space-y-8">
            {/* Key Issues */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Key Issues
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800">
                  Share your top 3 key issues that you'll focus on if elected.
                  Be specific and concise (2-3 sentences each).
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyIssue1">Key Issue #1 *</Label>
                  <Textarea
                    id="keyIssue1"
                    value={formData.key_issues.issue1}
                    onChange={e =>
                      handleInputChange('key_issues', 'issue1', e.target.value)
                    }
                    placeholder="e.g., Economic development and job creation in our community..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="keyIssue2">Key Issue #2 *</Label>
                  <Textarea
                    id="keyIssue2"
                    value={formData.key_issues.issue2}
                    onChange={e =>
                      handleInputChange('key_issues', 'issue2', e.target.value)
                    }
                    placeholder="e.g., Education funding and school improvements..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="keyIssue3">Key Issue #3 *</Label>
                  <Textarea
                    id="keyIssue3"
                    value={formData.key_issues.issue3}
                    onChange={e =>
                      handleInputChange('key_issues', 'issue3', e.target.value)
                    }
                    placeholder="e.g., Infrastructure and transportation improvements..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Policy Positions */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Policy Positions
              </h3>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-800">
                  Provide more detailed policy positions on 3 important topics.
                  This helps voters understand your specific plans and
                  priorities.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="policy1">Policy Position #1 *</Label>
                  <Textarea
                    id="policy1"
                    value={formData.policies.policy1}
                    onChange={e =>
                      handleInputChange('policies', 'policy1', e.target.value)
                    }
                    placeholder="e.g., Healthcare: I support expanding access to affordable healthcare by..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="policy2">Policy Position #2 *</Label>
                  <Textarea
                    id="policy2"
                    value={formData.policies.policy2}
                    onChange={e =>
                      handleInputChange('policies', 'policy2', e.target.value)
                    }
                    placeholder="e.g., Environment: My environmental plan includes..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="policy3">Policy Position #3 *</Label>
                  <Textarea
                    id="policy3"
                    value={formData.policies.policy3}
                    onChange={e =>
                      handleInputChange('policies', 'policy3', e.target.value)
                    }
                    placeholder="e.g., Public Safety: I will work to improve public safety by..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'location':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Update your contact information and location details. This
                information helps voters connect with you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.location.email}
                  onChange={e =>
                    handleInputChange('location', 'email', e.target.value)
                  }
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.location.phone}
                  onChange={e =>
                    handleInputChange('location', 'phone', e.target.value)
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.location.address}
                onChange={e =>
                  handleInputChange('location', 'address', e.target.value)
                }
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.location.city}
                  onChange={e =>
                    handleInputChange('location', 'city', e.target.value)
                  }
                  placeholder="Your City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.location.state}
                  onChange={e =>
                    handleInputChange('location', 'state', e.target.value)
                  }
                  placeholder="Your State"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.location.zipCode}
                  onChange={e =>
                    handleInputChange('location', 'zipCode', e.target.value)
                  }
                  placeholder="12345"
                />
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                Manage your notification preferences. Choose how you want to
                receive updates about your campaign and platform activity.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={formData.notifications.emailNotifications}
                  onCheckedChange={checked =>
                    handleInputChange(
                      'notifications',
                      'emailNotifications',
                      checked as boolean
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <Label className="text-base font-medium">
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive text message updates
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={formData.notifications.smsNotifications}
                  onCheckedChange={checked =>
                    handleInputChange(
                      'notifications',
                      'smsNotifications',
                      checked as boolean
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <div>
                    <Label className="text-base font-medium">
                      Campaign Updates
                    </Label>
                    <p className="text-sm text-gray-600">
                      Updates about your campaign profile
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={formData.notifications.campaignUpdates}
                  onCheckedChange={checked =>
                    handleInputChange(
                      'notifications',
                      'campaignUpdates',
                      checked as boolean
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-orange-600" />
                  <div>
                    <Label className="text-base font-medium">
                      Voter Messages
                    </Label>
                    <p className="text-sm text-gray-600">
                      Messages from potential voters
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={formData.notifications.voterMessages}
                  onCheckedChange={checked =>
                    handleInputChange(
                      'notifications',
                      'voterMessages',
                      checked as boolean
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-red-600" />
                  <div>
                    <Label className="text-base font-medium">
                      Policy Alerts
                    </Label>
                    <p className="text-sm text-gray-600">
                      Updates on policy changes and news
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={formData.notifications.policyAlerts}
                  onCheckedChange={checked =>
                    handleInputChange(
                      'notifications',
                      'policyAlerts',
                      checked as boolean
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <div>
                    <Label className="text-base font-medium">
                      Event Reminders
                    </Label>
                    <p className="text-sm text-gray-600">
                      Reminders for campaign events and deadlines
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={formData.notifications.eventReminders}
                  onCheckedChange={checked =>
                    handleInputChange(
                      'notifications',
                      'eventReminders',
                      checked as boolean
                    )
                  }
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Candidate Profile
              </h1>
              <p className="text-gray-600">
                Update your candidate information and preferences
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isFormValid() || isLoading}
                className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {TABS.find(tab => tab.id === activeTab)?.icon}
                  <span className="ml-2">
                    {TABS.find(tab => tab.id === activeTab)?.label}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">{renderTabContent()}</CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button at Bottom */}
        <div className="flex justify-end space-x-3 mt-8">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid() || isLoading}
            className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
