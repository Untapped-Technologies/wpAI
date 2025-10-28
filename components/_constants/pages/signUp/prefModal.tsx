'use client'
import {
  Preferences,
  UserTypes
} from '@/components/_constants/pages/signUp/signupTypes'

import { Button } from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react'
import { toast } from 'sonner'

export function LocationConfirmModal({
  preferences,
  onConfirm,
  onRetry,
  userTypes,
  userType,
  setUserType
  // onEdit,
}: {
  userTypes: UserTypes[]
  preferences: Preferences
  userType: string
  setUserType: (val: string) => void
  onConfirm: (prefs: Preferences, userType: string) => void
  onRetry: (prefs: Preferences, userType: string) => void
  // onEdit: (prefs: Preferences) => void
}) {
  const [localPrefs, setLocalPrefs] = useState(preferences)
  const [open, setOpen] = useState(false)

  const handleChange = (key: string, value: string) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }))
  }

  const handleSelectChange = (val: string) => {
    setUserType(val)
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
        setLocalPrefs({
          ...localPrefs,
          city: city || localPrefs.city,
          state: state || localPrefs.state,
          country: country || localPrefs.country
        })

        toast.success('Location information auto-filled!')
      }
    } catch (error) {
      console.error('Failed to lookup postal code:', error)
      // Don't show error toast to avoid annoying the user
    }
  }

  return (
    <Dialog
      open={true}
      onOpenChange={open => setOpen(open)}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-600">Confirm Your Data</DialogTitle>
          <DialogDescription>
            <div className="space-y-2 mb-4">
              <label className="block mb-1 text-sm font-medium">
                Account Type
              </label>
              <select
                value={userType}
                required
                name="user_type_id"
                onChange={e => handleSelectChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              >
                <option value="" disabled>
                  Select user type
                </option>
                {userTypes.map(type => (
                  <option key={type.id} value={type.id || ''}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 mt-4">
              {['city', 'state', 'country'].map(field => (
                <div key={field}>
                  <label className="block font-medium capitalize text-gray-800">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={
                      (localPrefs[field as keyof Preferences] || '') as string
                    }
                    onChange={e => handleChange(field, e.target.value)}
                    className="w-full bg-white border px-2 py-1 rounded border-gray-300 text-gray-600"
                  />
                </div>
              ))}
              <div>
                <label className="block font-medium capitalize text-gray-800">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={(localPrefs.postalCode || '') as string}
                  onChange={e => {
                    handleChange('postalCode', e.target.value)
                    // Auto-populate location data when postal code changes
                    handlePostalCodeLookup(e.target.value)
                  }}
                  className="w-full bg-white border px-2 py-1 rounded border-gray-300 text-gray-600"
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-center">
          <Button
            size="sm"
            className="border rounded-md border-gray-600 hover:bg-gray-800 hover:text-white"
            onClick={() => onRetry(localPrefs, userType)}
          >
            Retry
          </Button>
          {/* <Button
            size="sm"
            className="border rounded-md border-gray-600 bg-red hover:bg-gray-800 hover:text-white"
            onClick={() => onEdit(localPrefs)}
          >
            Save Manually
          </Button> */}
          <Button
            size="sm"
            className="border rounded-md border-gray-600 bg-red hover:bg-gray-800 hover:text-white"
            onClick={() => onConfirm(localPrefs, userType)}
          >
            Confirm & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
