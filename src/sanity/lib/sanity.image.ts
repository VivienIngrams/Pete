import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '~/sanity/lib/sanity.api'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

// Base image URL builder with optimizations
export const urlForImage = (source: Image) => {
  return imageBuilder
    .image(source)
    .auto('format') // Automatically serve WebP/AVIF when supported
    .quality(85) // Good balance for photography
    .fit('max') // Preserve aspect ratio
}

// Optimized for grid/thumbnail images
export const urlForThumbnail = (source: Image, width: number = 800) => {
  return imageBuilder
    .image(source)
    .auto('format')
    .quality(85) // Slightly lower quality for thumbnails is fine
    .url()
}

// Optimized for full-screen slideshow images
export const urlForSlideshow = (source: Image, width: number = 1920) => {
  return imageBuilder
    .image(source)
    .width(width)
    .auto('format')
    .quality(90) // Higher quality for full-screen
    .fit('max')
    .url()
}

// Generate responsive image srcset
export const getResponsiveSrcSet = (
  source: Image,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048],
) => {
  return widths
    .map((width) => {
      const url = imageBuilder
        .image(source)
        .width(width)
        .auto('format')
        .quality(85)
        .fit('max')
        .url()
      return `${url} ${width}w`
    })
    .join(', ')
}

// Generate blur placeholder (Low Quality Image Placeholder)
export const getBlurDataURL = (source: Image) => {
  return imageBuilder
    .image(source)
    .width(20)
    .height(20)
    .blur(10)
    .quality(30)
    .auto('format')
    .url()
}

// All-in-one helper for Next.js Image component
export const getImageProps = (
  source: Image,
  options?: {
    width?: number
    aspectRatio?: number
    priority?: boolean
  },
) => {
  const width = options?.width || 1920
  const aspectRatio = options?.aspectRatio || 1.5

  return {
    src: urlForSlideshow(source, width),
    blurDataURL: getBlurDataURL(source),
    width,
    height: Math.round(width / aspectRatio),
    placeholder: 'blur' as const,
  }
}
