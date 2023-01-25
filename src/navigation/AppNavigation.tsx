import * as React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ui-kitten/components';
import {observer} from 'mobx-react-lite';

import {MSTContext} from '../mst';

// Functions
import {getPasswordStatus} from '../utils/password';

// Password
import Password from '../screens/security/Password';

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

interface ScreenOptType {
  hideBackBtn?: boolean;
}

const ScreenOpts: Record<string, ScreenOptType> = {
  Password: {hideBackBtn: true},
  Entries: {hideBackBtn: true},
  Jump: {hideBackBtn: true},
  EntrySingle: {hideBackBtn: false},
  Settings: {hideBackBtn: true},
  SetPassword: {hideBackBtn: false},
  ChangePassword: {hideBackBtn: false},
  RemovePassword: {hideBackBtn: false},
};

// Types
import {
  RootStackParamList,
  RootTabParamList,
  SettingsStackParamList,
} from './types';

// Navigators Definition
const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<SettingsStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

let FLAG = false;

// Settings Stack
export const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({navigation, route, options}) => {
          return (
            <Header
              title={options.title}
              navigation={navigation}
              hideBack={Boolean(ScreenOpts[route.name]?.hideBackBtn)}
            />
          );
        },
      }}>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{title: 'Settings'}}
      />
      <Stack.Screen
        name="SetPassword"
        component={SetPassword}
        options={{title: 'New Password'}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{title: 'Update Password'}}
      />
      <Stack.Screen
        name="RemovePassword"
        component={RemovePassword}
        options={{title: 'Remove Password'}}
      />
    </Stack.Navigator>
  );
};

const AppNavigation = observer(() => {
  const store = React.useContext(MSTContext);

  React.useEffect(() => {
    void (async function fetchPasswordStatus() {
      getPasswordStatus().then(res => {
        store.user.toggleSecurityStatus(res ? true : false);
      });
    })();
  }, []);

  FLAG = store.user.isSecure ? (store.user.isUnlocked ? true : false) : true;

  return (
    <NavigationContainer>
      {!FLAG ? (
        <RootStack.Navigator>
          <RootStack.Screen name="Password" component={Password} />
        </RootStack.Navigator>
      ) : (
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
            },
            tabBarItemStyle: {
              paddingVertical: 5,
            },
            header: ({navigation, route, options}) => {
              return (
                <Header
                  title={options.tabBarLabel}
                  navigation={navigation}
                  hideBack={Boolean(ScreenOpts[route.name]?.hideBackBtn)}
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
                <Icon
                  style={styles.icon}
                  fill={color}
                  name="calendar-outline"
                />
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
                <Icon
                  style={styles.icon}
                  fill={color}
                  name="settings-outline"
                />
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
              unmountOnBlur: true,
            }}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
});

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});

export default AppNavigation;
