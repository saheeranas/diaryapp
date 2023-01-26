import React, {useContext, useState, useRef} from 'react';
import {StyleSheet, ScrollView, Button} from 'react-native';

import {observer} from 'mobx-react-lite';
import {Card, Input, Text} from '@ui-kitten/components';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {showMessage} from 'react-native-flash-message';

import {MSTContext} from '../../mst';
import {ChangePasswordProps} from '../../navigation/types';
import {Layout} from '../../components/Layout';

import {updatePassword} from '../../utils/password';

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .trim('Password cannot include spaces')
    .min(5, 'Too Short!')
    .required('Required'),
  password: Yup.string()
    .trim('Password cannot include spaces')
    .min(5, 'Too Short!')
    .required('Required'),
  confirm: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match',
  ),
});

interface FormValuesType {
  oldPassword: string;
  password: string;
  confirm: string;
}

const INITIAL_VALUES: FormValuesType = {
  oldPassword: '',
  password: '',
  confirm: '',
};

const ChangePassword: React.FC<ChangePasswordProps> = observer(
  ({navigation}) => {
    const store = useContext(MSTContext);
    const [respError, setRespError] = useState('');

    const passwordRef = useRef<Input>(null);
    const confirmPasswordRef = useRef<Input>(null);

    const handleChangePassword = async (values: FormValuesType) => {
      let {oldPassword, password} = values;
      try {
        let status = await updatePassword(oldPassword, password);
        if (status) {
          showMessage({
            message: 'Password changed successfully',
            type: 'success',
          });
          navigation.goBack();
        } else {
          showMessage({
            message: 'Current password is incorrect',
            type: 'danger',
          });
          setRespError('Password is wrong');
        }
      } catch (error) {
        setRespError('Error. Please try again');
      }
    };

    return (
      <Layout>
        <ScrollView contentContainerStyle={styles.scrollview}>
          <Card style={styles.card}>
            <Text category="s1" style={styles.heading}>
              Change Password
            </Text>
            <Formik
              initialValues={INITIAL_VALUES}
              validationSchema={ChangePasswordSchema}
              onSubmit={handleChangePassword}>
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
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (passwordRef.current !== null) {
                        passwordRef.current.focus();
                      }
                    }}
                  />
                  {errors.oldPassword && touched.oldPassword ? (
                    <Text style={styles.error}>{errors.oldPassword}</Text>
                  ) : null}
                  {respError ? (
                    <Text style={styles.error}>{respError}</Text>
                  ) : null}

                  <Input
                    ref={passwordRef}
                    placeholder="Password"
                    value={values.password}
                    onChangeText={text => {
                      // trim all whitespaces
                      setFieldValue('password', text.replace(/\s+/g, ''));
                    }}
                    onBlur={handleBlur('password')}
                    style={styles.input}
                    textStyle={styles.inputText}
                    secureTextEntry
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (confirmPasswordRef.current !== null) {
                        confirmPasswordRef.current.focus();
                      }
                    }}
                  />
                  {errors.password && touched.password ? (
                    <Text style={styles.error}>{errors.password}</Text>
                  ) : null}

                  <Input
                    ref={confirmPasswordRef}
                    placeholder="Confirm Password"
                    value={values.confirm}
                    onChangeText={text => {
                      // trim all whitespaces
                      setFieldValue('confirm', text.replace(/\s+/g, ''));
                    }}
                    onBlur={handleBlur('confirm')}
                    style={styles.input}
                    textStyle={styles.inputText}
                    secureTextEntry
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit}
                  />
                  {errors.confirm && touched.confirm ? (
                    <Text style={styles.error}>{errors.confirm}</Text>
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

export default ChangePassword;

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
