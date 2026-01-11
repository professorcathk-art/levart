import { NextResponse } from 'next/server'

export async function GET() {
  // Return affiliate config to client (public config)
  // Based on Trip.com format: Allianceid, SID, trip_sub1, trip_sub3
  const allianceId = process.env.TRIP_COM_ALLIANCE_ID || '7695682'
  const sid = process.env.TRIP_COM_SID || '288370027'
  const tripSub1 = process.env.TRIP_COM_SUB1 || 'levart'
  const tripSub3 = process.env.TRIP_COM_SUB3 || ''

  return NextResponse.json({
    allianceId,
    sid,
    tripSub1,
    tripSub3,
    // Legacy support
    affiliateId: allianceId,
  })
}
