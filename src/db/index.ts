import Realm from 'realm';

// import {getPassword} from '../utils/password';

// console.log(Realm.defaultPath);

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
