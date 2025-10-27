'use client'

import { useEffect, useState } from 'react'
import PostsGridMobile from './PostsGridMobile'
import PostsGridDesktop from './PostsGridDesktop'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  posts: Post[]
}

export default function PostsGrid({ posts }: Props) {
  // Default to desktop to ensure immediate rendering
  const [isTouchPad, setIsTouchPad] = useState(false)

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Detect touchpads by smaller vertical delta or any horizontal movement
      if (Math.abs(e.deltaY) < 10 || Math.abs(e.deltaX) > 0) {
        setIsTouchPad(true)
      } else {
        setIsTouchPad(false)
      }
      // Remove listener after first detection
      window.removeEventListener('wheel', onWheel)
    }

    window.addEventListener('wheel', onWheel, { passive: true })

    // Fallback for mobile / touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchPad(true)
    }

    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  return isTouchPad ? (
    <PostsGridMobile posts={posts} />
  ) : (
    <PostsGridDesktop posts={posts} />
  )
}
