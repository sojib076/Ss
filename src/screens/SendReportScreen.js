import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

/**
 * SendReportScreen — allows the user to explicitly send the report to the lab.
 * No automatic or hidden transmission occurs; transmission requires a button press.
 * The result (success or failure) is displayed visibly in the UI.
 */
export default function SendReportScreen({ route }) {
  const report = route.params?.report || {};

  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [logMessages, setLogMessages] = useState([]);

  function addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [`[${timestamp}] ${message}`, ...prev]);
  }

  async function sendReport() {
    setStatus('sending');
    addLog('Initiating report transmission…');

    try {
      // Lab API endpoint — replace with the actual secure backend URL
      const LAB_API_URL = 'https://lab.example.com/api/reports';

      addLog(`Connecting to ${LAB_API_URL}`);

      const response = await axios.post(LAB_API_URL, report, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      });

      addLog(`✅ Report sent successfully. Status: ${response.status}`);
      setStatus('success');
    } catch (err) {
      const message =
        err.response
          ? `Server error ${err.response.status}: ${err.response.statusText}`
          : err.message || 'Network error';
      addLog(`❌ Failed to send report: ${message}`);
      setStatus('error');
    }
  }

  function statusColor() {
    if (status === 'success') { return '#27ae60'; }
    if (status === 'error') { return '#e74c3c'; }
    return '#2980b9';
  }

  function buttonLabel() {
    if (status === 'sending') { return null; }
    if (status === 'success') { return '✅ Report Sent'; }
    if (status === 'error') { return '🔁 Retry Send'; }
    return '📤 Send Report to Lab';
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Send Report to Lab</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ Before you send</Text>
          <Text style={styles.infoBody}>
            Pressing the button below will transmit the assessment report to the
            predefined lab server over a secure HTTPS connection.
          </Text>
          <Text style={styles.infoBody}>
            This action is performed only once per button press. No data is
            sent automatically or in the background.
          </Text>
        </View>

        <View style={styles.reportPreviewCard}>
          <Text style={styles.previewTitle}>Report Preview</Text>
          <Text style={styles.previewLine}>
            Generated: {report.generatedAt || 'N/A'}
          </Text>
          <Text style={styles.previewLine}>
            Total apps: {report.summary?.totalApps ?? 'N/A'}
          </Text>
          <Text style={styles.previewLine}>
            High risk: {report.summary?.highRiskApps ?? 'N/A'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: statusColor() }]}
          onPress={sendReport}
          disabled={status === 'sending' || status === 'success'}
          accessibilityLabel="Send report button"
        >
          {status === 'sending' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>{buttonLabel()}</Text>
          )}
        </TouchableOpacity>

        {logMessages.length > 0 && (
          <View style={styles.logCard}>
            <Text style={styles.logTitle}>Transmission Log</Text>
            {logMessages.map((msg, i) => (
              <Text key={i} style={styles.logLine}>{msg}</Text>
            ))}
          </View>
        )}
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
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  infoBody: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
    marginBottom: 6,
  },
  reportPreviewCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  previewLine: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  sendButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  logCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 14,
  },
  logTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ccc',
    marginBottom: 8,
  },
  logLine: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#a8ff78',
    lineHeight: 20,
  },
});
