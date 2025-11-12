import { cookies } from 'next/headers'

import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import { getPost, getPosts } from '~/sanity/lib/sanity.queries'

import SlideShow from './SlideShowPage'

export const revalidate = 60 // regenerate every 60s (ISR)

export async function generateStaticParams() {
  const client = getClient({ token: readToken })
  const posts = await getPosts(client, 'fr') // or both langs
  return posts.map((post) => ({ slug: post.slug.current }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  
// Get language from cookies (fallback to 'fr')
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  const client = getClient({ token: readToken })
  const post = await getPost(client, params.slug, language) 
  return <SlideShow post={post} />
}
