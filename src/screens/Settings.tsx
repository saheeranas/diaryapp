import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {observer} from 'mobx-react-lite';
import {Divider, Text, Avatar, Icon, Card, Toggle} from '@ui-kitten/components';

import {MSTContext} from '../mst';
import {SettingsType} from '../types/types';
import {Layout} from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import {SettingsMenuItem} from '../components/SettingsMenu';

import {useGoogleDrive} from '../utils/GoogleDrive';
import dayjs from 'dayjs';

const Settings: React.FC<SettingsType> = observer(({navigation}) => {
  const store = useContext(MSTContext);
  // const [darkMode, setDarkMode] = useState(false);

  const {status, signInWithGoogle, signOut, exportToGDrive} = useGoogleDrive();

  // const onCheckedChange = isChecked => {
  //   setDarkMode(isChecked);
  // };

  const handleLogin = async () => {
    try {
      let userInfo = await signInWithGoogle();
      // console.log('userInfo', userInfo);
      store.user.updateUser(userInfo?.user);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleSync = () => {
    exportToGDrive();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout?',
      'User will be logged out from Google account.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => confirmLogout()},
      ],
    );
  };

  const confirmLogout = async () => {
    try {
      let userInfo = await signOut();
      store.user.removeUser();
    } catch (error) {
      // console.log(error);
    }
  };

  const formatEmail = (email: string = '') => {
    let temp =
      email.substring(0, 10) +
      '..' +
      email.substring(email.length - 10, email.length);
    return email.length > 20 ? temp : email;
  };

  const navigateTo = screen => {
    navigation.navigate(screen);
  };

  const autoSyncToggleHandler = () => {
    store.user.toggleAutoSync();
  };

  const isLogined = store.user._id !== '';
  const isSecured = store.user.isSecure;

  const avatar = store?.user?.photo
    ? {uri: store.user.photo}
    : require('../../assets/images/avatar.png');

  // console.log('store.user.isSecure', store.user.isSecure);

  // console.log(store);

  const isAutoSyncEnabled = store?.user?.isAutoSync || false;

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Card disabled>
          <View style={styles.profileCard}>
            <Avatar source={avatar} />
            <View style={styles.prodetails}>
              {!isLogined ? (
                <Button title="Login" onPress={handleLogin} />
              ) : (
                <>
                  <Text style={styles.name}>{store.user.name}</Text>
                  <Text>{formatEmail(store.user.email)}</Text>
                </>
              )}
            </View>
          </View>

          <Divider />
          <View>
            {/* <View style={styles.menuItem}>
              <Text>Dark Mode</Text>
              <Toggle checked={darkMode} onChange={onCheckedChange}></Toggle>
            </View>
            <Divider /> */}
            {isLogined && (
              <>
                <TouchableOpacity
                  onPress={handleSync}
                  disabled={status.label !== ''}>
                  <View style={styles.menuItem}>
                    <Text>Sync</Text>
                    <Icon
                      style={styles.icon}
                      fill="#8F9BB3"
                      name="sync-outline"
                    />
                  </View>
                  {status.label !== '' && (
                    <View>
                      <Text style={styles.statusText}>{status.label}</Text>
                      <ProgressBar
                        progress={status.value}
                        color={
                          status.label === 'Failed' ? '#ff3b30' : '#34c759'
                        }
                      />
                    </View>
                  )}
                </TouchableOpacity>
                {store.user.lastSynced !== 0 && (
                  <View>
                    <Text style={styles.lastSyncedText}>
                      Last Sync:{' '}
                      {dayjs(store.user.lastSynced).format(
                        'YYYY MMM DD dddd hh mm A',
                      )}
                    </Text>
                  </View>
                )}
                <Divider />
              </>
            )}

            {/* {isLogined && (
              <View style={styles.menuItem}>
                <Text>Auto Sync</Text>
                <Toggle
                  checked={isAutoSyncEnabled}
                  onChange={autoSyncToggleHandler}
                />
              </View>
            )} */}

            <SettingsMenuItem label="Manage Password" icon="sync-outline">
              {isSecured ? (
                <>
                  <SettingsMenuItem
                    label="Change Password"
                    onPress={() => navigateTo('ChangePassword')}
                  />
                  <SettingsMenuItem
                    label="Remove Password"
                    onPress={() => navigateTo('RemovePassword')}
                  />
                </>
              ) : (
                <SettingsMenuItem
                  label="Set Password"
                  onPress={() => navigateTo('SetPassword')}
                />
              )}
            </SettingsMenuItem>
            {isLogined && (
              <SettingsMenuItem label="Logout" onPress={handleLogout} />
            )}
            {isSecured && (
              <SettingsMenuItem
                label="Lock"
                icon="lock-outline"
                onPress={() => store.user.toggleUnlocked(false)}
              />
            )}
          </View>
        </Card>
      </ScrollView>
    </Layout>
  );
});

export default Settings;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#E9ECF2',
  },
  scrollview: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 15,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginRight: 16,
  },
  prodetails: {
    justifyContent: 'center',
    paddingHorizontal: 18,
    // flexShrink: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  email: {
    // flex: 1,
    // flexWrap: 'wrap',
    flexShrink: 1,
  },
  menuItem: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
  },
  statusText: {
    fontSize: 12,
    marginBottom: 5,
  },
  lastSyncedText: {
    fontSize: 11,
    fontStyle: 'italic',
    marginVertical: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
