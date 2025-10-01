import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'home',
  title: 'Image Première Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string' },
    {
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
})
