import { cookies } from 'next/headers'

import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import { getPost, getPosts, type Post } from '~/sanity/lib/sanity.queries'

import PostSlideshow from './PostSlideShow'

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const client = getClient({ token: readToken })

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  // Fetch the post by slug
  const post: Post | null = await getPost(client, params.slug, language, {
    next: { revalidate: 60 },
  })




  return (
    <>
    
      {/* Pass post data to client component */}
      <PostSlideshow post={post}/>
    </>
  )
}
