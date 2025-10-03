'use client'
import { useEffect, useState } from 'react'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show banner only if not previously set
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const setConsent = (granted: boolean) => {
    // Save preference
    localStorage.setItem('cookie-consent', granted ? 'granted' : 'denied')
    setVisible(false)

    // Push to Google Consent Mode
    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
        functionality_storage: granted ? 'granted' : 'denied',
        personalization_storage: granted ? 'granted' : 'denied',
        security_storage: 'granted'
      })
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white shadow-md p-4 flex flex-col sm:flex-row justify-between items-center z-50">
      <p className="text-sm text-gray-700 mb-2 sm:mb-0">
        We use cookies to improve your experience, analyze site usage, and for
        compliance. Learn more in our{' '}
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>
        .
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setConsent(false)}
          className="px-4 py-2 text-sm border rounded"
        >
          Reject
        </button>
        <button
          onClick={() => setConsent(true)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
