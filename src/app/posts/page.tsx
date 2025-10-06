import Link from 'next/link'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { readToken } from '~/sanity/lib/sanity.api'
import { getClient } from '~/sanity/lib/sanity.client'
import { getPosts, type Post } from '~/sanity/lib/sanity.queries'
import NavMenu from '../components/NavMenu'
import { urlForImage } from '~/sanity/lib/sanity.image'

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
      <div className="bg-[#edece0]  h-full md:ml-[20%] pt-16 md:pt-0 md:m-[3%] xl:min-h-[80vh] pb-20 font-cormorant font-bold max-w-full ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border border-[#edece0]">
          {posts.map((post) => (
            <div
              id={post.slug.current}
              key={post._id}
              className="relative aspect-square border border-[#edece0] group overflow-hidden"
            >
              {post.mainImage?.asset && (
                <Image
                  src={urlForImage(post.mainImage).url() as string}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-opacity duration-300 group-hover:opacity-20"
                />
              )}
              <Link
                href={`/posts/${post.slug.current}`}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black text-xl md:text-2xl text-center"
              >
                {post.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
