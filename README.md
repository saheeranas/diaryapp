<!--
  Title: Private Diary App
  Description: A privacy focused diary/journal app
  Author: saheeranas
  -->

# Private Diary App

A privacy focused journal app. The Private Diary App is built for people who are keen about privacy. The Private Diary App won't store any data on servers. Instead, it uses your device's local storage as its primary storage. But if you want to store all the data for the future, you can use the Sync option. It will store all your data in your Google Drive. [Read more information](https://www.saheeranas.com/project/diary)

<kbd>
  <img src="docs/diary-app.webp?raw=true"> 
</kbd>

## Features

- Offline first
- Sync to Google Drive (Optional)
- Privacy
- Password protection

## Dependencies

- React Native
- Mobx-state-tree
- Realm
- UI Kitten
- React Navigation v6

## App Installation

Check the APK files in Releases section.

## Project Installation

Clone this repo

```
git clone https://github.com/saheeranas/diaryapp.git
```

Open project folder and install dependencies

```
cd diaryapp
yarn
or
npm i
```

Run the project

```
yarn android
or
npm run android
```

or

```
yarn ios
or
npm run ios
```

### For Google Drive Support

1. Rename '.env.template' file to '.env'
2. Get 'OAuth 2.0 Client ID' for Android from Google Cloud Console (For Google Sign in: @react-native-google-signin/google-signin)
3. Place the Clinet ID in .env file for the key 'ANDROID_CLIENT_ID'

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
