import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * ConsentScreen — displayed before any data collection begins.
 * The user must explicitly agree before the assessment proceeds.
 * Provides a "Stop Assessment" option to exit.
 */
export default function ConsentScreen({ navigation }) {
  function handleAgree() {
    navigation.navigate('Scanner');
  }

  function handleStop() {
    Alert.alert(
      'Stop Assessment',
      'You have chosen to stop the assessment. No data has been collected.',
      [{ text: 'OK' }],
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Mobile Security Assessment Lab</Text>
        <Text style={styles.subtitle}>⚠️ Please read before continuing</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Purpose</Text>
          <Text style={styles.body}>
            This app performs a transparent, consent-based mobile security
            assessment. It is intended strictly for ethical lab use, education,
            and security research.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>What data will be collected</Text>
          <Text style={styles.bulletItem}>
            • Installed application names and their requested permissions
          </Text>
          <Text style={styles.bulletItem}>
            • Device model, manufacturer, and Android OS version
          </Text>
          <Text style={styles.bulletItem}>
            • Basic device security status (developer mode, root detection,
            screen lock type)
          </Text>
          <Text style={styles.bulletItem}>
            • A risk score calculated from dangerous permissions
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>How data is used</Text>
          <Text style={styles.body}>
            All collected data is displayed to you inside this app. Data is
            sent to the lab server only when you explicitly press the "Send
            Report" button. No background collection or hidden transmission
            occurs.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your rights</Text>
          <Text style={styles.body}>
            You may stop this assessment at any time using the "Stop
            Assessment" button. You are not required to proceed.
          </Text>
        </View>

        <TouchableOpacity style={styles.agreeButton} onPress={handleAgree}>
          <Text style={styles.agreeButtonText}>✅ Agree & Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
          <Text style={styles.stopButtonText}>🚫 Stop Assessment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#444',
    lineHeight: 21,
  },
  bulletItem: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginLeft: 4,
  },
  agreeButton: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  agreeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
