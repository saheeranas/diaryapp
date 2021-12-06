import {types} from 'mobx-state-tree';
import {getUserFromDB, updateUserToDB, clearUserFromDB} from '../db/user';

const User = types
  .model('User', {
    _id: types.string,
    name: types.string,
    email: types.string,
    photo: types.string,
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
  }));

export default User;