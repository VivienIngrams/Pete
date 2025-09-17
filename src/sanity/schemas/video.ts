import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'videoPage',
    title: 'Page Vidéos',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Titre de la page',
        type: 'string',
      },
      {
        name: 'videos',
        title: 'Vidéos',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Titre vidéo',
                type: 'string',
              },
              {
                name: 'videoId',
                title: 'Copiez e collez ici la dernière partie de l adresse de la page du vidéo sur Youtube, qui suit "v="... Par exemple, pour https://www.youtube.com/watch?v=vr-43dDHWSA il faut le code vr-43dDHWSA)',
                type: 'string',
              }
            ],
            preview: {
              select: {
                title: 'title',
                media: 'videoId'
              },
            
            }
          }
        ]
      }
    ]
  })
  