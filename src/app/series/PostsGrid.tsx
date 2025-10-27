"use client"

import { useEffect, useState } from "react"
import TouchPostsGrid from "./TouchPostsGrid"
import ScrollPostsGrid from "./ScrollPostsGrid"
import type { Post } from "~/sanity/lib/sanity.queries"

type Props = {
  posts: Post[]
}

export default function PostsGrid({ posts }: Props) {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null)

  useEffect(() => {
    // Detect touch capability reliably
    const hasTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    setIsTouchDevice(hasTouch)
  }, [])

  if (isTouchDevice === null) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  return isTouchDevice ? <TouchPostsGrid posts={posts} /> : <ScrollPostsGrid posts={posts} />
}
