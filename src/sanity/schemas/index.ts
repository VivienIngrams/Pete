import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import home from './homePage'
import post from './post'
import bio from './bio'
import video from './video'

export const schemaTypes = [post, blockContent]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, blockContent, home, bio, video],
}
