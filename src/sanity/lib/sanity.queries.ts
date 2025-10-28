import type { PortableTextBlock } from '@portabletext/types'
import groq from 'groq'
import { type SanityClient } from 'next-sanity'

import { sanityFetch } from './sanity.client'


// GROQ query to fetch posts by section
const postsQuery = () => groq`
*[_type == "post" ]  {
  _id,
  _createdAt,
  title,
  title_en,
  slug,
  excerpt,
  excerpt_en,
  mainImage {
    ...,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  },
  layout
}`

// GROQ query to fetch posts in the order defined by the series grid
export const seriesGridQuery = groq`
*[_type == "grid"][0]{
  "posts": seriesGrid[]->{
    _id,
    _createdAt,
    title,
    title_en,
    slug,
    excerpt,
    excerpt_en,
    mainImage {
      ...,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    layout
  }
}`

export async function getPosts(
  client: SanityClient,
    language: 'en' | 'fr' | string = 'fr',
  options = {}
): Promise<Post[]> {
  try {
    const posts = await sanityFetch<Post[]>({
      query: postsQuery(),
      qParams: { ...options },
    });

    const languagePosts = posts.map((post) => ({
      ...post,
      title: language === 'en' ? post.title_en || post.title : post.title,
      excerpt: language === 'en' ? post.excerpt_en || post.excerpt : post.excerpt,
    }));

    return languagePosts;
  } catch (error) {
    console.error('Error fetching posts by section:', error);
    throw error;
  }
}

// Fetch posts using the series grid order; returns empty array if no grid or references
export async function getSeriesGridPosts(
  client: SanityClient,
  language: 'en' | 'fr' | string = 'fr',
  options = {}
): Promise<Post[]> {
  try {
    const result = await sanityFetch<{ posts: Post[] | undefined }>({
      query: seriesGridQuery,
      qParams: { ...options },
    });

    const posts = result?.posts ?? []

    const languagePosts = posts.map((post) => ({
      ...post,
      title: language === 'en' ? post.title_en || post.title : post.title,
      excerpt: language === 'en' ? post.excerpt_en || post.excerpt : post.excerpt,
    }));

    return languagePosts
  } catch (error) {
    console.error('Error fetching posts from series grid:', error);
    throw error;
  }
}

// Query to fetch a single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug ][0] {
    _id,
    title,
    title_en,
    slug,
       excerpt,
    excerpt_en,
        images[] {
      ...,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    }
  }
`

// Function to fetch a post by its slug
export async function getPost(
  client: SanityClient,
  slug: string,
  language: string | 'en' | 'fr' = 'fr', // default language is 'fr'
  options = {}
): Promise<Post> {
  try {
    const post = await sanityFetch<Post>({
      query: postBySlugQuery,
      qParams: { slug, ...options },
    });

    if (!post) {
      throw new Error(`Post with slug "${slug}" not found`);
    }

    // Return the correct language-based title and excerpt
    return {
      ...post,
      title: language === 'en' ? post.title_en || post.title : post.title,
      excerpt: language === 'en' ? post.excerpt_en || post.excerpt : post.excerpt,
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw error;
  }
}

// Query to fetch all slugs for posts
export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`
export type Post = {
  _type: 'post'
  _id: string
  _publishedAt: string
  slug: { current: string }
  _createdAt: string
  mainImage: {
    _type: 'image'
    asset: any
    aspectRatio?: number
  }
  title: string
  title_en?: string
  excerpt?: PortableTextBlock[]
  excerpt_en?: PortableTextBlock[]
  images?: {
    _key: string
    image: any
    title_fr?: string
    title_en?: string
    excerpt_fr?: PortableTextBlock[]
    excerpt_en?: PortableTextBlock[]
  }[]
}

// Query to fetch the home page data
export const homePageQuery = groq`
  *[_type == "home"][0] {
  title,
    mainImage 
  }
`

// Function to fetch the home page data
export async function getHomePage(client: SanityClient, options = {}) {
  const homePage = await client.fetch(homePageQuery, options)
  return homePage
}

export const bioQuery = groq`*[_type == "bioContent"]{
  _id,
  _type,
  "imageUrl": image.asset->url,
  biography {
    fr {
      biographyText[]{
        ... 
      },
      biographyText2[]{
        ... 
      },
      artisticTraining,
      organizer,
      exhibitions
    },
    en {
      biographyText[]{
        ... 
      },
      biographyText2[]{
        ... 
      },
      artisticTraining,
      organizer,
      exhibitions
    }
  }
}
`

export async function getBioPage(client: SanityClient, options = {}) {
  const bioPage = await client.fetch(bioQuery, options)
  return bioPage
}

// GROQ query to fetch posts by section
const commissionsQuery = () => groq`
*[_type == "commission" ]  {
  _id,
  _createdAt,
  title,
  title_en,
  slug,
  excerpt,
  excerpt_en,
  mainImage {
    ...,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  },
  layout
}`

export async function getCommissions(
  client: SanityClient,
    language: 'en' | 'fr' | string = 'fr',
  options = {}
): Promise<Post[]> {
  try {
    const posts = await sanityFetch<Post[]>({
      query: commissionsQuery(),
      qParams: { ...options },
    });

    const languagePosts = posts.map((post) => ({
      ...post,
      title: language === 'en' ? post.title_en || post.title : post.title,
      excerpt: language === 'en' ? post.excerpt_en || post.excerpt : post.excerpt,
    }));

    return languagePosts;
  } catch (error) {
    console.error('Error fetching posts by section:', error);
    throw error;
  }
}

// GROQ query to fetch posts in the order defined by the series grid
export const commissionsGridQuery = groq`
*[_type == "grid"][0]{
  "commissions": seriesGrid[]->{
    _id,
    _createdAt,
    title,
    title_en,
    slug,
    excerpt,
    excerpt_en,
    mainImage {
      ...,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    layout
  }
}`

export async function getCommissionsGridPosts(
  client: SanityClient,
  language: 'en' | 'fr' | string = 'fr',
  options = {}
): Promise<Post[]> {
  try {
    const result = await sanityFetch<{ posts: Post[] | undefined }>({
      query: commissionsGridQuery,
      qParams: { ...options },
    });

    const posts = result?.posts ?? []

    const languagePosts = posts.map((post) => ({
      ...post,
      title: language === 'en' ? post.title_en || post.title : post.title,
      excerpt: language === 'en' ? post.excerpt_en || post.excerpt : post.excerpt,
    }));

    return languagePosts
  } catch (error) {
    console.error('Error fetching posts from commissions grid:', error);
    throw error;
  }
}