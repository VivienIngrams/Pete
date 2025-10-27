import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Genos, Roboto } from 'next/font/google'

import { LanguageProvider } from './components/context/LanguageProvider'
import ThemeProvider from './components/ThemeProvider'
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en" // Default to 'en' initially; language will be dynamically set in client-side code
      className={` ${roboto.variable} `}
      data-theme="light"
      
    >
      <body className="h-full bg-white font-roboto">
        <LanguageProvider>
          <ThemeProvider />
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
