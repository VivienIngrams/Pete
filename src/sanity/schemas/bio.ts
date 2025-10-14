import { defineType } from 'sanity'

// Reusable localized content schema
const localizedContentSchema = {
  type: 'object',
  fields: [
  
    {
      name: 'biographyText',
      title: 'Text',
      type: 'blockContent',
    },
    {
      name: 'biographyText2',
      title: 'Text',
      type: 'blockContent',
    },
    {
      name: 'artisticTraining',
      type: 'array',
      title: 'Commissions',
      of: [{ type: 'string' }],
    },

    {
      name: 'organizer',
      type: 'array',
      title: 'Publications',
      of: [{ type: 'string' }],
    },

    {
      name: 'exhibitions',
      type: 'array',
      title: 'Exhibitions',
      of: [{ type: 'string' }],
    },
  ],
}

export default defineType({
  name: 'bioContent',
  title: 'About Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Une image liée à la biographie.',
    },
    {
      name: 'biography',
      title: 'Biographie',
      type: 'object',
      fields: [
        {
          name: 'fr',
          title: 'Français',
          type: 'object',
          fields: localizedContentSchema.fields,
        },
        {
          name: 'en',
          title: 'English',
          type: 'object',
          fields: localizedContentSchema.fields,
        },
      ],
      description: 'Text for the biography',
    },
  ],
})
