'use client'

import { useLanguage } from './context/LanguageProvider'

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage()

  return (
    <div>
      <button
        onClick={toggleLanguage}
        aria-label="Toggle Language"
        className="z-50 hover:scale-105 ease-in duration-600"
      >
        {language === 'en' ? (
          // French Flag
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="16"
            id="flag-icons-fr"
            viewBox="0 0 640 480"
          >
            <path fill="#fff" d="M0 0h640v480H0z" />
            <path fill="#000091" d="M0 0h213.3v480H0z" />
            <path fill="#e1000f" d="M426.7 0H640v480H426.7z" />
          </svg>
        ) : (
          // British Flag
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 40"
            width="28"
            height="20"
          >
            <clipPath id="t">
              <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
            </clipPath>
            <path d="M0,0 v30 h60 v-30 z" fill="#00247d" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path
              d="M0,0 L60,30 M60,0 L0,30"
              clipPath="url(#t)"
              stroke="#cf142b"
              strokeWidth="4"
            />
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default LanguageSwitcher
