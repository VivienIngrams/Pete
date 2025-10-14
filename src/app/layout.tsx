// app/layout.tsx (or similar file)

import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import {  Genos, Roboto, Smooch_Sans } from 'next/font/google'

import { LanguageProvider } from './components/context/LanguageProvider'




const smooch = Smooch_Sans({
  variable: '--font-family-genos',
  weight: [ '400',],
  style: ['normal'],
  subsets: ['latin'],
})
const genos = Genos({
  variable: '--font-family-genos',
  weight: [ '400',],
  style: ['normal'],
  subsets: ['latin'],
})

const inter = Roboto({
  variable: '--font-family-inter',
  weight: [ '100', '300', '400', '500', '700' ],
  style: ['normal'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Peter Lippmann',
  description: 'Photographer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en" // Default to 'en' initially; language will be dynamically set in client-side code
      className={` ${genos.variable} ${inter.variable} ${smooch.variable}`}
    >
      <body className="h-full bg-[#f6f5ee] font-inter">
        <LanguageProvider>
       
            {children}
            <Analytics />
         
        </LanguageProvider>
      </body>
    </html>
  )
}
