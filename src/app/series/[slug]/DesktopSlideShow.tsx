'use client'

import { PortableText } from '@portabletext/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import LanguageSwitcher from '~/app/components/LanguageSwitcher'
import { urlForImage } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

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
  const [forceRender, setForceRender] = useState(0)

  const { language: activeLang } = useLanguage()

  useEffect(() => {
    setForceRender(prev => prev + 1)
  }, [activeLang])

  useEffect(() => {
    setIsImageLoading(true)
  }, [currentIndex])

  // Preload next and previous images for smoother transitions
  useEffect(() => {
    if (!post.images || post.images.length === 0) return
    const nextIndex = currentIndex < post.images.length - 1 ? currentIndex + 1 : 0
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : post.images.length - 1

    const preloadImage = (index: number) => {
      const img = post.images[index]
      if (img?.image) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = urlForImage(img.image).width(1920).quality(85).url()
        document.head.appendChild(link)
      }
    }

    preloadImage(nextIndex)
    preloadImage(prevIndex)
  }, [currentIndex, post.images])

  const hasImages = post.images && post.images.length > 0
  const current = hasImages ? post.images[currentIndex] : null

  const postTitle =
    activeLang === 'en' ? post.title_en || post.title : post.title || post.title

  const currentTitle =
    (activeLang === 'en'
      ? current?.title_en || current?.title_fr
      : current?.title_fr || current?.title_en) ||
    (hasImages ? `${postTitle} ${currentIndex + 1}` : postTitle)

  const currentExcerpt =
    activeLang === 'en'
      ? current?.excerpt_en || current?.excerpt_fr
      : current?.excerpt_fr || current?.excerpt_en

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? post.images!.length - 1 : prev - 1))

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === post.images!.length - 1 ? 0 : prev + 1))

const pathname = usePathname()
  // --- Close handler ---
  const handleClose = () => {
  if (pathname.startsWith('/series')) {
    router.push('/series#' + post.slug.current)
  } else if (pathname.startsWith('/commissions')) {
    router.push('/commissions#' + post.slug.current)
  } else {
    router.push('/') // fallback
  }
}

  const postExcerptBlocks =
    activeLang === 'en'
      ? post.excerpt_en || post.excerpt
      : post.excerpt || post.excerpt_en

  const t = {
    about: activeLang === 'en' ? 'about' : 'à propos',
    close: activeLang === 'en' ? 'close' : 'fermer',
  }

  return (
    <div className="relative w-full h-screen bg-white font-light flex items-center py-10 justify-center hide-scrollbar">
      {/* Loading spinner */}
      {isImageLoading && hasImages && (
        <div className="absolute inset-0 flex items-center justify-center bg-white animate-pulse">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Image or fallback */}
      {hasImages ? (
        current?.image && (
          <Image
            src={urlForImage(current.image).width(1920).quality(85).auto('format').url()}
            alt={currentTitle || post.title}
            width={1920}
            height={1080}
            sizes="(max-width: 768px) 100vw, 70vw"
            className={`w-auto h-full object-contain transition-opacity duration-500 max-w-[70vw] ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
            priority
            quality={85}
          />
        )
      ) : (
        <div className="w-full h-[80vh] flex items-center justify-center  text-sm uppercase tracking-wide">
          No images available
        </div>
      )}

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute text-sm text-black tracking-wide uppercase top-6 left-6 z-50 hover:font-bold"
      >
        {t.close}
      </button>

      {/* Navigation arrows (only show if multiple images) */}
      {hasImages && post.images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 transition-transform duration-200 md:hover:scale-105 p-2 rounded-full z-50 ml-4"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-200 md:hover:scale-105 p-2 rounded-full z-50 mr-4"
          >
            <ChevronRight className="w-12 h-12" />
          </button>
        </>
      )}

      {/* Caption */}
      <div className="absolute bottom-12 left-6">
        {currentTitle && (
          <h1 className="text-xl md:text-2xl font-normal max-w-[calc(15vw-24px)]">
            {currentTitle}
          </h1>
        )}
        <div className="prose prose-sm md:prose-base text-sm font-roboto max-w-[calc(15vw-24px)]">
          {currentExcerpt && (
            <PortableText key={`${activeLang}-${forceRender}`} value={currentExcerpt} />
          )}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="text-sm uppercase tracking-wide hover:font-bold"
          >
            {t.about}
          </button>
        </div>
      </div>

      {/* About modal */}
      {isAboutOpen && (
        <div
          className="fixed inset-0 z-50 text-black bg-white/85 flex items-center justify-center px-4"
          onClick={() => setIsAboutOpen(false)}
        >
          <button
            onClick={() => setIsAboutOpen(false)}
            className="absolute text-base uppercase top-6 left-6 z-50 font-normal hover:font-bold tracking-wide bg-white"
          >
            {t.close}
          </button>
          <div
            className="relative max-w-2xl w-full max-h-[80vh] overflow-auto hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <LanguageSwitcher />
            </div>

            <h2 className="text-3xl font-normal mb-4">{postTitle}</h2>

            <div className="prose prose-sm md:prose-base  text-base font-roboto text-justify mb-6">
              {postExcerptBlocks && postExcerptBlocks.length ? (
                <div className='portable-text'>
                <PortableText key={`${activeLang}-${forceRender}`} value={postExcerptBlocks} />
              </div>) : (
                <p>No description available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
