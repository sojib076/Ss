import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  NativeModules,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { calculateRiskScore, DANGEROUS_PERMISSION_LABELS } from '../utils/riskScorer';

const { PackageManagerModule } = NativeModules;

/**
 * ScannerScreen — lists installed apps with their permissions and risk scores.
 * Only runs after explicit user consent from ConsentScreen.
 */
export default function ScannerScreen({ navigation }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  async function requestPermissionsAndScan() {
    if (Platform.OS !== 'android') {
      Alert.alert('Android Only', 'This feature is only available on Android.');
      return;
    }

    setLoading(true);
    try {
      // Request QUERY_ALL_PACKAGES equivalent permission (Android 11+)
      // react-native-permissions handles the runtime request
      const result = await check(
        Platform.Version >= 30
          ? PERMISSIONS.ANDROID.QUERY_ALL_PACKAGES
          : PERMISSIONS.ANDROID.GET_ACCOUNTS,
      ).catch(() => RESULTS.UNAVAILABLE);

      if (result === RESULTS.DENIED) {
        await request(
          Platform.Version >= 30
            ? PERMISSIONS.ANDROID.QUERY_ALL_PACKAGES
            : PERMISSIONS.ANDROID.GET_ACCOUNTS,
        ).catch(() => null);
      }

      const installedApps = await getInstalledApps();
      setApps(installedApps);
    } catch (err) {
      Alert.alert('Scan Error', err.message || 'Failed to scan installed apps.');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Returns installed app data. Uses the native PackageManagerModule when
   * available; falls back to a sample dataset so the UI can be previewed.
   */
  async function getInstalledApps() {
    if (PackageManagerModule && typeof PackageManagerModule.getInstalledApps === 'function') {
      const raw = await PackageManagerModule.getInstalledApps();
      return raw.map(app => {
        const { score, level, dangerousPermissions } = calculateRiskScore(
          app.permissions || [],
        );
        return {
          packageName: app.packageName,
          appName: app.appName || app.packageName,
          permissions: app.permissions || [],
          riskScore: score,
          riskLevel: level,
          dangerousPermissions,
        };
      });
    }

    // Fallback sample data for UI preview / non-Android environments
    return SAMPLE_APPS.map(app => {
      const { score, level, dangerousPermissions } = calculateRiskScore(
        app.permissions,
      );
      return { ...app, riskScore: score, riskLevel: level, dangerousPermissions };
    });
  }

  function toggleExpand(packageName) {
    setExpanded(prev => (prev === packageName ? null : packageName));
  }

  function viewReport(scannedApps) {
    navigation.navigate('Report', { apps: scannedApps });
  }

  function riskColor(level) {
    switch (level) {
      case 'HIGH': return '#e74c3c';
      case 'MEDIUM': return '#f39c12';
      case 'LOW': return '#27ae60';
      default: return '#95a5a6';
    }
  }

  function permissionLabel(perm) {
    return DANGEROUS_PERMISSION_LABELS[perm] || perm.split('.').pop();
  }

  function renderApp({ item }) {
    const isExpanded = expanded === item.packageName;
    return (
      <TouchableOpacity
        style={styles.appCard}
        onPress={() => toggleExpand(item.packageName)}
        accessibilityLabel={`App: ${item.appName}, Risk: ${item.riskLevel}`}
      >
        <View style={styles.appHeader}>
          <Text style={styles.appName} numberOfLines={1}>{item.appName}</Text>
          <View style={[styles.riskBadge, { backgroundColor: riskColor(item.riskLevel) }]}>
            <Text style={styles.riskBadgeText}>{item.riskLevel}</Text>
          </View>
        </View>
        <Text style={styles.packageName} numberOfLines={1}>{item.packageName}</Text>
        <Text style={styles.riskScore}>Risk Score: {item.riskScore}/100</Text>

        {isExpanded && (
          <View style={styles.permsList}>
            {item.dangerousPermissions.length === 0 ? (
              <Text style={styles.noPerms}>No dangerous permissions detected.</Text>
            ) : (
              <>
                <Text style={styles.permsTitle}>⚠️ Dangerous Permissions:</Text>
                {item.dangerousPermissions.map(p => (
                  <Text key={p} style={styles.permItem}>• {permissionLabel(p)}</Text>
                ))}
              </>
            )}
            {item.permissions.length > 0 && (
              <Text style={styles.totalPerms}>
                Total permissions: {item.permissions.length}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>App Permission Scanner</Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={requestPermissionsAndScan}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.scanButtonText}>🔍 Scan Apps</Text>
          )}
        </TouchableOpacity>
      </View>

      {apps.length > 0 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>Found {apps.length} apps</Text>
          <TouchableOpacity onPress={() => viewReport(apps)}>
            <Text style={styles.reportLink}>View Full Report →</Text>
          </TouchableOpacity>
        </View>
      )}

      {apps.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Press "Scan Apps" to begin scanning installed applications.
          </Text>
          <Text style={styles.emptySubText}>
            Tap any app card to view its permissions.
          </Text>
          <TouchableOpacity
            style={styles.deviceInfoButton}
            onPress={() => navigation.navigate('DeviceInfo')}
          >
            <Text style={styles.deviceInfoButtonText}>📱 View Device Security Info</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={apps}
        keyExtractor={item => item.packageName}
        renderItem={renderApp}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

// Sample data for UI preview
const SAMPLE_APPS = [
  {
    packageName: 'com.example.messenger',
    appName: 'Example Messenger',
    permissions: [
      'android.permission.READ_SMS',
      'android.permission.SEND_SMS',
      'android.permission.READ_CONTACTS',
      'android.permission.INTERNET',
    ],
  },
  {
    packageName: 'com.example.camera',
    appName: 'Example Camera',
    permissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ],
  },
  {
    packageName: 'com.example.notes',
    appName: 'Example Notes',
    permissions: [
      'android.permission.INTERNET',
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    padding: 16,
    backgroundColor: '#1a1a2e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  scanButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 110,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryText: {
    color: '#444',
    fontSize: 14,
  },
  reportLink: {
    color: '#2980b9',
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    padding: 12,
  },
  appCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    flex: 1,
    marginRight: 8,
  },
  riskBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  riskBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  packageName: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  riskScore: {
    fontSize: 13,
    color: '#555',
  },
  permsList: {
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
  },
  permsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e74c3c',
    marginBottom: 4,
  },
  permItem: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  noPerms: {
    fontSize: 13,
    color: '#27ae60',
  },
  totalPerms: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
  deviceInfoButton: {
    marginTop: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deviceInfoButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
