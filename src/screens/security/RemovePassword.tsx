import React, {useContext, useState} from 'react';
import {StyleSheet, ScrollView, Button, Alert} from 'react-native';

import {observer} from 'mobx-react-lite';
import {Card, Input, Text} from '@ui-kitten/components';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {MSTContext} from '../../mst';
import {RemovePasswordProps} from '../../navigation/types';
import {Layout} from '../../components/Layout';

import {verifyPwdWithStoredHash, deletePassword} from '../../utils/password';

const RemovePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .trim('Password cannot include spaces')
    .min(5, 'Too Short!')
    .required('Required'),
});

interface FormValuesType {
  oldPassword: string;
}

const INITIAL_VALUES: FormValuesType = {
  oldPassword: '',
};

const RemovePassword: React.FC<RemovePasswordProps> = observer(
  ({navigation}) => {
    const store = useContext(MSTContext);
    const [respError, setRespError] = useState('');

    const handleRemovePassword = (values: FormValuesType) => {
      Alert.alert(
        'Confirm Delete?',
        'This action will remove password protection of the app',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'OK', onPress: () => confirmDelete(values)},
        ],
      );
    };

    const confirmDelete = async (values: FormValuesType) => {
      try {
        let status = await verifyPwdWithStoredHash(values.oldPassword);

        // console.log('status', status);

        if (status) {
          store.user.toggleSecurityStatus(false);
          store.user.toggleUnlocked(false);
          deletePassword();
          setTimeout(() => {
            navigation.goBack();
          }, 0);
        } else {
          // Show wrong password message
          setRespError('Password is wrong');
        }
      } catch (error) {
        // console.log(error);
      }
    };

    return (
      <Layout>
        <ScrollView contentContainerStyle={styles.scrollview}>
          <Card style={styles.card}>
            <Text category="s1" style={styles.heading}>
              Remove Password
            </Text>
            <Formik
              initialValues={INITIAL_VALUES}
              validationSchema={RemovePasswordSchema}
              onSubmit={handleRemovePassword}>
              {({
                setFieldValue,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <>
                  <Input
                    placeholder="Current Password"
                    value={values.oldPassword}
                    onChangeText={text => {
                      // trim all whitespaces
                      setFieldValue('oldPassword', text.replace(/\s+/g, ''));
                    }}
                    onBlur={handleBlur('oldPassword')}
                    style={styles.input}
                    textStyle={styles.inputText}
                    secureTextEntry
                    onSubmitEditing={handleSubmit}
                  />
                  {errors.oldPassword && touched.oldPassword ? (
                    <Text style={styles.error}>{errors.oldPassword}</Text>
                  ) : null}
                  {respError ? (
                    <Text style={styles.error}>{respError}</Text>
                  ) : null}

                  <Button title="Submit" onPress={handleSubmit} />
                </>
              )}
            </Formik>
          </Card>
        </ScrollView>
      </Layout>
    );
  },
);

export default RemovePassword;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#E9ECF2',
  },
  scrollview: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  card: {
    width: '100%',
  },
  input: {
    marginBottom: 10,
  },
  inputText: {
    textAlign: 'center',
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
  heading: {
    textAlign: 'center',
    marginBottom: 20,
  },
});
