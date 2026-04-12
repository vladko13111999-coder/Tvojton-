'use client'

import { useState, useEffect } from 'react'
import { Users, Globe, Mail, TrendingUp, Calendar } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'

interface Lead {
  id: string
  name: string
  phone: string
  email: string
  score: number
  created_at: string
}

interface ScrapedUrl {
  id: string
  url: string
  leads_found: number
  scraped_at: string
}

interface Task {
  id: string
  recipient_email: string
  subject: string
  status: string
  scheduled_at: string
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [urls, setUrls] = useState<ScrapedUrl[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leads' | 'urls' | 'emails'>('leads')

  useEffect(() => {
    async function fetchData() {
      try {
        const [leadsRes, urlsRes, emailsRes] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/urls'),
          fetch('/api/emails'),
        ])
        
        const leadsData = await leadsRes.json()
        const urlsData = await urlsRes.json()
        const emailsData = await emailsRes.json()
        
        if (Array.isArray(leadsData)) setLeads(leadsData)
        if (Array.isArray(urlsData)) setUrls(urlsData)
        if (Array.isArray(emailsData)) setTasks(emailsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Calculate stats
  const totalLeads = leads.length
  const totalUrls = urls.length
  const totalEmails = tasks.filter(t => t.status === 'completed').length
  
  // Chart data - leads per day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })
  
  const chartData = last7Days.map(date => {
    const dayLeads = leads.filter(l => 
      l.created_at && l.created_at.startsWith(date)
    ).length
    return {
      date: new Date(date).toLocaleDateString('sk-SK', { weekday: 'short' }),
      leads: dayLeads,
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Načítavam dáta...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Celkom Leads</p>
              <p className="text-2xl font-bold">{totalLeads}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scraped URLs</p>
              <p className="text-2xl font-bold">{totalUrls}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Odoslané Emaily</p>
              <p className="text-2xl font-bold">{totalEmails}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Úspešnosť</p>
              <p className="text-2xl font-bold">
                {totalLeads > 0 ? Math.round((totalEmails / totalLeads) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h3 className="text-lg font-semibold mb-4">Leady za posledných 7 dní</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="leads" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'leads' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 border hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Leadsy ({totalLeads})
        </button>
        <button
          onClick={() => setActiveTab('urls')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'urls' 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-700 border hover:bg-gray-50'
          }`}
        >
          <Globe className="w-4 h-4 inline mr-2" />
          Scraped URLs ({totalUrls})
        </button>
        <button
          onClick={() => setActiveTab('emails')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'emails' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white text-gray-700 border hover:bg-gray-50'
          }`}
        >
          <Mail className="w-4 h-4 inline mr-2" />
          Emaily ({tasks.length})
        </button>
      </div>

      {/* Tables */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {activeTab === 'leads' && (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Názov</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefón</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skóre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dátum</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.slice(0, 20).map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{lead.name}</td>
                  <td className="px-6 py-4 text-gray-600">{lead.email || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{lead.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.score >= 70 ? 'bg-green-100 text-green-700' :
                      lead.score >= 40 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString('sk-SK') : '-'}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Zatiaľ žiadne leadsy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'urls' && (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nájdených</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dátum</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {urls.slice(0, 20).map((url) => (
                <tr key={url.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600 truncate max-w-md">{url.url}</td>
                  <td className="px-6 py-4">{url.leads_found || 0}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {url.scraped_at ? new Date(url.scraped_at).toLocaleDateString('sk-SK') : '-'}
                  </td>
                </tr>
              ))}
              {urls.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Zatiaľ žiadne URL
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'emails' && (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Príjemca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Predmet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dátum</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.slice(0, 20).map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{task.recipient_email}</td>
                  <td className="px-6 py-4 text-gray-600">{task.subject || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {task.scheduled_at ? new Date(task.scheduled_at).toLocaleDateString('sk-SK') : '-'}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Zatiaľ žiadne emaily
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}