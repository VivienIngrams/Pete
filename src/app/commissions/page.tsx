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
        <h1 className="text-2xl xl:text-4xl text-center uppercase tracking-widest  pt-24  md:pt-32  font-light">
          Commissions
        </h1>
      <div className="min-h-[80vh] flex flex-col justify-center items-center md:px-[12vw]">
        <div className="w-full max-w-6xl">
          <CommissionsGrid posts={posts} />
        </div>
      </div>
    </>
  )
}