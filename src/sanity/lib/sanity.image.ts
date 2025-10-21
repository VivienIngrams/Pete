import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '~/sanity/lib/sanity.api'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: Image) => {
  return imageBuilder.image(source)
    .auto('format') // Automatically serve WebP/AVIF when browser supports it
    .quality(85) // Good balance between quality and file size for photography
    .fit('max') // Preserve aspect ratio
}

export const urlForImageWithSizes = (source: Image, width: number) => {
  return imageBuilder.image(source)
    .auto('format')
    .quality(85)
    .width(width)
    .fit('max')
    .url()
}
