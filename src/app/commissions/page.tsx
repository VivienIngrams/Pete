import { cookies } from 'next/headers'
import Image from 'next/image'

import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import {
  getCommissions,
  getCommissionsGridPosts,
  type Post,
} from '~/sanity/lib/sanity.queries'

import NavMenu from '../components/NavMenu'
import CommissionsGrid from './CommissionsGrid'

export default async function PostsPage() {
  const client = getClient({ token: readToken })

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  // Prefer ordered posts from series grid; fallback to all posts if grid empty
  const orderedPosts = await getCommissionsGridPosts(client, language, {
    next: { revalidate: 600 },
  })

  const posts: Post[] = (
    orderedPosts.length
      ? orderedPosts
      : await getCommissions(client, language, { next: { revalidate: 600 } })
  ).slice(0, 4)

  return (
    <>
      <NavMenu />
      <div
        id="series-banner"
        className="fixed top-[12vh] md:top-[17vh] left-0 right-0 z-20 "
      >
     
        <div className=" relative w-full h-[5vh] md:h-[9vh] md:flex items-center justify-center">
          <Image
            src="/commissions-r.png"
            alt="Commissions"
            fill
            sizes="40vw"
            className="object-contain"
            priority
          />
        </div>

        <div className="p-4 md:px-8 flex justify-center font-light font-roboto leadin-none tracking-wide text-sm md:text-base  3xl:text-lg text-black">
          <h3 className='text-center md:max-w-[50%]'>
            Below a smattering of my commissioned work. Although mainly concentrating on personal projects these days, I&apos;m always delighted to work on an interesting project. Contact me at studiolippmann@gmail.com
          </h3>
        </div>

      </div>
      <div className="mt-[30vh] md:mt-[43vh] min-h-[50vh] flex flex-col justify-center items-center md:px-[12vw]">
        <div className="w-full">
          <CommissionsGrid posts={posts} />
        </div>
      </div>
    </>
  )
}
