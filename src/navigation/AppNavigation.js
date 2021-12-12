import * as React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ui-kitten/components';

// Tab
import Entries from '../screens/Entries';
import Jump from '../screens/Jump';
import Settings from '../screens/Settings';
import EntrySingle from '../screens/EntrySingle';

// Settings Stack
import SetPassword from '../screens/security/SetPassword';
import ChangePassword from '../screens/security/ChangePassword';
import RemovePassword from '../screens/security/RemovePassword';

import Header from '../components/Header';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Settings Stack
export const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({navigation, route, options}) => {
          return (
            <Header
              title={options.tabBarLabel}
              navigation={navigation}
              hideBack={!options.headerBackBtnShown}
            />
          );
        },
      }}>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{tabBarLabel: 'Settings'}}
      />
      <Stack.Screen
        name="SetPassword"
        component={SetPassword}
        options={{tabBarLabel: 'New Password', headerBackBtnShown: true}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{tabBarLabel: 'Update Password', headerBackBtnShown: true}}
      />
      <Stack.Screen
        name="RemovePassword"
        component={RemovePassword}
        options={{tabBarLabel: 'Remove Password', headerBackBtnShown: true}}
      />
    </Stack.Navigator>
  );
};

export default function AppNavigation() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator headerMode="none">
        <Stack.Screen name="Entries" component={Entries} />
        <Stack.Screen name="EntrySingle" component={EntrySingle} />
      </Stack.Navigator> */}
      <Tab.Navigator
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#4361ee',
          tabBarInactiveTintColor: '#6c757d',
          tabBarStyle: {
            height: 60,
            bottom: 15,
            marginHorizontal: 15,
            borderRadius: 5,
            position: 'absolute',
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
          header: ({navigation, route, options}) => {
            return (
              <Header
                title={options.tabBarLabel}
                navigation={navigation}
                hideBack={!options.headerBackBtnShown}
              />
            );
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
          name="SettingsStack"
          component={SettingsStack}
          options={{
            tabBarLabel: 'Settings',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon style={styles.icon} fill={color} name="settings-outline" />
            ),
          }}
        />
        {/* <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({color, size}) => (
              <Icon style={styles.icon} fill={color} name="settings-outline" />
            ),
          }}
        /> */}
        <Tab.Screen
          name="EntrySingle"
          component={EntrySingle}
          options={{
            tabBarLabel: 'New',
            tabBarIcon: ({color, size}) => (
              <Icon style={styles.icon} fill={color} name="plus-outline" />
            ),
            headerBackBtnShown: true,
            unmountOnBlur: true,
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
