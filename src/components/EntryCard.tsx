import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Text, ListItem} from '@ui-kitten/components';

const EntryCard = ({item}) => {
  return (
    <ListItem
      title={`${item.title}`}
      description={`${item.description}`}
      accessoryLeft={renderItemIcon}
      style={styles.listItem}
    />
  );
};

const renderItemIcon = (props) => (
  <View>
    <Text category="c2">04 May</Text>
    <Text category="c1">2020</Text>
  </View>
);

export default EntryCard;

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 20,
  },
});
