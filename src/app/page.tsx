import Image from 'next/legacy/image'
import Link from 'next/link'

import { getClient } from '~/sanity/lib/sanity.client'
import { urlForImage } from '~/sanity/lib/sanity.image'
import { getHomePage } from '~/sanity/lib/sanity.queries'

export default async function HomePage() {
  const client = getClient()

  const homePageData = await getHomePage(client, {
    next: {
      revalidate: 600,
      cache: 'no-store',
    },
  })
console.log('homePageData', homePageData)
  return (
    <>
      {/* Entire Page Clickable */}

      <Link
        href="/posts"
        className="block relative h-[100vh] w-full overflow-hidden"
      >
        <section className="relative h-full w-full flex flex-col justify-start xl:justify-center items-start">
          <Image
            className="object-cover object-[10%]"
            src={urlForImage(homePageData.mainImage).url() || ''}
            layout="fill"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
            alt="Home Page Background"
          />
          {/* Title and Subtitle */}
          <div className="fixed xl:min-w-full left-1/2 -translate-x-1/2 text-white  bottom-[42%] xl:bottom-[83%]  text-center">
            <h1 className="font-medium text-[50px] xl:text-8xl  tracking-tight">
              Peter Lippmann
            </h1>
          </div>
        </section>
      </Link>
    </>
  )
}
