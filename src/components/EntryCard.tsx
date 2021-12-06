import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';

import {Text} from '@ui-kitten/components';
import dayjs from 'dayjs';

interface EntryCardProps {
  item: any;
  onPress: () => void;
}

const EntryCard: React.FC<EntryCardProps> = ({item: {desc, date}, onPress}) => {
  const day = dayjs(date).format('DD');
  const rest = dayjs(date).format('MMM');
  return (
    <Pressable style={styles.listItem} onPress={onPress}>
      <View style={styles.listItemInner}>
        <View style={styles.dateWrp}>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.date}>{rest}</Text>
        </View>
        <Text style={styles.desc}>{desc.substr(0, 50)}</Text>
      </View>
    </Pressable>
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
    fontWeight: 'bold',
    marginRight: 5,
  },
  date: {
    fontSize: 14,
    color: '#333333',
  },
  desc: {
    fontSize: 15,
    color: '#333333',
  },
});
