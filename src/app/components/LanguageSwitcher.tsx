import { useLanguage } from './context/LanguageProvider'

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage()

  return (
    <div className="text-sm flex items-center uppercase space-x-2">
      {/* French */}
      <span
        className={`cursor-pointer ${
          language === 'fr' ? 'text-black dark:text-black cursor-default' : 'text-gray-500 dark:text-gray-500 hover:opacity-80'
        }`}
        onClick={() => language !== 'fr' && toggleLanguage()}
      >
        français
      </span>

      <span className="text-black dark:text-black">|</span>

      {/* English */}
      <span
        className={`cursor-pointer ${
          language === 'en' ? 'text-black dark:text-black cursor-default' : 'text-gray-500 dark:text-gray-500 hover:opacity-80'
        }`}
        onClick={() => language !== 'en' && toggleLanguage()}
      >
        english
      </span>
    </div>
  )
}

export default LanguageSwitcher
