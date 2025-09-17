import { cookies } from 'next/headers'; // For reading cookies

import ImageGallery from '~/app/components/ImageGallery';
import MobileImageGallery from '~/app/components/MobileImageGallery';
import SubMenu from '~/app/components/SubMenu';
import { readToken } from '~/sanity/lib/sanity.api';
import { getClient } from '~/sanity/lib/sanity.client';
import { getPosts, type Post } from '~/sanity/lib/sanity.queries';

export default async function ProjetsPage() {
  const client = getClient({ token: readToken });

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies();
  const language = cookieStore.get('language')?.value || 'fr';

  const posts: Post[] = await getPosts(client, 'projets-actuels', language, {
    next: {
      revalidate: 100,
    },
  });

  const sortedPosts = posts.map((post) => ({
    ...post,
    title: language === 'en' ? post.title_en || post.title : post.title,
    excerpt: language === 'en' ? post.excerpt_en || post.excerpt : post.excerpt,
  }));

  if (!sortedPosts || sortedPosts.length === 0) {
    return <p>No posts found.</p>;
  }

  return (
    <>
    <SubMenu
      posts={sortedPosts.map((post) => ({
        href: `/posts/${post.slug.current}`,
        title: post.title,
        title_en: post.title_en,
      }))}
    />
    <div className="h-full xl:min-h-[80vh] pb-20 font-cinzel bg-white max-w-[98vw] pt-20 xl:pt-16 ">
     
      {/* Render ImageGallery for each post */}
      {posts.map((post) => (
        <div key={post._id}>
          {/* Show on mobile screens */}
          <div className="py-8 xl:hidden">
            <MobileImageGallery
              images={post.mainImages}
              layout={post.layout}
              slug={post.slug.current}
              title={post.title}
            />
          </div>
          
          {/* Show on desktop screens */}
          <div className="hidden xl:block">
            <ImageGallery
              images={post.mainImages}
              layout={post.layout}
              slug={post.slug.current}
              title={post.title}
            />
          </div>
        </div>
      ))}
    </div>
    </>
  )
}
