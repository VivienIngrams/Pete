import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { LanguageProvider } from './components/context/LanguageProvider'
import ThemeProvider from './components/ThemeProvider'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light dark',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <body className="h-full font-roboto bg-black dark:bg-black  text-white dark:text-white ">
        <LanguageProvider>
          <ThemeProvider />
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
