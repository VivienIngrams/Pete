import type { PortableTextBlock } from '@portabletext/types'
import groq from 'groq'
import { type SanityClient } from 'next-sanity'

import { sanityFetch } from './sanity.client'


// GROQ query to fetch posts by section
const postsBySectionQuery = (section: string) => groq`
*[_type == "post" && section == $section ]  {
  _id,
  _createdAt,
  title,
  title_en,
  slug,
  excerpt,
  excerpt_en,
  subtitles,
  mainImages,
  layout
}`

export async function getPosts(
  client: SanityClient,
  section: 'gallery' | 'projets-actuels' | 'collaborations',
  language: 'en' | 'fr' | string = 'fr',
  options = {}
): Promise<Post[]> {
  try {
    const posts = await sanityFetch<Post[]>({
      query: postsBySectionQuery(section),
      qParams: { section, ...options },
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

// Query to fetch a single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug ][0] {
    _id,
    title,
    title_en,
    slug,
    section,
    excerpt,
    excerpt_en,
    subtitles,
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
  mainImages: any[] 
  title: string
  title_en?: string
  subtitles?: string[]
  excerpt?: PortableTextBlock[]
  excerpt_en?: PortableTextBlock[]
  section?: 'gallery' | 'projets-actuels' | 'collaborations'
  layout: 'portrait' | 'square' | 'landscape'
  images?: any[]
}

// Query to fetch the home page data
export const homePageQuery = groq`
  *[_type == "home"][0] {
    mainImages[] 
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

export type Video = {
title: string
videoId: string
}

// GROQ query to fetch videos
const videosQuery = groq`
  *[_type == "videoPage"][0] {
    title,
    "videos": videos[] {
      title,
      videoId
    }
  }
`


  // Function to fetch videos
  export async function getVideos(
    client: SanityClient,
    options = {}
  ): Promise<Video[]> {
    try {
      const result = await client.fetch(videosQuery, options)
      return result.videos || []
    } catch (error) {
      console.error('Error fetching videos:', error)
      throw error
    }
  }
  