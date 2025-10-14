'use client'

import { useLanguage } from './context/LanguageProvider'

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage()

  return (
    <div>
      <button
        onClick={toggleLanguage}
        aria-label="Toggle Language"
        className="md:ml-2 z-50 text-sm font-light tracking-wide text-black hover:opacity-70 transition-opacity duration-300"
      >
        {language === 'fr' ? (
          <span>en&nbsp;|&nbsp;<span className="text-gray-600">fr</span></span>
        ) : (
          <span><span className="text-gray-600">en</span>&nbsp;|&nbsp;fr</span>
        )}
      </button>
    </div>
  )
}

export default LanguageSwitcher
