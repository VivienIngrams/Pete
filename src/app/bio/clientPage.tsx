'use client'

import type { PortableTextBlock } from '@portabletext/types'
import { useState } from 'react'
import { useLanguage } from '../components/context/LanguageProvider'
import NavMenu from '../components/NavMenu'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { urlForThumbnail } from '~/sanity/lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
interface BiographyContent {
  title: string
  biographyText: PortableTextBlock[]
}

interface BioData {
  image: any
  biography: {
    personal: { fr: BiographyContent; en: BiographyContent }
    critic: { fr: BiographyContent; en: BiographyContent }
  }
}

export default function BioClient({
  initialBioData,
}: {
  initialBioData: BioData
}) {
  const { language } = useLanguage()
  const [bioData] = useState(initialBioData)

  const personal =
    bioData.biography.personal[language] || bioData.biography.personal.fr
  const critic =
    bioData.biography.critic[language] || bioData.biography.critic.fr

  const renderParagraphs = (blocks: PortableTextBlock[]) =>
    blocks.map((block, index) => {
      if (block._type !== 'block') return null // skip non-text blocks
      const text =
        block.children?.map((child: any) => child.text).join('') || ''
      if (!text.trim()) return null

      return (
        <p
          key={index}
          className="text-lg md:text-xl mb-6 font-light first-letter:text-4xl  first-letter:mr-0"
        >
          {text}
        </p>
      )
    })

  return (
    <div className="bg-white text-black min-h-screen">
      <NavMenu />
      <div className="w-full flex justify-end md:hidden pt-16 pr-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="min-h-screen my-8 md:my-32">
        {/* Personal Section */}
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-3 pt-2">
              <h2 className="-ml-4 text-[18px] uppercase text-center md:text-left font-light sticky top-32">
                {personal.title}
              </h2>
            </div>
            <div className="lg:col-span-9">
              <div className="relative w-full  max-w-[140px] md:max-w-[200px] aspect-[3/4] float-right ml-2 md:ml-6 mt-2 mb-4  mx-auto md:mx-0">
                <Image
                  src={urlForThumbnail(bioData.image)}
                  alt="Artist portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                  priority
                />
              </div>
              {renderParagraphs(personal.biographyText)}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto my-8 pb-8">
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Critic Section */}
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-3 pt-3">
              <h2 className=" -ml-4 text-[18px] uppercase text-center md:text-left font-light sticky top-32">
                {critic.title}
              </h2>
            </div>
            <div className="lg:col-span-9">
              {renderParagraphs(critic.biographyText)}
            </div>
          </div>
        </section>
      </div>
      <div className="hidden md:block">
        <Link
          href="https://peterlippmann.com/studio"
          className="-center m-6 text-sm md:text-base text-gray-400 pb-4"
        >
          studio
        </Link>
      </div>
    </div>
  )
}
