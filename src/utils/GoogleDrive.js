import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  GDrive,
  MimeTypes,
  ListQueryBuilder,
} from '@robinbobin/react-native-google-drive-api-wrapper';

const DRIVE_FOLDER_NAME = 'PrivateDiaryApp';

let signInOptions = {
  scopes: ['https://www.googleapis.com/auth/drive'], // [Android] what API you want to access on behalf of the user, default is email and profile
  androidClientId:
    '543449270040-irmkbslopngnj6urrg18jf5q1ec4kiii.apps.googleusercontent.com',
};

// Sign In
export const signInWithGoogle = async () => {
  GoogleSignin.configure(signInOptions);
  try {
    let userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error) {
    // console.log(error);
  }
};

export const initializeDrive = async () => {
  const gdrive = new GDrive();
  gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;

  let year = parseInt('2021', 10);
  let fileName = `PrivateDiaryApp.${year}.realm`;

  // let fileName = /(PrivateDiaryApp)\.([1-2][0-9]{3})\.(realm)/g;
  // console.log(fileName);

  let queryParams = {
    q: new ListQueryBuilder().e('name', fileName),
  };

  let searchResult = null;

  try {
    searchResult = await gdrive.files.list(queryParams);
  } catch (error) {
    console.log(error);
  }

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

  // Upload new file
  try {
    console.log('New Upload');
    let res = await gdrive.files
      .newMultipartUploader()
      .setData([1, 2, 3, 4, 5], MimeTypes.BINARY)
      .setRequestBody({
        name: fileName,
      })
      .execute();
    console.log(res);
  } catch (e) {
    console.log(e);
  }

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
};
