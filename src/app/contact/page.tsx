import { cookies } from 'next/headers';

import ContactForm from '../components/ContactForm';
import NavMenu from '../components/NavMenu';

export default function ContactPage() {
  const cookieStore = cookies();
  const language = cookieStore.get('language')?.value || 'fr';
 
  return (
    <>
    <NavMenu/>

    <div className="min-h-screen bg-black dark:bg-black xl:h-[90%] flex flex-col items-center justify-center">
      <div className=" mx-6 xl:w-1/3 xl:mx-auto">
        <h1 className="text-2xl xl:text-3xl  w-full text-left font-light uppercase tracking-widest pt-24 md:pt-12 pb-8">
          Contact
        </h1>
      
        <ContactForm  />
      </div>
    </div>
    </>
  );
}
