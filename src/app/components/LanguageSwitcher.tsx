'use client'

import { useLanguage } from './context/LanguageProvider'

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage()

  return (
    <div>
      <button
        onClick={toggleLanguage}
        aria-label="Toggle Language"
        className=" z-50 text-sm font-light tracking-wide text-black dark:text-white hover:opacity-80 transition-opacity duration-300"
      >
        {language === 'fr' ? (
          <span>english&nbsp;|&nbsp;<span className="text-gray-600 dark:text-gray-400">français</span></span>
        ) : (
          <span><span className="text-gray-600 dark:text-gray-400">english</span>&nbsp; | &nbsp;français</span>
        )}
      </button>
    </div>
  )
}

export default LanguageSwitcher
