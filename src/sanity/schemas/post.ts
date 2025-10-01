import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Projects',
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
      title: 'Cliquez sur le bouton Generate',
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
      title: 'Toutes les images du projet',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
  
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
