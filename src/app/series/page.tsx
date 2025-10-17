import { cookies } from 'next/headers'
import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import {
  getPosts,
  getSeriesGridPosts,
  type Post,
} from '~/sanity/lib/sanity.queries'
import NavMenu from '../components/NavMenu'
import PostsGrid from './PostsGrid'
import Image from 'next/image'
import PostsGridMobile from './PostsGridMobile'

export default async function PostsPage() {
  const client = getClient({ token: readToken })

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  // Prefer ordered posts from series grid; fallback to all posts if grid empty
  const orderedPosts = await getSeriesGridPosts(client, language, {
    next: { revalidate: 600 },
  })

  const posts: Post[] = orderedPosts.length
    ? orderedPosts
    : await getPosts(client, language, { next: { revalidate: 600 } })

  return (
    // PostsPage.tsx
    <>
      <NavMenu />

      {/* Fixed banner on top */}
      <div className="fixed top-12 md:top-[10vw] left-0 right-0 z-20 bg-white">
        <div className="relative w-full h-[12vw] min-h-[60px] max-h-[120px] flex items-center justify-center mt-6 ">
          <Image
            src="/shifting-ground.png"
            alt="Shifting Ground"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className='pb-4 md:px-8 flex justify-center text-black font-light font-roboto tracking-wide text-base md:text-2xl'>
          <h3>Fine art photos for an upcoming book</h3>
        </div>
      </div>

     
      {/* Horizontal Scroll Section */}
      <div className=" md:px-[12vw]">
        <PostsGrid posts={posts} />
      </div>
    </>
  )
}
