import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';

/**
 * DeviceInfoScreen — displays device security information including model,
 * OS version, manufacturer, developer mode, root status, and screen lock.
 */
export default function DeviceInfoScreen({ navigation }) {
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeviceInfo();
  }, []);

  async function fetchDeviceInfo() {
    setLoading(true);
    try {
      const [
        brand,
        manufacturer,
        model,
        systemVersion,
        deviceId,
        isEmulator,
        hasNotch,
        isTablet,
      ] = await Promise.all([
        DeviceInfo.getBrand(),
        DeviceInfo.getManufacturer(),
        DeviceInfo.getModel(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getDeviceId(),
        DeviceInfo.isEmulator(),
        Promise.resolve(DeviceInfo.hasNotch()),
        Promise.resolve(DeviceInfo.isTablet()),
      ]);

      // Root detection (basic check via DeviceInfo)
      const isRooted = await DeviceInfo.isRooted().catch(() => false);

      // Developer mode detection via DeviceInfo
      const isPinOrFingerprintSet = await DeviceInfo.isPinOrFingerprintSet().catch(
        () => false,
      );

      setDeviceData({
        brand,
        manufacturer,
        model,
        systemVersion,
        deviceId,
        isEmulator,
        hasNotch,
        isTablet,
        isRooted,
        isPinOrFingerprintSet,
      });
    } catch (err) {
      setDeviceData({ error: err.message || 'Failed to fetch device info.' });
    } finally {
      setLoading(false);
    }
  }

  function SecurityRow({ label, value, isWarning = false }) {
    return (
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, isWarning && styles.rowValueWarning]}>
          {value}
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a1a2e" />
        <Text style={styles.loadingText}>Fetching device information…</Text>
      </SafeAreaView>
    );
  }

  if (deviceData?.error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{deviceData.error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDeviceInfo}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Device Security Info</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📱 Hardware</Text>
          <SecurityRow label="Brand" value={deviceData.brand} />
          <SecurityRow label="Manufacturer" value={deviceData.manufacturer} />
          <SecurityRow label="Model" value={deviceData.model} />
          <SecurityRow label="Device ID" value={deviceData.deviceId} />
          <SecurityRow
            label="Form Factor"
            value={deviceData.isTablet ? 'Tablet' : 'Phone'}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💻 Software</Text>
          <SecurityRow label="Android Version" value={deviceData.systemVersion} />
          <SecurityRow
            label="Emulator"
            value={deviceData.isEmulator ? 'Yes ⚠️' : 'No'}
            isWarning={deviceData.isEmulator}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🔐 Security Status</Text>
          <SecurityRow
            label="Root Detected"
            value={deviceData.isRooted ? '⚠️ YES — Device may be rooted' : '✅ Not detected'}
            isWarning={deviceData.isRooted}
          />
          <SecurityRow
            label="Screen Lock"
            value={
              deviceData.isPinOrFingerprintSet
                ? '✅ Enabled (PIN/Fingerprint)'
                : '⚠️ No screen lock set'
            }
            isWarning={!deviceData.isPinOrFingerprintSet}
          />
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('Report', { deviceInfo: deviceData })}
        >
          <Text style={styles.nextButtonText}>View Report →</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    marginTop: 12,
    color: '#555',
    fontSize: 15,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 15,
    margin: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignSelf: 'center',
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
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
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLabel: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
    color: '#1a1a2e',
    flex: 1,
    textAlign: 'right',
  },
  rowValueWarning: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#2980b9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
