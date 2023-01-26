import Realm from 'realm';

// Import Schemas
import {EntrySchema} from './entry';
import {UserSchema} from './user';

// Initialization
export const realm = new Realm({
  schema: [EntrySchema, UserSchema],
});

// Close DB
export const closeDB = () => {
  realm.close();
};
