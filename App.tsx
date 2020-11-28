import React from 'react';
import {StyleSheet} from 'react-native';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';

import Entries from './src/screens/Entries';
import EntrySingle from './src/screens/EntrySingle';

const App = () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <Entries />
      {/* <EntrySingle /> */}
    </ApplicationProvider>
  </>
);

export default App;

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  likeButton: {
    marginVertical: 16,
  },
});
