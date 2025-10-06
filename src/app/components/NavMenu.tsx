'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { useLanguage } from './context/LanguageProvider'
import LanguageSwitcher from './LanguageSwitcher'

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const path = usePathname()
  const isHomePage = path === '/'

  const { language } = useLanguage()

  const menuItems = {
    posts: {
      en: 'Photography',
      fr: 'Photographie',
    },

    bio: {
      en: 'About',
      fr: 'Bio',
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
    <nav className="absolute   h-screen md:w-[18%] md:mx-8 md:my-24 z-50  font-medium tracking-tight">
      {/* Desktop menu */}
      <div
        className={`w-full flex items-start justify-start  ${isHomePage ? 'hidden' : 'xl:text-lg tracking-wide'}`}
      >
        <div className="flex items-center ">
          <div className="hidden md:block">
            <div className="flex flex-col items-baseline space-y-8">
              <Link href="/">
                <h1 className="my-6">Peter Lippmann</h1>
              </Link>
              <Link href="/posts" className="hover:text-gray-500">
                {menuItems.posts[language] || menuItems.posts.en}
              </Link>
              <Link href="/bio" className="hover:text-gray-500">
                {menuItems.bio[language] || menuItems.bio.en}
              </Link>
              <Link href="/contact" className="hover:text-gray-500">
                {menuItems.contact[language] || menuItems.contact.en}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header (fixed) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#edece0]  z-50">
        <div className="flex items-center justify-between p-4">
          {/* Site title in mobile header */}
          <Link href="/">
            <h1 className="text-lg font-semibold">Peter Lippmann</h1>
          </Link>
          {/* Hamburger button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center p-2"
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
                className="h-6 w-6"
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
        className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-[#edece0] mt-16 w-screen`} // push down below header
        id="mobile-menu"
        onClick={toggleMenu}
      >
        <div className="px-4 py-3 space-y-2 text-black text-md">
          <Link href="/posts" className="block px-2 py-1">
            {menuItems.posts[language] || menuItems.posts.en}
          </Link>
          <Link href="/bio" className="block px-2 py-1">
            {menuItems.bio[language] || menuItems.bio.en}
          </Link>
          <Link href="/contact" className="block px-2 py-1">
            {menuItems.contact[language] || menuItems.contact.en}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default NavMenu
