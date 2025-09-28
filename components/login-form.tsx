'use client'

import HCaptcha from '@hcaptcha/react-hcaptcha'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/index'

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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const router = useRouter()
  const captchaRef = useRef<HCaptcha>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    // Only require CAPTCHA if it's configured
    if (process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && !captchaToken) {
      setError('Please complete the CAPTCHA verification')
      setIsLoading(false)
      return
    }

    try {
      const loginOptions: any = {}

      // Only add captchaToken if we have one
      if (captchaToken) {
        loginOptions.captchaToken = captchaToken
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: loginOptions
      })
      if (error) throw error
      // Redirect to root and refresh to ensure server components get updated session
      router.push('/')
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      // Reset CAPTCHA on error
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha()
      }
      setCaptchaToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token)
  }

  const handleSocialLogin = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/oauth`
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
            Welcome back
          </CardTitle>
          <CardDescription className="text-[#203c39]">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              type="button"
              className="w-full bg-[#203c39] text-white hover:text-[#203c39] hover:bg-white border-0"
              onClick={handleSocialLogin}
              disabled={isLoading}
            >
              Sign In with Google
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                {/* <span className="bg-muted px-2 text-muted-foreground">Or</span> */}
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#203c39]">
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
                  <Label htmlFor="password" className="text-[#203c39]">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-[#203c39]"
                  >
                    Forgot password?
                  </Link>
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
              <div className="flex justify-center">
                {process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ? (
                  <HCaptcha
                    ref={captchaRef}
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                    onVerify={onCaptchaChange}
                    onExpire={() => setCaptchaToken(null)}
                    onError={() => setCaptchaToken(null)}
                  />
                ) : (
                  <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg text-center">
                    <p className="text-sm text-yellow-800">
                      ⚠️ hCaptcha not configured. Please add
                      NEXT_PUBLIC_HCAPTCHA_SITE_KEY to your .env.local file.
                    </p>
                  </div>
                )}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full hover:bg-[#203c39] hover:text-white text-[#203c39]"
                disabled={
                  isLoading ||
                  (process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && !captchaToken)
                }
              >
                {isLoading ? 'Logging in...' : 'Sign In'}
              </Button>
            </form>
          </div>
          <div className="mt-6 text-center text-sm text-[#203c39]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="underline underline-offset-4">
              Sign Up
            </Link>
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
