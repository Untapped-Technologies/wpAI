'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { getProfileUrl } from '@/lib/utils/profile-navigation'
import { User } from '@supabase/supabase-js'
import { LogOut, Menu, User as UserIcon, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthAwareNavigationProps {
  className?: string
}

const AuthAwareNavigation = ({ className = '' }: AuthAwareNavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileUrl, setProfileUrl] = useState('/user/profile')
  const router = useRouter()
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

  const handleLogout = async () => {
    const supabase = createClient()

    // Clear chat history
    try {
      await fetch('/api/chats', { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to clear chat history:', error)
    }

    // Clear sidebar cookie
    if (typeof document !== 'undefined') {
      document.cookie =
        'sidebar:state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }

    // Sign out from Supabase
    await supabase.auth.signOut()

    // Dispatch events to reset sidebar components
    window.dispatchEvent(new CustomEvent('chat-history-updated'))
    window.dispatchEvent(new CustomEvent('sidebar-reset'))

    // Force a full page reload to ensure sidebar updates
    window.location.href = '/'
  }

  const navigationLinks = [
    { href: '/trending-topics', label: 'Trending Topics' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/faqs', label: 'FAQs' }
  ]

  const unauthenticatedLinks = [
    { href: '/auth/sign-up', label: 'Sign Up', variant: 'default' as const },
    { href: '/auth/login', label: 'Login', variant: 'outline' as const }
  ]

  const authenticatedLinks = [
    { href: profileUrl, label: 'Profile', icon: UserIcon },
    {
      href: '/auth/logout',
      label: 'Logout',
      icon: LogOut,
      onClick: handleLogout
    }
  ]

  return (
    <nav
      className={`bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logos/icononly_transparent_nobuffer.png"
              alt="World Politics Logo"
              width={32}
              height={32}
            />
            <span className="font-bold text-lg text-slate-900">
              WorldPolitics.AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navigationLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {loading ? (
                <div className="w-20 h-8 bg-slate-200 animate-pulse rounded"></div>
              ) : !user ? (
                unauthenticatedLinks.map(link => (
                  <Button
                    key={link.href}
                    asChild
                    variant={link.variant}
                    size="sm"
                    className={
                      link.variant === 'default'
                        ? 'bg-[#203c39] hover:bg-[#203c39]/90 text-white'
                        : ''
                    }
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))
              ) : (
                authenticatedLinks.map(link => {
                  const Icon = link.icon
                  return (
                    <Button
                      key={link.href}
                      asChild
                      variant="outline"
                      size="sm"
                      onClick={link.onClick}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </Button>
                  )
                })
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-slate-600" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-3">
                {navigationLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-10 bg-slate-200 animate-pulse rounded"></div>
                    <div className="h-10 bg-slate-200 animate-pulse rounded"></div>
                  </div>
                ) : !user ? (
                  unauthenticatedLinks.map(link => (
                    <Button
                      key={link.href}
                      asChild
                      variant={link.variant}
                      className={
                        link.variant === 'default'
                          ? 'bg-[#203c39] hover:bg-[#203c39]/90 text-white'
                          : ''
                      }
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </Button>
                  ))
                ) : (
                  authenticatedLinks.map(link => {
                    const Icon = link.icon
                    return (
                      <Button
                        key={link.href}
                        asChild
                        variant="outline"
                        onClick={link.onClick}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </Button>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default AuthAwareNavigation
