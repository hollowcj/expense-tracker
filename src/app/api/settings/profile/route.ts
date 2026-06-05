import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Independent server-side client instantiation bypassing non-existent global utils
async function getSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Can be safely disregarded if overridden mid-flight by routing
          }
        },
      },
    }
  )
}

// 1. GET: Fetch transaction preferences from data tables
export async function GET() {
  try {
    const supabase = await getSupabaseServer()

    // Read the session details transmitted by middleware cookies securely
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, currency_preference, monthly_budget')
      .eq('id', user.id)
      .maybeSingle()

    // Fallback if profiles table is empty for this user record
    if (error || !data) {
      return NextResponse.json({
        fullName: user.user_metadata?.full_name || user.user_metadata?.display_name || '',
        currency: '₦',
        monthlyBudget: 0
      })
    }

    // Explicit translation mapping to camelCase frontend variables
    return NextResponse.json({
      fullName: data.full_name || '',
      currency: data.currency_preference || '₦',
      monthlyBudget: data.monthly_budget || 0
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 2. PUT: Save configuration preferences smoothly
export async function PUT(request: Request) {
  try {
    const supabase = await getSupabaseServer()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    const body = await request.json()
    const { fullName, currency, monthlyBudget } = body

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        currency_preference: currency,
        monthly_budget: Number(monthlyBudget),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}