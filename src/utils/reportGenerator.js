/**
 * Generates a structured JSON assessment report.
 */

/**
 * @param {{ apps: object[], deviceInfo: object }} data
 * @returns {object} JSON-serializable report
 */
export function generateReport({ apps = [], deviceInfo = {} }) {
  const generatedAt = new Date().toISOString();

  return {
    reportVersion: '1.0.0',
    generatedAt,
    deviceInfo,
    apps,
    summary: {
      totalApps: apps.length,
      highRiskApps: apps.filter(a => a.riskLevel === 'HIGH').length,
      mediumRiskApps: apps.filter(a => a.riskLevel === 'MEDIUM').length,
      lowRiskApps: apps.filter(a => a.riskLevel === 'LOW').length,
    },
  };
}
