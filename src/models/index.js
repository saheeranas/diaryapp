import React from 'react';
import {types, destroy} from 'mobx-state-tree';

// Stores
import DiaryEntry from './DiaryEntry';

const RootStore = types
  .model({
    entries: types.array(DiaryEntry),
  })
  .views((self) => ({
    getData() {
      return self.entries;
    },
    findEntryByDate(date) {
      return self.entries.filter((e) => e.date.toDateString() === date);
    },
  }))
  .actions((self) => ({
    addEntry(entry) {
      self.entries.push(entry);
    },
    updateEntry(entry) {
      let pos = self.entries.findIndex((e) => e.id === entry.id);
      self.entries.splice(pos, 1, entry);
    },
    deleteEntry(entry) {
      // let pos = self.entries.findIndex((e) => e.id === entry.id);
      // self.entries.splice(pos, 1);
      destroy(entry);
    },
  }));

const rootStore = RootStore.create({
  entries: [
    // {
    //   id: 'qwe1',
    //   date: new Date(),
    //   desc: 'lorem ipsum',
    //   createdAt: new Date(),
    //   modifiedAt: new Date(),
    // },
    // {
    //   id: 'qwe2',
    //   date: new Date(Date.now() - 86400000),
    //   desc: 'This is yesterday post',
    //   createdAt: new Date(Date.now() - 86400000),
    //   modifiedAt: new Date(Date.now() - 86400000),
    // },
  ],
});

export default rootStore;
export const MSTContext = React.createContext(null);
