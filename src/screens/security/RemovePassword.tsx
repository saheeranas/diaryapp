import React, {useContext} from 'react';
import {StyleSheet, ScrollView, Button} from 'react-native';

import {observer} from 'mobx-react-lite';
import {Card, Input, Text} from '@ui-kitten/components';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {MSTContext} from '../../mst';
import {PasswordType} from '../../types/types';
import {Layout} from '../../components/Layout';

const RemovePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .trim('Password cannot include spaces')
    .min(5, 'Too Short!')
    .required('Required'),
});

const RemovePassword: React.FC<PasswordType> = observer(({navigation}) => {
  const store = useContext(MSTContext);

  const handleRemovePassword = values => {
    //   handle submit here
    // console.log(values);
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Card style={styles.card}>
          <Text category="s1" style={styles.heading}>
            Remove Password
          </Text>
          <Formik
            initialValues={{oldPassword: ''}}
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
                />
                {errors.oldPassword && touched.oldPassword ? (
                  <Text style={styles.error}>{errors.oldPassword}</Text>
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
