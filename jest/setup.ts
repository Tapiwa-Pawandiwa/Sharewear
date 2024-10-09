// jest/setup.js
import 'react-native-gesture-handler/jestSetup';

// Mock for `react-native-reanimated`
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('react-native-reanimated-carousel', () => {
        return ({ children }: any) => {children};
    });
// Mock for `react-native-gesture-handler`
jest.mock('react-native-gesture-handler', () => {
  return {
    ...jest.requireActual('react-native-gesture-handler'),
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock for `expo-image`
jest.mock('expo-image', () => 'Image');
