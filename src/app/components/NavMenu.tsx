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
    series: { en: 'Series', fr: 'Séries' },
    bio: { en: 'About', fr: 'About' },
    commissions: { en: 'Commissions', fr: 'Commissions' },
    contact: { en: 'Contact', fr: 'Contact' },
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="fixed h-screen md:w-[10vw] md:ml-10 z-50 tracking-wider font-genos">
    {/* Desktop menu */}
    <div
      className={`w-full flex items-start justify-start  ${isHomePage ? 'hidden' : '2xl:text-lg'}`}
    >
      <div className="flex items-start ">
        <div className="hidden md:block">
          <div className="flex flex-col items-baseline space-y-6">
            <Link href="/series" className="hover:text-gray-500">
              <h1 className="text-3xl mb-2 max-w-12 leading-none">Peter Lippmann</h1>
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
            <Link href="/" className="hover:text-gray-500 font-semibold">
            Subscribe
          </Link>
        {/* Right: Socials */}
        <div className="flex items-center space-x-4">
          <Socials />
        </div>
        </div>

      </div>
      </div>
      {/* Mobile header (unchanged) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#f6f5ee] z-50">
        <div className="flex items-center justify-between py-4 px-6">
          <Link href="/series">
            <h1 className="text-xl tracking-widest font-semibold">Peter Lippmann</h1>
          </Link>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
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
        className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-[#f6f5ee] py-6 w-screen`}
        id="mobile-menu"
        onClick={toggleMenu}
      >
        <div className="px-6 space-y-3 text-md">
          <Link href="/series" className="block">
            {menuItems.series[language] || menuItems.series.en}
          </Link>
          <Link href="/bio" className="block">
            {menuItems.bio[language] || menuItems.bio.en}
          </Link>
          <Link href="/commissions" className="block">
            {menuItems.commissions[language] || menuItems.commissions.en}
          </Link>
          <Link href="/contact" className="block">
            {menuItems.contact[language] || menuItems.contact.en}
          </Link>
          <Link href="/" className="block font-semibold">
            Subscribe
          </Link>
          <Socials />
        </div>
      </div>
      </div>
    </nav>
  )
}

export default NavMenu
