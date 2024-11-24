module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testPathIgnorePatterns: [
    '\\.snap$',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/',
  ],
  transformIgnorePatterns: ['node_modules/?!(static-container)', 'jest-runner'],
  cacheDirectory: '.jest/cache',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './node_modules/@react-native-google-signin/google-signin/jest/build/jest/setup.js',
  ],
  moduleNameMapper: {
    '^mobx-react-lite$': '<rootDir>/node_modules/mobx-react-lite/es/index.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!src/**/*stories.{ts,tsx}',
  ],
};
