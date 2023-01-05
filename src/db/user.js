import {realm} from './index';

export const UserSchema = {
  name: 'User',
  properties: {
    _id: 'string',
    name: 'string',
    email: 'string',
    photo: 'string',
    lastSynced: {type: 'string', default: ''},
    isAutoSync: {type: 'bool', default: false},
  },
  primaryKey: '_id',
};

const SETTINGS_ITEMS = ['lastSynced', 'isAutoSync'];

// Read user info
const getUserFromDB = () => {
  const users = realm.objects('User');
  return users.length ? users[0] : null;
};

// Update user info
const updateUserToDB = user => {
  const users = realm.objects('User');
  const res = users.filtered('_id == $0', user.id);

  if (res.length) {
    realm.write(() => {
      res[0]._id = user.id;
      res[0].name = user.name;
      res[0].email = user.email;
      res[0].photo = user.photo;
    });
  } else {
    realm.write(() => {
      realm.create('User', {
        _id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      });
    });
  }
};

// Update user settings info
const updateUserSettingsToDB = user => {
  const users = realm.objects('User');
  const res = users.filtered('_id == $0', user.id);

  let {_id, ...rest} = user;

  if (res.length) {
    realm.write(() => {
      for (const prop in rest) {
        if (SETTINGS_ITEMS.includes(prop)) {
          res[0][prop] = rest[prop];
        }
      }
      // res[0].lastSynced = user.lastSynced;
    });
  }
};

// Clear user info
const clearUserFromDB = () => {
  const users = realm.objects('User');

  realm.write(() => {
    realm.delete(users);
  });
};

export {getUserFromDB, updateUserToDB, updateUserSettingsToDB, clearUserFromDB};
