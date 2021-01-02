import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

export const TextArea = (props: any) => {
  return <TextInput style={styles.textarea} {...props} />;
};

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 0,
    backgroundColor: 'cyan',
  },
});
