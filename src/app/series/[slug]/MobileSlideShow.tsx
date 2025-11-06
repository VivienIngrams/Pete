'use client'

import { PortableText } from '@portabletext/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import { useLanguage } from '~/app/components/context/LanguageProvider'
import LanguageSwitcher from '~/app/components/LanguageSwitcher'
import NavMenu from '~/app/components/NavMenu'
import { urlForImage } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  post: Post
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function MobileSlideShow({
  post,
  currentIndex,
  setCurrentIndex,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const isCommissionsPage = pathname.startsWith('/commissions')
  const { language: activeLang } = useLanguage()

  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // Reset loading when image changes
  useEffect(() => {
    setIsImageLoading(true)
  }, [currentIndex])

  // --- Data memoization ---
  const images = useMemo(() => post.images || [], [post.images])
  const current = useMemo(() => images[currentIndex] || null, [images, currentIndex])

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

  const postExcerptBlocks = useMemo(() => {
    return activeLang === 'en'
      ? post.excerpt_en || post.excerpt
      : post.excerpt || post.excerpt_en
  }, [activeLang, post.excerpt, post.excerpt_en])

  // --- Navigation ---
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  const handleClose = () => {
    if (pathname.startsWith('/series')) {
      router.push('/series#' + post.slug.current)
    } else if (pathname.startsWith('/commissions')) {
      router.push('/commissions#' + post.slug.current)
    } else {
      router.push('/')
    }
  }

  // --- Swipe handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomed) return
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (zoomed) return
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (zoomed) return
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev()
    touchStartX.current = null
    touchEndX.current = null
  }

  // --- Translations ---
  const t = {
    about: activeLang === 'en' ? 'about' : 'à propos',
    close: activeLang === 'en' ? 'close' : 'fermer',
  }

  return (
    <div className="relative w-full min-h-[95vh] max-h-[99vh] !text-black !bg-white mt-12 flex flex-col items-center justify-center">
      <NavMenu
        slideshowMode
        onDropdownToggle={setIsDropdownOpen}
        hideMenu={isAboutOpen}
      />

      {/* Top bar */}
      <div
        className={`fixed top-0 left-0 z-[900] !bg-white flex items-center h-12 p-6 ${
          isDropdownOpen || isAboutOpen ? 'hidden' : 'block'
        }`}
      >
        <button
          onClick={handleClose}
          className="!text-black text-sm tracking-wide uppercase mt-2"
        >
          {t.close}
        </button>
      </div>

      {/* Main content */}
      <div className="min-h-[55vh] flex flex-col justify-between">
        <div>
          {/* Image area with pinch zoom */}
          <div
            ref={imageWrapperRef}
            className="relative w-full px-6 flex items-center justify-center mt-4 touch-pan-x"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full overflow-hidden flex items-center justify-center">
              {isImageLoading && images.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center !bg-white animate-pulse">
                  <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!images.length ? (
                <div className="w-full h-[60vh] flex items-center justify-center text-sm uppercase">
                  No images available
                </div>
              ) : (
                current?.image && (
                  <TransformWrapper
                    initialScale={1}
                    minScale={1}
                    maxScale={4}
                    doubleClick={{ disabled: true }}
                    wheel={{ disabled: true }}
                    pinch={{ step: 0.08 }}
                    onZoomStop={({ state }) => setZoomed(state.scale > 1.05)}
                  >
                    <TransformComponent wrapperClass="flex items-center justify-center">
                      <Image
                        src={urlForImage(current.image).url() || ''}
                        alt={currentTitle || post.title}
                        width={500}
                        height={500}
                        className={`w-auto h-auto object-contain block transition-opacity duration-500 ${
                          isImageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={() => setIsImageLoading(false)}
                        priority={currentIndex === 0}
                        unoptimized
                      />
                    </TransformComponent>
                  </TransformWrapper>
                )
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex w-full justify-between px-3 mt-4 md:hidden">
            <button
              onClick={handlePrev}
              className="rounded-full !bg-white/60 active:!bg-white/90 transition"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="rounded-full !bg-white/60 active:!bg-white/90 transition"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="!bg-white/50 w-full px-6 py-2">
          {currentTitle && <h1 className="text-lg leading-tighter">{currentTitle}</h1>}
          <div
            className={`text-[12px] ${
              !isCommissionsPage && 'min-h-[100px]'
            } font-roboto uppercase mt-[2px] tracking-wide leading-tighter`}
          >
            {currentExcerpt && (
              <PortableText key={`${activeLang}-${post.slug.current}`} value={currentExcerpt} />
            )}
            {postExcerptBlocks && (
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-[12px] uppercase tracking-wide mt-2"
              >
                {t.about}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* About Modal */}
      {isAboutOpen && (
        <div
          className="fixed inset-0 z-[1100] !text-black !bg-white/90 flex items-center justify-center px-4"
          onClick={() => setIsAboutOpen(false)}
        >
          <div
            key={`${activeLang}-${post.slug.current}`}
            className="max-w-2xl w-full max-h-[90vh] overflow-auto p-4 -mt-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAboutOpen(false)}
              className="text-sm text-left fixed top-0 py-4 left-4 right-0 tracking-wide uppercase !bg-white"
            >
              {t.close}
            </button>

            <div className="flex justify-end mt-8">
              <LanguageSwitcher />
            </div>

            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl">{postTitle}</h2>
            </div>

            <div className="text-sm font-roboto text-justify">
              {postExcerptBlocks && postExcerptBlocks.length ? (
                <div key={activeLang}  className="portable-text">
                  <PortableText
                    key={`${activeLang}-${post.slug.current}`}
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
