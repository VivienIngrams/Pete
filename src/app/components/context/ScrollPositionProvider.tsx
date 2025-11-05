// app/components/context/ScrollPositionProvider.tsx
'use client'

import { createContext, useContext, useRef, ReactNode } from 'react'

type ScrollPositionContextType = {
  saveScrollPosition: (key: string, position: number | string) => void
  getScrollPosition: (key: string) => number | string | null
  clearScrollPosition: (key: string) => void
}

const ScrollPositionContext = createContext<ScrollPositionContextType | undefined>(undefined)

export function ScrollPositionProvider({ children }: { children: ReactNode }) {
  const scrollPositionsRef = useRef<Map<string, number | string>>(new Map())

  const saveScrollPosition = (key: string, position: number | string) => {
    scrollPositionsRef.current.set(key, position)
  }

  const getScrollPosition = (key: string) => {
    return scrollPositionsRef.current.get(key) || null
  }

  const clearScrollPosition = (key: string) => {
    scrollPositionsRef.current.delete(key)
  }

  return (
    <ScrollPositionContext.Provider value={{ saveScrollPosition, getScrollPosition, clearScrollPosition }}>
      {children}
    </ScrollPositionContext.Provider>
  )
}

export function useScrollPosition() {
  const context = useContext(ScrollPositionContext)
  if (context === undefined) {
    throw new Error('useScrollPosition must be used within a ScrollPositionProvider')
  }
  return context
}