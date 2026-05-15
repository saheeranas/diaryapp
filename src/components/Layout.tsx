import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native'; 
import {Layout as UILayout, LayoutProps} from '@ui-kitten/components';

export const Layout = ({children}: LayoutProps) => {
  return (
    <View style={styles.safearea}>
      <StatusBar backgroundColor="#E9ECF2" barStyle="dark-content" />
      <UILayout style={styles.layout}>{children}</UILayout>
    </View>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1, 
  },
  layout: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#E9ECF2',
  },
});
