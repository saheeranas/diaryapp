import React from 'react';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {Layout as UILayout, LayoutProps} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';

export const Layout = ({children}: LayoutProps) => {
  return (
    <SafeAreaView style={styles.safearea}>
      <StatusBar backgroundColor="#E9ECF2" barStyle="dark-content" />
      <UILayout style={styles.layout}>{children}</UILayout>
    </SafeAreaView>
  );
};

// export const Layout = ({children}) => {
//   return <UIKLayout style={styles.layout}>{children}</UIKLayout>;
// };

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
