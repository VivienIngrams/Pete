import { cookies } from 'next/headers'
import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import { getPosts, type Post } from '~/sanity/lib/sanity.queries'
import NavMenu from '../components/NavMenu'
import PostsGrid from './PostsGrid'

export default async function PostsPage() {
  const client = getClient({ token: readToken })

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  const posts: Post[] = await getPosts(client, language, {
    next: { revalidate: 600 },
  })

  return (
    <>
      <NavMenu />
      <div className="bg-[#edece0] h-full md:ml-[20%] pt-16 md:pt-0 md:m-[3%] xl:min-h-[80vh] pb-20 font-cormorant font-bold max-w-full">
        <PostsGrid posts={posts} />
      </div>
    </>
  )
}
