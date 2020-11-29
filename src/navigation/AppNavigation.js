import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Entries from '../screens/Entries';
import EntrySingle from '../screens/EntrySingle';

const Stack = createStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Entries" component={Entries} />
        <Stack.Screen name="EntrySingle" component={EntrySingle} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
