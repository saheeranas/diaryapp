import {useState, useEffect} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  GDrive,
  MimeTypes,
  ListQueryBuilder,
} from '@robinbobin/react-native-google-drive-api-wrapper';

import {readEntriesFromDB} from '../db/entry';

let signInOptions = {
  scopes: ['https://www.googleapis.com/auth/drive'], // [Android] what API you want to access on behalf of the user, default is email and profile
  androidClientId:
    '543449270040-irmkbslopngnj6urrg18jf5q1ec4kiii.apps.googleusercontent.com',
};

const STATUSES = {
  initial: {label: '', value: 0},
  signin: {label: 'Signing in', value: 0.1},
  packaging: {label: 'Packaging', value: 0.23},
  checkForOld: {label: 'Checking for old backup files', value: 0.26},
  upload: {label: 'Uploading', value: 0.3},
  delete: {label: 'Deleting old backup file', value: 0.8},
  finish: {label: 'Success', value: 1},
};

export const useGoogleDrive = () => {
  const [status, setstatus] = useState(STATUSES.initial);

  useEffect(() => {
    if (status === STATUSES.finish) {
      setTimeout(() => {
        setstatus(STATUSES.initial);
      }, 500);
    }
    // return () => {
    //   setstatus(STATUSES.initial);
    // };
  }, [status]);

  // Sign In
  const signInWithGoogle = async () => {
    GoogleSignin.configure(signInOptions);
    try {
      let userInfo = await GoogleSignin.signIn();
      return userInfo;
    } catch (error) {
      // console.log(error);
    }
  };

  // Sign Out
  const signOut = async () => {
    GoogleSignin.configure(signInOptions);
    try {
      await GoogleSignin.signOut();
      return 'Logged Out';
    } catch (error) {
      console.error(error);
    }
  };

  // Export DB to Google Drive
  const exportToGDrive = async () => {
    setstatus(STATUSES.signin);
    const gdrive = new GDrive();
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;

    let year = parseInt('2021', 10);
    let fileName = `PrivateDiaryApp.${year}.realm`;

    // let fileName = /(PrivateDiaryApp)\.([1-2][0-9]{3})\.(realm)/g;
    // console.log(fileName);

    setstatus(STATUSES.packaging);

    // Get data from DB
    let itemsFromDB = readEntriesFromDB();
    let data = JSON.stringify(itemsFromDB);

    let queryParams = {
      q: new ListQueryBuilder().e('name', fileName),
    };

    let searchResult = null;

    try {
      searchResult = await gdrive.files.list(queryParams);
    } catch (error) {
      console.log(error);
    }

    setstatus(STATUSES.checkForOld);

    if (searchResult.files.length) {
      console.log('Exists; Rename the file');
      // Rename the existing File to ${fileName} + '.temp'
      // 1. Extract ID from result
      let {id} = searchResult.files[0];
      // 2. Insert id to setIdOfFileToUpdate(id) and call uploader
      try {
        let updateRes = await gdrive.files
          .newMetadataOnlyUploader()
          .setIdOfFileToUpdate(id)
          .setRequestBody({
            name: `${fileName}.temp`,
          })
          .execute();
        console.log(updateRes);
      } catch (e) {
        console.log(e);
      }
    }

    setstatus(STATUSES.upload);

    // Upload new file
    try {
      console.log('New Upload');
      let res = await gdrive.files
        .newMultipartUploader()
        .setData(data, MimeTypes.BINARY)
        .setRequestBody({
          name: fileName,
        })
        .execute();
      console.log(res);
    } catch (e) {
      console.log(e);
    }

    setstatus(STATUSES.delete);

    // Delete Temperory file
    if (searchResult.files.length) {
      console.log('New Upload');
      try {
        let {id} = searchResult.files[0];
        let res = await gdrive.files.delete(id);
        console.log('Deleted', res);
      } catch (error) {
        console.log(error);
      }
    }

    setstatus(STATUSES.finish);
  };

  return {status, signInWithGoogle, signOut, exportToGDrive};
};
