'use client'

import { PortableText } from '@portabletext/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import LanguageSwitcher from '~/app/components/LanguageSwitcher'
import { urlForSlideshow } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  post: Post
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function DesktopSlideShow({
  post,
  currentIndex,
  setCurrentIndex,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)


  const { language: activeLang } = useLanguage()

  useEffect(() => {
    setIsImageLoading(true)
  }, [currentIndex])

  // Simple preloading of next/prev images only
  useEffect(() => {
    if (!post.images || post.images.length === 0) return

    const nextIndex = (currentIndex + 1) % post.images.length
    const prevIndex =
      (currentIndex - 1 + post.images.length) % post.images.length

    const preloadImage = (index: number) => {
      const img = post.images[index]
      if (img?.image) {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.as = 'image'
        link.href = urlForSlideshow(img.image, 1920)
        document.head.appendChild(link)
      }
    }

    preloadImage(nextIndex)
    preloadImage(prevIndex)
  }, [currentIndex, post.images])

  const hasImages = post.images && post.images.length > 0
  const current = hasImages ? post.images[currentIndex] : null
  const aspectRatio =
    current?.image?.asset?.metadata?.dimensions?.aspectRatio || 1
  let titleWidthClass = 'max-w-none' // default for portraits or undefined

  if (aspectRatio >= 1 && aspectRatio < 1.7) {
    titleWidthClass = 'max-w-[20vw]' // moderate landscape
  } else if (aspectRatio >= 1.7) {
    titleWidthClass = 'max-w-[calc(15vw-24px)]' // very wide landscape
  }

  const postExcerptBlocks =
    activeLang === 'en'
      ? post.excerpt_en || post.excerpt
      : post.excerpt || post.excerpt_en

  const postTitleLang =
    activeLang === 'en'
      ? post.title_en || post.title
      : post.title || post.title_en

  const currentTitleLang = current
    ? activeLang === 'en'
      ? current.title_en || current.title_fr
      : current.title_fr || current.title_en
    : `${postTitleLang} ${currentIndex + 1}`

  const currentExcerpt = useMemo(() => {
    if (!current) return null
    return activeLang === 'en'
      ? current.excerpt_en || current.excerpt_fr
      : current.excerpt_fr || current.excerpt_en
  }, [activeLang, current])

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? post.images!.length - 1 : prev - 1))

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === post.images!.length - 1 ? 0 : prev + 1))

  const handleClose = () => {
    if (pathname.startsWith('/series')) {
      router.push('/series#' + post.slug.current)
    } else if (pathname.startsWith('/commissions')) {
      router.push('/commissions#' + post.slug.current)
    } else {
      router.push('/')
    }
  }

  const t = {
    about: activeLang === 'en' ? 'about' : 'à propos',
    close: activeLang === 'en' ? 'close' : 'fermer',
  }

  return (
    <div className="relative w-full h-screen !text-black dark:!text-black !bg-white dark:!bg-white font-light flex items-center py-10 justify-center hide-scrollbar">
      {/* Loading spinner */}
      {isImageLoading && hasImages && (
        <div className="absolute inset-0 flex items-center justify-center !bg-white dark:!bg-white">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Image or fallback */}
      {hasImages ? (
        current?.image && (
          <Image
            src={urlForSlideshow(current.image, 1920)}
            alt={currentTitleLang || post.title}
            width={1920}
            height={1080}
            sizes="70vw"
            className={`w-auto h-full object-contain transition-opacity duration-300   max-w-[70vw] ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
            priority={currentIndex === 0}
            quality={85}
            unoptimized
          />
        )
      ) : (
        <div className="w-full h-[80vh] flex items-center justify-center text-sm uppercase tracking-wide">
          No images available
        </div>
      )}

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute text-sm !text-black dark:!text-black tracking-wide uppercase top-6 left-6 z-50 hover:font-bold"
      >
        {t.close}
      </button>

      {/* Navigation arrows */}
      {hasImages && post.images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 !bg-white dark:!bg-white hover:!bg-white/10 dark:hover:!bg-white/10 transition-transform duration-200 md:hover:scale-105 p-2 rounded-full z-50 ml-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-12 h-12 !text-black dark:!text-black" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 !bg-white dark:!bg-white hover:!bg-white/10 dark:hover:!bg-white/10  transition-transform duration-200 md:hover:scale-105 p-2 rounded-full z-50 mr-2"
            aria-label="Next image"
          >
            <ChevronRight className="w-12 h-12 !text-black dark:!text-black" />
          </button>
        </>
      )}

      {/* Caption */}
      <div className="absolute bottom-12 left-6">
        {currentTitleLang && (
          <h1
            className={`md:text-lg font-light tracking-tight  ${titleWidthClass}`}
          >
            {currentTitleLang.split(' - ').map((part, index) => (
              <span key={index} className="block leading-tighter">
                {part}
              </span>
            ))}
          </h1>
        )}

        <div className=" uppercase md:text-sm tracking-wide  max-w-[calc(15vw-24px)]">
          {currentExcerpt && (
            <div className="mt-1 mb-2 leading-tighter">
              <PortableText
                 key={`${activeLang}-${post.slug.current}`}
                value={currentExcerpt}
              />
            </div>
          )}

          {postExcerptBlocks && (
            <button
              onClick={() => setIsAboutOpen(true)}
              className="block md:text-sm tracking-wide uppercase hover:font-semibold transition-all"
            >
              {t.about}
            </button>
          )}
        </div>
      </div>

      {/* About modal */}
      {postExcerptBlocks && isAboutOpen && (
        <div
          className="fixed inset-0 z-50 !text-black dark:!text-black !bg-white/85 dark:!bg-white/80 flex items-center justify-center px-4"
          onClick={() => setIsAboutOpen(false)}
        >
          <button
            onClick={() => setIsAboutOpen(false)}
            className="absolute text-base uppercase top-6 left-6 z-50 font-normal hover:font-bold tracking-wide !bg-white dark:!bg-white"
          >
            {t.close}
          </button>
          <div
            key={`${activeLang}-${post.slug.current}`} // 👈 this forces full remount
            className="relative max-w-2xl w-full max-h-[80vh] overflow-auto hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <LanguageSwitcher />
            </div>

            <h2 className="text-3xl font-normal mb-4">{postTitleLang}</h2>

            <div className="portable-text text-base text-justify mb-6">
              {postExcerptBlocks && postExcerptBlocks.length ? (
                <div key={activeLang}  className="portable-text">
                  <PortableText
                    key={`${activeLang}-${post.slug.current}`} // 👈 ensure this key changes on switch
                    value={postExcerptBlocks}
                  />
                </div>
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
