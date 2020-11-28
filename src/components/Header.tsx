import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Icon,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const BackAction = () => <TopNavigationAction icon={BackIcon} />;

const Header: React.FC = () => {
  return (
    <TopNavigation
      accessoryLeft={BackAction}
      title="Diary"
      alignment="center"
    />
  );
};

export default Header;

const styles = StyleSheet.create({});
