import { cookies } from 'next/headers'
import Image from 'next/image'

import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import {
  getPosts,
  getSeriesGridPosts,
  type Post,
} from '~/sanity/lib/sanity.queries'

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

      {/* Fixed banner on top */}
      <div
        id="series-banner"
        className="fixed top-[12vh] md:top-[9vw] left-0 right-0 z-20 bg-white"
      >
        <div className="hidden relative w-full  h-[13vh] md:flex items-center justify-center">
          <Image
            src="/shifting-ground.png"
            alt="Shifting Ground"
            fill
            sizes="50vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="md:hidden relative w-full h-auto  flex flex-col items-center justify-center">
          <div className="w-full h-[12vh] relative mr-5">
            <Image
              src="/shifting.png"
              alt="Shifting"
              fill
              sizes="70vw"
              className="object-contain"
              priority
            />
          </div>
          <div className="w-full h-[12vh] relative -mt-[4vh]">
            <Image
              src="/ground.png"
              alt="Ground"
              fill
              sizes="70vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="pb-4 md:px-8 flex justify-center -mt-1 text-black font-light font-roboto tracking-wide text-lg">
          <h3> Fine art photos for an upcoming book</h3>
        </div>
      </div>

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
