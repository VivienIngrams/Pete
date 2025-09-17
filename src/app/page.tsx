import Image from 'next/legacy/image'
import Link from 'next/link'

import Verification from '~/app/components/Verification'
import { getClient } from '~/sanity/lib/sanity.client'
import { urlForImage } from '~/sanity/lib/sanity.image';
import { getHomePage } from '~/sanity/lib/sanity.queries'

export default async function HomePage() {
  const client = getClient()

  const homePageData = await getHomePage(client, {
    next: {
      revalidate: 600,
      cache: 'no-store',
    },
  })

  return (
    <>
      {/* Age Verification Popup */}
      <Verification />

      {/* Entire Page Clickable */}    
   
      <Link
        href="/posts"
        className="block relative h-[100vh] w-full overflow-hidden"
      >
        <section className="relative h-full w-full flex flex-col justify-start xl:justify-center items-start">
          
        <Image
            className="object-cover object-[56%] xl:object-bottom"
            src={urlForImage(homePageData.mainImages[0]).url() || ''}
            layout="fill"
            sizes="(max-width: 768px) 500vw, (max-width: 1200px) 50vw, 100vw"
            alt="Home Page Background"
          />

          {/* Title and Subtitle */}
          <div className="fixed xl:min-w-full left-1/2 -translate-x-1/2 text-black  font-montserrat bottom-[42%] xl:bottom-[52%]  text-center">
            <h1 className="font-normal text-[50px] xl:text-[100px] uppercase tracking-[-0.2rem] xl:tracking-[-0.4rem] leading-[40px]">
              <span className="text-[62px] font-light leading-[40px] xl:text-[135px] tracking-[-1rem] xl:tracking-[-2rem] ">
                J
              </span>{' '}
              oël{' '}
              <span className="text-[62px] font-light  leading-[40px] xl:text-[135px] tracking-[-0.3rem] xl:tracking-[-0.6rem]">
                B
              </span>
              ardeau
            </h1>
            <h2 className=" text-2xl xl:text-3xl font-cinzel leading-normal -mt-1 md:mt-4">
              Artiste Auteur
            </h2>
          </div>
        </section>
      </Link>
    </>
  )
}