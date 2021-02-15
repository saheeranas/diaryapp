import React, {forwardRef} from 'react';
import {TextInput, StyleSheet} from 'react-native';

export const TextArea = forwardRef((props: any, ref) => {
  return <TextInput ref={ref} style={styles.textarea} {...props} />;
});

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 0,
    backgroundColor: 'cyan',
  },
});
