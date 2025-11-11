import { SchemaTypeDefinition } from 'sanity'

import bio from './bio'
import blockContent from './blockContent'
import commission from './commission'
import home from './homePage'
import post from './post'
import grid from './seriesGrid'


export const schemaTypes = [post, blockContent]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, blockContent, commission, home, bio, grid],
}
