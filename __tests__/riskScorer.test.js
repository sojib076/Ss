/**
 * Tests for the risk scoring utility.
 * @format
 */

import {
  calculateRiskScore,
  DANGEROUS_PERMISSION_LABELS,
} from '../src/utils/riskScorer';

describe('calculateRiskScore', () => {
  it('returns NONE level for empty permissions', () => {
    const result = calculateRiskScore([]);
    expect(result.score).toBe(0);
    expect(result.level).toBe('NONE');
    expect(result.dangerousPermissions).toHaveLength(0);
  });

  it('returns NONE level for non-dangerous permissions only', () => {
    const result = calculateRiskScore(['android.permission.INTERNET', 'android.permission.VIBRATE']);
    expect(result.score).toBe(0);
    expect(result.level).toBe('NONE');
  });

  it('returns LOW level for a small number of dangerous permissions', () => {
    const result = calculateRiskScore(['android.permission.CAMERA']);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(35);
    expect(result.level).toBe('LOW');
    expect(result.dangerousPermissions).toContain('android.permission.CAMERA');
  });

  it('returns MEDIUM level for moderate dangerous permissions', () => {
    const result = calculateRiskScore([
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_CONTACTS',
      'android.permission.READ_EXTERNAL_STORAGE',
    ]);
    expect(result.level).toBe('MEDIUM');
  });

  it('returns HIGH level for many dangerous permissions', () => {
    const result = calculateRiskScore([
      'android.permission.READ_SMS',
      'android.permission.SEND_SMS',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.READ_CONTACTS',
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
    ]);
    expect(result.level).toBe('HIGH');
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it('caps score at 100', () => {
    // Use all dangerous permissions
    const allDangerous = Object.keys(DANGEROUS_PERMISSION_LABELS);
    const result = calculateRiskScore(allDangerous);
    expect(result.score).toBe(100);
  });

  it('only includes recognised dangerous permissions in the list', () => {
    const result = calculateRiskScore([
      'android.permission.INTERNET',
      'android.permission.CAMERA',
    ]);
    expect(result.dangerousPermissions).toEqual(['android.permission.CAMERA']);
  });
});
