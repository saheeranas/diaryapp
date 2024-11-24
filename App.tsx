import React from 'react';
// import RNBootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import rootStore, {MSTContext} from './src/mst';
import {default as mapping} from './mapping.json';
import FlashMessage from 'react-native-flash-message';

import AppNavigation from './src/navigation/AppNavigation';

const App = () => {
  // useEffect(() => {
  //   RNBootSplash.hide({fade: true});
  // }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={eva.light}
        customMapping={{...eva.mapping, ...mapping}}>
        <MSTContext.Provider value={rootStore}>
          <SafeAreaProvider>
            <GestureHandlerRootView>
              <AppNavigation />
            </GestureHandlerRootView>
          </SafeAreaProvider>
          <FlashMessage position="top" />
        </MSTContext.Provider>
      </ApplicationProvider>
    </>
  );
};

export default App;
