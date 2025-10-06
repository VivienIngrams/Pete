// app/layout.tsx (or similar file)

import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import {  Cormorant_Unicase, Inter } from 'next/font/google'

import { LanguageProvider } from './components/context/LanguageProvider'




const cormorant = Cormorant_Unicase({
  variable: '--font-family-cormorant',
  weight: [ '400',],
  style: ['normal'],
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-family-inter',
  weight: [ '200', '300', '400', '600', '700', '800'],
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
      className={` ${cormorant.variable} ${inter.variable}`}
    >
      <body className="h-full bg-[#edece0] font-cormorant">
        <LanguageProvider>
       
            {children}
            <Analytics />
         
        </LanguageProvider>
      </body>
    </html>
  )
}
