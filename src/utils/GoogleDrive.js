import {useState, useEffect} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  GDrive,
  MimeTypes,
  ListQueryBuilder,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import dayjs from 'dayjs';

import {readEntriesFromDB, importToDBFromJSON} from '../db/entry';
import rootStore from '../mst';

// Sign in configuration
let signInOptions = {
  scopes: ['https://www.googleapis.com/auth/drive'], // [Android] what API you want to access on behalf of the user, default is email and profile
  androidClientId:
    '543449270040-irmkbslopngnj6urrg18jf5q1ec4kiii.apps.googleusercontent.com',
};

// Backup filename
let fileName = 'PrivateDiaryApp.db';

// Sync stages and dummy percentage values in points tp show progress bar
const STATUSES = {
  initial: {label: '', value: 0},
  signin: {label: 'Signing in', value: 0.1},
  packaging: {label: 'Packaging', value: 0.23},
  checkForOld: {label: 'Checking for old backup files', value: 0.26},
  upload: {label: 'Uploading', value: 0.3},
  delete: {label: 'Deleting old backup file', value: 0.8},
  finish: {label: 'Success', value: 1},
  fail: {label: 'Failed', value: 1},
};

/**
 * useGoogleDrive
 */
export const useGoogleDrive = () => {
  const [status, setstatus] = useState(STATUSES.initial);

  useEffect(() => {
    if (status === STATUSES.finish || status === STATUSES.fail) {
      setTimeout(() => {
        setstatus(STATUSES.initial);
      }, 5000);
    }
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
    // TODO: Check for Active Internet first.
    // If no, show a message and return from here itself

    setstatus(STATUSES.signin);
    const gdrive = new GDrive();
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;

    setstatus(STATUSES.packaging);

    // Get data from DB
    let itemsFromDB = readEntriesFromDB();

    // For search in the google Drive
    let queryParams = {
      q: new ListQueryBuilder().e('name', fileName),
    };

    // Global Vars
    let fileId = null;

    setstatus(STATUSES.checkForOld);

    /**
     * Sync Chain
     * 1. Search for existing backup - getListOfFiles()
     * 2. If yes, get data from the file - getDataFromFile()
     * 3. Add extension '.temp' to the Filename - updateOldFileName() - (TODO: handle edge cases sync interrupt)
     * 4. Get syncable data from Local and Drive - getSyncedData()
     * 5. Upload syncable data to Drive - uploadToDrive()
     * 6. Delete Old temp file from drive - deleteOldFile()
     */
    getListOfFiles(gdrive, queryParams)
      .then(res => {
        let dataFromFile = [];
        if (res.files.length) {
          fileId = res.files[0].id;
          dataFromFile = getDataFromFile(gdrive, fileId);
        }
        return dataFromFile;
      })
      .then(res => {
        if (fileId) {
          updateOldFileName(gdrive, fileId, fileName);
        }
        return getSyncedData(itemsFromDB, res);
      })
      .then(modifiedData => {
        setstatus(STATUSES.upload);
        importToDBFromJSON(modifiedData);
        return uploadToDrive(gdrive, fileName, modifiedData);
      })
      .then(res => {
        setstatus(STATUSES.delete);
        return deleteOldFiles(gdrive);
      })
      .then(res => {
        setstatus(STATUSES.finish);
        let date = dayjs(new Date()).format('YYYY MMM DD dddd hh mm A');
        rootStore.settings.updateLastSynced(date);
      })
      .catch(err => {
        setstatus(STATUSES.fail);
        console.warn(err);
      })
      .finally(() => {
        fileId = null;
      });
  };

  return {status, signInWithGoogle, signOut, exportToGDrive};
};

// getListOfFiles
const getListOfFiles = async (gdrive, queryParams) => {
  try {
    let searchResult = await gdrive.files.list(queryParams);
    return searchResult;
  } catch (error) {
    return error;
  }
};

// getDataFromFile & Update Old file name
const getDataFromFile = async (gdrive, fileId) => {
  try {
    let filedataDrive = await gdrive.files.getJson(fileId);
    return filedataDrive;
  } catch (error) {
    return error;
  }
};

// updateOldFileName
const updateOldFileName = async (gdrive, fileId, fileName) => {
  try {
    let res = await await gdrive.files
      .newMetadataOnlyUploader()
      .setIdOfFileToUpdate(fileId)
      .setRequestBody({
        name: `${fileName}.temp`,
      })
      .execute();
    return res;
  } catch (error) {
    return error;
  }
};

// uploadToDrive
const uploadToDrive = async (gdrive, fileName, data) => {
  try {
    let res = await gdrive.files
      .newMultipartUploader()
      .setData(JSON.stringify(data), MimeTypes.BINARY)
      .setRequestBody({
        name: fileName,
      })
      .execute();
    return res;
  } catch (error) {
    return error;
  }
};

// deleteOldFiles - Delete temp files from drive
const deleteOldFiles = async gdrive => {
  let queryParams = {
    q: new ListQueryBuilder().e('name', `${fileName}.temp`),
  };

  getListOfFiles(gdrive, queryParams)
    .then(list => {
      if (!list.files.length) {
        // console.log('Error');
      }
      let promises = list.files.map(el => {
        return gdrive.files.delete(el.id);
      });
      return Promise.all(promises);
    })
    .catch(err => err);
};

/**
 * Compare Local and server data
 * 1. Combine both arrays
 * 2. Sort in ascendig order by modifiedAt
 * 3. Loop through the items (Array.filter)
 *    a. If Current item's modified data is <= next's, remove item
 *    b. If Current item has property 'deleted' = true, remove item
 *    c. Else return current
 * 4. Return modified array
 */
const getSyncedData = (dataFromDB, dataFromDrive) => {
  let temp = [...dataFromDB, ...dataFromDrive].sort(
    (a, b) => a.modifiedAt - b.modifiedAt,
  );

  let nextItem = null;
  let tempItem = {_id: 'qwerty', modifiedAt: 8640000000000};

  let newData = temp.filter((item, i) => {
    nextItem = temp[i + 1] ? temp[i + 1] : tempItem;
    if (item._id === nextItem._id) {
      if (item.modifiedAt <= nextItem.modifiedAt) {
        return null;
      }
    }
    // Filter out soft deleted
    if (item.deleted) {
      return null;
    }
    return item;
  });

  return newData;
};
