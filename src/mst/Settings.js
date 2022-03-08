import {types} from 'mobx-state-tree';

const Settings = types
  .model('Settings', {
    lastSynced: types.string,
  })
  .views(self => ({}))
  .actions(self => ({
    updateLastSynced(status) {
      self.lastSynced = status;
    },
    removeLastSynced() {
      self.lastSynced = '';
    },
  }));

export default Settings;
