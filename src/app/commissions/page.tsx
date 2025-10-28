import { cookies } from 'next/headers'
import Image from 'next/image'

import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import { getPosts, getSeriesGridPosts, type Post } from '~/sanity/lib/sanity.queries'

import NavMenu from '../components/NavMenu'
import CommissionsGrid from './CommissionsGrid'

export default async function PostsPage() {
  const client = getClient({ token: readToken })

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  // Prefer ordered posts from series grid; fallback to all posts if grid empty
  const orderedPosts = await getSeriesGridPosts(client, language, {
    next: { revalidate: 600 },
  })

const posts: Post[] = (orderedPosts.length
  ? orderedPosts
  : await getPosts(client, language, { next: { revalidate: 600 } })
).slice(0, 4);

  return (
    <>
      <NavMenu />
      <div className=" h-full  mt-12 md:mt-16 md:mx-[12vw] xl:min-h-[80vh] pb-14 font-light max-w-full">
        <h1 className="text-2xl xl:text-4xl  w-full text-center uppercase tracking-widest py-14 md:py-[15vh]">
          Commissions
        </h1>

        <CommissionsGrid posts={posts} />
      </div>
    </>
  )
}