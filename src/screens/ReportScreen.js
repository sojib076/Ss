import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateReport } from '../utils/reportGenerator';

/**
 * ReportScreen — displays the generated JSON assessment report.
 * The full report is shown inside the app for transparency.
 */
export default function ReportScreen({ route, navigation }) {
  const apps = route.params?.apps || [];
  const deviceInfo = route.params?.deviceInfo || {};

  const report = useMemo(
    () => generateReport({ apps, deviceInfo }),
    [apps, deviceInfo],
  );

  const reportJson = useMemo(
    () => JSON.stringify(report, null, 2),
    [report],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Assessment Report</Text>
        <Text style={styles.timestamp}>Generated: {report.generatedAt}</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Row label="Total Apps Scanned" value={String(report.summary.totalApps)} />
          <Row label="High Risk Apps" value={String(report.summary.highRiskApps)} isWarning={report.summary.highRiskApps > 0} />
          <Row label="Medium Risk Apps" value={String(report.summary.mediumRiskApps)} />
          <Row label="Low Risk Apps" value={String(report.summary.lowRiskApps)} />
        </View>

        {Object.keys(deviceInfo).length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Device</Text>
            {deviceInfo.brand ? <Row label="Brand" value={deviceInfo.brand} /> : null}
            {deviceInfo.model ? <Row label="Model" value={deviceInfo.model} /> : null}
            {deviceInfo.systemVersion ? (
              <Row label="Android" value={deviceInfo.systemVersion} />
            ) : null}
            <Row
              label="Rooted"
              value={deviceInfo.isRooted ? 'Yes ⚠️' : 'No'}
              isWarning={deviceInfo.isRooted}
            />
          </View>
        )}

        <View style={styles.jsonCard}>
          <Text style={styles.sectionTitle}>Full JSON Report</Text>
          <Text style={styles.jsonText}>{reportJson}</Text>
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => navigation.navigate('SendReport', { report })}
        >
          <Text style={styles.sendButtonText}>📤 Send Report to Lab</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, isWarning = false }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, isWarning && styles.rowValueWarning]}>
        {value}
      </Text>
    </View>
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
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLabel: {
    fontSize: 14,
    color: '#555',
  },
  rowValue: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '600',
  },
  rowValueWarning: {
    color: '#e74c3c',
  },
  jsonCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#a8ff78',
    lineHeight: 18,
  },
  sendButton: {
    backgroundColor: '#2980b9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
