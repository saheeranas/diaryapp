import {realm} from './index';
import {UserOut, UserSettingsType} from '../types/User';

const SETTINGS_ITEMS = ['lastSynced', 'isAutoSync'];

// Read user info
const getUserFromDB = () => {
  const users = realm.objects('User');
  return users.length ? users[0] : null;
};

// Update user info
const updateUserToDB = (
  user: Pick<UserOut, '_id' | 'name' | 'email' | 'photo'>,
) => {
  const users = realm.objects('User');
  const res = users.filtered('_id == $0', user._id);

  if (res.length > 0) {
    realm.write(() => {
      // @ts-ignore
      res[0]._id = user._id;
      // @ts-ignore
      res[0].name = user.name;
      // @ts-ignore
      res[0].email = user.email;
      // @ts-ignore
      res[0].photo = user.photo;
    });
  } else {
    try {
      realm.write(() => {
        // @ts-ignore
        realm.create('User', {
          _id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
        });
      });
    } catch (error) {}
  }
};

// Update user settings info
const updateUserSettingsToDB = (user: UserSettingsType) => {
  const users = realm.objects('User');
  const res = users.filtered('_id == $0', user._id);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  let {_id, ...rest} = user;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  if (res.length) {
    realm.write(() => {
      for (const prop in rest) {
        if (SETTINGS_ITEMS.includes(prop)) {
          // @ts-ignore
          res[0][prop] = rest[prop];
        }
      }
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
