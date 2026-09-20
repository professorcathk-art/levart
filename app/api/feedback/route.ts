import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const TO = 'professor.cat.hk@gmail.com'
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function clientKey(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local'
  )
}

function allow(key: string) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Email is not configured yet.' }, { status: 503 })
  }

  if (!allow(clientKey(request))) {
    return NextResponse.json({ error: 'Please wait a bit before sending another note.' }, { status: 429 })
  }

  const body = (await request.json().catch(() => null)) as {
    type?: string
    name?: string
    email?: string
    message?: string
    page?: string
  } | null

  const type = body?.type === 'bug' ? 'bug' : 'contact'
  const message = body?.message?.trim() ?? ''
  const email = body?.email?.trim() ?? ''
  const name = body?.name?.trim() ?? ''
  const page = body?.page?.trim() ?? ''

  if (message.length < 8 || message.length > 4000) {
    return NextResponse.json({ error: 'Please write a short message.' }, { status: 400 })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'That email looks off.' }, { status: 400 })
  }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'Catpawtrip 貓爪印 <onboarding@resend.dev>',
      to: TO,
      replyTo: email || undefined,
      subject: type === 'bug' ? `[Catpawtrip bug] ${name || email || 'anonymous'}` : `[Catpawtrip contact] ${name || email || 'anonymous'}`,
      text: [
        `Type: ${type}`,
        `Name: ${name || '—'}`,
        `Email: ${email || '—'}`,
        `Page: ${page || '—'}`,
        '',
        message,
      ].join('\n'),
    })

    if (error) {
      console.error('Resend failed:', error)
      return NextResponse.json({ error: 'Could not send just now.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Feedback send failed:', error)
    return NextResponse.json({ error: 'Could not send just now.' }, { status: 502 })
  }
}
