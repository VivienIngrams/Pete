import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Projets',
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
      name: 'section',
      title: 'Sur quelle page veux-tu rajouter ce projet?',
      type: 'string',
      options: {
        list: [
          { title: 'Page principale Galeries', value: 'gallery' },
          { title: 'Collaborations', value: 'collaborations' },
          { title: 'Projets actuels', value: 'projets-actuels' },
      
        ],
        layout: 'radio', 
      },
      initialValue: 'gallery', 
    },
    {
      name: 'mainImages',
      type: 'array',
      title: 'Images (2 à 5) pour représenter le projet (dans Galéries/Collaborations/Projets Actuels) ',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'layout',
      title: 'Format image pour page principale',
      type: 'string',
      options: {
        list: [
          { title: 'Carré', value: 'square' },
          { title: 'Portrait', value: 'portrait' },
          { title: 'Paysage', value: 'landscape' },
          { title: 'Panorama', value: 'panorama' },
        ],
        layout: 'radio', // Radio button selection
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
    {
      name: 'subtitles',
      title: 'Sous-titres',
      type: 'array',
      of: [{ type: 'string' }], // Array of strings
      description: 'Optional subtitles for images. Each subtitle corresponds to an image in the same order.',
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
