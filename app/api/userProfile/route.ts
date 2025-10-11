import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) return new Response(error.message, { status: 500 })
  return new Response(JSON.stringify(data), { status: 200 })
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const body = await req.json()
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .insert([{ user_id: userId, ...body }])
    .select()
    .maybeSingle()

  if (error) return new Response(error.message, { status: 500 })
  return new Response(JSON.stringify(data), { status: 201 })
}

export async function PATCH(req: Request) {
  const userId = await getCurrentUserId()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const body = await req.json()
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ user_id: userId, ...body })
    .eq('id', userId)
    .select()
    .maybeSingle()

  if (error) return new Response(error.message, { status: 500 })
  return new Response(JSON.stringify(data), { status: 200 })
}
