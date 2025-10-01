// app/layout.tsx (or similar file)

import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import {  Cormorant_Unicase } from 'next/font/google'


import { LanguageProvider } from './components/context/LanguageProvider'




const cormorant = Cormorant_Unicase({
  variable: '--font-family-cormorant',
  weight: [ '400',],
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
      className={` ${cormorant.variable}`}
    >
      <body className="h-full bg-white font-cormorant">
        <LanguageProvider>
       
            {children}
            <Analytics />
         
        </LanguageProvider>
      </body>
    </html>
  )
}
