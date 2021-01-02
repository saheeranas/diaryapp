import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Layout, Divider, Icon, Button, Text} from '@ui-kitten/components';

import {MSTContext} from '../models';

import {EntrySingleType} from '../types/types';
import Header from '../components/Header';
import {TextArea} from '../components/Form';

const DeleteIcon = (props: any) => <Icon {...props} name="trash-2-outline" />;
const SaveIcon = (props: any) => <Icon {...props} name="save-outline" />;

const initialText = '';

const EntrySingle: React.FC<EntrySingleType> = observer(
  ({route, navigation}) => {
    const store = useContext(MSTContext);
    const [inputData, setInputData] = React.useState(initialText);
    const [active, setActive] = useState(null);
    const [editable, setEditable] = useState(false);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        let tempDate;
        if (route.params) {
          tempDate = new Date(route.params.date);
        } else {
          tempDate = new Date();
        }
        const temp = store.findEntryByDate(tempDate.toDateString());
        if (temp.length) {
          setActive(temp[0]);
          setInputData(temp[0].desc);
        }
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }, [route]);

    const deleteEntry = () => {
      // Clear entry from text input
      setInputData(initialText);

      // Delete from DB
      if (active) {
        store.deleteEntry(active);
      }
    };

    const addEntry = () => {
      if (inputData.trim() !== '') {
        if (!active) {
          store.addEntry({
            id: 'qwe',
            date: new Date(),
            desc: inputData,
            createdAt: new Date(),
            modifiedAt: new Date(),
          });
        } else {
          store.updateEntry({
            id: active.id,
            date: active.date,
            createdAt: active.createdAt,
            desc: inputData,
            modifiedAt: new Date(),
          });
        }
        navigation.goBack();
      }

      // setInputData(initialText);
    };

    return (
      <Layout style={styles.container} level="1">
        <Header
          hideBack={false}
          navigation={navigation}
          // title={date.toDateString()}
          title="Test"
        />
        <Divider />
        <View style={styles.inner}>
          <TouchableOpacity onPress={() => setEditable(true)}>
            <TextArea
              editable={editable}
              value={inputData}
              style={styles.textArea}
              multiline={true}
              onChangeText={(text: string) => setInputData(text)}
              onBlur={() => setEditable(false)}
            />
          </TouchableOpacity>
          <View style={styles.btnWrp}>
            <Button
              status="danger"
              accessoryLeft={DeleteIcon}
              appearance="outline"
              onPress={deleteEntry}
            />
            <Button
              status="primary"
              accessoryLeft={SaveIcon}
              onPress={addEntry}>
              Save
            </Button>
          </View>
          <>
            {store.entries.map((item, i) => (
              <View key={i}>
                <Text>{item.desc}</Text>
              </View>
            ))}
          </>
        </View>
      </Layout>
    );
  },
);

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
