'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'

export default function PostSlideshow({ post, language }: { post: Post, language: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!post.images || post.images.length === 0) {
    return <p>No images found.</p>
  }

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    )
  }
console.log(post, language, post.images)
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slideshow images */}
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src={urlForImage(post.images[currentIndex]).url() || ''}
          alt={post.title}
          width={1600}
          height={1200}
          className="max-h-[95vh] w-auto object-contain"
          
        />
      </div>

      {/* Overlay: Title + Excerpt */}
      <div className="absolute bottom-6 left-6 p-4 rounded-xl max-w-lg">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {post.excerpt && (
          <p className="mt-2 text-base ">{post.excerpt[language]}</p>
        )}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2  hover:bg-black/10 p-3 rounded-full"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2  hover:bg-black/10 p-3 rounded-full"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  )
}
