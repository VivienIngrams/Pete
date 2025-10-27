import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Roboto } from 'next/font/google'

import { LanguageProvider } from './components/context/LanguageProvider'
import ThemeProvider from './components/ThemeProvider'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light',
}

const roboto = Roboto({
  variable: '--font-family-roboto',
  weight: ['100', '300', '400', '500', '700'],
  style: ['normal'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Peter Lippmann',
  description: 'Art Photography',
  other: {
    'color-scheme': 'light only',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable}`}
      data-theme="light"
      style={{ colorScheme: 'light only', backgroundColor: 'white', color: 'black' }}
    >
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="theme-color" content="#ffffff" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root { color-scheme: light only !important; }
            html, body { background-color: white !important; color: black !important; }
          `
        }} />
      </head>
      <body 
        className="h-full bg-white font-roboto"
        style={{ backgroundColor: 'white', color: 'black' }}
      >
        <LanguageProvider>
          <ThemeProvider />
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}