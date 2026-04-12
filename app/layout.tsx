import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Sales Agent | Automatizovaný predaj',
  description: 'AI Sales Agent pre slovenské a české firmy - automatizovaný scraping, emaily a telefonovanie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk">
      <body className={inter.className}>{children}</body>
    </html>
  )
}