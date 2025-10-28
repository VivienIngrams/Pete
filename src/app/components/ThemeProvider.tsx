'use client'

import { useEffect } from 'react'

export default function ThemeProvider() {
  useEffect(() => {
    // Single enforcement function
    const enforceLight = () => {
      const html = document.documentElement
      const body = document.body
      
      // Remove dark class
      html.classList.remove('dark')
      body.classList.remove('dark')
      
      // Set data attribute
      html.dataset.theme = 'light'
      
      // Set styles
      html.style.colorScheme = 'light only'
      html.style.backgroundColor = 'white'
      html.style.color = 'black'
      
      body.style.backgroundColor = 'white'
      body.style.color = 'black'
    }
    
    // Initial enforcement
    enforceLight()
    
    // Re-enforce on visibility change (for iOS app switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        enforceLight()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null
}