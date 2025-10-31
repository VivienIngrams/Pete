import type { PortableTextBlock } from "@portabletext/types"
import { cookies } from "next/headers"

import { readToken } from "~/sanity/lib/sanity.api"
import { getClient } from "~/sanity/lib/sanity.client"
import { getBioPage } from "~/sanity/lib/sanity.queries"

import NavMenu from "../components/NavMenu"

interface BiographyContent {
  title: string
  biographyText: PortableTextBlock[]
}

interface BioData {
  imageUrl: string
  biography: {
    personal: {
      fr: BiographyContent
      en: BiographyContent
    }
    critic: {
      fr: BiographyContent
      en: BiographyContent
    }
  }
}

const Bio = async () => {
  const client = getClient({ token: readToken })

  const cookieStore = await cookies()
  const language = (cookieStore.get("language")?.value || "fr") as "fr" | "en"

  const bioDataArray: BioData[] | null = await getBioPage(client, {
    next: { revalidate: 60 },
  })

  if (!bioDataArray || bioDataArray.length === 0) {
    return <div>Error: Unable to fetch biography data.</div>
  }

  const bioData = bioDataArray[0]
  const { imageUrl, biography } = bioData

  if (!biography) {
    return <div>Error: Biography data is missing.</div>
  }

  const personalContent = biography.personal[language] || biography.personal.fr
  const criticContent = biography.critic[language] || biography.critic.fr

  const renderPortableText = (blocks: PortableTextBlock[]) => {
    return blocks.map((block, index) => {
      const text = block.children?.map((child: any) => child.text).join(" ") || ""
      if (!text.trim()) return null
      return (
        <p key={index} className="text-lg md:text-xl leading-relaxed mb-6 font-light text-pretty">
          {text}
        </p>
      )
    })
  }

  return (
    <>
      <NavMenu />
      <div className="min-h-screen my-24 md:my-40">
        

        {/* Personal Statement Section */}
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-base uppercase text-center md:text-left tracking-widest font-light sticky top-32">
                {personalContent.title}
              </h2>
            </div>
            <div className="lg:col-span-8 ">
              <div className="max-w-none ">
              {personalContent.biographyText.map((block, index) => {
                  const text = block.children?.map((child: any) => child.text).join(" ") || ""
                  if (!text.trim()) return null
                  return (
                    <p
                      key={index}
                      className={`text-lg md:text-xl leading-relaxed mb-6 font-light text-pretty ${
                        index === 0
                          ? "first-letter:text-5xl first-letter:font-light first-letter:mr-1 first-letter:float-left first-letter:leading-none first-letter:mt-1"
                          : ""
                      }`}
                    >
                      {text}
                    </p>
                  )
                })}</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto my-12 pb-8">
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Art Critic Section */}
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-base uppercase tracking-widest text-center md:text-left font-light sticky top-32">
                {criticContent.title}
              </h2>
            </div>
            <div className="lg:col-span-8 ">
              <div className="max-w-none ">
                {criticContent.biographyText.map((block, index) => {
                  const text = block.children?.map((child: any) => child.text).join(" ") || ""
                  if (!text.trim()) return null
                  return (
                    <p
                      key={index}
                      className={`text-lg md:text-xl leading-relaxed mb-6 font-light text-pretty ${
                        index === 0
                          ? "first-letter:text-5xl first-letter:font-light first-letter:mr-1 first-letter:float-left first-letter:leading-none first-letter:mt-1"
                          : ""
                      }`}
                    >
                      {text}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Bio
