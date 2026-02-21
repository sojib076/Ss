/**
 * Tests for the report generation utility.
 * @format
 */

import { generateReport } from '../src/utils/reportGenerator';

describe('generateReport', () => {
  it('generates a report with the correct structure', () => {
    const report = generateReport({ apps: [], deviceInfo: {} });
    expect(report).toHaveProperty('reportVersion');
    expect(report).toHaveProperty('generatedAt');
    expect(report).toHaveProperty('deviceInfo');
    expect(report).toHaveProperty('apps');
    expect(report).toHaveProperty('summary');
  });

  it('includes generatedAt as a valid ISO date string', () => {
    const report = generateReport({ apps: [], deviceInfo: {} });
    expect(() => new Date(report.generatedAt)).not.toThrow();
    expect(new Date(report.generatedAt).toISOString()).toBe(report.generatedAt);
  });

  it('counts apps by risk level correctly', () => {
    const apps = [
      { riskLevel: 'HIGH' },
      { riskLevel: 'HIGH' },
      { riskLevel: 'MEDIUM' },
      { riskLevel: 'LOW' },
      { riskLevel: 'NONE' },
    ];
    const report = generateReport({ apps, deviceInfo: {} });
    expect(report.summary.totalApps).toBe(5);
    expect(report.summary.highRiskApps).toBe(2);
    expect(report.summary.mediumRiskApps).toBe(1);
    expect(report.summary.lowRiskApps).toBe(1);
  });

  it('includes device info in the report', () => {
    const deviceInfo = { model: 'Pixel 7', systemVersion: '13' };
    const report = generateReport({ apps: [], deviceInfo });
    expect(report.deviceInfo).toEqual(deviceInfo);
  });

  it('handles missing apps and deviceInfo gracefully', () => {
    const report = generateReport({});
    expect(report.summary.totalApps).toBe(0);
    expect(report.deviceInfo).toEqual({});
  });
});
