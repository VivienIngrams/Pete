'use client'

import { useState } from 'react'
import type { Post } from '~/sanity/lib/sanity.queries'
import DesktopSlideshow from './DesktopSlideShow'
import MobileSlideshow from './MobileSlideShow'

type Props = {
  post: Post
  language: string
}

export default function PostSlideshow({ post, language }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <>
      <div className="hidden md:block">
        <DesktopSlideshow
          post={post}
          language={language}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
      <div className="block md:hidden">
        <MobileSlideshow
          post={post}
          language={language}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    </>
  )
}
