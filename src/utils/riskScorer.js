/**
 * Risk scoring utility for installed app permissions.
 * Assigns points based on the type and number of dangerous permissions.
 */

const DANGEROUS_PERMISSIONS = {
  'android.permission.READ_CONTACTS': 10,
  'android.permission.WRITE_CONTACTS': 10,
  'android.permission.READ_SMS': 15,
  'android.permission.SEND_SMS': 15,
  'android.permission.RECEIVE_SMS': 15,
  'android.permission.CAMERA': 10,
  'android.permission.RECORD_AUDIO': 10,
  'android.permission.ACCESS_FINE_LOCATION': 15,
  'android.permission.ACCESS_COARSE_LOCATION': 10,
  'android.permission.READ_CALL_LOG': 15,
  'android.permission.WRITE_CALL_LOG': 15,
  'android.permission.PROCESS_OUTGOING_CALLS': 15,
  'android.permission.READ_EXTERNAL_STORAGE': 5,
  'android.permission.WRITE_EXTERNAL_STORAGE': 5,
  'android.permission.GET_ACCOUNTS': 5,
  'android.permission.USE_BIOMETRIC': 5,
  'android.permission.USE_FINGERPRINT': 5,
};

/**
 * Calculates a risk score (0–100) for a list of permissions.
 * @param {string[]} permissions - Array of Android permission strings.
 * @returns {{ score: number, level: string, dangerousPermissions: string[] }}
 */
export function calculateRiskScore(permissions = []) {
  let rawScore = 0;
  const dangerousPermissions = [];

  for (const perm of permissions) {
    if (DANGEROUS_PERMISSIONS[perm] !== undefined) {
      rawScore += DANGEROUS_PERMISSIONS[perm];
      dangerousPermissions.push(perm);
    }
  }

  // Cap at 100
  const score = Math.min(rawScore, 100);

  let level;
  if (score >= 70) {
    level = 'HIGH';
  } else if (score >= 35) {
    level = 'MEDIUM';
  } else if (score > 0) {
    level = 'LOW';
  } else {
    level = 'NONE';
  }

  return { score, level, dangerousPermissions };
}

export const DANGEROUS_PERMISSION_LABELS = {
  'android.permission.READ_CONTACTS': 'Contacts (Read)',
  'android.permission.WRITE_CONTACTS': 'Contacts (Write)',
  'android.permission.READ_SMS': 'SMS (Read)',
  'android.permission.SEND_SMS': 'SMS (Send)',
  'android.permission.RECEIVE_SMS': 'SMS (Receive)',
  'android.permission.CAMERA': 'Camera',
  'android.permission.RECORD_AUDIO': 'Microphone',
  'android.permission.ACCESS_FINE_LOCATION': 'Location (Fine)',
  'android.permission.ACCESS_COARSE_LOCATION': 'Location (Coarse)',
  'android.permission.READ_CALL_LOG': 'Call Log (Read)',
  'android.permission.WRITE_CALL_LOG': 'Call Log (Write)',
  'android.permission.PROCESS_OUTGOING_CALLS': 'Outgoing Calls',
  'android.permission.READ_EXTERNAL_STORAGE': 'Storage (Read)',
  'android.permission.WRITE_EXTERNAL_STORAGE': 'Storage (Write)',
  'android.permission.GET_ACCOUNTS': 'Accounts',
  'android.permission.USE_BIOMETRIC': 'Biometric',
  'android.permission.USE_FINGERPRINT': 'Fingerprint',
};
