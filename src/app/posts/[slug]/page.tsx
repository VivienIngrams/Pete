import { cookies } from 'next/headers'; // For reading cookies
import PostContent from '~/app/components/PostContent';

import { readToken } from '~/sanity/lib/sanity.api';
import { getClient } from '~/sanity/lib/sanity.client';
import { getPost, getPosts, type Post } from '~/sanity/lib/sanity.queries';

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const client = getClient({ token: readToken });

  // Get language from cookies (fallback to 'fr')
  const cookieStore = cookies();
  const language = cookieStore.get('language')?.value || 'fr';

  // Fetch the individual post by its slug
  const post: Post | null = await getPost(client, params.slug, language, {
    next: {
      revalidate: 60,
    },
  });

  // Handle case where no post is found
  if (!post) {
    return <p>No post found.</p>;
  }

  // Fetch related posts from the same section
  const posts: Post[] = await getPosts(client, language, {
    next: { revalidate: 60 },
  });

  // Handle case where no related posts are found
  if (!posts || posts.length === 0) {
    return <p>No related posts found.</p>;
  }


  return (
    <>
      
      <div className="min-h-[80vh] xl:h-full w-screen flex flex-col justify-center xl:justify-start xl:flex-row">
     

        {/* Post Texts */}
        <PostContent post={post} />
<div>Images</div>

       
      </div>
    </>
  );
}
