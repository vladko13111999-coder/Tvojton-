'use client'

import { useState } from 'react'
import { Mail, Phone, Globe, Zap, MessageSquare, BarChart3, CheckCircle, ArrowRight } from 'lucide-react'

export default function Home() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      
      if (res.ok) {
        setSubmitted(true)
        setContactForm({ name: '', email: '', message: '' })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-6xl mx-auto px-4 py-24 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI Sales Agent
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Automatizovaný predaj pre slovenské a české firmy
            </p>
            <p className="text-lg mb-12 text-blue-200 max-w-2xl mx-auto">
              Získavajte leads, posielajte emaily a telefonujte s klientmi 
              - všetko automaticky pomocou umelej inteligencie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#funkcie" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
              >
                Zistiť viac
              </a>
              <a 
                href="#kontakt" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition"
              >
                Kontaktovať
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Funkcie */}
      <section id="funkcie" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Čo všetko AI Agent dokáže
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Web Scraping</h3>
              <p className="text-gray-600">
                Automaticky vyhľadáva firmy na Google Maps, extrahuje kontakty 
                a ukladá do databázy s hodnotením kvality.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Email Marketing</h3>
              <p className="text-gray-600">
                Personalizované emaily pre každého leadu. Automatické sledovanie 
                otvorení a odpovedí.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Phone className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Automatické volania</h3>
              <p className="text-gray-600">
                AI telefonuje s potenciálnymi zákazníkmi. Hlasový asistent 
                odpovedá na otázky v reálnom čase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Výhody */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Prečo AI Sales Agent?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Rýchly', desc: 'Spracuje stovky leads za hodinu' },
              { icon: MessageSquare, title: 'Personalizovaný', desc: 'Každý email je unikátny' },
              { icon: BarChart3, title: 'Merateľný', desc: 'Real-time štatistiky' },
              { icon: CheckCircle, title: 'Spoľahlivý', desc: 'Beží 24/7 bez prestávky' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <item.icon className="w-10 h-10 mx-auto mb-4 text-blue-600" />
                <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cenník */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Jednoduchý cenník</h2>
          
          <div className="bg-white text-gray-900 rounded-2xl p-12 max-w-md mx-auto">
            <p className="text-gray-500 mb-2">PRE ZAČIATOK</p>
            <div className="text-6xl font-bold mb-4">97 €<span className="text-xl">/mes</span></div>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Neobmedzený scraping
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Neobmedzené emaily
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Automatické volania
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Dashboard
              </li>
            </ul>
            <a 
              href="#kontakt" 
              className="block w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Vyskúšať zdarma
            </a>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
            Kontaktujte nás
          </h2>
          
          {submitted ? (
            <div className="bg-green-100 border border-green-500 text-green-700 p-6 rounded-lg text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-semibold">Ďakujeme za správu!</p>
              <p className="text-green-600">Ozvu sa vám čo najskôr.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meno</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Vaše meno"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="vas@email.sk"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Správa</label>
                <textarea
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ako vám môžeme pomôcť?"
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? 'Odosielam...' : 'Odoslať správu'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 AI Sales Agent. Všetky práva vyhradené.</p>
        </div>
      </footer>
    </main>
  )
}