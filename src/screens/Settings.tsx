import React, {useContext, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {observer} from 'mobx-react-lite';
import {Divider, Text, Avatar, Toggle, Icon, Card} from '@ui-kitten/components';

import {MSTContext} from '../models';
import {SettingsType} from '../types/types';
import {Layout} from '../components/Layout';

const Settings: React.FC<SettingsType> = observer(({navigation}) => {
  const store = useContext(MSTContext);
  const [darkMode, setDarkMode] = useState(false);

  const onCheckedChange = isChecked => {
    setDarkMode(isChecked);
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Card>
          <View style={styles.profileCard}>
            <Avatar source={require('../../assets/images/avatar.png')} />
            <View style={styles.prodetails}>
              <Text style={styles.name}>Saheer Anas</Text>
              <Text>saheer@email.com</Text>
            </View>
          </View>
          <Divider />
          <View>
            <View style={styles.menuItem}>
              <Text>Dark Mode</Text>
              <Toggle checked={darkMode} onChange={onCheckedChange}></Toggle>
            </View>
            <Divider />
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <Text>Sync with Drive</Text>
                <Icon style={styles.icon} fill="#8F9BB3" name="sync-outline" />
              </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <Text>Logout</Text>
              </View>
            </TouchableOpacity>
            <Divider />
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
    paddingLeft: 18,
  },
  name: {
    fontWeight: 'bold',
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
  icon: {
    width: 24,
    height: 24,
  },
});
