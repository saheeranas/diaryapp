import React from 'react';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import rootStore, {MSTContext} from './src/models';
import {default as mapping} from './mapping.json';

import AppNavigation from './src/navigation/AppNavigation';

const App = () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
      <MSTContext.Provider value={rootStore}>
        <AppNavigation />
      </MSTContext.Provider>
    </ApplicationProvider>
  </>
);

// if (__DEV__) {
//   import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
// }

export default App;
