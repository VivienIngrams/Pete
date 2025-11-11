import { cookies } from 'next/headers'
import Link from 'next/link'

import ContactForm from '../components/ContactForm'
import NavMenu from '../components/NavMenu'

export default function ContactPage() {
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  return (
    <>
      <NavMenu />

      <div className="min-h-screen !bg-white dark:!bg-white xl:h-[90%] flex flex-col items-center justify-center">
        <div className=" mx-6 xl:w-1/3 xl:mx-auto">
          <h1 className="text-2xl xl:text-3xl  w-full text-left font-light uppercase tracking-widest pt-16 md:pt-24 pb-8">
            Contact
          </h1>

          <ContactForm />
        </div>
          <div className="w-full text-center py-8">
            <p>
              {language === 'en'
                ? 'Or write to us at '
                : 'Ou écrivez-nous à '}
              <Link className="underline" href="mailto:studiolippmann@gmail.com">
                studiolippmann@gmail.com
              </Link>
            </p>
          </div>
      </div>
    </>
  )
}
