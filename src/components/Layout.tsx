import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Layout} from '@ui-kitten/components';

export const LayoutInner = ({children}) => {
  return <Layout style={styles.layout}>{children}</Layout>;
};

const styles = StyleSheet.create({
  layout: {
    borderRadius: 5,
    paddingVertical: 10,
  },
});
