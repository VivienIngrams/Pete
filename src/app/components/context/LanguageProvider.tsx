'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Create context to provide and consume language state
const LanguageContext = createContext(null)

export const useLanguage = () => {
  return useContext(LanguageContext)
}

// Helper function to get language from cookies
const getLanguageFromCookies = () => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/language=([^;]+)/)
    return match ? match[1] : 'fr' // Default to 'fr'
  }
  return 'fr'
}

// Helper function to set language in cookies
const setLanguageInCookies = (language: string) => {
  document.cookie = `language=${language}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year expiration
}

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('fr')

  // Load language from cookies on mount
  useEffect(() => {
    const initialLanguage = getLanguageFromCookies()
    setLanguage(initialLanguage)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = initialLanguage
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en'
    setLanguage(newLanguage)
    setLanguageInCookies(newLanguage)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLanguage
    }
    // ❌ No window.location.reload() — let React rerender naturally
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
