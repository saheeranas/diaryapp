const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const MetroConfig = require('@ui-kitten/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const evaConfig = {
  evaPackage: '@ui-kitten/eva', 
};

const config = {};

const uiKittenMixedConfig = MetroConfig.create(evaConfig, mergeConfig(getDefaultConfig(__dirname), config));

module.exports = uiKittenMixedConfig;
