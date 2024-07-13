import React, {useContext} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {observer} from 'mobx-react-lite';
import {Calendar, LocaleConfig, DateData} from 'react-native-calendars';
import dayjs from 'dayjs';
import {MSTContext} from '../mst';
import {JumpProps} from '../navigation/types';
import {Layout} from '../components/Layout';

interface CalendarMarkedValue {
  marked: boolean;
}

LocaleConfig.locales.en = {
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

const Jump: React.FC<JumpProps> = observer(({navigation}) => {
  const store = useContext(MSTContext);

  let markedDates = store.entries.reduce((acc, current) => {
    acc[dayjs(current.date).format('YYYY-MM-DD')] = {marked: true};
    return acc;
  }, {} as Record<string, CalendarMarkedValue>);

  const navigateToDetail = (date: DateData) => {
    navigation.navigate('EntrySingle', {date: date.dateString});
  };

  let today = dayjs(new Date()).format('YYYY-MM-DD');

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Calendar
          testID="JumpScreen.Calendar"
          current={today}
          minDate={'2020-01-01'}
          maxDate={today}
          enableSwipeMonths={true}
          onDayPress={(day: DateData) => navigateToDetail(day)}
          markedDates={markedDates}
          theme={{
            dotColor: '#4361ee',
            selectedDotColor: '#4361ee',
            todayTextColor: '#4361ee',
            arrowColor: '#4361ee',
            indicatorColor: '#4361ee',
          }}
        />
      </ScrollView>
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
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
