import { cookies } from 'next/headers';

import ContactForm from '../components/ContactForm';

export default function ContactPage() {
  const cookieStore = cookies();
  const language = cookieStore.get('language')?.value || 'fr';
 
  return (
    <div className="min-h-screen mt-20 xl:mt-20 bg-white text-gray-500 ">
      <div className="xl:h-[90%] flex flex-col items-center justify-center mx-6 xl:w-1/3 xl:mx-auto">
        <h1 className="text-2xl xl:text-3xl  w-full text-left font-cinzel py-4">
          {language === 'fr' ? 'Contact' : 'Contact'}
        </h1>
        <ContactForm language={language} />
      </div>
    </div>
  );
}
