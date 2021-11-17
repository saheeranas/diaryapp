import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {observer, Observer} from 'mobx-react-lite';
import {toJS} from 'mobx';

import {
  Layout,
  List,
  Divider,
  Icon,
  Button,
  Datepicker,
  Text,
} from '@ui-kitten/components';

import {MSTContext} from '../models';

import {EntriesType} from '../types/types';
import Header from '../components/Header';
import EntryCard from '../components/EntryCard';

const AddIcon = (props: any) => <Icon {...props} name="plus-outline" />;

const Entries: React.FC<EntriesType> = observer(({navigation}) => {
  const store = useContext(MSTContext);

  const navigateToDetail = (date = null) => {
    // console.log('here');
    navigation.navigate('EntrySingle', {date});
  };

  const renderItem = ({item}: any) => {
    return (
      <Observer>
        {() => (
          <EntryCard
            key={`entrycard-${item.id}`}
            item={item}
            onPress={() => navigateToDetail(item.date.toJSON())}
          />
        )}
      </Observer>
    );
  };

  return (
    <Layout style={styles.container}>
      <Header hideBack navigation={navigation} />
      <Divider />
      {/* <View style={styles.dateWrp}>
        <Text category="c2">Selected date: {date.toLocaleDateString()}</Text>
        <Datepicker date={date} onSelect={(nextDate) => setDate(nextDate)} />
      </View>
      <Divider /> */}
      <List
        style={styles.list}
        data={store.entries}
        extraData={toJS(store.entries)}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
      />
    </Layout>
  );
});

export default Entries;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#E9ECF2',
  },
  dateWrp: {
    paddingHorizontal: 16,
  },
  list: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    // height: 200,
    // flex: 0.5,
  },
  btnWrpAbsolute: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  btnAdd: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
});
