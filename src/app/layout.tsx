import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'

import { LanguageProvider } from './components/context/LanguageProvider'
import { ScrollPositionProvider } from './components/context/ScrollPositionProvider'
import ThemeProvider from './components/ThemeProvider'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light', // Force light mode only
}

const roboto = Roboto({
  variable: '--font-family-roboto',
  weight: ['100', '300', '400', '500', '700'],
  style: ['normal'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Peter Lippmann',
  description: 'Discover the poetic photography of Peter Lippmann — timeless still-life compositions that reveal beauty in decay, nature and the ordinary',
  manifest: '/manifest.json',
 
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <body className="h-full font-roboto !bg-white dark:!bg-white  !text-black dark:!text-black ">
        <LanguageProvider>
          <ScrollPositionProvider>
          <ThemeProvider />
          {children}
          </ScrollPositionProvider>
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
