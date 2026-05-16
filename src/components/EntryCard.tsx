import React from 'react';
import {StyleSheet, View, Pressable, GestureResponderEvent, Text} from 'react-native';

import dayjs from 'dayjs';

interface EntryCardProps {
  // item: any;
  desc: string;
  date: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  // onPress: () => void;
}

const EntryCard: React.FC<EntryCardProps> = ({desc, date, onPress}) => {
  const day = dayjs(date).format('DD');
  const rest = `${dayjs(date).format('MMM')} ${dayjs(date)
    .format('YYYY')
    .toString()
    .substr(-2)}`;
  // const dayStr = dayjs(date).format('ddd');
  return (
    <Pressable style={styles.listItem} onPress={onPress}>
      <View style={styles.listItemInner}>
        <View style={styles.dateWrp}>
          <Text style={styles.day}>{day} </Text> 
          <Text style={styles.date}>{rest}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="clip">{desc.slice(0, 35)}</Text>
        <Text style={styles.desc} numberOfLines={1} ellipsizeMode="clip">{desc.slice(50, 100)}</Text>
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
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#e8e2d9',
    borderRadius: 16, 
  },
  dateWrp: { 
    marginBottom: 8,  
    paddingRight: 8, 
    flexDirection: "row",
    alignItems: 'center',
  },
  day: { 
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold', 
  },
  date: {
    fontSize: 14,
    color: '#333333', 
    textTransform: 'uppercase',
  },
  dayStr: {
    fontSize: 10,
    color: '#333333',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: '#333333',  
    marginBottom: 3
  },
  desc: {
    fontSize: 16,
    color: '#333333', 
    flex: 1, 
  },
});
