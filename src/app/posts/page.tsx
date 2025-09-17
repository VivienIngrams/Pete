import { cookies } from 'next/headers'; // For reading cookies

import ImageGallery from '~/app/components/ImageGallery';
import MobileImageGallery from '~/app/components/MobileImageGallery';
import SubMenu from '~/app/components/SubMenu';
import { readToken } from '~/sanity/lib/sanity.api';
import { getClient } from '~/sanity/lib/sanity.client';
import {  getPosts, type Post } from '~/sanity/lib/sanity.queries';

export default async function PostsPage() {
  const client = getClient({ token: readToken });

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies();
  const language = cookieStore.get('language')?.value || 'fr';
 
  const posts: Post[] = await getPosts(client, 'gallery', language, {
    next: { revalidate: 600 }
  });
console.log(posts)
  const customOrder = [
    'autoportraits',
    'survol',
    'hors-d-age',
    'respiration',
    'derision',
    'collaborations',
    'projets',
    ,
  ];

  const sortedPosts = posts
    .map((post) => ({
      ...post,
      title: language === 'en' ? post.title_en || post.title : post.title,
      excerpt: language === 'en' ? post.excerpt_en || post.excerpt : post.excerpt,
    }))
    .sort(
      (a, b) =>
        customOrder.indexOf(a.slug.current) - customOrder.indexOf(b.slug.current) ||
        new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime(),
    );

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
    <div className="h-full xl:min-h-[80vh] pb-20 font-cinzel font-bold bg-white max-w-full pt-40 xl:pt-16">

      {sortedPosts.map((post) => (
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
      ))}
    </div>
    </>
  );
}
