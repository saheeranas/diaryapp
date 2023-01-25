import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {observer, Observer} from 'mobx-react-lite';
import {toJS} from 'mobx';
// import dayjs from 'dayjs';

import {List} from '@ui-kitten/components';

// import {readEntriesFromDB, deleteAllEntriesFromDB} from '../db/entry';
import {MSTContext} from '../mst';

import {EntriesType} from '../types/types';
import {Layout} from '../components/Layout';
import EntryCard from '../components/EntryCard';
import NoData from '../components/NoData';

// import {useGoogleDrive} from '../utils/GoogleDrive';

const Entries: React.FC<EntriesType> = observer(({navigation}) => {
  const store = useContext(MSTContext);

  // const {exportToGDrive} = useGoogleDrive();

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

  const navigateToDetail = (date = null) => {
    navigation.navigate('EntrySingle', {date});
  };

  // console.log(store);

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

  return (
    <Layout>
      <List
        style={styles.list}
        contentContainerStyle={styles.contentContainerStyle}
        data={store.entries}
        extraData={toJS(store.entries)}
        renderItem={renderItem}
        // ItemSeparatorComponent={Divider}
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
