'use client'

import { useEffect } from 'react'

export default function ThemeProvider() {
  useEffect(() => {
    // Force light mode on mount
    const enforceLight = () => {
      document.documentElement.classList.remove('dark')
      document.documentElement.dataset.theme = 'light'
      document.documentElement.style.colorScheme = 'light only'
      document.documentElement.style.backgroundColor = 'white'
      document.documentElement.style.color = 'black'
      
      document.body.classList.remove('dark')
      document.body.style.backgroundColor = 'white'
      document.body.style.color = 'black'
    }
    
    // Initial enforcement
    enforceLight()
    
    // Re-enforce on visibility change (iOS sometimes resets on app switch)
    document.addEventListener('visibilitychange', enforceLight)
    
    // Re-enforce on focus (when returning to tab)
    window.addEventListener('focus', enforceLight)
    
    // Watch for any class changes on html/body
    const observer = new MutationObserver(enforceLight)
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme', 'style'] 
    })
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class', 'style'] 
    })
    
    return () => {
      document.removeEventListener('visibilitychange', enforceLight)
      window.removeEventListener('focus', enforceLight)
      observer.disconnect()
    }
  }, [])

  return null
}