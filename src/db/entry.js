import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import {realm} from './index';

// Read All
const readEntriesFromDB = () => {
  const entries = realm.objects('Entry').sorted('date', true);
  return entries;
};

// Add
const addEntryToDB = item => {
  const entries = realm.objects('Entry');
  const res = entries.filtered('date == $0', item.date);

  if (res.length) {
    // console.warn('ADD: Already exists');
    return;
  }

  let entry;
  realm.write(() => {
    entry = realm.create('Entry', {
      ...item,
      _id: item._id,
    });
    // console.log(`created entry: ${entry.date} `);
  });
};

// Update
const updateEntryToDB = item => {
  const entries = realm.objects('Entry');
  const res = entries.filtered('date == $0', item.date);
  let entry;

  if (res.length) {
    // console.log('UPDATE: Already exists');
    realm.write(() => {
      res[0].desc = item.desc;
      res[0].modifiedAt = dayjs(new Date()).valueOf();
    });
  } else {
    // console.log('UPDATE: New');
    realm.write(() => {
      entry = realm.create('Entry', {
        ...item,
        _id: uuidv4(),
        createdAt: dayjs(new Date()).valueOf(),
        modifiedAt: dayjs(new Date()).valueOf(),
      });
      // console.log(`Created entry: ${entry.date} `);
    });
  }
};

// Delete item
const deleteOneEntryFromDB = item => {
  const resItem = realm.objectForPrimaryKey('Entry', item._id);
  realm.write(() => {
    realm.delete(resItem);
  });
};

// Delete All
const deleteAllEntriesFromDB = () => {
  realm.write(() => {
    // Delete all objects from the realm.
    realm.deleteAll();
    // console.log('Cleared');
  });
};

export {
  readEntriesFromDB,
  addEntryToDB,
  updateEntryToDB,
  deleteOneEntryFromDB,
  deleteAllEntriesFromDB,
};
