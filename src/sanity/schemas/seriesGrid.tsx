import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'grid',
  title: 'Organise order of icons',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seriesGrid',
      title: 'Series to display in icon format',
      description:
        'These are the series that will appear in icon format. First create your series and then add to the list below. You can rearrange the display order by dragging each project.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'post' }, { type: 'commission' }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
