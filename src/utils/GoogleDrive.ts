import {useState, useEffect} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  GDrive,
  MimeTypes,
  ListQueryBuilder,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import dayjs from 'dayjs';

import {readEntriesFromDB, importToDBFromJSON} from '../db/entry';
import {
  getPassword,
  getPasswordTimestamp,
  verifyHashWithStoredHash,
  updateHash,
} from './password';
import rootStore from '../mst';

import {DiaryEntryDBType} from '../types/DiaryEntry';

interface UserInfo {
  pkey: string;
  modifiedAt: string;
}

export interface DataFromFile {
  userInfo: UserInfo;
  entries: DiaryEntryDBType[];
}

interface Status {
  label: string;
  value: number;
}

// Sign in configuration
let signInOptions = {
  scopes: ['https://www.googleapis.com/auth/drive'], // [Android] what API you want to access on behalf of the user, default is email and profile
};

// Backup filename
let fileName = 'PrivateDiaryApp.db';
let tempFileName = 'pdatmp.db';

// Sync stages and dummy percentage values in points tp show progress bar
const STATUSES: Record<string, Status> = {
  initial: {label: '', value: 0},
  signin: {label: 'Signing in', value: 0.1},
  packaging: {label: 'Packaging', value: 0.3},
  checkForOld: {label: 'Checking for old backup files', value: 0.5},
  upload: {label: 'Uploading', value: 0.8},
  delete: {label: 'Deleting old backup file', value: 0.9},
  finish: {label: 'Success', value: 1},
  fail: {label: 'Failed', value: 1},
};

const LOCAL_NOTIFICATION_MESSAGES = {
  complete: {title: 'Success', body: 'Sync is successfully completed'},
  fail: {title: 'Sync Failed', body: 'Sync was failed. Please try again'},
};

const newData: DataFromFile = {
  userInfo: {
    pkey: '',
    modifiedAt: '',
  },
  entries: [],
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
    await GoogleSignin.hasPlayServices();
    GoogleSignin.configure(signInOptions);
    try {
      let userInfo = await GoogleSignin.signIn();
      return userInfo;
    } catch (error) {
      // TDDO: log the error
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

    let INITIAL_DATA = {...newData};

    setstatus(STATUSES.signin);
    const gdrive = new GDrive();
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;

    setstatus(STATUSES.packaging);

    // setstatus(STATUSES.fail);
    // onDisplayNotification('fail');

    // return;

    // For search in the google Drive
    let queryParams = {
      q: new ListQueryBuilder().e('name', fileName),
    };

    // Global Vars
    let fileId: string = '';

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
    getDataFromDevice()
      .then(res => {
        INITIAL_DATA = {...res};
        return getListOfFiles(gdrive, queryParams);
      })
      .then(res => {
        let dataFromFile = {};

        if (res.files?.length === 0) {
          return dataFromFile;
        }

        fileId = res.files[0].id;

        return getDataFromFile(gdrive, fileId);
      })
      .then(res => getTransformedFileData(res))
      .then(res => {
        if (fileId !== '') {
          updateOldFileName(gdrive, fileId, tempFileName);
        }
        return getSyncedData(INITIAL_DATA, res);
      })
      .then(modifiedData => {
        setstatus(STATUSES.upload);
        // Compare hash from import with local, if do not match, lock the app
        importToDBFromJSON(modifiedData);
        return uploadToDrive(gdrive, fileName, modifiedData);
      })
      .then(() => {
        // throw new Error('sample error');
        setstatus(STATUSES.finish);
        let date = dayjs(new Date()).valueOf();
        rootStore.user.updateLastSynced(date);
        onDisplayNotification('complete');
        // Delete temp file
        deleteFile(gdrive, tempFileName);
      })
      .catch(() => {
        setstatus(STATUSES.fail);
        onDisplayNotification('fail');
        // console.warn(err);
        // Delete sync file if temp file exists
        // REVERT to temp file; (Rename temp -> sync file name)
        revertToOldFile(gdrive);
      })
      .finally(() => {
        fileId = '';
        // setstatus(STATUSES.delete);
      });
  };

  return {status, signInWithGoogle, signOut, exportToGDrive};
};

// getDataFromDevice
const getDataFromDevice = async () => {
  let DATA_FROM_FILE: DataFromFile = {
    userInfo: {
      pkey: '',
      modifiedAt: '',
    },
    entries: [],
  };

  // Entries
  let entriesFromDB = readEntriesFromDB();
  DATA_FROM_FILE.entries = entriesFromDB;
  // End Entries

  // Password
  try {
    let hash = await getPassword();
    let time = await getPasswordTimestamp();
    if (hash) {
      DATA_FROM_FILE.userInfo.pkey = hash;
    }
    if (time) {
      DATA_FROM_FILE.userInfo.modifiedAt = time;
    }
  } catch (e) {}
  // End Password

  return DATA_FROM_FILE;
};

// getListOfFiles
const getListOfFiles = async (gdrive: GDrive, queryParams: any) => {
  try {
    let searchResult = await gdrive.files.list(queryParams);
    return searchResult;
  } catch (error) {
    return error;
  }
};

// getDataFromFile & Update Old file name
const getDataFromFile = async (gdrive: GDrive, fileId: string) => {
  try {
    let filedataDrive = await gdrive.files.getJson(fileId);
    return filedataDrive;
  } catch (error) {
    return error;
  }
};

