import { cookies } from 'next/headers'
import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import { getPosts, getSeriesGridPosts, type Post } from '~/sanity/lib/sanity.queries'
import NavMenu2 from '../components/NavMenu2'
import PostsGrid from './PostsGrid'

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
      <NavMenu2 />
      <div className="bg-[#f6f5ee] h-full  mt-12 md:m-[8vw] xl:min-h-[80vh] pb-20 font-genos font-bold max-w-full">
        <PostsGrid posts={posts} />
      </div>
    </>
  )
}
