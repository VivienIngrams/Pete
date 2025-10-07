'use client'

import Image from 'next/image'
import Link from 'next/link'


import { urlForImage } from '~/sanity/lib/sanity.image'

interface ImageGalleryProps {
  images: any[]

  slug: string
  title: string
}

const ImageGallery = ({ images, slug, title }: ImageGalleryProps) => {
  return (
    <div className="mx-auto max-w-full">
      {/* Title Section with custom middle line */}
      <div className=" mt-24 mx-auto relative">
        <Link href={`/series/${slug}`}>
          <div className="relative text-center ">
            {/* White Line Spanning Full Width */}
            <span className="absolute left-0 right-0 bottom-1/2 transform translate-y-2px bg-gray-400  h-[1px] z-5"></span>

            {/* Title with Grey Background covering only text width */}
            <h1 className="text-gray-500 hover: upper  font-light text-3xl lg:text-4xl inline-block relative z-11 px-1 my-4 bg-[#f6f5ee]">
              {title}
            </h1>
          </div>
        </Link>
      </div>
      {/* Image Gallery */}
      <div className="flex justify-center space-x-28 mb-4 max-w-full">
        {images.map((image, index) => (
          <Link key={index} href={`/series/${slug}`}>
            <div>
              <Image
                src={urlForImage(image).url() as string}
                alt={image.alt || title}
                fill
                sizes="90vw"
                className="object-cover shadow-md shadow-gray-800 "
                loading="lazy"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
