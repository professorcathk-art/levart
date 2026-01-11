import { NextResponse } from 'next/server'

export async function GET() {
  // Return affiliate ID to client (public config)
  const affiliateId = process.env.TRIP_COM_AFFILIATE_ID || ''
  return NextResponse.json({ affiliateId })
}
