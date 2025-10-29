'use client'

import Image from 'next/image'
import { useLanguage } from '../components/context/LanguageProvider'

export default function CommissionsBanner() {
  const { language } = useLanguage()

  const captions = {
    en: `Below a smattering of my commissioned work. Although mainly concentrating on personal projects these days, I'm always delighted to work on an interesting project. Contact me at `,
    fr: `Voici un aperçu de mes travaux commandés. Bien que je me concentre principalement sur mes projets personnels ces derniers temps, je suis toujours ravi de travailler sur un projet intéressant. Contactez-moi à `,
  }

  return (
    <div id="series-banner" className="z-20 bg-white dark:bg-black">
      {/* Desktop / common banner */}
      <div className="mt-[8vh] relative h-[8vh] w-[70vw] md:w-[40vw] mx-auto md:flex items-center justify-center">
        {/* Light mode */}
        <Image
          src="/commissions-b.png"
          alt="Commissions"
          fill
          sizes="40vw"
          className="object-contain dark:hidden"
          priority
        />
        {/* Dark mode */}
        <Image
          src="/commissions-w.png"
          alt="Commissions (Dark)"
          fill
          sizes="40vw"
          className="object-contain hidden dark:block"
          priority
        />
      </div>

      <div className="py-2 px-6 md:px-8 flex justify-center font-light font-roboto leading-none tracking-wide text-sm md:text-base 3xl:text-lg text-black dark:text-white">
        <h3 className="text-center md:max-w-[50%]">
          {captions[language]}
          <a
            href="mailto:studiolippmann@gmail.com"
            className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            studiolippmann@gmail.com
          </a>
        </h3>
      </div>
    </div>
  )
}
