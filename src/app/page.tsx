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
import PostsGridMobile from './series/PostsGridMobile'


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
    <>
      <NavMenu />

      <BannerWithAutoFallback />


      {/* Desktop horizontal scroll */}
      <div className="hidden md:block flex-grow h-full pl-12">
        <PostsGrid posts={posts} />
      </div>

      {/* Mobile horizontal touch scroll */}
      <div className="block md:hidden ml-4">
        <PostsGridMobile posts={posts} />
      </div>

      <div className="hidden md:fixed bottom-0 left-0 right-0 text-xs w-screen md:flex justify-center pb-2 bg-black text-white uppercase pt-2">
        <p>scroll to explore</p>
      </div>
      {/* RIGHT visual margin overlay (16px) — non-interactive */}
      <div
        className="pointer-events-none hidden md:block  md:fixed right-0 top-0 bottom-0 w-4 z-50 bg-white"
        aria-hidden="true"
      />
    </>
  )
}
