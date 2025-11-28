'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Ad, AdContext } from '@/lib/types/ads'
import { AD_SLOTS } from '@/lib/config/ads'
import { selectAdForSlot, getViewportWidth } from '@/lib/utils/ads'
import { HouseAd } from './house-ad'
import { AffiliateAd } from './affiliate-ad'
import { ExternalAd } from './external-ad'

interface AdSlotProps {
  slotId: string
  className?: string
  context?: Partial<AdContext>
  ads?: Ad[]
  height?: number
  width?: number
}

/**
 * AdSlot component - Main component for rendering ads
 * Handles ad selection, lazy loading, and rendering based on ad type
 */
export function AdSlot({
  slotId,
  className,
  context,
  ads = [],
  height,
  width
}: AdSlotProps) {
  const [selectedAd, setSelectedAd] = React.useState<Ad | null>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const [viewportWidth, setViewportWidth] = React.useState<number | undefined>()
  const slotRef = React.useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const slotConfig = AD_SLOTS[slotId]
  const shouldLazyLoad = slotConfig?.lazyLoad !== false

  // Get viewport width on client
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportWidth(getViewportWidth())
      
      const handleResize = () => {
        setViewportWidth(getViewportWidth())
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Select ad
  React.useEffect(() => {
    if (ads.length === 0) return

    const adContext: AdContext = {
      slotId,
      page: pathname,
      viewportWidth,
      ...context
    }

    const ad = selectAdForSlot(ads, slotId, adContext)
    setSelectedAd(ad)
  }, [ads, slotId, pathname, viewportWidth, context])

  // Intersection Observer for lazy loading
  React.useEffect(() => {
    if (!shouldLazyLoad || !slotRef.current) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px' // Start loading 50px before ad comes into view
      }
    )

    observer.observe(slotRef.current)

    return () => {
      observer.disconnect()
    }
  }, [shouldLazyLoad])

  // Track impression
  const handleImpression = React.useCallback(async () => {
    if (!selectedAd) return

    try {
      await fetch('/api/ads/impression', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adId: selectedAd.id,
          slotId,
          page: pathname
        })
      })
    } catch (error) {
      // Silently fail - analytics shouldn't break the page
      console.error('Failed to track impression:', error)
    }
  }, [selectedAd, slotId, pathname])

  // Track click
  const handleClick = React.useCallback(async () => {
    if (!selectedAd) return

    try {
      await fetch('/api/ads/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adId: selectedAd.id,
          slotId,
          page: pathname
        })
      })
    } catch (error) {
      // Silently fail - analytics shouldn't break the page
      console.error('Failed to track click:', error)
    }
  }, [selectedAd, slotId, pathname])

  if (!selectedAd) {
    return null
  }

  const slotHeight = height || slotConfig?.defaultHeight
  const slotWidth = width || slotConfig?.defaultWidth

  return (
    <div
      ref={slotRef}
      className={cn('w-full', className)}
      style={{
        minHeight: slotHeight ? `${slotHeight}px` : undefined,
        width: slotWidth ? `${slotWidth}px` : undefined
      }}
      data-ad-slot={slotId}
      data-ad-id={selectedAd.id}
    >
      {isVisible && (
        <>
          {selectedAd.type === 'house' && (
            <HouseAd
              ad={selectedAd}
              slotId={slotId}
              onImpression={handleImpression}
              onClick={handleClick}
            />
          )}
          {selectedAd.type === 'affiliate' && (
            <AffiliateAd
              ad={selectedAd}
              slotId={slotId}
              onImpression={handleImpression}
              onClick={handleClick}
            />
          )}
          {selectedAd.type === 'external' && (
            <ExternalAd
              ad={selectedAd}
              slotId={slotId}
              onImpression={handleImpression}
            />
          )}
        </>
      )}
    </div>
  )
}

