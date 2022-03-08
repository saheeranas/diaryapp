import React from 'react';
import {StyleSheet} from 'react-native';
import {Layout as UILayout} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';

export const Layout = ({children}) => {
  return (
    <SafeAreaView style={styles.safearea}>
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
