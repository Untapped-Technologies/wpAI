import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { getUserAccess } from '@/lib/utils/access-control'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const userAccess = await getUserAccess(userId)

    if (!userAccess) {
      return NextResponse.json({
        access_level: 'free',
        features: {},
        limits: {},
        subscription: null
      })
    }

    return NextResponse.json(userAccess)
  } catch (error) {
    console.error('Error in user access GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