// Make sure the data from remote file is in desired format
// If remote data is in correct format, return it
// Else return initial data (newData)
const getTransformedFileData = (dataFromFile: any) => {
  try {
    if (dataFromFile) {
      if ('userInfo' in dataFromFile && 'entries' in dataFromFile) {
        return dataFromFile;
      }
    }
    return {...newData};
  } catch (error) {
    return error;
  }
};

// updateOldFileName
const updateOldFileName = async (
  gdrive: GDrive,
  fileId: string,
  name: string = tempFileName,
) => {
  try {
    let res = await gdrive.files
      .newMetadataOnlyUploader()
      .setIdOfFileToUpdate(fileId)
      .setRequestBody({
        name: `${name}`,
      })
      .execute();
    return res;
  } catch (error) {
    return error;
  }
};

// uploadToDrive
const uploadToDrive = async (
  gdrive: GDrive,
  fname: string,
  data: DataFromFile,
) => {
  try {
    let res = await gdrive.files
      .newMultipartUploader()
      .setData(JSON.stringify(data), MimeTypes.BINARY)
      .setRequestBody({
        name: fname,
      })
      .execute();
    return res;
  } catch (error) {
    return error;
  }
};

// Delete GDrive file
const deleteFile = async (gdrive: GDrive, file: string) => {
  let queryParams = {
    q: new ListQueryBuilder().e('name', `${file}`),
  };

  getListOfFiles(gdrive, queryParams)
    .then(list => {
      if (!list.files.length) {
      }
      let promises = list.files.map((el: {id: string}) => {
        return gdrive.files.delete(el.id);
      });
      return Promise.all(promises);
    })
    .catch(err => err);
};

// revertToOldFile - Revert to temp file if error happens
const revertToOldFile = async (gdrive: GDrive) => {
  let queryParamsForTemp = {
    q: new ListQueryBuilder().e('name', `${tempFileName}`),
  };

  let queryParamsForSyncFile = {
    q: new ListQueryBuilder().e('name', `${fileName}`),
  };

  getListOfFiles(gdrive, queryParamsForTemp)
    .then(list => {
      if (list.files.length === 0) {
        throw new Error('No backup files');
      }
      return list.files;
    })
    .then(async tempFiles => {
      let originalFiles = await getListOfFiles(gdrive, queryParamsForSyncFile);
      let promises = originalFiles.files.map((el: {id: string}) => {
        return gdrive.files.delete(el.id);
      });
      return {tempFiles, deleteStatus: Promise.all(promises)};
    })
    .then(res => {
      updateOldFileName(gdrive, res.tempFiles[0].id, fileName);
    })
    .catch(() => {});
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

const getSyncedData = (dataFromDB = newData, dataFromDrive = newData) => {
  // Populate properties if not exists
  if (!dataFromDB.entries) {
    dataFromDB = {...newData};
  }
  // Populate properties if not exists
  if (!dataFromDrive.entries) {
    dataFromDrive = {...newData};
  }

  // throw new Error('Here');

  // UserInfo
  let tempUserInfo = {pkey: '', modifiedAt: ''};
  if (dataFromDB.userInfo && dataFromDrive.userInfo) {
    tempUserInfo =
      dataFromDB.userInfo.modifiedAt > dataFromDrive.userInfo.modifiedAt
        ? dataFromDB.userInfo
        : dataFromDrive.userInfo;
  } else if (dataFromDB.userInfo && !dataFromDrive.userInfo) {
    tempUserInfo = dataFromDB.userInfo;
  } else if (!dataFromDB.userInfo && dataFromDrive.userInfo) {
    tempUserInfo = dataFromDrive.userInfo;
  }

  saveLatestPasswordToLocal(tempUserInfo);

  newData.userInfo = Object.assign({}, tempUserInfo);
  // end UserInfo

  // Entries
  let temp = [...dataFromDB.entries, ...dataFromDrive.entries].sort(
    (a, b) => a.modifiedAt - b.modifiedAt,
  );

  let nextItem = null;
  let tempItem = {_id: 'qwerty', modifiedAt: 8640000000000};

  let filteredNewData = temp.filter((item, i) => {
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

  newData.entries = [...filteredNewData];
  // end Entries

  return newData;
};

// Save latest password to local
const saveLatestPasswordToLocal = async (newUserInfo: UserInfo) => {
  verifyHashWithStoredHash(newUserInfo.pkey)
    .then(res => {
      if (res) {
        // If both hashes are same, then no need to continue
        throw new Error('Same password');
      }
      return updateHash(newUserInfo.pkey, newUserInfo.modifiedAt);
    })
    .catch(() => {});
};

// Local Notification
const onDisplayNotification = async (status: string) => {
  // Check messages already defined
  if (status in LOCAL_NOTIFICATION_MESSAGES) {
    // Create a channel
    // const channelId = await notifee.createChannel({
    //   id: 'default',
    //   name: 'Default Channel',
    // });
    // Display a notification
    // await notifee.displayNotification({
    //   title: LOCAL_NOTIFICATION_MESSAGES[status].title,
    //   body: LOCAL_NOTIFICATION_MESSAGES[status].body,
    //   android: {
    //     channelId,
    //   },
    // });
  }
};
