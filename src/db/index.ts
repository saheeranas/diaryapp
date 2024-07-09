import Realm from 'realm';

// Import Schemas
import {Entry, User} from './models';

// Initialization
export const realm = new Realm({
  schema: [User, Entry],
});

// Close DB
export const closeDB = () => {
  realm.close();
};
