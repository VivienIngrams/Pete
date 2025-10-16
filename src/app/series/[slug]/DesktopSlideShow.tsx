'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '~/sanity/lib/sanity.queries'
import { urlForImage } from '~/sanity/lib/sanity.image'
import { PortableText } from '@portabletext/react'
import LanguageSwitcher from '~/app/components/LanguageSwitcher'
import { useLanguage } from '~/app/components/context/LanguageProvider'

type Props = {
  post: Post
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function DesktopSlideshow({
  post,
  currentIndex,
  setCurrentIndex,
}: Props) {
  const router = useRouter()
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  // Use global language context instead of prop
  const { language: activeLang } = useLanguage()

  const current = post.images?.[currentIndex]
  if (!current) return <p>No images found.</p>

  // Titles and excerpts depend on language
  const postTitle =
    activeLang === 'en' ? post.title_en || post.title : post.title || post.title

  const currentTitle =
    (activeLang === 'en'
      ? current.title_en || current.title_fr
      : current.title_fr || current.title_en) ||
    `${postTitle} ${currentIndex + 1}`

  const currentExcerpt =
    activeLang === 'en'
      ? current.excerpt_en || current.excerpt_fr
      : current.excerpt_fr || current.excerpt_en

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? post.images!.length - 1 : prev - 1))

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1))

  const handleClose = () => {
    if (document.referrer.includes('/series')) {
      router.back()
    } else {
      router.push(`/series#${post.slug.current}`)
    }
  }

  // Dynamic post excerpt (updates instantly when language changes)
  const postExcerptBlocks =
    activeLang === 'en'
      ? post.excerpt_en || post.excerpt
      : post.excerpt || post.excerpt_en

  // Translations for buttons
  const t = {
    about: activeLang === 'en' ? 'about' : 'à propos',
    close: activeLang === 'en' ? 'close' : 'fermer',
  }

  return (
    <div className="relative w-full h-screen bg-[#e3e1de] flex items-center py-10 justify-center hide-scrollbar">
      {/* Placeholder skeleton */}
      {isImageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#eae8dd] animate-pulse">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main image */}
      {current.image && (
        <Image
          src={urlForImage(current.image).url() || ''}
          alt={currentTitle || post.title}
          width={1600}
          height={1200}
          className={`w-auto h-full object-contain transition-opacity duration-500 max-w-[70vw] ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsImageLoading(false)}
          priority
        />
      )}

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute text-base text-black tracking-wide underline underline-offset-2 top-6 left-6 z-50 font-normal hover:font-bold"
      >
        {t.close}
      </button>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 transition-transform duration-200 md:hover:scale-105 p-2 rounded-full z-50 ml-4"
        >
          <ChevronLeft className="w-12 h-12" />
        </button>
      )}
      {currentIndex < post.images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-200 md:hover:scale-105 p-2 rounded-full z-50 mr-4"
        >
          <ChevronRight className="w-12 h-12" />
        </button>
      )}

      {/* Caption + About link */}
      <div className="absolute bottom-6 left-6 max-w-[15vw]">
        {currentTitle && (
          <h1 className="text-xl md:text-2xl font-normal">{currentTitle}</h1>
        )}
        {currentExcerpt && (
          <div className="prose prose-sm md:prose-base mt-3 text-sm font-light font-roboto">
            <PortableText key={activeLang} value={currentExcerpt} />
          </div>
        )}
        <div className="">
          <button
            onClick={() => setIsAboutOpen(true)}
            className="text-base font-normal underline underline-offset-2 rounded-md tracking-wide hover:font-bold"
          >
            {t.about}
          </button>
        </div>
      </div>

      {/* ABOUT MODAL */}
      {isAboutOpen && (
        <div
          className="fixed inset-0 z-50 text-black bg-[#e3e1de]/85 flex items-center justify-center px-4"
          onClick={() => setIsAboutOpen(false)}
        >
          <button
            onClick={() => setIsAboutOpen(false)}
            className="absolute text-base underline underline-offset-2 top-6 left-6 z-50 font-normal hover:font-bold tracking-wide bg-[#e3e1de]"
          >
            {t.close}
          </button>
          <div
            className="relative max-w-2xl w-full max-h-[80vh] overflow-auto hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Live language switcher inside modal */}
            <div className="flex justify-end">
              <LanguageSwitcher />
            </div>

            <h2 className="text-3xl font-normal mb-4">{postTitle}</h2>

            <div className="prose prose-sm md:prose-base text-base font-roboto text-justify mb-6">
              {postExcerptBlocks && postExcerptBlocks.length ? (
                <PortableText key={activeLang} value={postExcerptBlocks} />
              ) : (
                <p>No description available.</p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
