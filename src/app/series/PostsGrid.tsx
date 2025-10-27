'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '~/app/components/context/LanguageProvider'
import { urlForImage } from '~/sanity/lib/sanity.image'
import type { Post } from '~/sanity/lib/sanity.queries'

type Props = {
  posts: Post[]
  language?: string
}

export default function PostsGrid({ posts, language }: Props) {
  const { language: activeLang } = useLanguage()
  const lang = language || activeLang || 'en'

  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({})
 
  gsap.registerPlugin(ScrollTrigger)

  // ---- CONFIG ----
  const IMAGE_SPACING = 48 // px between images
  const HEIGHT_RATIO = 0.5 // proportion of viewport height for image height

  // ---- Set up layout once images known ----
  useEffect(() => {
    const handleResize = () => setReady(false)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return

    const wrapper = wrapperRef.current
    const container = containerRef.current

    // Duplicate posts for looping feel
    const repeated = [...posts, ...posts]

    // Compute horizontal layout width
    const viewportHeight = window.innerHeight
    const imgHeight = viewportHeight * HEIGHT_RATIO
    let totalWidth = IMAGE_SPACING
  

    repeated.forEach((post) => {
      const aspect = post.mainImage.aspectRatio || 1.5
      totalWidth += imgHeight * aspect + IMAGE_SPACING
    })

    // Set container width
    container.style.width = `${totalWidth}px`
    setReady(true)
  }, [posts])

  // ---- GSAP horizontal scroll setup ----
  useEffect(() => {
    if (!ready || !containerRef.current || !wrapperRef.current) return

    const wrapper = wrapperRef.current
    const container = containerRef.current
    const totalScroll = container.scrollWidth - window.innerWidth
    const top = window.innerHeight * 0.4

    const ctx = gsap.context(() => {
      gsap.to(container, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: `top, ${top}`,
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, wrapper)

    return () => ctx.revert()
  }, [ready])

  const repeatedPosts = [...posts, ...posts]

  return (
    
    <section
      ref={wrapperRef}
      className="relative overflow-hidden "
    >
     
      <div
        ref={containerRef}
        className="flex items-center gap-12 max-h-full "
      >
        {repeatedPosts.map((post, index) => {
          const postKey = `${post._id}-${index}` // unique key per instance
          const title =
            lang === 'en'
              ? post.title_en || post.title || ''
              : post.title || post.title_en || ''
          const aspect = post.mainImage.aspectRatio || 1.5
         
                    const isLoaded = loadedMap[postKey]

          return (
            <Link
              key={`${post._id}-${index}`}
              href={`/series/${post.slug.current}`}
            className="relative flex-shrink-0 group h-[50vh]"
              style={{ width: `${aspect * 50}vh` }}
            >
              <div className="relative w-full h-full transform-gpu">
                <Image
                  src={urlForImage(post.mainImage).url() as string}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="35vw"
                  priority={index < 3}
                />
              </div>

              {isLoaded && (
                <div className="w-full h-[50px] px-4 transition-opacity duration-300">
                  <h3 className="text-black font-light text-xl text-center">
                    <span className="group-hover:hidden">{title}</span>
                    <span className="hidden group-hover:inline underline underline-offset-2 font-normal text-lg tracking-tight">
                      View series
                    </span>
                  </h3>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

// export function HorizontalScroll({ images, title, subtitles }: HorizontalGalleryProps) {
//   const sectionRef = useRef<HTMLDivElement | null>(null)
//   const triggerRef = useRef<HTMLDivElement | null>(null)
//   const [dimensions, setDimensions] = useState({
//     height: 0,
//     totalImagesWidth: 0,
//   })
//   const [isOverlayVisible, setOverlayVisible] = useState(false)
//   const [selectedImage, setSelectedImage] = useState<string | null>(null)

//   gsap.registerPlugin(ScrollTrigger)

//   // Set dimensions of images based on aspect ratio
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const height = window.innerHeight * 0.73
//       let totalImagesWidth = 0

//       images.forEach((image) => {
//         const { aspectRatio } = image
//         const imgWidth = height * aspectRatio
//         totalImagesWidth += imgWidth
//       })

//       const totalSpacing = (images.length) * 64
//       totalImagesWidth += totalSpacing
//       setDimensions({ height, totalImagesWidth })
//     }
//   }, [images])

//   // GSAP scroll logic
//   useEffect(() => {
//     if (dimensions.totalImagesWidth > 0 && typeof window !== 'undefined') {
//       const containerWidth = window.innerWidth * 0.7
//       const totalWidth = dimensions.totalImagesWidth - containerWidth

//       const pin = gsap.fromTo(
//         sectionRef.current,
//         { translateX: 0 },
//         {
//           translateX: `-${totalWidth}px`,
//           ease: 'none',
//           scrollTrigger: {
//             trigger: triggerRef.current,
//             start: 'center center',
//             end: `${totalWidth} top`,
//             scrub: true,
//             pin: true,
//           },
//         },
//       )

//       return () => {
//         pin.kill()
//       }
//     }
//   }, [dimensions])



//   return (
//     <>
//       
//       <section
//         ref={triggerRef}
//         className="w-full h-full pt-28 overflow-hidden bg-white pl-[28vw]"
//       >
//         <div
//           ref={sectionRef}
//           className="flex pl-2 space-x-16 pb-[75px]"
//           style={{ width: `${dimensions.totalImagesWidth}px` }}
//         >
//           {images.map((image, index) => {
//             const { aspectRatio } = image
//             const imgWidth = dimensions.height * aspectRatio

//             return (
//               
//           })}
//         </div>
//       </section>
//     </>
//   )
// }

// export default HorizontalScroll