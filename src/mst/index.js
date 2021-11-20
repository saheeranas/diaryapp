import React from 'react';
import {types, destroy} from 'mobx-state-tree';

// Stores
import DiaryEntry from './DiaryEntry';

// Realm DB Ops
import {
  readEntriesFromDB,
  addEntryToDB,
  updateEntryToDB,
  deleteOneEntryFromDB,
} from '../db/entry';

const RootStore = types
  .model({
    entries: types.array(DiaryEntry),
  })
  .views(self => ({
    getData() {
      return self.entries.sort((a, b) => b.date - a.date);
    },
    findEntryByDate(date) {
      return self.entries.filter(e => e.date === date);
    },
  }))
  .actions(self => ({
    populateStoreFromDB() {
      let itemsFromDB = readEntriesFromDB();
      let temp = JSON.parse(JSON.stringify(itemsFromDB));
      self.entries = temp;
    },
    addEntry(entry) {
      self.entries.unshift(entry);
      addEntryToDB(entry);
    },
    updateEntry(entry) {
      let pos = self.entries.findIndex(e => e._id === entry._id);
      if (pos >= 0) {
        self.entries.splice(pos, 1, entry);
      } else {
        self.entries.push(entry);
      }
      updateEntryToDB(entry);
    },
    deleteEntry(entry) {
      // let pos = self.entries.findIndex((e) => e.id === entry.id);
      // self.entries.splice(pos, 1);
      deleteOneEntryFromDB(entry);
      destroy(entry);
    },
  }));

const rootStore = RootStore.create({
  entries: [
    // {
    //   _id: 'b91289ce-c2fe-43ed-9830-f5cb5f222a7b',
    //   date: '2021-11-16',
    //   desc: 'lorem ipsum',
    //   createdAt: 1637330913,
    //   modifiedAt: 1637330913,
    // },
  ],
});

export default rootStore;
export const MSTContext = React.createContext(null);
