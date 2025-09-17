import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from '@portabletext/types'

interface PostContentProps {
  post: {
    title?: string
    excerpt?: PortableTextBlock[]
    section?: string
  }
}

function PostContent({ post }: PostContentProps) {
  const customComponents = {
    marks: {
      strong: ({ children }: { children: React.ReactNode }) => (
        <strong className="font-bold">{children}</strong>
      ),
    },
  }

  return (
<div
      className={`w-full h-full xl:h-[94%] relative xl:fixed xl:max-w-[25vw] min-[1800px]:max-w-[23vw] xl:top-0 xl:left-0 xl:bg-white pb-6 xl:py-16 px-4 xl:pl-7 z-40 ${
        post.section === 'gallery' ? 'pt-44' : 'pt-36'
      }`}
    >      {/* Gradient Space */}
      <div className="hidden xl:block absolute top-0 left-[24vw] min-[1800px]:left-[23vw] xl:w-[5vw] bg-gradient-to-r from-white via-white/70 to-transparent h-full"></div>
      <div className="xl:h-[80vh] flex flex-col justify-start xl:justify-center">
        {/* Title */}
        <h1 className="text-2xl xl:text-4xl font-cinzel font-medium tracking-tighter xl:mt-16">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="mt-3 font-arsenal">
            <PortableText value={post.excerpt} components={customComponents} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PostContent
