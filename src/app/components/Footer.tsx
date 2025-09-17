'use client'

import Link from 'next/link'
import NavMenu from './NavMenu'
import Socials from './Socials'
import { useLanguage } from './context/LanguageProvider'

export default function Footer({
  isHomePage,
  isContactPage,
}: {
  isHomePage: boolean
  isContactPage: boolean
}) {
  const { language } = useLanguage()

  // Text translations
  const text = {
    en: 'Website by Vivien Ingrams',
    fr: 'Site web par Vivien Ingrams',
  }

  return (
    <footer
      className={`fixed bottom-0 w-full md:h-8 p-4 pt-4 md:pb-7 flex items-end md:items-center justify-between ${
        isHomePage
          ? 'md:bg-transparent' // Transparent background on the homepage
          : 'bg-white text-gray-500'
      }`}
    >
      {/* Gradient bar */}
      <div
        className={`absolute -top-3 left-0 w-full h-4 ${
          isHomePage
            ? 'md:bg-transparent' // Transparent background on the homepage
            : 'bg-gradient-to-t from-white to-transparent'
        }`}
      ></div>

      {/* Website Link */}
      <div className="relative z-60">
        <Link
          href="https://vivieningrams.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`${
            isContactPage ? 'block' : 'hidden'
          } font-arsenal text-gray-500 hover:text-black tracking-normal leading-loose text-[12px] ml-12 md:ml-2 mb-1`}
        >
          {text[language] || text.en}
        </Link>
      </div>

      <NavMenu />

      {/* Social Icons */}
      <div className="z-50">
        {!isHomePage && (
          <div className="flex items-end mb-2 gap-x-3">
            <div className="flex gap-x-3">
              <Socials />
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
