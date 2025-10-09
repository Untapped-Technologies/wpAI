'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import {
  createOrUpdateUserProfile,
  fetchLocationFromIP
} from '@/lib/utils/createOrUpdateUserProfile'
import { cn } from '@/lib/utils/index'

import { signUpUserTypes } from '@/components/_constants/pageData/userTypes'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import ButtonGroup from '../ui/_custom/_common/buttonGroup'

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [selectedUserType, setSelectedUserType] = useState(
    '77503f6f-c160-4cca-9d13-70f08e09fcc4'
  ) // Default to Citizen
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Initialize state from localStorage on component mount, or set default
  useEffect(() => {
    const storedUserType = localStorage.getItem('selectedUserType')
    if (storedUserType) {
      setSelectedUserType(storedUserType)
    } else {
      // Only set localStorage if it doesn't exist
      localStorage.setItem('selectedUserType', selectedUserType)
    }
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const signUpOptions: any = {
        emailRedirectTo: `${location.origin}/auth/oauth?next=/auth/oauth/oauth-callback`
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: signUpOptions
      })

      if (error) throw error

      // Create user profile with selected user type
      if (data.user) {
        try {
          const location = await fetchLocationFromIP()
          const locationData = {
            city: location?.city,
            state: location?.state,
            postalCode: location?.postalCode,
            country: location?.country,
            latitude: location?.latitude,
            longitude: location?.longitude,
            emailNotifs: true,
            smsNotifs: true
          }

          await createOrUpdateUserProfile(
            supabase,
            data.user,
            locationData,
            {},
            selectedUserType
          )
        } catch (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't fail the signup if profile creation fails
        }
      }

      // Show success message or redirect
      if (data.user && !data.user.email_confirmed_at) {
        setError('Please check your email for a confirmation link.')
      } else if (data.user && data.user.email_confirmed_at) {
        // If email is already confirmed, check if candidate needs onboarding
        const candidateTypeId = '3dad0f25-2b3b-491b-9e82-9f9e71adad6f'
        if (selectedUserType === candidateTypeId) {
          router.push('/candidate-onboarding')
        } else {
          router.push('/user/profile')
        }
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/oauth?next=/auth/oauth/oauth-callback?userType=${encodeURIComponent(selectedUserType)}`
        }
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'An OAuth error occurred'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn('flex flex-col items-center gap-6', className)}
      {...props}
    >
      <Card className="w-full max-w-sm bg-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex flex-col items-center justify-center gap-4 text-[#203c39]">
            <Image
              src="/images/logos/icononly_transparent_nobuffer.png"
              alt="World Politics Logo"
              width={112}
              height={112}
            />
            Create an account
          </CardTitle>
          <CardDescription className="text-[#203c39]">
            Enter your details below to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <ButtonGroup
              groupTitle="Select Type"
              groupData={signUpUserTypes}
              defaultValue={selectedUserType}
              onValueChange={value => {
                setSelectedUserType(value)
                localStorage.setItem('selectedUserType', value)
              }}
            />
            <Button
              variant="outline"
              type="button"
              className="w-full bg-[#203c39] text-white hover:text-[#203c39] hover:bg-white border-0"
              onClick={handleSocialSignup}
              disabled={isLoading}
            >
              Sign Up with Google
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase"></div>
            </div>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label className="text-[#203c39]" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-gray-100"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label className="text-[#203c39]" htmlFor="password">
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-gray-100"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label className="text-[#203c39]" htmlFor="repeat-password">
                      Repeat Password
                    </Label>
                  </div>
                  <Input
                    id="repeat-password"
                    type="password"
                    placeholder="********"
                    required
                    value={repeatPassword}
                    onChange={e => setRepeatPassword(e.target.value)}
                    className="bg-gray-100"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  className="w-full hover:bg-[#203c39] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-[#203c39]">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </div>
          <div className="mt-10 text-center text-xs text-[#203c39]">
            <Link href="/" className="hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
