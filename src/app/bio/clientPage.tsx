'use client'

import type { PortableTextBlock } from "@portabletext/types"
import { useState } from "react"
import { useLanguage } from "../components/context/LanguageProvider"
import NavMenu from "../components/NavMenu"
import LanguageSwitcher from "../components/LanguageSwitcher"

interface BiographyContent {
  title: string
  biographyText: PortableTextBlock[]
}

interface BioData {
  imageUrl: string
  biography: {
    personal: { fr: BiographyContent; en: BiographyContent }
    critic: { fr: BiographyContent; en: BiographyContent }
  }
}

export default function BioClient({ initialBioData }: { initialBioData: BioData }) {
  const { language } = useLanguage()
  const [bioData] = useState(initialBioData)

  const personal = bioData.biography.personal[language] || bioData.biography.personal.fr
  const critic = bioData.biography.critic[language] || bioData.biography.critic.fr

  const renderParagraphs = (blocks: PortableTextBlock[]) =>
    blocks.map((block, index) => {
      const text = block.children?.map((child: any) => child.text).join(" ") || ""
      if (!text.trim()) return null
      const first = index === 0
      return (
        <p
          key={index}
          className={`text-lg md:text-xl leading-relaxed mb-6 font-light text-pretty ${
            first
              ? "first-letter:text-5xl first-letter:font-light first-letter:mr-1 first-letter:float-left first-letter:leading-none first-letter:mt-1"
              : ""
          }`}
        >
          {text}
        </p>
      )
    })

  return (
    <>
      <NavMenu />
      <div className="w-full flex justify-end md:hidden pt-16 pr-6 z-50" >
        <LanguageSwitcher /> 
      </div>

      <div className="min-h-screen my-12 md:my-40">
        {/* Personal Section */}
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-base uppercase text-center md:text-left tracking-widest font-light sticky top-32">
                {personal.title}
              </h2>
            </div>
            <div className="lg:col-span-8">{renderParagraphs(personal.biographyText)}</div>
          </div>
        </section>

        {/* Divider */}
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto my-12 pb-8">
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Critic Section */}
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-base uppercase tracking-widest text-center md:text-left font-light sticky top-32">
                {critic.title}
              </h2>
            </div>
            <div className="lg:col-span-8">{renderParagraphs(critic.biographyText)}</div>
          </div>
        </section>
      </div>
    </>
  )
}
