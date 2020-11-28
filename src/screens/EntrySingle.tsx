import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Layout, Divider, Icon, Button, Text} from '@ui-kitten/components';

import Header from '../components/Header';
import {TextArea} from '../components/Form';

const DeleteIcon = (props) => <Icon {...props} name="trash-2-outline" />;
const SaveIcon = (props) => <Icon {...props} name="save-outline" />;

const initialText = '';

const EntrySingle = () => {
  const [inputData, setInputData] = React.useState(initialText);

  const deleteEntry = () => {
    // Clear entry from text input
    setInputData(initialText);

    // Delete from DB
    // ...
  };
  return (
    <Layout style={styles.container} level="1">
      <Header />
      <Divider />
      <View style={styles.inner}>
        <TextArea
          value={inputData}
          style={styles.textArea}
          multiline={true}
          onChangeText={(text) => setInputData(text)}
        />
        <View style={styles.btnWrp}>
          <Button
            status="danger"
            accessoryLeft={DeleteIcon}
            appearance="outline"
            onPress={deleteEntry}
          />
          <Button status="primary" accessoryLeft={SaveIcon}>
            Save
          </Button>
        </View>
      </View>
    </Layout>
  );
};

export default EntrySingle;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  inner: {
    paddingHorizontal: 20,
  },
  textArea: {
    height: 300,
    borderWidth: 1,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  btnWrp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
