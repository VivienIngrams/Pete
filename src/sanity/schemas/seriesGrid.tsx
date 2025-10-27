import { defineArrayMember,defineField, defineType } from 'sanity'

export default defineType({
  name: 'grid',
  title: 'Icons on Main page',
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
      title: 'Series to display on main page in grid format',
      description:
        'These are the series that will appear on your main page. First create your series and then add to the list below. You can rearrange the display order by dragging each project.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'post' }],
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
