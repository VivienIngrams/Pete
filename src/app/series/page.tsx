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
    <>
      <NavMenu />
      <div className="bg-white h-full  mt-12 md:mt-[8vw] md:mx-[12vw] xl:min-h-[80vh] pb-14 font-roboto font-bold max-w-full">
           {/* Banner section */}
           <div className="relative w-full bg-white mt-12 md:mt-[6vw]">
        <div className="relative w-full h-[15vw] min-h-[110px] flex items-center justify-center">
          <Image
            src="/shifting.png"
            alt="Shifting Ground"
            fill
            className="object-contain p-4 md:p-8"
            priority
          />
        </div>
      </div>
        <PostsGrid posts={posts} />
      </div>
    </>
  )
}
