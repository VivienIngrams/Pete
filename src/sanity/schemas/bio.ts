import { defineType } from 'sanity'

// Reusable localized content schema
const localizedContentSchema = {
  type: 'object',
  fields: [
  
    {
      name: 'biographyText',
      title: 'Première paragraphe de texte (sous la photo de profile, et à gauche sur ordinateur)',
      type: 'blockContent',
    },
    {
      name: 'biographyText2',
      title: 'Texte biographie',
      type: 'blockContent',
    },
    {
      name: 'artisticTraining',
      type: 'array',
      title: 'Formations artistiques',
      of: [{ type: 'string' }],
    },

    {
      name: 'organizer',
      type: 'array',
      title: 'Organisateur, Animateur, Conférencier',
      of: [{ type: 'string' }],
    },

    {
      name: 'exhibitions',
      type: 'array',
      title: 'Expositions et publications',
      of: [{ type: 'string' }],
    },
  ],
}

export default defineType({
  name: 'bioContent',
  title: 'Biographie',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string' },
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
          title: 'Anglais',
          type: 'object',
          fields: localizedContentSchema.fields,
        },
      ],
      description: 'Bloc de contenu riche pour la biographie.',
    },
  ],
})
