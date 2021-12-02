import {realm} from './index';

export const UserSchema = {
  name: 'User',
  properties: {
    _id: 'string',
    name: 'string',
    email: 'string',
    photo: 'string',
  },
  primaryKey: '_id',
};

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
        ...user,
        _id: user.id,
      });
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

export {getUserFromDB, updateUserToDB, clearUserFromDB};
