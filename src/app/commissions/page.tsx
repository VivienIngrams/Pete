import { cookies } from 'next/headers'
import Image from 'next/image'

import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import {
  getCommissions,
  getCommissionsGridPosts,
  type Post,
} from '~/sanity/lib/sanity.queries'

import CommissionsBanner from '../components/CommissionsBanner'
import NavMenu from '../components/NavMenu'
import CommissionsGrid from './CommissionsGrid'

export default async function PostsPage() {
  const client = getClient({ token: readToken })

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  // Fetch posts
  const orderedPosts = await getCommissionsGridPosts(client, language, {
    next: { revalidate: 600 },
  })
  const posts = (
    orderedPosts.length
      ? orderedPosts
      : await getCommissions(client, language, { next: { revalidate: 600 } })
  ).slice(0, 4)

  return (
    <>
      <NavMenu />
      <div className="h-screen flex flex-col justify-evenly !bg-white dark:!bg-white !text-black dark:!text-black">
        <CommissionsBanner />

        <div className="flex flex-col justify-center items-center md:px-[12vw]">
          <div className="w-full">
            <CommissionsGrid posts={posts} />
          </div>
        </div>
      </div>
    </>
  )
}
