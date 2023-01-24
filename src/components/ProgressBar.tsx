import React from 'react';
import {StyleSheet, View} from 'react-native';

interface ProgressBarProps {
  color: string;
  progress: number;
}

const ProgressBar = ({color = '#34c759', progress = 0}): ProgressBarProps => {
  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.bar,
          {width: `${progress * 100}%`, backgroundColor: color},
        ]}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ccc',
    borderRadius: 15,
  },
  bar: {
    backgroundColor: '#34c759', //green
    height: 8,
    borderRadius: 15,
  },
});
