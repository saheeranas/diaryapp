import React from 'react';
import {StyleSheet} from 'react-native';

import {ListItem} from '@ui-kitten/components';

const EntryCard = ({item, onPress}) => {
  return (
    <ListItem
      title={item.date.toDateString()}
      description={item.desc}
      style={styles.listItem}
      onPress={onPress}
    />
  );
};

export default EntryCard;

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 20,
  },
});
