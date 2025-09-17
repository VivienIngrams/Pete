'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/legacy/image'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { urlForImage } from '~/sanity/lib/sanity.image'

interface HorizontalGalleryProps {
  images: any[]
  title: string
  subtitles?: string[] // Optional subtitles array
}

export function HorizontalScroll({ images, title, subtitles }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const [dimensions, setDimensions] = useState({
    height: 0,
    totalImagesWidth: 0,
  })
  const [isOverlayVisible, setOverlayVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  gsap.registerPlugin(ScrollTrigger)

  // Set dimensions of images based on aspect ratio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const height = window.innerHeight * 0.73
      let totalImagesWidth = 0

      images.forEach((image) => {
        const { aspectRatio } = image
        const imgWidth = height * aspectRatio
        totalImagesWidth += imgWidth
      })

      const totalSpacing = (images.length) * 64
      totalImagesWidth += totalSpacing
      setDimensions({ height, totalImagesWidth })
    }
  }, [images])

  // GSAP scroll logic
  useEffect(() => {
    if (dimensions.totalImagesWidth > 0 && typeof window !== 'undefined') {
      const containerWidth = window.innerWidth * 0.7
      const totalWidth = dimensions.totalImagesWidth - containerWidth

      const pin = gsap.fromTo(
        sectionRef.current,
        { translateX: 0 },
        {
          translateX: `-${totalWidth}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'center center',
            end: `${totalWidth} top`,
            scrub: true,
            pin: true,
          },
        },
      )

      return () => {
        pin.kill()
      }
    }
  }, [dimensions])

  const closeModal = () => {
    setOverlayVisible(false)
    setSelectedImage(null)
  }

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  // Modal rendered via React Portal
  const Modal = () =>
    isOverlayVisible && selectedImage
      ? createPortal(
          <div
            className="fixed top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/80"
            style={{
              isolation: 'isolate',
              backdropFilter: 'blur(5px)',
            }}
            onClick={handleClickOutside}
          >
            <div  onClick={closeModal} className="relative w-auto h-auto max-w-[90vw] max-h-[99vh] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt={title}
                layout="intrinsic"
                width={1200}
                height={800}
                objectFit="contain"
              />
              <button
                className="absolute top-5 -right-12 text-gray-500 rounded-full p-1 px-2 hover:bg-white"
               
              >
                ✕
              </button>
            </div>
          </div>,
          document.body // Render modal at root level
        )
      : null

  return (
    <>
      <Modal />
      <section
        ref={triggerRef}
        className="w-full h-full pt-28 overflow-hidden bg-white pl-[28vw]"
      >
        <div
          ref={sectionRef}
          className="flex pl-2 space-x-16 pb-[75px]"
          style={{ width: `${dimensions.totalImagesWidth}px` }}
        >
          {images.map((image, index) => {
            const { aspectRatio } = image
            const imgWidth = dimensions.height * aspectRatio

            return (
              <div
                key={image._key || index.toString()}
                className="relative flex-shrink-0 cursor-pointer shadow-lg shadow-gray-800"
                style={{
                  width: `${imgWidth}px`,
                  height: `${dimensions.height}px`,
                }}
                onClick={() => {
                  setSelectedImage(urlForImage(image).url() as string)
                  setOverlayVisible(true)
                }}
              >
                <Image
                  src={urlForImage(image).url() as string}
                  alt={title}
                  layout="fill"
                  sizes="100vw"
                  className="mt-24 object-cover"
                />
                {subtitles && subtitles[index] && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white text-center text-xl p-2 ">
                    {subtitles[index]}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default HorizontalScroll
