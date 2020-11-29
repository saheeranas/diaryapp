import React from 'react';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';

import AppNavigation from './src/navigation/AppNavigation';

const App = () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <AppNavigation />
    </ApplicationProvider>
  </>
);

export default App;
