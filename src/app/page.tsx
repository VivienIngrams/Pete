import { cookies } from 'next/headers'
import Image from 'next/image'

import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import {
  getPosts,
  getSeriesGridPosts,
  type Post,
} from '~/sanity/lib/sanity.queries'

import { BannerWithAutoFallback } from './components/Banner'
import NavMenu from './components/NavMenu'
import PostsGrid from './series/PostsGrid'


export default async function HomePage() {
  const client = getClient({ token: readToken })

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  // Prefer ordered posts from series grid; fallback to all posts if grid empty
  const orderedPosts = await getSeriesGridPosts(client, language, {
    next: { revalidate: 10 },
  })

  const posts: Post[] = orderedPosts.length
    ? orderedPosts
    : await getPosts(client, language, { next: { revalidate: 600 } })

  return (
    // PostsPage.tsx
    <div className="flex flex-col justify-evenly h-screen bg-white dark:bg-black  text-black dark:text-white">
      <NavMenu />

      <BannerWithAutoFallback  />

      <div className=" px-4 ">
        <PostsGrid posts={posts} />
      </div>

    
    </div>
  )
}
