import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, message, message_type } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 1. Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from('contact_messages')
      .insert([{ name, email, message, message_type: message_type || 'other' }])

    if (dbError) {
      console.error('Insert error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // 2. Send Email Notification
    const recipients = ['ezcabrera@untappd.net']

    await resend.emails.send({
      from: 'WorldPolitics.ai <no-reply@worldpolitics.ai>',
      to: recipients,
      subject: `New ${message_type || 'Contact'} Form Submission`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message Type:</strong> ${message_type || 'other'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
