import '@testing-library/react-native/extend-expect';

import Realm from 'realm';

import {beforeAll, afterAll} from '@jest/globals';

beforeAll(done => {
  done();
});

afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  Realm.shutdown();
  done();
});
