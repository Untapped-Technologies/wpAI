'use client'

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

interface LocationPreferences {
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  email: string | null
}

export function LocationConfirmModal({
  preferences,
  onConfirm,
  // onEdit,
  onRetry
}: {
  preferences: LocationPreferences
  onConfirm: (prefs: LocationPreferences) => void
  onRetry: (prefs: LocationPreferences) => void
  // onEdit: (prefs: LocationPreferences) => void
}) {
  const [localPrefs, setLocalPrefs] = useState(preferences)
  const [open, setOpen] = useState(false)

  const handleChange = (key: string, value: string) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }))
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
          <DialogTitle className="text-gray-600">
            Confirm Your Location
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-2 mt-4">
              {['city', 'state', 'postalCode', 'country'].map(field => (
                <div key={field}>
                  <label className="block font-medium capitalize text-gray-800">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={
                      (localPrefs[field as keyof LocationPreferences] ||
                        '') as string
                    }
                    onChange={e => handleChange(field, e.target.value)}
                    className="w-full bg-white border px-2 py-1 rounded border-gray-300 text-gray-600"
                  />
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-center">
          <Button
            size="sm"
            className="border rounded-md border-gray-600 hover:bg-gray-800 hover:text-white"
            onClick={() => onRetry(localPrefs)}
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
            onClick={() => onConfirm(localPrefs)}
          >
            Confirm & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
