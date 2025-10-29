'use client'

import { useState } from 'react'

import type { Post } from '~/sanity/lib/sanity.queries'

import DesktopSlideshow from '../../series/[slug]/DesktopSlideShow'
import MobileSlideshow from '../../series/[slug]/MobileSlideShow'

type Props = {
  post: Post
}

export default function Slideshow({ post }: Props) {
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
