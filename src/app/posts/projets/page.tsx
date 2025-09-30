import { cookies } from 'next/headers' // For reading cookies

import ImageGallery from '~/app/components/ImageGallery'

import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import { getPosts, type Post } from '~/sanity/lib/sanity.queries'
import NavMenu from '../../components/NavMenu'

export default async function ProjetsPage() {
  const client = getClient({ token: readToken })

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'fr'

  const posts: Post[] = await getPosts(client, 'projets-actuels', language, {
    next: {
      revalidate: 100,
    },
  })

  return (
    <>
      <NavMenu />
      <div className="h-full xl:min-h-[80vh] pb-20 font-cinzel bg-white max-w-[98vw] pt-20 xl:pt-16 ">
        {/* Render ImageGallery for each post */}
        {/* {posts.map((post) => (
        <div key={post._id}>
         
          <div className="">
            <ImageGallery
              images={post.mainImages}
              layout={post.layout}
              slug={post.slug.current}
              title={post.title}
            />
          </div>
        </div>
      ))} */}
      </div>
    </>
  )
}
