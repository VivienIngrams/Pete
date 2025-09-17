'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'


import BackButton from './BackButton'

import Footer from './Footer'
import LanguageSwitcher from './LanguageSwitcher'


export default function Container({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  const isHomePage = path === '/'
  const isContactPage = path === '/contact'

  const isCollaborationsPage = path === '/posts/collaborations'
  const isProjetsPage = path === '/posts/projets'
  const isCollaborationsSousPage = [
    '/posts/mathilde',
    '/posts/vibrations',
    '/posts/johanna',
  ].includes(path)
  const isProjetsSousPage = [
    '/posts/memento',
    '/posts/dante-extraits',
  ].includes(path)
  const isSousPage =
    path.startsWith('/posts/') &&
    !isProjetsPage &&
    !isProjetsSousPage &&
    !isCollaborationsSousPage &&
    !isCollaborationsPage // Exclude Projets and Collaborations subpages
  const isStudioPage = path.startsWith('/studio') // Check if the path starts with /studio

  if (isStudioPage) {
    // If it's the /studio path, return only the children without the container
    return <>{children}</>
  }


  return (
    <div className="max-w-screen h-full font-ubuntu">
     
        <div
          className={`${
            isHomePage
              ? 'hidden'
              : 'fixed  top-0 z-50 h-24 w-full md:h-24 bg-white flex flex-col items-center justify-center'
          }`}
        >
          <BackButton
            show={
              (isProjetsPage || isCollaborationsPage) &&
              !isCollaborationsSousPage &&
              !isProjetsSousPage
            }
            href="/posts"
          />
          <BackButton
            show={isCollaborationsSousPage}
            href="/posts/collaborations"
          />
          <BackButton show={isProjetsSousPage} href="/posts/projets" />
          <BackButton show={isSousPage} href="/posts" />
      
          <Link href={isHomePage ? '/posts' : '/'}>
            <h1
              className={`${isHomePage ? 'hidden' : 'text-black font-montserrat uppercase font-normal  hover:text-gray-500 text-3xl tracking-[-0.rem] text-center md:pb-4'}`}
            >
              <span className="text-[40px] font-light    tracking-[-0.65rem] ">
                J
              </span>{' '}
              oël{' '}
              <span className="text-[40px]   font-light tracking-[-0.05rem]">
                B
              </span>
              ardeau
            </h1>
          </Link>
          <div className='hidden md:block fixed top-4 right-6'>
          <LanguageSwitcher/></div>
        </div>

        <main className="w-full font-arsenal">{children}</main>

        {/* Footer */}
        <Footer isHomePage={isHomePage} isContactPage={isContactPage} />
      
    </div>
  )
}
