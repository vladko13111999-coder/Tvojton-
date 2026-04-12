import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const supabase = await createAdmin()
    
    const { data: urls, error } = await supabase
      .from('scraped_urls')
      .select('*')
      .order('scraped_at', { ascending: false })
      .limit(50)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(urls || [])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 })
  }
}