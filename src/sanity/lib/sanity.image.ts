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
    .auto('format')
    .quality(85)
    .fit('max')
}

// Optimized for grid/thumbnail images - smaller and faster
export const urlForThumbnail = (source: Image, width: number = 600) => {
  return imageBuilder
    .image(source)
    .width(width)
    .auto('format')
    .quality(75)
    .fit('max')
    .url()
}

// Optimized for full-screen slideshow images
export const urlForSlideshow = (source: Image, width: number = 1920) => {
  return imageBuilder
    .image(source)
    .width(width)
    .auto('format')
    .quality(85)
    .fit('max')
    .url()
}