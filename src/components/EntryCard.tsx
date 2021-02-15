import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import {ListItem, Text} from '@ui-kitten/components';

const EntryCard = ({item, onPress}) => {
  return (
    <TouchableOpacity style={styles.listItem}>
      <View style={styles.listItemInner}>
        <View style={styles.dateWrp}>
          <Text style={styles.day}>02</Text>
          <Text style={styles.date}>Jan 2021</Text>
        </View>
        <Text>{item.desc}</Text>
      </View>
    </TouchableOpacity>
  );
}; 

export default EntryCard;

const styles = StyleSheet.create({
  listItem: {
    marginBottom: 10,
  },
  listItemInner: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  dateWrp: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  day: {
    fontSize: 14,
    color: '#333333',
  },
  date: {
    fontSize: 14,
    color: '#333333',
  },
  desc: {
    fontSize: 14,
    color: '#333333',
  },
});
