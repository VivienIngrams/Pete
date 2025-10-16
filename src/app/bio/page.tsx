import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from '@portabletext/types'
import { cookies } from 'next/headers'
import Image from 'next/image'
import React from 'react'
import { BsChevronDoubleDown } from 'react-icons/bs'

import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import { getBioPage } from '~/sanity/lib/sanity.queries'

import NavMenu from '../components/NavMenu'

interface BiographyContent {
  biographyText: PortableTextBlock[] // Ensure this is an array of PortableTextBlocks
  biographyText2: PortableTextBlock[] // Ensure this is an array of PortableTextBlocks
  artisticTraining: string[]
  organizer: string[]
  exhibitions: string[]
}

interface BioData {
  imageUrl: string
  biography: {
    fr: BiographyContent
    en: BiographyContent
  }
}

const Bio = async () => {
  const client = getClient({ token: readToken })

  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  // Fetch the bio data
  const bioDataArray: BioData[] | null = await getBioPage(client, {
    next: { revalidate: 60 },
  })

  if (!bioDataArray || bioDataArray.length === 0) {
    return <div>Error: Unable to fetch biography data.</div>
  }

  const bioData = bioDataArray[0] // Access the first item in the array
  const { imageUrl, biography } = bioData

  if (!biography) {
    return <div>Error: Biography data is missing.</div>
  }

  const currentContent = {
    biographyText:
      biography[language]?.biographyText || biography['fr'].biographyText,
    biographyText2:
      biography[language]?.biographyText2 || biography['fr'].biographyText2,
    artisticTraining:
      biography[language]?.artisticTraining || biography['fr'].artisticTraining,
    organizer: biography[language]?.organizer || biography['fr'].organizer,
    exhibitions:
      biography[language]?.exhibitions || biography['fr'].exhibitions,
  }

  const titles = {
    artisticTraining:
      language === 'fr' ? 'Formations artistiques' : 'Artistic Training',
    organizer:
      language === 'fr'
        ? 'Organisateur, Animateur, Conférencier'
        : 'Organizer, Animator, Lecturer',
    exhibitions:
      language === 'fr'
        ? 'Expositions et publications'
        : 'Exhibitions and Publications',
  }

  return (
    <>
      <NavMenu />
      <div className="min-h-screen mt-6 xl:mt-24 bg-[#e3e1de]">
      <div className="xl:h-[90%] flex flex-col items-center justify-center mx-6 xl:w-1/3 xl:mx-auto">
        <h1 className="text-2xl xl:text-4xl  w-full text-left font-roboto py-14">
          About
        </h1>
      
      </div>
    </div>
    </>
  )
}

export default Bio
