import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const supabase = await createAdmin()
    
    const { data: tasks, error } = await supabase
      .from('scheduled_tasks')
      .select('*')
      .order('scheduled_at', { ascending: false })
      .limit(50)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(tasks || [])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}