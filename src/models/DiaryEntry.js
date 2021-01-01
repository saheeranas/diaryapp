import {types} from 'mobx-state-tree';

const DiaryEntry = types.model('DiaryEntry', {
  id: types.identifier,
  date: types.Date,
  desc: types.string,
  createdAt: types.Date,
  modifiedAt: types.Date,
});

export default DiaryEntry;
