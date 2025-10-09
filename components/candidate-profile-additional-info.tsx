'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Bell, CheckCircle, Mail, MapPin, Phone, XCircle } from 'lucide-react'

interface CandidateProfileAdditionalInfoProps {
  location?: {
    address?: string
    city?: string
    state?: string
    postalCode?: string
    phone?: string
    email?: string
  }
  notifications?: {
    emailNotifications?: boolean
    smsNotifications?: boolean
    campaignUpdates?: boolean
    voterMessages?: boolean
    policyAlerts?: boolean
    eventReminders?: boolean
  }
}

export default function CandidateProfileAdditionalInfo({
  location,
  notifications
}: CandidateProfileAdditionalInfoProps) {
  const hasLocationData =
    location &&
    (location.address ||
      location.city ||
      location.state ||
      location.phone ||
      location.email)

  const hasNotificationData =
    notifications &&
    (notifications.emailNotifications !== undefined ||
      notifications.smsNotifications !== undefined ||
      notifications.campaignUpdates !== undefined ||
      notifications.voterMessages !== undefined ||
      notifications.policyAlerts !== undefined ||
      notifications.eventReminders !== undefined)

  if (!hasLocationData && !hasNotificationData) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Location Information */}
      {hasLocationData && (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center text-2xl">
              <MapPin className="w-6 h-6 mr-3 text-green-600" />
              Contact Information
            </CardTitle>
            <CardDescription className="text-lg">
              How voters can reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {location.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{location.email}</p>
                  </div>
                </div>
              )}

              {location.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{location.phone}</p>
                  </div>
                </div>
              )}

              {location.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <div className="font-medium">
                      <p>{location.address}</p>
                      {(location.city ||
                        location.state ||
                        location.postalCode) && (
                        <p>
                          {[location.city, location.state, location.postalCode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Preferences */}
      {hasNotificationData && (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center text-2xl">
              <Bell className="w-6 h-6 mr-3 text-purple-600" />
              Notification Preferences
            </CardTitle>
            <CardDescription className="text-lg">
              Your communication preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notifications.emailNotifications !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">
                    Email Notifications
                  </span>
                  {notifications.emailNotifications ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}

              {notifications.smsNotifications !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">SMS Notifications</span>
                  {notifications.smsNotifications ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}

              {notifications.campaignUpdates !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Campaign Updates</span>
                  {notifications.campaignUpdates ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}

              {notifications.voterMessages !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Voter Messages</span>
                  {notifications.voterMessages ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}

              {notifications.policyAlerts !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Policy Alerts</span>
                  {notifications.policyAlerts ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}

              {notifications.eventReminders !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Event Reminders</span>
                  {notifications.eventReminders ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
