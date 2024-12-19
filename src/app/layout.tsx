import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'US-China Economic Analysis',
  description: 'Analysis of China\'s Economic Rise'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="icon" 
          href="/favicon.ico" 
          sizes="any"
        />
        <link 
          rel="apple-touch-icon" 
          href="/favicon.ico"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-slate-900`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
