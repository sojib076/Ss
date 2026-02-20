/**
 * Mobile Security Assessment Lab App
 *
 * Ethical, consent-based Android security assessment tool.
 * All data collection requires explicit user consent.
 * No background activities or hidden data transmission.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ConsentScreen from './src/screens/ConsentScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import DeviceInfoScreen from './src/screens/DeviceInfoScreen';
import ReportScreen from './src/screens/ReportScreen';
import SendReportScreen from './src/screens/SendReportScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Consent"
          screenOptions={{
            headerStyle: { backgroundColor: '#1a1a2e' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="Consent"
            component={ConsentScreen}
            options={{ title: 'Security Assessment', headerShown: false }}
          />
          <Stack.Screen
            name="Scanner"
            component={ScannerScreen}
            options={{ title: 'Permission Scanner' }}
          />
          <Stack.Screen
            name="DeviceInfo"
            component={DeviceInfoScreen}
            options={{ title: 'Device Security Info' }}
          />
          <Stack.Screen
            name="Report"
            component={ReportScreen}
            options={{ title: 'Assessment Report' }}
          />
          <Stack.Screen
            name="SendReport"
            component={SendReportScreen}
            options={{ title: 'Send Report' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
