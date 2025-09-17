'use client';

import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';

import { useLanguage } from './context/LanguageProvider'; // Import the LanguageProvider context
import LanguageSwitcher from './LanguageSwitcher'; // Import the LanguageSwitcher component

const Verification = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [message, setMessage] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [showYesButton, setShowYesButton] = useState(true);
  const router = useRouter();

  const { language } = useLanguage(); // Access the current language

  useEffect(() => {
    const hasVerifiedAge = sessionStorage.getItem('hasVerifiedAge');

    if (hasVerifiedAge === 'true') {
      setShowPopup(false);
    }
  }, []);

  const handleAgeConfirmation = (isAdult: boolean) => {
    if (isAdult) {
      setShowPopup(false);
      sessionStorage.setItem('hasVerifiedAge', 'true');
    } else {
      setMessage(
        language === 'en'
          ? 'This website is only for individuals 18 years or older.'
          : 'Ce site est réservé aux personnes de 18 ans et plus.'
      );
      setRedirecting(true);
      setShowYesButton(false);

      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black font-arsenal bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white text-gray-500 p-6 rounded-md text-center max-w-xs sm:max-w-sm w-full mx-4">
       <div className='absolute top-4 right-4'> <LanguageSwitcher /> </div>
        <h2 className="text-xl xl:text-3xl font-bold mb-4">
          {language === 'en' ? 'Warning' : 'Avertissement'}
        </h2>
        <p className="mb-4">
          {language === 'en'
            ? 'This site contains images of nudity.'
            : 'Ce site contient des images de nudité.'}
        </p>
        <p className="mb-4 font-bold">
          {language === 'en'
            ? 'Are you 18 years or older?'
            : 'Avez-vous plus de 18 ans ?'}
        </p>
        <div className="flex flex-col sm:flex-row justify-around">
          {showYesButton && (
            <button
              className="bg-gray-200 text-gray-600 py-2 px-6 m-2 rounded"
              onClick={() => handleAgeConfirmation(true)}
            >
              <span className="font-bold">
                {language === 'en' ? 'Yes,' : 'Oui,'}
              </span>{' '}
              {language === 'en' ? 'I am over 18' : 'j\'ai plus de 18 ans'}
            </button>
          )}
          <button
            className="bg-[#454648] text-white py-2 px-6 m-2 rounded"
            onClick={() => handleAgeConfirmation(false)}
          >
            <span className="font-bold">
              {language === 'en' ? 'No,' : 'Non,'}
            </span>{' '}
            {language === 'en' ? 'I am under 18' : 'j\'ai moins de 18 ans'}
          </button>
        </div>
        {message && <p className="mt-4 text-red-500 text-lg">{message}</p>}
      </div>
    </div>
  );
};

export default Verification;
