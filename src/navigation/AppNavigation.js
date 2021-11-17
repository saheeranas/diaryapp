import 'react-native-gesture-handler';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ui-kitten/components';

import Entries from '../screens/Entries';
import Jump from '../screens/Jump';
import Settings from '../screens/Settings';
import EntrySingle from '../screens/EntrySingle';

// const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator headerMode="none">
        <Stack.Screen name="Entries" component={Entries} />
        <Stack.Screen name="EntrySingle" component={EntrySingle} />
      </Stack.Navigator> */}
      <Tab.Navigator
        tabBarOptions={{
          // activeTintColor: colors.primary1,
          // inactiveTintColor: colors.fontColorDark1,
          // showIcon: true,
          style: {
            height: 60,
            bottom: 15,
            marginHorizontal: 15,
            borderRadius: 5,
            // position: 'absolute',
            // backgroundColor: colors.layout_bg_color,
            // shadowColor: colors.inverse,
            // shadowOffset: {
            //   width: 0,
            //   height: 0,
            // },
            // shadowOpacity: 0.3,
            // shadowRadius: 4.65,
            // elevation: 8,
          },
          tabStyle: {
            paddingVertical: 10,
          },
        }}>
        <Tab.Screen
          name="Entries"
          component={Entries}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <Icon style={styles.icon} fill={color} name="list-outline" />
            ),
          }}
        />
        <Tab.Screen
          name="Jump"
          component={Jump}
          options={{
            tabBarLabel: 'Jump',
            tabBarIcon: ({color, size}) => (
              <Icon style={styles.icon} fill={color} name="calendar-outline" />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({color, size}) => (
              <Icon style={styles.icon} fill={color} name="settings-outline" />
            ),
          }}
        />
        <Tab.Screen
          name="EntrySingle"
          component={EntrySingle}
          options={{
            tabBarLabel: 'New',
            tabBarIcon: ({color, size}) => (
              <Icon style={styles.icon} fill={color} name="plus-outline" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});
