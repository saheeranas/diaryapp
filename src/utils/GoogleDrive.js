import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  GDrive,
  MimeTypes,
} from '@robinbobin/react-native-google-drive-api-wrapper';

let signInOptions = {
  scopes: ['https://www.googleapis.com/auth/drive'], // [Android] what API you want to access on behalf of the user, default is email and profile
  androidClientId:
    '543449270040-irmkbslopngnj6urrg18jf5q1ec4kiii.apps.googleusercontent.com',
};

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

  // gdrive.files
  //   .list()
  //   .then(res => {
  //     console.log(res);
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });

  // File f = new File(realm.getPath());

  // const id = (
  //   await gdrive.files
  //     .newMultipartUploader()
  //     .setData([1, 2, 3, 4, 5], MimeTypes.BINARY)
  //     .setRequestBody({
  //       name: 'multipart_bin',
  //     })
  //     .execute()
  // ).id;

  // console.log(await gdrive.files.getBinary(id));
};
