import sha512 from 'crypto-js/sha512';

import {setSecureValue, getSecureValue, removeSecureValue} from './keyChain';

/**
 * Store a hashed password in Keychain
 * @param {string} password - The plain text password from form
 */
export const setPassword = async (password: string) => {
  // 1. Create a hash from password (which is plain text)
  let hash = sha512(password).toString();

  // 2. Store the hash in keychain: Call the function here
  try {
    let res = await setSecureValue('pwdHash', hash);
    return res;
  } catch (error) {
    return error;
    // console.log(error);
  }
};

/**
 * Retrieve hashed password from Keychain
 */
export const getPassword = async () => {
  return getSecureValue('pwdHash');
};

/**
 * Retrieve hashed password from Keychain
 */
export const getPasswordStatus = async () => {
  try {
    let pwd = await getSecureValue('pwdHash');
    return pwd ? true : false;
  } catch (error) {
    return false;
  }
};

/**
 * Compare & verify user input password with stored hash
 */
export const verifyPwdWithStoredHash = async (inputPwd: string) => {
  let hash = sha512(inputPwd).toString();
  try {
    let pwd = await getSecureValue('pwdHash');
    return pwd === hash ? true : false;
  } catch (error) {
    return error;
  }
};

/**
 * Delete stored password
 */
export const deletePassword = async () => {
  try {
    let status = await removeSecureValue('pwdHash');
    return status;
  } catch (error) {
    return false;
  }
};

/* Update  password
 *
 */
export const updatePassword = async (
  inputCurrentPwd: string,
  newPwd: string,
) => {
  // 1. Compare input Password with Current Password
  let hashOfInputCurrentPwd = sha512(inputCurrentPwd).toString();

  return getPassword()
    .then(currentPwd => {
      return hashOfInputCurrentPwd === currentPwd;
    })
    .then(res => {
      if (!res) {
        throw new Error('Current pasword is incorrect');
      }
      return setPassword(newPwd);
    })
    .catch(e => console.log(e));
};
