import React, {useContext, useState} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {observer} from 'mobx-react-lite';

import {
  Layout,
  List,
  Divider,
  Icon,
  Button,
  Datepicker,
  Text,
} from '@ui-kitten/components';

import {MSTContext} from '../models/index';

import {EntriesType} from '../types/types';
import Header from '../components/Header';
import EntryCard from '../components/EntryCard';

const data = new Array(8).fill({
  title: 'Item',
  description: 'Description for Item',
});

const AddIcon = (props: any) => <Icon {...props} name="plus-outline" />;

const Entries: React.FC<EntriesType> = observer(({navigation}) => {
  const store = useContext(MSTContext);

  const [tempText, setTempText] = useState('');

  const [date, setDate] = useState(new Date());

  const navigateToDetail = () => {
    navigation.navigate('EntrySingle');
  };

  const renderItem = ({item, index}: any) => (
    <EntryCard
      key={`entrycard-${index + 1}`}
      item={item}
      onPress={navigateToDetail}
    />
  );

  const addNew = () => {
    store.addEntry({
      id: 'test',
      date: 'test',
      desc: tempText,
    });

    setTempText('');
  };

  return (
    <Layout style={styles.container} level="1">
      <Header hideBack navigation={navigation} />
      <Divider />
      <View style={styles.dateWrp}>
        <Text category="c2">Selected date: {date.toLocaleDateString()}</Text>
        <Datepicker date={date} onSelect={(nextDate) => setDate(nextDate)} />
      </View>
      <Divider />
      <List
        style={styles.list}
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
      />

      {store.entries.map((item, i) => (
        <View key={`li-${i}`}>
          <Text>{item.desc}</Text>
        </View>
      ))}

      <>
        <TextInput
          value={tempText}
          onChangeText={(text) => setTempText(text)}
        />
        <Button status="primary" onPress={() => addNew()}>
          Add
        </Button>
      </>

      {/* <View style={styles.btnWrpAbsolute}>
        <Button
          status="primary"
          accessoryLeft={AddIcon}
          style={styles.btnAdd}
          onPress={() => navigateToDetail()}
        />
      </View> */}
    </Layout>
  );
});

export default Entries;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  dateWrp: {
    paddingHorizontal: 16,
  },
  list: {
    // paddingHorizontal: 16,
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
