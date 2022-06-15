import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '@ui-kitten/components';

interface NoDataProps {
  title: string;
}

const NoData = ({title = 'No Data'}: NoDataProps) => {
  return (
    <View style={styles.wrapper}>
      <Text status="basic" category="p2">
        {title}
      </Text>
    </View>
  );
};

export default NoData;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
