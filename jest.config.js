/**
 * NOTE: the `jest-expo` preset is intentionally not used.
 *
 * This project pins React Native 0.76.9 while `jest-expo@53` targets RN 0.79+.
 * Its setup module does
 *   require('react-native/Libraries/BatchedBridge/NativeModules').default
 * which is `undefined` on 0.76, so the preset throws before any test runs.
 *
 * The current suite covers pure logic (theme tokens, content model), so a plain
 * babel transform is enough. If/when component tests are added, either bump
 * React Native to the version Expo SDK 53 ships, or pin `jest-expo` to a
 * release that matches 0.76.
 */
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/android/', '<rootDir>/ios/'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.jest.js' }],
  },
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/__tests__/**'],
};
