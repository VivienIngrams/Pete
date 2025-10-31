import { defineType } from 'sanity'

// Reusable localized content schema
const localizedContentSchema = {
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section title',
      type: 'string',
      description: 'Title for this localized biography section (e.g. "Me" / "Moi")',
    },
    {
      name: 'biographyText',
      title: 'Text',
      type: 'blockContent',
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

    // Top-level "biography" now contains two sections: personal and critic.
    // Each section contains localized objects for 'fr' and 'en', and each localized object
    // uses the localizedContentSchema (title + biographyText).
    {
      name: 'biography',
      title: 'Biographie',
      type: 'object',
      fields: [
        {
          name: 'personal',
          title: 'Personal Section',
          type: 'object',
          fields: [
            {
              name: 'fr',
              title: 'Français (Personal)',
              type: 'object',
              fields: localizedContentSchema.fields,
            },
            {
              name: 'en',
              title: 'English (Personal)',
              type: 'object',
              fields: localizedContentSchema.fields,
            },
          ],
        },
        {
          name: 'critic',
          title: 'Critic Section',
          type: 'object',
          fields: [
            {
              name: 'fr',
              title: 'Français (Critic)',
              type: 'object',
              fields: localizedContentSchema.fields,
            },
            {
              name: 'en',
              title: 'English (Critic)',
              type: 'object',
              fields: localizedContentSchema.fields,
            },
          ],
        },
      ],
      description:
        'Two biography sections (personal and critic), each localized for fr and en. Each localized object contains a title and blockContent.',
    },
  ],
})
