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
      <div className="h-screen flex flex-col justify-evenly bg-white dark:bg-black text-black">
        <div id="series-banner" className="z-20 bg-white dark:bg-black ">
          {/* Desktop / common banner */}
          <div className="mt-[8vh] relative h-[8vh] w-[70vw] md:w-[40vw] mx-auto  md:flex items-center justify-center">
            {/* Light mode */}
            <Image
              src="/commissions.png"
              alt="Commissions"
              fill
              sizes="40vw"
              className="object-contain dark:hidden"
              priority
            />
            {/* Dark mode */}
            <Image
              src="/commissions-w.png"
              alt="Commissions (Dark)"
              fill
              sizes="40vw"
              className="object-contain hidden dark:block"
              priority
            />
          </div>

          <div className="py-2 px-6 md:px-8 flex justify-center font-light font-roboto leading-none tracking-wide text-sm md:text-base 3xl:text-lg text-black dark:text-white">
            <h3 className="text-center md:max-w-[50%]">
              Below a smattering of my commissioned work. Although mainly
              concentrating on personal projects these days, I&apos;m always
              delighted to work on an interesting project. Contact me at{' '}
              <a
                href="mailto:studiolippmann@gmail.com"
                className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                studiolippmann@gmail.com
              </a>
            </h3>
          </div>
        </div>

        <div className=" flex flex-col justify-center items-center md:px-[12vw]">
          <div className="w-full">
            <CommissionsGrid posts={posts} />
          </div>
        </div>
      </div>
    </>
  )
}
