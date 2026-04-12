import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }
    
    const supabase = await createAdmin()
    
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{ name, email, message }])
      .select()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}