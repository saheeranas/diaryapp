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
  const rest = `${dayjs(date).format('MMM')} ${dayjs(date)
    .format('YYYY')
    .toString()
    .substr(-2)}`;
  const dayStr = dayjs(date).format('ddd');
  return (
    <Pressable style={styles.listItem} onPress={onPress}>
      <View style={styles.listItemInner}>
        <View style={styles.dateWrp}>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.date}>{rest}</Text>
          <Text style={styles.dayStr}>{dayStr}</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateWrp: {
    marginBottom: 3,
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#ccc',
    paddingRight: 8,
    width: 42,
  },
  day: {
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  date: {
    fontSize: 10,
    color: '#333333',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  dayStr: {
    fontSize: 10,
    color: '#333333',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  desc: {
    fontSize: 15,
    color: '#333333',
    paddingLeft: 8,
  },
});
