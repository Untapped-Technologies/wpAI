import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/location/postal-code?code=12345
 * Lookup location information from postal code using Zippopotam.us
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const postalCode = searchParams.get('code')

    if (!postalCode) {
      return NextResponse.json(
        { success: false, message: 'Postal code is required' },
        { status: 400 }
      )
    }

    // Extract country code from postal code format
    // US postal codes are 5 digits
    let countryCode = 'us'
    let zipCode = postalCode

    // Handle other formats if needed
    if (postalCode.length > 5) {
      // Could be international format like "CA H1A 1A6"
      // For now, just try US
      zipCode = postalCode.substring(0, 5)
    }

    // Fetch location data from Zippopotam.us (free API, no token needed)
    const response = await fetch(
      `https://api.zippopotam.us/${countryCode}/${zipCode}`,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    )

    // Handle 404 (postal code not found in database)
    if (response.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: 'Postal code not found in database'
        },
        { status: 404 }
      )
    }

    if (!response.ok) {
      throw new Error(`Location API error: ${response.status}`)
    }

    const data = await response.json()

    // Parse the location data from Zippopotam format
    const place = data.places?.[0] || {}

    const locationData = {
      city: place['place name'] || '',
      state: place.state || place.stateAbbreviation || '',
      country: data.country || 'US',
      postalCode: data['post code'] || postalCode,
      latitude: place.latitude || '',
      longitude: place.longitude || ''
    }

    return NextResponse.json({
      success: true,
      data: locationData
    })
  } catch (error) {
    console.error('Error fetching location from postal code:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch location data'
      },
      { status: 500 }
    )
  }
}
