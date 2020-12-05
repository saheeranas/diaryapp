import React from 'react';
import {types} from 'mobx-state-tree';

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
  }))
  .actions((self) => ({
    addEntry(entry) {
      self.entries.push(entry);
    },
  }));

const rootStore = RootStore.create({
  entries: [
    {
      id: 'qwe',
      date: 'afd',
      desc: 'lorem ipsum',
    },
  ],
});

export default rootStore;
export const MSTContext = React.createContext(null);
