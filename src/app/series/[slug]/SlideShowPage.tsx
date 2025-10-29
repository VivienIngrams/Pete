'use client'

import { useState } from 'react'

import type { Post } from '~/sanity/lib/sanity.queries'

import DesktopSlideShow from './DesktopSlideShow'
import MobileSlideShow from './MobileSlideShow'

type Props = {
  post: Post
}

export default function Slideshow({ post }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <>
      <div className="hidden md:block">
        <DesktopSlideShow
          post={post}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
      <div className="block md:hidden">
        <MobileSlideShow
          post={post}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    </>
  )
}
