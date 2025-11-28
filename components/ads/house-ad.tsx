'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Ad } from '@/lib/types/ads'
import { buildTrackingUrl } from '@/lib/utils/ads'

interface HouseAdProps {
  ad: Ad
  slotId: string
  className?: string
  onImpression?: () => void
  onClick?: () => void
}

export function HouseAd({ ad, slotId, className, onImpression, onClick }: HouseAdProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const trackingUrl = buildTrackingUrl(ad, slotId)

  React.useEffect(() => {
    // Track impression when component mounts
    if (onImpression) {
      onImpression()
    }
  }, [onImpression])

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <Link
        href={trackingUrl}
        onClick={handleClick}
        className="block hover:opacity-90 transition-opacity"
      >
        {ad.imageUrl && (
          <div className="relative w-full aspect-video bg-muted">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className={cn(
                'object-cover transition-opacity duration-300',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
          </div>
        )}
        <CardHeader className={cn(ad.imageUrl && 'pb-3')}>
          <CardTitle className="text-lg leading-tight">{ad.title}</CardTitle>
          {ad.description && (
            <CardDescription className="line-clamp-2">
              {ad.description}
            </CardDescription>
          )}
        </CardHeader>
        {ad.ctaLabel && (
          <CardContent className="pt-0">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <span>{ad.ctaLabel}</span>
            </Button>
          </CardContent>
        )}
      </Link>
    </Card>
  )
}

