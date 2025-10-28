'use client'

import { useState } from 'react'

import type { Post } from '~/sanity/lib/sanity.queries'

import DesktopSlideshow from './DesktopSlideShow'
import MobileSlideshow from './MobileSlideShow'

type Props = {
  post: Post
}

export default function PostSlideshow({ post }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <>
      <div className="hidden md:block">
        <DesktopSlideshow
          post={post}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
      <div className="block md:hidden">
        <MobileSlideshow
          post={post}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    </>
  )
}
