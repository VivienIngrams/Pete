import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'commission',
  title: 'Commissions',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre (Français)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'CLICK on the button "Generate" to automatically create the url',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    {
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    defineField({
      name: 'excerpt_en',
      title: 'Text (English)',
      type: 'blockContent',
    }),
    defineField({
      name: 'excerpt',
      title: 'Texte (Français)',
      type: 'blockContent',
    }),
    {
      name: 'images',
      type: 'array',
      title: 'All photos from the series',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title_fr',
              type: 'string',
              title: 'Titre (Français)',
            },
            {
              name: 'title_en',
              type: 'string',
              title: 'Title (English)',
            },
            {
              name: 'excerpt_fr',
              type: 'blockContent',
              title: 'Texte (Français)',
             
            },
            {
              name: 'excerpt_en',
              type: 'blockContent',
              title: 'Text (English)',
              
            },
          ],
          preview: {
            select: {
              title: 'title_fr',
              media: 'image',
            },
          },
        },
      ],
    }
    
  
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImages.0', // Preview the first image
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
