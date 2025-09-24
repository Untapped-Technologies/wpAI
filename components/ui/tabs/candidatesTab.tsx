'use client'
import { createClient } from '@/lib/supabase/client'
import { savePoliticianProfile } from '@/lib/utils/createOrUpdateUserProfile'
import { useState } from 'react'
import { toast } from 'sonner'
import CoreCandidate from '../_custom/stepper/candidate/core'
import General from '../_custom/stepper/candidate/general'
import Stepper from '../stepper'

type PrefType = {
  city: string
  state: string
  country: string
  postalCode: string
  timezone: string
  smsNotifs: boolean
  emailNotifs: boolean
}

type UserType = {
  id: string
  setOpen: (val: boolean) => void
  setPrefs: (val: PrefType) => void
  prefs: PrefType
  userType: string
}

export default function CandidatesTab({
  id,
  prefs,
  setOpen,
  setPrefs,
  userType
}: UserType) {
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [formValues, setFormValues] = useState({
    affiliation: '',
    bio: '',
    district: '',
    fullname: '',
    jurisdiction: [],
    office: '',
    photo: '',
    socialMedia: {},
    user_type: 'Citizen',
    website: ''
  })

  interface ChangeEvent {
    preventDefault: () => void
    target: {
      name: string
      value: string
    }
  }

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = evt.target

    const checked =
      evt.target instanceof HTMLInputElement && type === 'checkbox'
        ? evt.target.checked
        : undefined

    setFormValues(prev => ({
      ...prev,
      [name]: checked !== undefined ? checked : value
    }))
  }

  const handleSave = async () => {
    setOpen(true)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', id)
      .single()

    if (error || !profile) return console.error('Profile not found', error)

    const result = await savePoliticianProfile(supabase, profile.id, formValues)

    if (result.success) {
      toast('Data Updated')
    } else {
      toast('Error: Please check data.')
    }
    setOpen(false)
  }

  const columns = [
    {
      id: 1,
      title: 'General',
      status: 'active',
      content: <General formValues={formValues} handleChange={handleChange} />
    },
    {
      id: 2,
      title: 'Core',
      status: 'pending',
      content: (
        <CoreCandidate formValues={formValues} handleChange={handleChange} />
      )
    },
    {
      id: 3,
      title: 'Policies',
      status: 'pending',
      content: <div>Policies</div>
    },
    {
      id: 4,
      title: 'Responsibility',
      status: 'pending',
      content: <div>Responsibilities</div>
    },
    {
      id: 5,
      title: 'Approval',
      status: 'pending',
      content: <div>Confirm & Approve</div>
    }
  ]

  return (
    <div className="space-y-4">
      <Stepper
        data={columns}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        handleSave={handleSave}
      />
    </div>
  )
}
