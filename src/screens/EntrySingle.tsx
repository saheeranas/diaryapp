import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Card, Icon, Button, Text} from '@ui-kitten/components';

import {MSTContext} from '../models';

import {EntrySingleType} from '../types/types';
import Header from '../components/Header';
import {Layout} from '../components/Layout';

const DeleteIcon = (props: any) => <Icon {...props} name="trash-2-outline" />;
const SaveIcon = (props: any) => <Icon {...props} name="save-outline" />;

const initialText = '';

const EntrySingle: React.FC<EntrySingleType> = observer(
  ({route, navigation}) => {
    const store = useContext(MSTContext);
    const editorRef = useRef(null);
    const [inputData, setInputData] = React.useState(initialText);
    const [active, setActive] = useState(null);
    const [editable, setEditable] = useState(false);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setInputData(initialText);
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

      return unsubscribe;
    }, [route, navigation, store]);

    const deleteEntry = () => {
      // Clear entry from text input
      setInputData(initialText);

      // Delete from Store
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
      }

      // setInputData(initialText);
    };

    const focusInput = () => {
      editorRef.current.focus();
    };

    return (
      <Layout level="1">
        <ScrollView contentContainerStyle={styles.scrollview}>
          <Card>
            <View style={styles.inner}>
              <TouchableOpacity onPress={() => setEditable(true)}>
                <TextInput
                  ref={editorRef}
                  value={inputData}
                  style={styles.textArea}
                  multiline={true}
                  onChangeText={(text: string) => setInputData(text)}
                  onBlur={addEntry}
                  // autoFocus={true}
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
            </View>
          </Card>
        </ScrollView>
      </Layout>
    );
  },
);

export default EntrySingle;

const styles = StyleSheet.create({
  scrollview: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 15,
  },
  inner: {
    paddingVertical: 5,
  },
  textArea: {
    height: 180,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderRadius: 8,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: '#E9ECF2',
  },
  btnWrp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
