import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const supabase = await createAdmin()
    
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(leads || [])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}