import React, {useContext} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {observer} from 'mobx-react-lite';
import {Divider} from '@ui-kitten/components';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import dayjs from 'dayjs';

import {MSTContext} from '../mst';
import {JumpType} from '../types/types';
import {Layout} from '../components/Layout';

LocaleConfig.locales['en'] = {
  formatAccessibilityLabel: "dddd d 'of' MMMM 'of' yyyy",
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

LocaleConfig.defaultLocale = 'en';

const Jump: React.FC<JumpType> = observer(({navigation}) => {
  const store = useContext(MSTContext);

  let markedDates = store.entries.reduce((acc, current) => {
    acc[dayjs(current.date).format('YYYY-MM-DD')] = {marked: true};
    return acc;
  }, {});

  const navigateToDetail = (date = null) => {
    navigation.navigate('EntrySingle', {date: date.dateString});
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        {/* <LayoutInner> */}
        <Calendar
          current={new Date()}
          minDate={'2020-01-01'}
          maxDate={new Date()}
          enableSwipeMonths={true}
          onDayPress={day => navigateToDetail(day)}
          markedDates={markedDates}
        />
        {/* </LayoutInner> */}
      </ScrollView>
      {/* <View style={{flex: 1, backgroundColor: 'magenta'}}></View> */}
    </Layout>
  );
});

export default Jump;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#E9ECF2',
  },
  scrollview: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 15,
  },
});
