/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Mock the libraries that rely on native modules
jest.mock('react-native-device-info', () => ({
  getBrand: jest.fn().mockResolvedValue('TestBrand'),
  getManufacturer: jest.fn().mockResolvedValue('TestManufacturer'),
  getModel: jest.fn().mockReturnValue('TestModel'),
  getSystemVersion: jest.fn().mockReturnValue('13'),
  getDeviceId: jest.fn().mockReturnValue('test-device-id'),
  isEmulator: jest.fn().mockResolvedValue(false),
  hasNotch: jest.fn().mockReturnValue(false),
  isTablet: jest.fn().mockReturnValue(false),
  isRooted: jest.fn().mockResolvedValue(false),
  isPinOrFingerprintSet: jest.fn().mockResolvedValue(true),
}));

jest.mock('react-native-permissions', () => ({
  check: jest.fn().mockResolvedValue('granted'),
  request: jest.fn().mockResolvedValue('granted'),
  PERMISSIONS: { ANDROID: {} },
  RESULTS: { GRANTED: 'granted', DENIED: 'denied', UNAVAILABLE: 'unavailable' },
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ component: Component }: { component: React.ComponentType<object> }) => (
      <Component navigation={{navigate: jest.fn()}} route={{params: {}}} />
    ),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: jest.fn().mockReturnValue({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

test('renders without crashing', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});
