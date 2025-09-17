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
      en: 'Galleries',
      fr: 'Galeries',
    },
    videos: {
      en: 'Videos',
      fr: 'Vidéos',
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
    <nav className="absolute md:w-[80%] md:ml-[10%] z-50 text-black font-medium tracking-tight">
      <div
        className={`w-full flex items-start justify-start md:justify-center ${isHomePage ? 'hidden' : 'xl:text-lg tracking-wide'}`}
      >
        <div className="flex items-center md:-ml-12">
          <div className="hidden md:block">
            <div className="flex items-baseline">
              <Link href="/posts" className="hover:text-gray-500 px-3">
                {menuItems.posts[language] || menuItems.posts.en}
              </Link>
              <Link href="/videos" className="hover:text-gray-500 px-3">
                {menuItems.videos[language] || menuItems.videos.en}
              </Link>
              <Link href="/bio" className="hover:text-gray-500 px-3">
                {menuItems.bio[language] || menuItems.bio.en}
              </Link>
              <Link href="/contact" className="hover:text-gray-500 px-3">
                {menuItems.contact[language] || menuItems.contact.en}
              </Link>
            </div>
          </div>
        </div>

        <div className="-mr-2 flex md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <svg
                className="block h-6 w-6 mt-24 -mb-24 -ml-4"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 5L4.99998 19M5.00001 5L19 19"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-16 w-16 -m-4"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="184px"
                height="184px"
                viewBox="0 0 100.00 100.00"
                enableBackground="new 0 0 100 100"
                xmlSpace="preserve"
                fill="#9ca3af"
                stroke="#9ca3af"
              >
                <path
                  fill="white"
                  stroke="#9ca3af"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M33.791,33.604c4.528-4.528,10.462-6.791,16.396-6.791c5.934,0,11.868,2.264,16.396,6.791c4.527,4.527,6.79,10.459,6.791,16.392 c0.001,5.936-2.263,11.872-6.791,16.4c-9.055,9.055-23.737,9.055-32.792,0S24.736,42.659,33.791,33.604z"
                ></path>
                <line
                  fill="white"
                  stroke="#9ca3af"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  x1="58.187"
                  y1="50"
                  x2="42.187"
                  y2="50"
                ></line>
                <line
                  fill="white"
                  stroke="#9ca3af"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  x1="58.187"
                  y1="42"
                  x2="42.187"
                  y2="42"
                ></line>
                <line
                  fill="white"
                  stroke="#9ca3af"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  x1="58.187"
                  y1="58"
                  x2="42.187"
                  y2="58"
                ></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={`${
          isOpen ? 'block bg-gradient-to-b from-transparent via-white to-white w-screen pt-24 -ml-4' : 'hidden'
        } md:hidden`}
        id="mobile-menu"
        onClick={toggleMenu}
      >
        <div className="text-black px-2 pt-2 pb-3 space-y-1 text-md sm:px-3">
          <Link href="/posts" className="block px-3 py-1">
            {menuItems.posts[language] || menuItems.posts.en}
          </Link>
          <Link href="/videos" className="block px-3 py-1">
            {menuItems.videos[language] || menuItems.videos.en}
          </Link>
          <Link href="/bio" className="block px-3 py-1">
            {menuItems.bio[language] || menuItems.bio.en}
          </Link>
          <Link href="/contact" className="block px-3 py-1">
            {menuItems.contact[language] || menuItems.contact.en}
          </Link>
          <div className="px-3">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavMenu
