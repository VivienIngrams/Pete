import { cookies } from 'next/headers'

import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import { getCommission, type Post } from '~/sanity/lib/sanity.queries'

import CommissionSlideshow from './CommissionSlideShow'

export default async function CommissionPage({
  params,
}: {
  params: { slug: string }
}) {
  const client = getClient({ token: readToken })

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  // Fetch the post by slug
  const post: Post | null = await getCommission(client, params.slug, language, {
    next: { revalidate: 60 },
  })

  if (!post) {
    return <p>No post found.</p>
  }

 
  return (
    <>
    
      {/* Pass post data to client component */}
      <CommissionSlideshow post={post}/>
    </>
  )
}
