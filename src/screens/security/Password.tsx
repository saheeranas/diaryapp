import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Button,
  TouchableWithoutFeedback,
  ImageProps,
} from 'react-native';

import {observer} from 'mobx-react-lite';
import {Card, Input, Text, Icon} from '@ui-kitten/components';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {showMessage} from 'react-native-flash-message';

import {MSTContext} from '../../mst';
import {PasswordProps} from '../../navigation/types';
import {Layout} from '../../components/Layout';

import {verifyPwdWithStoredHash} from '../../utils/password';
import {RenderProp} from '@ui-kitten/components/devsupport';

const UnlockSchema = Yup.object().shape({
  password: Yup.string()
    .trim('Password cannot include spaces')
    .min(5, 'Too Short!')
    .required(''),
});

interface FormValuesType {
  password: string;
}

const INITIAL_VALUES: FormValuesType = {
  password: '',
};

const Password: React.FC<PasswordProps> = observer(({}) => {
  const store = useContext(MSTContext);
  const [respError, setRespError] = useState('');

  const handleUnlock = async (values: FormValuesType) => {
    setRespError('');
    try {
      // Verify User with password
      let status = await verifyPwdWithStoredHash(values.password);

      if (status) {
        // If status is true, show success message 'Unlock success'
        // Navigate to Tab Navigation by updating mst
        showMessage({
          message: 'Welcome',
          type: 'info',
        });
        store.user.toggleUnlocked(true);
      } else {
        showMessage({
          message: 'Unlock Failed',
          description: 'Entered password is incorrect',
          type: 'danger',
        });
        setRespError('Password is wrong');
      }
    } catch (error) {}
  };

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon: RenderProp<Partial<ImageProps>> = props => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Card style={styles.card}>
          <Text category="s1" style={styles.heading}>
            Unlock
          </Text>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={UnlockSchema}
            onSubmit={handleUnlock}>
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
                  onSubmitEditing={handleSubmit}
                  style={styles.input}
                  textStyle={styles.inputText}
                  accessoryRight={renderIcon}
                  secureTextEntry={secureTextEntry}
                  autoCapitalize="none"
                />
                {errors.password && touched.password ? (
                  <Text style={styles.error}>{errors.password}</Text>
                ) : null}
                {respError ? (
                  <Text style={styles.error}>{respError}</Text>
                ) : null}
                <Button title="Go" onPress={handleSubmit} />
                {/* <Button title="Delete Pwd" onPress={deletePassword} /> */}
              </>
            )}
          </Formik>
        </Card>
      </ScrollView>
    </Layout>
  );
});

export default Password;

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
    // textAlign: 'center',
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
