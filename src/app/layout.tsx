// app/layout.tsx (or similar file)

import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import {  Cinzel, Montserrat } from 'next/font/google'


import { LanguageProvider } from './components/context/LanguageProvider'




const cinzel = Cinzel({
  variable: '--font-family-cinzel',
  weight: ['800', '500', '400', '700', '900'],
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
      className={` ${cinzel.variable}`}
    >
      <body className="h-full bg-white font-cinzel">
        <LanguageProvider>
       
            {children}
            <Analytics />
         
        </LanguageProvider>
      </body>
    </html>
  )
}
