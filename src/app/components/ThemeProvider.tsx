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

      // Set data attributes
      html.dataset.theme = 'light'
      html.setAttribute('data-theme', 'light')

      // Set styles
      html.style.colorScheme = 'light'
      html.style.backgroundColor = 'white'
      html.style.color = 'black'

      body.style.backgroundColor = 'white'
      body.style.color = 'black'

      // Inject meta tags if missing (for Safari)
      const ensureMeta = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`)
        if (!tag) {
          tag = document.createElement('meta')
          tag.setAttribute('name', name)
          document.head.appendChild(tag)
        }
        tag.setAttribute('content', content)
      }

      ensureMeta('color-scheme', 'light only')
      ensureMeta('supported-color-schemes', 'light')
      ensureMeta('apple-mobile-web-app-status-bar-style', 'default')
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