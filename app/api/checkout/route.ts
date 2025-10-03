import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})
export async function POST(req: NextRequest) {
  try {
    const { priceId, paymentType } = await req.json()
    const headersList = await headers()
    const origin = headersList.get('origin')

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceID' }, { status: 400 })
    }
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: paymentType,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`
    })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
