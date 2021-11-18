import React from 'react';
import {types, destroy} from 'mobx-state-tree';

// Stores
import DiaryEntry from './DiaryEntry';

const RootStore = types
  .model({
    entries: types.array(DiaryEntry),
  })
  .views(self => ({
    getData() {
      return self.entries;
    },
    findEntryByDate(date) {
      return self.entries.filter(e => e.date.toDateString() === date);
    },
  }))
  .actions(self => ({
    addEntry(entry) {
      self.entries.push(entry);
    },
    updateEntry(entry) {
      let pos = self.entries.findIndex(e => e.id === entry.id);
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
    {
      id: 'qwe1',
      date: new Date(),
      desc: 'lorem ipsum',
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
    {
      id: 'qwe2',
      date: new Date(Date.now() - 2 * 86400000),
      desc: "This is yesterday's post",
      createdAt: new Date(Date.now() - 2 * 86400000),
      modifiedAt: new Date(Date.now() - 2 * 86400000),
    },
    {
      id: 'qwe3',
      date: new Date(Date.now() - 3 * 86400000),
      desc: "This is day before yesterday's post",
      createdAt: new Date(Date.now() - 3 * 86400000),
      modifiedAt: new Date(Date.now() - 3 * 86400000),
    },
    {
      id: 'qwe4',
      date: new Date(Date.now() - 4 * 86400000),
      desc: 'This post is 3 day older',
      createdAt: new Date(Date.now() - 4 * 86400000),
      modifiedAt: new Date(Date.now() - 4 * 86400000),
    },
    {
      id: 'qwe5',
      date: new Date(Date.now() - 5 * 86400000),
      desc: "This is day before yesterday's post",
      createdAt: new Date(Date.now() - 5 * 86400000),
      modifiedAt: new Date(Date.now() - 5 * 86400000),
    },
    {
      id: 'qwe6',
      date: new Date(Date.now() - 6 * 86400000),
      desc: 'This post is 3 day older',
      createdAt: new Date(Date.now() - 6 * 86400000),
      modifiedAt: new Date(Date.now() - 6 * 86400000),
    },
  ],
});

export default rootStore;
export const MSTContext = React.createContext(null);
