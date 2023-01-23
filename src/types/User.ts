import {SnapshotIn, SnapshotOut} from 'mobx-state-tree';

import User from '../mst/User';

export interface UserIn extends SnapshotIn<typeof User> {}
export interface UserOut extends SnapshotOut<typeof User> {}
