'use client'

import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const HomeNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationLinks = [
    { href: '/trending-topics', label: 'Trending Topics' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/faqs', label: 'FAQs' }
  ]

  const accountLinks = [
    { href: '/auth/sign-up', label: 'Sign Up', variant: 'default' as const },
    { href: '/auth/login', label: 'Login', variant: 'outline' as const }
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
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
              {accountLinks.map(link => (
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
              ))}
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
                {accountLinks.map(link => (
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
                    <Link href={link.href} onClick={() => setIsMenuOpen(false)}>
                      {link.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default HomeNavigation
