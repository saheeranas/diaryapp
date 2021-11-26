import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Layout as UILayout} from '@ui-kitten/components';

export const Layout = ({children}) => {
  return <UILayout style={styles.layout}>{children}</UILayout>;
};

// export const Layout = ({children}) => {
//   return <UIKLayout style={styles.layout}>{children}</UIKLayout>;
// };

const styles = StyleSheet.create({
  layout: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#E9ECF2',
  },
});
