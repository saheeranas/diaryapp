import {SnapshotIn, SnapshotOut} from 'mobx-state-tree';

import DiaryEntry from '../mst/DiaryEntry';

interface DiaryEntryIn extends SnapshotIn<typeof DiaryEntry> {}
interface DiaryEntryOut extends SnapshotOut<typeof DiaryEntry> {}

interface DiaryEntryDBType extends DiaryEntryIn {
  deleted: boolean;
}

export type {DiaryEntryIn, DiaryEntryOut, DiaryEntryDBType};
