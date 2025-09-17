import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'home',
  title: 'Image Première Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string' },
    {
      name: 'mainImages',
      type: 'array',
      title: 'Image(s) pour Home Page',
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
})
