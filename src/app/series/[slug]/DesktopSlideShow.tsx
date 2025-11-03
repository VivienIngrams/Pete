'use client'

import { PortableText } from '@portabletext/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { usePathname,useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'

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
  const [forceRender, setForceRender] = useState(0)

  const { language: activeLang } = useLanguage()

  useEffect(() => {
    setForceRender(prev => prev + 1)
  }, [activeLang])

  useEffect(() => {
    setIsImageLoading(true)
  }, [currentIndex])

  // Simple preloading of next/prev images only
  useEffect(() => {
    if (!post.images || post.images.length === 0) return
    
    const nextIndex = (currentIndex + 1) % post.images.length
    const prevIndex = (currentIndex - 1 + post.images.length) % post.images.length
    
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

  // --- Memoized titles & excerpts ---
  const postTitle = useMemo(
    () => (activeLang === 'en' ? post.title_en || post.title : post.title),
    [activeLang, post.title, post.title_en],
  )
  const currentTitle = useMemo(() => {
    if (!current) return ''
    return (
      (activeLang === 'en'
        ? current.title_en || current.title_fr
        : current.title_fr || current.title_en) ||
      `${postTitle} ${currentIndex + 1}`
    )
  }, [activeLang, current, currentIndex, postTitle])

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

 const postExcerptBlocks = useMemo(() => {
  return activeLang === 'en'
    ? post.excerpt_en || post.excerpt
    : post.excerpt || post.excerpt_en
}, [activeLang, post])

  const t = {
    about: activeLang === 'en' ? 'about' : 'à propos',
    close: activeLang === 'en' ? 'close' : 'fermer',
  }

  return (
    <div className="relative w-full h-screen text-black dark:text-white bg-white dark:bg-black font-light flex items-center py-10 justify-center hide-scrollbar">
      {/* Loading spinner */}
      {isImageLoading && hasImages && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-black">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Image or fallback */}
      {hasImages ? (
        current?.image && (
          <Image
            src={urlForSlideshow(current.image, 1920)}
            alt={currentTitle || post.title}
            width={1920}
            height={1080}
            sizes="70vw"
            className={`w-auto h-full object-contain transition-opacity duration-300 max-w-[70vw] ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
            priority={currentIndex === 0}
            quality={85}
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
        className="absolute text-sm text-black dark:text-white tracking-wide uppercase top-6 left-6 z-50 hover:font-bold"
      >
        {t.close}
      </button>

      {/* Navigation arrows */}
      {hasImages && post.images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-black hover:bg-black/10 dark:hover:bg-white/10 transition-transform duration-200 md:hover:scale-105 p-2 rounded-full z-50 ml-4"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-12 h-12 text-black dark:text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-black hover:bg-black/10 dark:hover:bg-white/10  transition-transform duration-200 md:hover:scale-105 p-2 rounded-full z-50 mr-4"
            aria-label="Next image"
          >
            <ChevronRight className="w-12 h-12 text-black dark:text-white" />
          </button>
        </>
      )}

      {/* Caption */}
      <div className="absolute bottom-12 left-6">
        {currentTitle && (
          <h1 className="text-lg md:text-xl  max-w-[calc(15vw-24px)]">
            {currentTitle}
          </h1>
        )}
        <div className=" text-sm font-roboto max-w-[calc(15vw-24px)]">
          {currentExcerpt && (
            <PortableText key={`${activeLang}-${forceRender}`} value={currentExcerpt} />
          )}
          {postExcerptBlocks && (
             <button
            onClick={() => setIsAboutOpen(true)}
            className="text-sm uppercase tracking-wide hover:font-bold"
          >
            {t.about}
          </button>
          )}
         
        </div>
      </div>

      {/* About modal */}
      {postExcerptBlocks && isAboutOpen && (
        <div
          className="fixed inset-0 z-50 text-black dark:text-white bg-white/85 dark:bg-black/80 flex items-center justify-center px-4"
          onClick={() => setIsAboutOpen(false)}
        >
          <button
            onClick={() => setIsAboutOpen(false)}
            className="absolute text-base uppercase top-6 left-6 z-50 font-normal hover:font-bold tracking-wide bg-white dark:bg-black"
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

            <div className=" portable-text text-base font-roboto text-justify mb-6">
              {postExcerptBlocks && postExcerptBlocks.length ? (
                <div className='portable-text'>
                  <PortableText  key={activeLang} value={postExcerptBlocks} />
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