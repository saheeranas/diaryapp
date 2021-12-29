import React, {useContext} from 'react';
import {StyleSheet, ScrollView, Button} from 'react-native';

import {observer} from 'mobx-react-lite';
import {Card, Input, Text} from '@ui-kitten/components';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {MSTContext} from '../../mst';
import {PasswordType} from '../../types/types';
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

const ChangePassword: React.FC<PasswordType> = observer(({navigation}) => {
  const store = useContext(MSTContext);

  const handleChangePassword = async values => {
    let {oldPassword, password} = values;
    try {
      let status = updatePassword(oldPassword, password);
      navigation.goBack();
    } catch (error) {}
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Card style={styles.card}>
          <Text category="s1" style={styles.heading}>
            Change Password
          </Text>
          <Formik
            initialValues={{oldPassword: '', password: '', confirm: ''}}
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
                />
                {errors.oldPassword && touched.oldPassword ? (
                  <Text style={styles.error}>{errors.oldPassword}</Text>
                ) : null}

                <Input
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
                />
                {errors.password && touched.password ? (
                  <Text style={styles.error}>{errors.password}</Text>
                ) : null}

                <Input
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
});

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
