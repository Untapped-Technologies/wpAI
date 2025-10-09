'use client'

import { createClient } from '@/lib/supabase/client'
import { saveCandidateProfile } from '@/lib/utils/createOrUpdateUserProfile'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface CandidateOnboardingWizardProps {
  userId: string
  onComplete: () => void
}

const STEPS = [
  {
    id: 0,
    title: 'Welcome',
    subtitle: "Let's get started with your candidate profile"
  },
  {
    id: 1,
    title: 'Basic Information',
    subtitle: 'Tell us about yourself and your candidacy'
  },
  {
    id: 2,
    title: 'Key Issues',
    subtitle: 'Share your positions on important topics'
  },
  {
    id: 3,
    title: 'Policy Details',
    subtitle: 'Elaborate on your specific policy positions'
  },
  {
    id: 4,
    title: 'Confirmation',
    subtitle: 'Review and confirm your information'
  }
]

export default function CandidateOnboardingWizard({
  userId,
  onComplete
}: CandidateOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasConfirmedTruthfulness, setHasConfirmedTruthfulness] =
    useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formValues, setFormValues] = useState({
    // Basic Information
    fullName: '',
    office: '',
    district: '',
    party: '',
    website: '',
    bio: '',
    jurisdiction: [] as string[],

    // Key Issues (simplified for better UX)
    keyIssue1: '',
    keyIssue2: '',
    keyIssue3: '',

    // Policy Details
    policy1: '',
    policy2: '',
    policy3: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleJurisdictionChange = (jurisdiction: string, checked: boolean) => {
    setFormValues(prev => ({
      ...prev,
      jurisdiction: checked
        ? [...prev.jurisdiction, jurisdiction]
        : prev.jurisdiction.filter(j => j !== jurisdiction)
    }))
  }

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      await saveProgress()
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const saveProgress = async () => {
    try {
      console.log('Saving progress for step:', currentStep)
      const candidateData = {
        basic_info: {
          fullName: formValues.fullName,
          office: formValues.office,
          district: formValues.district,
          party: formValues.party,
          website: formValues.website,
          bio: formValues.bio,
          jurisdiction: formValues.jurisdiction
        },
        key_issues: {
          issue1: formValues.keyIssue1,
          issue2: formValues.keyIssue2,
          issue3: formValues.keyIssue3
        },
        policies: {
          policy1: formValues.policy1,
          policy2: formValues.policy2,
          policy3: formValues.policy3
        },
        onboarding_completed: currentStep === STEPS.length - 1,
        onboarding_step: currentStep
      }

      console.log('Candidate data to save:', candidateData)
      const result = await saveCandidateProfile(supabase, userId, candidateData)
      console.log('Save candidate profile result:', result)

      if (!result.success) {
        console.error('Save candidate profile failed:', result.error)
        toast.error('Failed to save progress. Please try again.')
        return false
      }

      console.log('Progress saved successfully')
      return true
    } catch (error) {
      console.error('Error saving progress:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      toast.error('Failed to save progress. Please try again.')
      return false
    }
  }

  const handleComplete = async () => {
    if (!hasConfirmedTruthfulness) {
      toast.error(
        'Please confirm that the information provided is accurate and truthful.'
      )
      return
    }

    setIsSubmitting(true)

    try {
      console.log('Starting onboarding completion...')
      const success = await saveProgress()
      console.log('Save progress result:', success)

      if (success) {
        console.log(
          'Progress saved successfully, updating completion status...'
        )

        // Mark onboarding as completed - handle case where fields might not exist
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              onboarding_completed: true,
              onboarding_completed_at: new Date().toISOString()
            })
            .eq('user_id', userId)

          if (error) {
            console.warn(
              'Could not update onboarding fields (they may not exist yet):',
              error
            )
            // Continue anyway - the candidate profile data is saved
          } else {
            console.log('Onboarding completion status updated successfully')
          }
        } catch (updateError) {
          console.warn('Onboarding field update failed:', updateError)
          // Continue anyway - the candidate profile data is saved
        }

        console.log('Onboarding completed successfully')
        toast.success(
          'Welcome! Your candidate profile has been created successfully. Allow for up to 7 business days for approval.'
        )
        onComplete()
      } else {
        console.error('Failed to save progress')
        toast.error('Failed to save your profile. Please try again.')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      toast.error('Failed to complete onboarding. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Your Candidate Journey
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We're excited to help you connect with voters and share your
                vision. This quick setup will take about 5 minutes to complete.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 font-semibold mb-1">Step 1</div>
                <div className="text-sm text-gray-700">Basic Information</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 font-semibold mb-1">Step 2</div>
                <div className="text-sm text-gray-700">Key Issues</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 font-semibold mb-1">Step 3</div>
                <div className="text-sm text-gray-700">Policy Details</div>
              </div>
            </div>
          </div>
        )

      case 1: // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formValues.fullName}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="office">Office Sought *</Label>
                <Input
                  id="office"
                  value={formValues.office}
                  onChange={e => handleInputChange('office', e.target.value)}
                  placeholder="e.g., Mayor, City Council, State Representative"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="district">District/Area *</Label>
                <Input
                  id="district"
                  value={formValues.district}
                  onChange={e => handleInputChange('district', e.target.value)}
                  placeholder="e.g., District 5, Ward 3"
                />
              </div>
              <div>
                <Label htmlFor="party">Political Party</Label>
                <Input
                  id="party"
                  value={formValues.party}
                  onChange={e => handleInputChange('party', e.target.value)}
                  placeholder="e.g., Democratic, Republican, Independent"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Campaign Website</Label>
              <Input
                id="website"
                value={formValues.website}
                onChange={e => handleInputChange('website', e.target.value)}
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
                      checked={formValues.jurisdiction.includes(level)}
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
                value={formValues.bio}
                onChange={e => handleInputChange('bio', e.target.value)}
                placeholder="Tell voters about yourself, your background, and why you're running..."
                maxLength={150}
                rows={4}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formValues.bio.length}/150 characters
              </div>
            </div>
          </div>
        )

      case 2: // Key Issues
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Share your top 3 key issues that you'll focus on if elected. Be
                specific and concise (2-3 sentences each).
              </p>
            </div>

            <div>
              <Label htmlFor="keyIssue1">Key Issue #1 *</Label>
              <Textarea
                id="keyIssue1"
                value={formValues.keyIssue1}
                onChange={e => handleInputChange('keyIssue1', e.target.value)}
                placeholder="e.g., Economic development and job creation in our community..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="keyIssue2">Key Issue #2 *</Label>
              <Textarea
                id="keyIssue2"
                value={formValues.keyIssue2}
                onChange={e => handleInputChange('keyIssue2', e.target.value)}
                placeholder="e.g., Education funding and school improvements..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="keyIssue3">Key Issue #3 *</Label>
              <Textarea
                id="keyIssue3"
                value={formValues.keyIssue3}
                onChange={e => handleInputChange('keyIssue3', e.target.value)}
                placeholder="e.g., Infrastructure and transportation improvements..."
                rows={3}
              />
            </div>
          </div>
        )

      case 3: // Policy Details
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                Provide more detailed policy positions on 3 important topics.
                This helps voters understand your specific plans and priorities.
              </p>
            </div>

            <div>
              <Label htmlFor="policy1">Policy Position #1 *</Label>
              <Textarea
                id="policy1"
                value={formValues.policy1}
                onChange={e => handleInputChange('policy1', e.target.value)}
                placeholder="e.g., Healthcare: I support expanding access to affordable healthcare by..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="policy2">Policy Position #2 *</Label>
              <Textarea
                id="policy2"
                value={formValues.policy2}
                onChange={e => handleInputChange('policy2', e.target.value)}
                placeholder="e.g., Environment: My environmental plan includes..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="policy3">Policy Position #3 *</Label>
              <Textarea
                id="policy3"
                value={formValues.policy3}
                onChange={e => handleInputChange('policy3', e.target.value)}
                placeholder="e.g., Public Safety: I will work to improve public safety by..."
                rows={4}
              />
            </div>
          </div>
        )

      case 4: // Confirmation
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Review Your Information
              </h3>
              <p className="text-gray-600">
                Please review all the information you've provided and confirm
                its accuracy.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Basic Information
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Name:</strong> {formValues.fullName || 'Not provided'}
                </p>
                <p>
                  <strong>Office:</strong> {formValues.office || 'Not provided'}
                </p>
                <p>
                  <strong>District:</strong>{' '}
                  {formValues.district || 'Not provided'}
                </p>
                <p>
                  <strong>Party:</strong> {formValues.party || 'Not provided'}
                </p>
                <p>
                  <strong>Jurisdiction:</strong>{' '}
                  {formValues.jurisdiction.join(', ') || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="truthfulness"
                  checked={hasConfirmedTruthfulness}
                  onCheckedChange={setHasConfirmedTruthfulness}
                />
                <div className="space-y-2">
                  <label
                    htmlFor="truthfulness"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    I confirm that all information provided is accurate and
                    truthful
                  </label>
                  <p className="text-xs text-gray-600">
                    By checking this box, you acknowledge that the information
                    you've provided is accurate to the best of your knowledge
                    and that you understand the importance of truthful
                    representation in the political process.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-amber-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-amber-800">
                    Review Process
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Your candidate profile will be reviewed by our team. Please
                    allow up to 7 business days for approval. You will be
                    notified via email once your profile has been approved and
                    is live on the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Welcome
        return true
      case 1: // Basic Information
        return (
          formValues.fullName &&
          formValues.office &&
          formValues.district &&
          formValues.jurisdiction.length > 0
        )
      case 2: // Key Issues
        return (
          formValues.keyIssue1 && formValues.keyIssue2 && formValues.keyIssue3
        )
      case 3: // Policy Details
        return formValues.policy1 && formValues.policy2 && formValues.policy3
      case 4: // Confirmation
        return hasConfirmedTruthfulness
      default:
        return false
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {STEPS[currentStep].title}
            </CardTitle>
            <CardDescription className="text-lg">
              {STEPS[currentStep].subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">{renderStepContent()}</CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || isSubmitting}
            className="px-6"
          >
            Previous
          </Button>

          <div className="flex space-x-3">
            {currentStep === STEPS.length - 1 ? (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || isSubmitting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8"
              >
                {isSubmitting ? 'Creating Profile...' : 'Complete Setup'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8"
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
