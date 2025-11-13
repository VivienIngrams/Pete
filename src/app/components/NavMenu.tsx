'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { useLanguage } from './context/LanguageProvider'
import LanguageSwitcher from './LanguageSwitcher'
import Socials from './Socials'
import SubscribeModal from './SubscribeModal'

interface NavMenuProps {
  slideshowMode?: boolean
  onDropdownToggle?: (isOpen: boolean) => void
  hideMenu?: boolean
}

const NavMenu = ({
  slideshowMode = false,
  onDropdownToggle,
  hideMenu = false,
}: NavMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)

  const path = usePathname()
  const isHomePage = path === '/'

  const { language } = useLanguage()

  const menuItems = {
    series: { en: 'Series', fr: 'Séries' },
    bio: { en: 'About', fr: 'Bio' },
    commissions: { en: 'Commissions', fr: 'Commissions' },
    contact: { en: 'Contact', fr: 'Contact' },
  }

  const toggleMenu = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    if (onDropdownToggle) {
      onDropdownToggle(newIsOpen)
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 font-roboto tracking-wide">
      {/* Desktop menu */}
      <div
        className={`hidden md:flex items-center justify-between md:px-[3vw]  pt-[4vh] !bg-white dark:!bg-white !text-black dark:!text-black ${
          isHomePage ? 'hidden' : ''
        }`}
      >
        {/* Left: Logo / Title */}
        <Link
          href="/"
          className="hover:text-gray-500 dark:hover:text-gray-300  text-2xl xl:text-3xl pb-1 font-light transition  tracking-widest"
        >
          Peter Lippmann
        </Link>

        {/* Center: Menu items */}
        <div className="flex items-center space-x-6 text-base font-light">
          <Link
            href="/series"
            className={`block ${isHomePage ? 'hidden' : ''}`}
          >
            {menuItems.series[language] || menuItems.bio.en}
          </Link>
          <Link
            href="/bio"
            className="hover:text-gray-500 dark:hover:text-gray-300 "
          >
            {menuItems.bio[language] || menuItems.bio.en}
          </Link>
          <Link
            href="/commissions"
            className="hover:text-gray-500 dark:hover:text-gray-300 "
          >
            {menuItems.commissions[language] || menuItems.commissions.en}
          </Link>
          <Link href="/contact" className="hover:text-gray-500 dark:hover:text-gray-300 ">
            {menuItems.contact[language] || menuItems.contact.en}
          </Link>

          <button
            onClick={() => setIsSubscribeOpen(true)}
            className="hover:text-gray-500 dark:hover:text-gray-300 "
          >
            Subscribe
          </button>
          {/* <Link href="mailto:studiolippmann@gmail.com" className="block">
            studiolippmann@gmail.com
          </Link> */}
          {/* Right: Socials + Language */}
          <div className="flex items-center space-x-6">
            <Socials />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full !bg-white dark:!bg-white ${slideshowMode ? 'z-[1002]' : 'z-50'} ${hideMenu ? 'hidden' : ''}`}
      >
        <div className="flex items-center justify-between py-4 px-4 h-14">
          {!slideshowMode && (
            <Link
              href="/"
              className="!text-black dark:!text-black text-2xl sm:text-3xl tracking-widest transition font-light"
            >
              Peter Lippmann
            </Link>
          )}

          {slideshowMode && <div></div>}

          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center !text-black dark:!text-black"
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
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:hidden !bg-white dark:!bg-white !text-black dark:!text-black pb-4 w-screen ${slideshowMode ? 'z-[1003] pt-4 mb-12' : 'py-16 z-40'}`}
        id="mobile-menu"
        onClick={toggleMenu}
      >
        <div className="px-6 space-y-4 text-base">
          {slideshowMode && (
            <Link
              href="/"
              className={`!text-black dark:!text-black text-2xl sm:text-3xl tracking-widest transition font-light z-1010 pt-12 ${slideshowMode ? 'z-[1010] block' : 'hidden'}`}
            >
              Peter Lippmann
            </Link>
          )}
          <Link href="/series" className="block">
            {menuItems.series[language] || menuItems.bio.en}
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

          <button
            onClick={() => setIsSubscribeOpen(true)}
            className="hover:text-gray-500 dark:hover:text-gray-300 "
          >
            Subscribe
          </button>

          <Socials />
          {/* <Link href="mailto:studiolippmann@gmail.com" className="block">
            studiolippmann@gmail.com
          </Link> */}
          {/* Language Switcher (mobile) */}
          <div onClick={(e) => e.stopPropagation()}>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Subscribe Modal */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />
    </nav>
  )
}

export default NavMenu
