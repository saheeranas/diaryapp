import {SnapshotIn, SnapshotOut} from 'mobx-state-tree';

import User from '../mst/User';

interface UserIn extends SnapshotIn<typeof User> {}
interface UserOut extends SnapshotOut<typeof User> {}

type UserDBType = Omit<UserOut, 'isSecure' | 'isUnlocked'>;

type UserSettingsType = {
  _id: string;
  isAutoSync?: boolean;
  lastSynced?: number;
};

export type {UserIn, UserOut, UserDBType, UserSettingsType};
