import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';

import {Card, Icon, Button, Text} from '@ui-kitten/components';

import {MSTContext} from '../mst';

import {EntrySingleType} from '../types/types';
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
          tempDate = dayjs(new Date(route.params.date)).format('YYYY-MM-DD');
        } else {
          tempDate = dayjs(new Date()).format('YYYY-MM-DD');
        }
        const temp = store.findEntryByDate(tempDate);
        if (temp.length) {
          setActive(temp[0]);
          setInputData(temp[0].desc);
        } else {
          let newItem = {
            _id: uuidv4(),
            date: dayjs(tempDate).format('YYYY-MM-DD'),
            desc: '',
            createdAt: dayjs(tempDate).valueOf(),
            modifiedAt: dayjs(tempDate).valueOf(),
          };
          setActive(newItem);
        }
      });

      return unsubscribe;
    }, [route, navigation, store]);

    const deleteEntry = () => {
      Alert.alert(
        'Are you sure?',
        'This will permanently delete the entry from the device',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'OK', onPress: () => confirmDelete()},
        ],
      );
    };

    const confirmDelete = () => {
      // Clear entry from text input
      setInputData(initialText);

      // Delete from Store
      if (active) {
        store.deleteEntry(active);
        setActive(null);
        navigation.goBack();
      }
    };

    const addEntry = () => {
      if (inputData.trim() !== '') {
        if (!active) {
          store.addEntry({
            _id: uuidv4(),
            date: dayjs(new Date()).format('YYYY-MM-DD'),
            desc: inputData,
            createdAt: dayjs(new Date()).valueOf(),
            modifiedAt: dayjs(new Date()).valueOf(),
          });
        } else {
          store.updateEntry({
            _id: active._id,
            date: active.date,
            createdAt: active.createdAt,
            desc: inputData,
            modifiedAt: dayjs(new Date()).valueOf(),
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
