'use client'

import { createClient } from '@/lib/supabase/client'
import { getProfileUrl } from '@/lib/utils/profile-navigation'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface AuthAwareFooterProps {
  className?: string
}

const AuthAwareFooter = ({ className = '' }: AuthAwareFooterProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileUrl, setProfileUrl] = useState('/user/profile')
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)

      // Set appropriate profile URL
      const url = await getProfileUrl(user)
      setProfileUrl(url)

      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      // Set appropriate profile URL
      const url = await getProfileUrl(currentUser)
      setProfileUrl(url)

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const renderAccountLinks = () => {
    if (loading) {
      return (
        <>
          <li>
            <div className="h-4 w-16 bg-slate-600 animate-pulse rounded"></div>
          </li>
          <li>
            <div className="h-4 w-12 bg-slate-600 animate-pulse rounded"></div>
          </li>
        </>
      )
    }

    if (!user) {
      return (
        <>
          <li>
            <Link
              href="/auth/sign-up"
              className="hover:text-white transition-colors"
            >
              Sign Up
            </Link>
          </li>
          <li>
            <Link
              href="/auth/login"
              className="hover:text-white transition-colors"
            >
              Login
            </Link>
          </li>
        </>
      )
    }

    return (
      <>
        <li>
          <Link
            href={profileUrl}
            className="hover:text-white transition-colors"
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            href="/auth/logout"
            className="hover:text-white transition-colors"
          >
            Logout
          </Link>
        </li>
      </>
    )
  }

  return (
    <footer className={`bg-slate-900 text-white py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logos/icononly_transparent_nobuffer.png"
                alt="World Politics Logo"
                width={32}
                height={32}
              />
              <span className="font-bold text-lg">WorldPolitics.AI</span>
            </div>
            <p className="text-slate-400 text-sm">
              The Truth Starts Here. Navigate global politics with AI-powered
              insights.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  href="/trending-topics"
                  className="hover:text-white transition-colors"
                >
                  Trending Topics
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {renderAccountLinks()}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2025 WorldPolitics.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default AuthAwareFooter
