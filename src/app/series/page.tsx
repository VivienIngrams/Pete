import { cookies } from 'next/headers'
import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import { getPosts, getSeriesGridPosts, type Post } from '~/sanity/lib/sanity.queries'
import NavMenu from '../components/NavMenu'
import PostsGrid from './PostsGrid'
import Image from 'next/image'

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
  <div className="fixed top-12 md:top-[8vw] left-0 right-0 z-20 bg-[#e3e1de]">
    <div className="relative w-full h-[12vw] min-h-[80px] max-h-[100px] flex items-center justify-center my-16">
      <Image
        src="/shifting-ground.png"
        alt="Shifting Ground"
        fill
        className="object-contain"
        priority
      />
    </div>
  </div>

  {/* Horizontal Scroll Section */}
  <div className=' px-[12vw]'>
  <PostsGrid posts={posts} />
  </div>
</>

  )
}