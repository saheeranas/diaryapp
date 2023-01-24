import {types} from 'mobx-state-tree';

const DiaryEntry = types.model('DiaryEntry', {
  // _id: uuid4()
  _id: types.string,
  // date: 2021-11-15
  date: types.string,
  // desc: Random strings
  desc: types.string,
  // createdAt: UNIX timestamp
  createdAt: types.number,
  // modifiedAt: UNIX timestamp
  modifiedAt: types.number,
});

export default DiaryEntry;
