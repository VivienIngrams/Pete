import { cookies } from 'next/headers';

import ContactForm from '../components/ContactForm';
import NavMenu from '../components/NavMenu';

export default function ContactPage() {
  const cookieStore = cookies();
  const language = cookieStore.get('language')?.value || 'fr';
 
  return (
    <>
    <NavMenu/>
    <div className="min-h-screen mt-6 xl:mt-24 bg-[#f6f5ee]">
      <div className="xl:h-[90%] flex flex-col items-center justify-center mx-6 xl:w-1/3 xl:mx-auto">
        <h1 className="text-2xl xl:text-4xl  w-full text-center font-roboto py-14">
          Commissions
        </h1>
      
      </div>
    </div>
    </>
  );
}
