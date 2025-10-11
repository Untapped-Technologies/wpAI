'use client'
import { UserType } from '@/components/_constants/pageData/pageTypes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import CoreCandidate from '../_custom/stepper/candidate/core'
import General from '../_custom/stepper/candidate/general'
import PolicyCandidate from '../_custom/stepper/candidate/policies'
import ResponseCandidate from '../_custom/stepper/candidate/responsibility'
import Stepper from '../stepper'

export default function CandidatesTab({
  id,
  prefs,
  setOpen,
  setPrefs,
  userType,
  showSaveToast
}: UserType) {
  const [currentStep, setCurrentStep] = useState(0)

  // Load existing candidate profile data on component mount
  useEffect(() => {
    const loadCandidateProfile = async () => {
      try {
        const response = await fetch('/api/candidate/profile')

        if (!response.ok) {
          return
        }

        const result = await response.json()

        if (!result.success) {
          return
        }

        // Get candidate data from either candidate_profile column or preferences
        const existingData = result.data.candidateProfile

        if (!existingData) {
          return
        }

        // Update form values with existing data
        setFormValues(prev => ({
          ...prev,
          // General section
          affiliation: existingData.general?.affiliation || '',
          bio: existingData.general?.bio || '',
          district: existingData.general?.district || '',
          fullname: existingData.general?.fullname || '',
          jurisdiction: existingData.general?.jurisdiction || [],
          office: existingData.general?.office || '',
          photo: existingData.general?.photo || '',
          socialMedia: existingData.general?.socialMedia || {},
          website: existingData.general?.website || '',

          // Core section
          core_1: existingData.core?.core_1 || '',
          core_2: existingData.core?.core_2 || '',
          core_3: existingData.core?.core_3 || '',
          core_4: existingData.core?.core_4 || '',
          core_5: existingData.core?.core_5 || '',
          core_6: existingData.core?.core_6 || '',
          core_7: existingData.core?.core_7 || '',
          core_8: existingData.core?.core_8 || '',
          core_9: existingData.core?.core_9 || '',
          core_10: existingData.core?.core_10 || '',

          // Policies section
          policy_1: existingData.policies?.policy_1 || '',
          policy_2: existingData.policies?.policy_2 || '',
          policy_3: existingData.policies?.policy_3 || '',
          policy_4: existingData.policies?.policy_4 || '',
          policy_5: existingData.policies?.policy_5 || '',
          policy_6: existingData.policies?.policy_6 || '',
          policy_7: existingData.policies?.policy_7 || '',
          policy_8: existingData.policies?.policy_8 || '',
          policy_9: existingData.policies?.policy_9 || '',
          policy_10: existingData.policies?.policy_10 || '',

          // Responsibility section
          response_1: existingData.responsibility?.response_1 || '',
          response_2: existingData.responsibility?.response_2 || '',
          response_3: existingData.responsibility?.response_3 || '',
          response_4: existingData.responsibility?.response_4 || '',
          response_5: existingData.responsibility?.response_5 || ''
        }))
      } catch (error) {
        console.error('Error loading candidate profile:', error)
      }
    }

    loadCandidateProfile()
  }, [id])
  const [formValues, setFormValues] = useState({
    // General section
    affiliation: '',
    bio: '',
    district: '',
    fullname: '',
    jurisdiction: [] as string[],
    office: '',
    photo: '',
    socialMedia: {},
    user_type: 'Citizen',
    website: '',
    core_1: '',
    core_2: '',
    core_3: '',
    core_4: '',
    core_5: '',
    core_6: '',
    core_7: '',
    core_8: '',
    core_9: '',
    core_10: '',
    policy_1: '',
    policy_2: '',
    policy_3: '',
    policy_4: '',
    policy_5: '',
    policy_6: '',
    policy_7: '',
    policy_8: '',
    policy_9: '',
    policy_10: '',
    response_1: '',
    response_2: '',
    response_3: '',
    response_4: '',
    response_5: ''
  })

  interface ChangeEvent {
    preventDefault: () => void
    target: {
      name: string
      value: string
    }
  }

  const handleRTChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evt.target
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = evt.target

    if (evt.target instanceof HTMLInputElement && type === 'checkbox') {
      const checked = evt.target.checked

      if (name === 'jurisdiction') {
        // Handle jurisdiction array for checkboxes
        setFormValues(prev => ({
          ...prev,
          jurisdiction: checked
            ? [...prev.jurisdiction, value] // Add to array
            : prev.jurisdiction.filter(item => item !== value) // Remove from array
        }))
      } else {
        // Handle other checkbox fields
        setFormValues(prev => ({
          ...prev,
          [name]: checked
        }))
      }
    } else {
      // Handle text inputs
      setFormValues(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const patchCandidateData = async (stepNumber: number) => {
    try {
      // Get current candidate profile data using API
      const response = await fetch('/api/candidate/profile')

      if (!response.ok) {
        return { success: false, error: 'Failed to fetch current profile' }
      }

      const result = await response.json()

      if (!result.success) {
        return { success: false, error: 'Failed to get current profile' }
      }

      // Start with existing data or empty structure
      const existingData = result.data.candidateProfile || {
        general: {},
        core: {},
        policies: {},
        responsibility: {},
        metadata: {}
      }

      // Update the specific section based on current step
      let updatedData = { ...existingData }

      switch (stepNumber) {
        case 0: // General section
          updatedData.general = {
            affiliation: formValues.affiliation,
            bio: formValues.bio,
            district: formValues.district,
            fullname: formValues.fullname,
            jurisdiction: formValues.jurisdiction,
            office: formValues.office,
            photo: formValues.photo,
            socialMedia: formValues.socialMedia,
            website: formValues.website
          }
          break
        case 1: // Core section
          updatedData.core = {
            core_1: formValues.core_1,
            core_2: formValues.core_2,
            core_3: formValues.core_3,
            core_4: formValues.core_4,
            core_5: formValues.core_5,
            core_6: formValues.core_6,
            core_7: formValues.core_7,
            core_8: formValues.core_8,
            core_9: formValues.core_9,
            core_10: formValues.core_10
          }
          break
        case 2: // Policies section
          updatedData.policies = {
            policy_1: formValues.policy_1,
            policy_2: formValues.policy_2,
            policy_3: formValues.policy_3,
            policy_4: formValues.policy_4,
            policy_5: formValues.policy_5,
            policy_6: formValues.policy_6,
            policy_7: formValues.policy_7,
            policy_8: formValues.policy_8,
            policy_9: formValues.policy_9,
            policy_10: formValues.policy_10
          }
          break
        case 3: // Responsibility section
          updatedData.responsibility = {
            response_1: formValues.response_1,
            response_2: formValues.response_2,
            response_3: formValues.response_3,
            response_4: formValues.response_4,
            response_5: formValues.response_5
          }
          break
      }

      // Update metadata
      updatedData.metadata = {
        ...updatedData.metadata,
        lastUpdated: new Date().toISOString(),
        userType: formValues.user_type,
        lastStepCompleted: stepNumber
      }

      // Save using API
      const saveResponse = await fetch('/api/candidate/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ candidateData: updatedData })
      })

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text()
        return { success: false, error: errorText }
      }

      const saveResult = await saveResponse.json()
      return saveResult
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const handleSave = async (stepNumber: number) => {
    setOpen(true)

    const result = await patchCandidateData(stepNumber)

    if (result.success) {
      toast(`Step ${stepNumber + 1} data saved successfully`)
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
        <CoreCandidate formValues={formValues} handleChange={handleRTChange} />
      )
    },
    {
      id: 3,
      title: 'Policies',
      status: 'pending',
      content: (
        <PolicyCandidate
          formValues={formValues}
          handleChange={handleRTChange}
        />
      )
    },
    {
      id: 4,
      title: 'Responsibility',
      status: 'pending',
      content: (
        <ResponseCandidate
          formValues={formValues}
          handleChange={handleRTChange}
        />
      )
    },
    {
      id: 5,
      title: 'Approval',
      status: 'pending',
      content: <div>Confirm & Approve</div>
    }
  ]

  return (
    <div className="space-y-4 pb-10 border-gray-300">
      <Stepper
        data={columns}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        handleSave={handleSave}
      />
    </div>
  )
}
