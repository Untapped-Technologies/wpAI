import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(secretKey as string, {})

export async function POST(req: NextRequest) {
  try {
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured on the server' },
        { status: 500 }
      )
    }

    const { priceId, paymentType } = await req.json()
    const origin = req.headers.get('origin') || req.nextUrl.origin

    // Get user ID using the same pattern as other API routes
    const userId = await getCurrentUserId()

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    // Preflight: ensure the Price exists and is compatible with the requested mode
    let price
    try {
      price = await stripe.prices.retrieve(priceId)
    } catch (e: any) {
      const hint =
        'Verify the price belongs to the same Stripe account and mode (test vs live) as your secret key.'
      return NextResponse.json(
        { error: `Stripe says: ${e?.message || 'No such price'}. ${hint}` },
        { status: 400 }
      )
    }

    const derivedMode: 'payment' | 'subscription' =
      price.type === 'recurring' ? 'subscription' : 'payment'

    const mode: 'payment' | 'subscription' =
      paymentType === 'subscription' || derivedMode === 'subscription'
        ? 'subscription'
        : 'payment'

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        user_id: userId || 'anonymous'
      }
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    const message =
      (error?.raw && error.raw.message) || error?.message || 'Server error'
    console.error('Checkout API error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
