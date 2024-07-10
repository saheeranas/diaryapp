const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// OLD CONFIG
// const MetroConfig = require('@ui-kitten/metro-config');

// /**
//  * @see https://akveo.github.io/react-native-ui-kitten/docs/guides/improving-performance
//  */
// const evaConfig = {
//   evaPackage: '@eva-design/eva',
// };

// module.exports = MetroConfig.create(evaConfig, {
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//   },
// });
