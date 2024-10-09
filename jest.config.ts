module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    setupFiles: ['<rootDir>/jest/setup.js'], // Add the setup file for mocking and initialization
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation|react-native-reanimated)/)',
    ],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
      "^.+\\.svg$": "jest-transformer-svg"
    },
  };
  