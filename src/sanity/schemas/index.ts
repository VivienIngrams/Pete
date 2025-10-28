import { SchemaTypeDefinition } from 'sanity'

import bio from './bio'
import blockContent from './blockContent'
import home from './homePage'
import post from './post'
import grid from './seriesGrid'
import commission from './commission'


export const schemaTypes = [post, blockContent]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, blockContent, commission, home, bio, grid],
}
