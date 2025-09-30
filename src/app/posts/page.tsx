import { cookies } from 'next/headers'; // For reading cookies

import ImageGallery from '~/app/components/ImageGallery';

import { readToken } from '~/sanity/lib/sanity.api';
import { getClient } from '~/sanity/lib/sanity.client';
import {  getPosts, type Post } from '~/sanity/lib/sanity.queries';
import NavMenu from '../components/NavMenu' 

export default async function PostsPage() {
  const client = getClient({ token: readToken });

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies();
  const language = cookieStore.get('language')?.value || 'fr';
 
  const posts: Post[] = await getPosts(client, 'gallery', language, {
    next: { revalidate: 600 }
  });
// console.log(posts)



  return (
 <>
      <NavMenu/>
    <div className="h-full xl:min-h-[80vh] pb-20 font-cinzel font-bold bg-white max-w-full pt-40 xl:pt-16">

      {/* {sortedPosts.map((post) => (
        <div key={post._id}>
          <div className="pb-6 xl:hidden">
            <MobileImageGallery
              images={post.mainImages}
              layout={post.layout}
              slug={post.slug.current}
              title={post.title}
            />
          </div>
          <div className="hidden xl:block">
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
  );
}
