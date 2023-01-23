import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import {realm} from './index';
import rootStore from '../mst';
import {DiaryEntryOut, DiaryEntryDBType} from '../types/DiaryEntry';

// Declaration
export const EntrySchema = {
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

// Read All
const readEntriesFromDB = () => {
  const entries = realm.objects('Entry').sorted('date', true);
  return entries;
};

// Add
const addEntryToDB = (item: DiaryEntryOut) => {
  const entries = realm.objects('Entry');
  const res = entries.filtered('date == $0', item.date);

  if (res.length) {
    // console.warn('ADD: Already exists');
    return;
  }

  let entry;
  realm.write(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entry = realm.create('Entry', {
      ...item,
      _id: item._id,
    });

    // console.log(`created entry: ${entry.date} `);
  });
};

// Update
const updateEntryToDB = (item: DiaryEntryDBType) => {
  const entries = realm.objects('Entry');
  const res = entries.filtered('date == $0', item.date);
  let entry;

  if (res.length) {
    // console.log('UPDATE: Already exists');
    realm.write(() => {
      res[0].desc = item.desc;
      res[0].modifiedAt = dayjs(new Date()).valueOf();
      res[0].deleted = false;
    });
  } else {
    // console.log('UPDATE: New');
    realm.write(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// Delete item (Soft)
const softDeleteOneEntryFromDB = (item: DiaryEntryDBType) => {
  const res = realm.objectForPrimaryKey('Entry', item._id);
  if (res) {
    realm.write(() => {
      res.deleted = true;
      res.modifiedAt = dayjs(new Date()).valueOf();
    });
  }
};

// Delete item (Hard)
const deleteOneEntryFromDB = (item: DiaryEntryDBType) => {
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

/**
 * Import from JSON source (Google Drive)
 * @param {*} data - Syncable data from Google Drive and Local combined
 * TODO: Delete functionality
 */
const importToDBFromJSON = data => {
  let dataFromDB = readEntriesFromDB();
  // console.log('syncable Data:', data);
  // console.log('DB Data:', dataFromDB);
  realm.write(() => {
    data.entries.forEach(obj => {
      let itemFoundInDB = dataFromDB.find(item => item._id === obj._id);
      if (!itemFoundInDB) {
        // If does not exist in DB, Create
        realm.create('Entry', obj);
      } else {
        if (itemFoundInDB.modifiedAt < obj.modifiedAt) {
          // If already exists && modified, Update
          itemFoundInDB.desc = obj.desc;
          itemFoundInDB.modifiedAt = obj.modifiedAt;
        }
      }
    });
  });
  // Hard delete the soft deleted
  let softDeleted = dataFromDB.filter(item => item.deleted === true);
  realm.write(() => {
    softDeleted.forEach(obj => {
      realm.delete(obj);
    });
  });
  rootStore.populateStoreFromDB();
};

export {
  readEntriesFromDB,
  addEntryToDB,
  updateEntryToDB,
  softDeleteOneEntryFromDB,
  deleteOneEntryFromDB,
  deleteAllEntriesFromDB,
  importToDBFromJSON,
};
