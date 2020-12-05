import {types} from 'mobx-state-tree';

const DiaryEntry = types.model('DiaryEntry', {
  //   id: types.identifier,
  id: types.string,
  date: types.string,
  desc: types.string,
});

export default DiaryEntry;
