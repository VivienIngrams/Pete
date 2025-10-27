'use client'

import { useEffect } from 'react'

export default function ThemeProvider() {
  useEffect(() => {
    // Ensure no 'dark' class is present and set explicit light theme
    document.documentElement.classList.remove('dark')
    document.documentElement.dataset.theme = 'light'
    document.documentElement.style.backgroundColor = 'white'
    document.documentElement.style.color = 'black'
  }, [])

  return null
}
