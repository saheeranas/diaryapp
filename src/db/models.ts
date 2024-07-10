import Realm from 'realm';

class Entry extends Realm.Object {
  _id!: string;
  date: string = '';
  desc: string = '';
  createdAt: number | undefined;
  modifiedAt: number | undefined;
  deleted: boolean = false;

  static schema: Realm.ObjectSchema = {
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
      // deleted: Boolean
      deleted: {type: 'bool', default: false},
    },
    primaryKey: '_id',
  };
}

class User extends Realm.Object {
  _id!: string;
  name: string = '';
  email: string = '';
  photo: string = '';
  lastSynced: number = 0;
  isAutoSync: boolean = false;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    properties: {
      _id: 'string',
      name: 'string',
      email: 'string',
      photo: 'string',
      lastSynced: {type: 'int', default: 0},
      isAutoSync: {type: 'bool', default: false},
    },
    primaryKey: '_id',
  };
}

export {Entry, User};
