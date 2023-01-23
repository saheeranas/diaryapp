import {types} from 'mobx-state-tree';
import {
  getUserFromDB,
  updateUserToDB,
  updateUserSettingsToDB,
  clearUserFromDB,
} from '../db/user';

const User = types
  .model('User', {
    _id: types.string,
    name: types.string,
    email: types.string,
    photo: types.string,
    isSecure: types.boolean, // true if user opted for password protection
    isUnlocked: types.boolean, // true if user unlocked from password screen
    lastSynced: types.number,
    isAutoSync: types.boolean,
  })
  .views(self => ({
    getData() {
      return self;
    },
  }))
  .actions(self => ({
    populateUserFromDB() {
      let itemFromDB = getUserFromDB();
      if (!itemFromDB) return;
      let temp = JSON.parse(JSON.stringify(itemFromDB));
      self._id = temp._id;
      self.name = temp.name;
      self.email = temp.email;
      self.photo = temp.photo;
      self.lastSynced = temp.lastSynced;
      self.isAutoSync = temp.isAutoSync;
    },
    updateUser(user) {
      self._id = user.id;
      self.name = user.name;
      self.email = user.email;
      self.photo = user.photo;

      updateUserToDB(user);
    },
    removeUser() {
      self._id = '';
      self.name = '';
      self.email = '';
      self.photo = '';

      clearUserFromDB();
    },
    toggleSecurityStatus(status) {
      self.isSecure = status;
    },
    toggleUnlocked(status) {
      self.isUnlocked = status;
    },
    updateLastSynced(status) {
      // "YYYY MMM DD dddd hh mm A"
      self.lastSynced = status;
      updateUserSettingsToDB({
        _id: self._id,
        lastSynced: status,
      });
    },
    toggleAutoSync() {
      let res = !self.isAutoSync;
      self.isAutoSync = res;
      updateUserSettingsToDB({
        _id: self._id,
        isAutoSync: res,
      });
    },
  }));

export default User;
