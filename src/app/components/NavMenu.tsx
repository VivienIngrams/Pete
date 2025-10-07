'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { useLanguage } from './context/LanguageProvider'
import LanguageSwitcher from './LanguageSwitcher'
import Socials from './Socials'

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const path = usePathname()
  const isHomePage = path === '/'
  const isSeriesPage = path === '/series'

  const { language } = useLanguage()

  const menuItems = {
    series: {
      en: 'Series',
      fr: 'Séries',
    },
    bio: {
      en: 'About',
      fr: 'Bio',
    },
    commissions: {
      en: 'Commissions',
      fr: 'Commissions',
    },
    contact: {
      en: 'Contact',
      fr: 'Contact',
    },
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="fixed h-screen md:w-[15vw] md:ml-10 md:my-28 z-50 tracking-wider">
      {/* Desktop menu */}
      <div
        className={`w-full flex items-start justify-start  ${isHomePage ? 'hidden' : '2xl:text-lg'}`}
      >
        <div className="flex items-center ">
          <div className="hidden md:block">
            <div className="flex flex-col items-baseline space-y-6">
              <Link href="/series" className="hover:text-gray-500">
                <h1 className="text-3xl my-2">Peter Lippmann</h1>
              </Link>
              {!isSeriesPage && (
                <Link href="/series" className="hover:text-gray-500">
                  {menuItems.series[language] || menuItems.series.en}
                </Link>
              )}
              <Link href="/bio" className="hover:text-gray-500">
                {menuItems.bio[language] || menuItems.bio.en}
              </Link>
              <Link href="/commissions" className="hover:text-gray-500">
                {menuItems.commissions[language] || menuItems.commissions.en}
              </Link>
              <Link href="/contact" className="hover:text-gray-500">
                {menuItems.contact[language] || menuItems.contact.en}
              </Link>
              <Socials />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header (fixed) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#f6f5ee]  z-50">
        <div className="flex items-center justify-between py-4 px-6">
          {/* Site title in mobile header */}
          <Link href="/series">
            <h1 className="text-xl font-semibold">Peter Lippmann</h1>
          </Link>
          {/* Hamburger button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              // X icon
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-[#f6f5ee] pb-8 w-screen`} // push down below header
        id="mobile-menu"
        onClick={toggleMenu}
      >
        <div className="px-6  space-y-3  text-md">
          <Link href="/series" className="block">
            {menuItems.series[language] || menuItems.series.en}
          </Link>
          <Link href="/bio" className="block  ">
            {menuItems.bio[language] || menuItems.bio.en}
          </Link>
          <Link href="/commissions" className="block  ">
            {menuItems.commissions[language] || menuItems.commissions.en}
          </Link>
          <Link href="/contact" className="block  ">
            {menuItems.contact[language] || menuItems.contact.en}
          </Link>
          <Socials />
        </div>
      </div>
    </nav>
  )
}

export default NavMenu
