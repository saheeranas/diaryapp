import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import {realm} from './index';
import rootStore from '../mst';
import {DiaryEntryOut, DiaryEntryDBType} from '../types/DiaryEntry';
import {DataFromFile} from '../utils/GoogleDrive';

// Read All
const readEntriesFromDB = (): DiaryEntryDBType[] => {
  const entries = realm.objects('Entry').sorted('date', true);
  return JSON.parse(JSON.stringify(entries));
};

// Add
const addEntryToDB = (item: DiaryEntryOut) => {
  const entries = realm.objects('Entry');
  const res = entries.filtered('date == $0', item.date);

  if (res.length) {
    return;
  }

  realm.write(() => {
    realm.create('Entry', {
      _id: item._id,
      date: item.date,
      desc: item.desc,
      createdAt: item.createdAt,
      modifiedAt: item.modifiedAt,
    });
  });
};

// Update
const updateEntryToDB = (item: DiaryEntryDBType) => {
  const entries = realm.objects('Entry');
  const res = entries.filtered('date == $0', item.date);

  if (res.length) {
    realm.write(() => {
      // @ts-ignore
      res[0].desc = item.desc;
      // @ts-ignore
      res[0].modifiedAt = dayjs(new Date()).valueOf();
      // @ts-ignore
      res[0].deleted = false;
    });
  } else {
    realm.write(() => {
      // @ts-ignore
      realm.create('Entry', {
        ...item,
        _id: uuidv4(),
        createdAt: dayjs(new Date()).valueOf(),
        modifiedAt: dayjs(new Date()).valueOf(),
      });
    });
  }
};

// Delete item (Soft)
const softDeleteOneEntryFromDB = (item: DiaryEntryDBType) => {
  const res = realm.objectForPrimaryKey('Entry', item._id);
  if (res) {
    realm.write(() => {
      // @ts-ignore
      res.deleted = true;
      // @ts-ignore
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
  });
};

/**
 * Import from JSON source (Google Drive)
 * @param {*} data - Syncable data from Google Drive and Local combined
 * TODO: Delete functionality
 */
const importToDBFromJSON = (data: DataFromFile) => {
  let dataFromDB = realm.objects('Entry').sorted('date', true);

  // Soft deleted
  // @ts-ignore
  let softDeleted = dataFromDB.filter(item => item.deleted === true);

  realm.write(() => {
    data.entries.forEach(obj => {
      // @ts-ignore
      let itemFoundInDB = dataFromDB.find(item => item._id === obj._id);
      if (!itemFoundInDB) {
        // If does not exist in DB, Create
        realm.create('Entry', obj);
      } else {
        // @ts-ignore
        if (itemFoundInDB.modifiedAt < obj.modifiedAt) {
          // If already exists && modified, Update

          // @ts-ignore
          itemFoundInDB.desc = obj.desc;
          // @ts-ignore
          itemFoundInDB.modifiedAt = obj.modifiedAt;
          // @ts-ignore
          itemFoundInDB.deleted = obj.deleted;
        }
      }
    });

    // Hard delete the soft deleted
    softDeleted.forEach(obj => {
      // @ts-ignore
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
