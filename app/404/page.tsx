'use client'

import { ArrowLeft, Home, Search } from 'lucide-react'
import Link from 'next/link'

import AuthAwareNavigation from '@/components/auth-aware-navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AuthAwareNavigation />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <Search className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-slate-600">
              Sorry, we couldn't find the page you're looking for. It might have
              been moved, deleted, or doesn't exist.
            </p>
          </div>

          {/* Help Card */}
          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle>What can you do?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">
                      1
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Check the URL</p>
                    <p className="text-sm text-slate-600">
                      Make sure you typed the address correctly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">
                      2
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Go back to the homepage
                    </p>
                    <p className="text-sm text-slate-600">
                      Start fresh from our main page.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">
                      3
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Contact support
                    </p>
                    <p className="text-sm text-slate-600">
                      If you think this is an error, let us know.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#203c39] hover:bg-[#203c39]/90"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </div>
            </Button>
          </div>

          {/* Popular Links */}
          <div className="mt-12">
            <h3 className="font-semibold text-slate-900 mb-4">Popular Pages</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild variant="outline" size="sm">
                <Link href="/pricing">Pricing</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/about">About</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/faqs">FAQs</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
