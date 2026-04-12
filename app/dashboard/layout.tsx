import Link from 'next/link'
import { BarChart3, Globe, Mail, Users, ArrowLeft } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Späť na web
            </Link>
            <span className="text-xl font-bold text-gray-900">AI Sales Agent</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard?password=aiagent2024" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Users className="w-5 h-5" />
              Leads
            </Link>
            <Link href="/dashboard?password=aiagent2024" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Globe className="w-5 h-5" />
              Scraped URLs
            </Link>
            <Link href="/dashboard?password=aiagent2024" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Mail className="w-5 h-5" />
              Emaily
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}