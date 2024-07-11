import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {observer, Observer} from 'mobx-react-lite';
import {toJS} from 'mobx';

import {List} from '@ui-kitten/components';

import {MSTContext} from '../mst';

import {EntriesProps} from '../navigation/types';
import {Layout} from '../components/Layout';
import EntryCard from '../components/EntryCard';
import NoData from '../components/NoData';
import Search from '../components/Search';

const Entries: React.FC<EntriesProps> = observer(({navigation}) => {
  const store = useContext(MSTContext);
  const [searchQuery, setSearchQuery] = useState('');

  const dummy = (status: boolean) => {
    if (!status) {
      setSearchQuery('');
    }
  };

  const handleSearchInput = (q: string) => {
    setSearchQuery(q);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Search onToggle={dummy} onChangeText={handleSearchInput} />
      ),
    });
  }, [navigation]);

  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshData();
    refreshOtherData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshData = () => {
    setRefreshing(true);
    store.populateStoreFromDB();
    setRefreshing(false);
  };

  const refreshOtherData = () => {
    store.user.populateUserFromDB();
  };

  // EXPERINMENTAL: Auto Sync
  // useEffect(() => {
  //   // const now = dayjs();
  //   // const lastSyncTime =
  //   //   store?.user.lastSynced !== '' ? dayjs(store?.user.lastSynced) : dayjs();
  //   // const difference = now.diff(lastSyncTime, 'hour');
  //   // console.log('store: ', store);
  //   // console.log('difference: ', difference);
  //   // If used logined && AutoSync enabled && last synced time is greater than 2 hrs
  //   // if (store.user._id !== '' && store.user.isAutoSync && difference > 2) {
  //   //   exportToGDrive();
  //   // }
  // });

  const navigateToDetail = (date = '') => {
    navigation.navigate('EntrySingle', {date});
  };

  const filteredData = store.entries.filter(item =>
    item.desc.includes(searchQuery),
  );

  const renderItem = ({item}: any) => {
    return (
      <Observer>
        {() => (
          <EntryCard
            key={`entrycard-${item._id}`}
            // item={item}
            desc={item.desc}
            date={item.date}
            onPress={() => navigateToDetail(item.date)}
          />
        )}
      </Observer>
    );
  };

  console.log(filteredData);

  return (
    <Layout>
      {/* <Search onToggle={dummy} /> */}
      <List
        style={styles.list}
        contentContainerStyle={styles.contentContainerStyle}
        data={filteredData}
        extraData={toJS(store.entries)}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={refreshData}
        ListEmptyComponent={
          <NoData title="Add a new entry by pressing + button" />
        }
      />
    </Layout>
  );
});

export default Entries;

const styles = StyleSheet.create({
  dateWrp: {
    paddingHorizontal: 16,
  },
  list: {
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#E9ECF2',
  },
  contentContainerStyle: {
    paddingBottom: 100,
    flexGrow: 1,
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
