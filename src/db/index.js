import Realm from 'realm';

// Import Schemas
import {UserSchema} from './user';

// Declaration
const EntrySchema = {
  name: 'Entry',
  properties: {
    // _id: uuid4()
    _id: 'string',
    // date: 2021-11-15
    date: 'string',
    // desc: Random strings
    desc: 'string',
    // createdAt: UNIX timestamp
    createdAt: 'int',
    // modifiedAt: UNIX timestamp
    modifiedAt: 'int',
  },
  primaryKey: '_id',
};

// Initialization
export const realm = new Realm({
  schema: [EntrySchema, UserSchema],
});
