import React, {useContext} from 'react';
import {StyleSheet, ScrollView, Button} from 'react-native';

import {observer} from 'mobx-react-lite';
import {Card, Input, Text} from '@ui-kitten/components';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {showMessage} from 'react-native-flash-message';

import {MSTContext} from '../../mst';
import {SetPasswordProps} from '../../navigation/types';
import {Layout} from '../../components/Layout';

import {setPassword} from '../../utils/password';

const SetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .trim('Password cannot include spaces')
    .min(1, 'Too Short!')
    .required('Required'),
  confirm: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match',
  ),
});

interface FormValuesType {
  password: string;
  confirm: string;
}

const INITIAL_VALUES: FormValuesType = {
  password: '',
  confirm: '',
};

const SetPassword: React.FC<SetPasswordProps> = observer(({navigation}) => {
  const store = useContext(MSTContext);

  const handleSetPassword = async (values: FormValuesType) => {
    try {
      let status = await setPassword(values.password);
      if (status) {
        showMessage({
          message: 'Password changed successfully',
          type: 'success',
        });
        store.user.toggleSecurityStatus(true);
        navigation.goBack();
      } else {
        showMessage({
          message: 'Failed',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Failed',
        type: 'danger',
      });
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Card style={styles.card}>
          <Text category="s1" style={styles.heading}>
            Set Password
          </Text>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={SetPasswordSchema}
            onSubmit={handleSetPassword}>
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
                <Button title="Set" onPress={handleSubmit} />
              </>
            )}
          </Formik>
        </Card>
      </ScrollView>
    </Layout>
  );
});

export default SetPassword;

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
