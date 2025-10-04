import {
  VulnerabilityAnalysisJSON,
  AppData,
  AppMeta,
  Finding,
  Permission,
  Tracker,
  Secret,
  CertificateFinding,
  ManifestFlag,
  LogEvent,
  AppSummary,
  Severity,
  Section,
  Label,
  PermissionStatus,
  FileReference,
} from '@/types';

/**
 * Parser to convert raw vulnerability analysis JSON into normalized domain entities
 */

// Helper function to generate unique ID
const generateId = (prefix: string, data: any): string => {
  const hash = btoa(JSON.stringify(data)).slice(0, 8);
  return `${prefix}_${hash}`;
};

// Map severity strings to our Severity type
const mapSeverity = (severity: string): Severity => {
  const severityMap: Record<string, Severity> = {
    'high': 'high',
    'warning': 'warning',
    'info': 'info',
    'secure': 'secure',
  };
  return severityMap[severity.toLowerCase()] || 'info';
};

// Map section strings to our Section type
const mapSection = (section: string): Section => {
  const sectionMap: Record<string, Section> = {
    'certificate': 'certificate',
    'manifest': 'manifest',
    'code': 'code',
    'permissions': 'permissions',
    'trackers': 'trackers',
    'secrets': 'secrets',
    'firebase': 'firebase',
  };
  return sectionMap[section.toLowerCase()] || 'code';
};

// Map permission status strings
const mapPermissionStatus = (status: string): PermissionStatus => {
  const statusMap: Record<string, PermissionStatus> = {
    'normal': 'normal',
    'dangerous': 'dangerous',
    'unknown': 'unknown',
  };
  return statusMap[status.toLowerCase()] || 'unknown';
};

// Extract labels from metadata
const extractLabels = (labels: string[]): Label[] => {
  const labelMap: Record<string, Label> = {
    'collection': 'collection',
    'control': 'control',
    'network': 'network',
    'sms': 'sms',
    'calllog': 'calllog',
    'calendar': 'calendar',
    'accessibility service': 'accessibility service',
  };
  
  return labels
    .map(label => labelMap[label.toLowerCase()])
    .filter(Boolean) as Label[];
};

// Parse file references from the files object
const parseFileReferences = (files: Record<string, string>): FileReference[] => {
  return Object.entries(files).map(([path, linesStr]) => ({
    path,
    lines: linesStr.split(',').map(line => parseInt(line.trim(), 10)).filter(n => !isNaN(n)),
  }));
};

// Parse app metadata
const parseAppMeta = (data: VulnerabilityAnalysisJSON): AppMeta => {
  return {
    id: generateId('app', data.md5),
    appName: data.app_name || 'Unknown App',
    packageName: data.package_name || '',
    versionName: data.version_name || '',
    versionCode: data.version_code || '',
    size: data.size || '',
    hashes: {
      md5: data.md5 || '',
      sha1: data.sha1 || '',
      sha256: data.sha256 || '',
    },
    sdk: {
      min: data.min_sdk || '',
      target: data.target_sdk || '',
      max: data.max_sdk || undefined,
    },
    mainActivity: data.main_activity || '',
    activities: data.activities || [],
    services: data.services || [],
    receivers: data.receivers || [],
    providers: data.providers || [],
    libraries: data.libraries || [],
    iconPath: data.icon_path,
    uploadedAt: new Date(),
  };
};

// Parse findings from dynamic rule-based data
const parseFindings = (data: VulnerabilityAnalysisJSON, appId: string): Finding[] => {
  const findings: Finding[] = [];
  
  // Parse certificate findings
  if (data.certificate_analysis?.certificate_findings) {
    data.certificate_analysis.certificate_findings.forEach(([severity, description, title], index) => {
      findings.push({
        id: generateId('cert', { title, index }),
        appId,
        section: 'certificate',
        severity: mapSeverity(severity),
        labels: [],
        title,
        description,
        files: [],
      });
    });
  }
  
  // Parse manifest findings
  if (data.manifest_analysis?.manifest_findings) {
    data.manifest_analysis.manifest_findings.forEach((finding, index) => {
      findings.push({
        id: generateId('manifest', { rule: finding.rule, index }),
        appId,
        section: 'manifest',
        severity: mapSeverity(finding.severity),
        labels: [],
        title: finding.title,
        description: finding.description,
        files: [],
        rule: finding.rule,
      });
    });
  }
  
  // Parse appsec findings
  if (data.appsec) {
    const appsecSections: { key: keyof typeof data.appsec; section: Section }[] = [
      { key: 'high', section: 'code' },
      { key: 'warning', section: 'code' },
      { key: 'info', section: 'code' },
      { key: 'secure', section: 'code' },
      { key: 'hotspot', section: 'code' },
    ];
    
    appsecSections.forEach(({ key, section }) => {
      const sectionFindings = data.appsec![key] as any[] || [];
      sectionFindings.forEach((finding: any, index: number) => {
        findings.push({
          id: generateId('appsec', { key, index }),
          appId,
          section: mapSection(finding.section) || section,
          severity: mapSeverity(key === 'hotspot' ? 'warning' : key),
          labels: [],
          title: finding.title,
          description: finding.description,
          files: [],
        });
      });
    });
  }
  
  // Parse dynamic rule-based findings (the large section you were looking at)
  Object.entries(data).forEach(([key, value]) => {
    // Look for rule-based findings (numeric keys with files and metadata)
    if (/^\d+$/.test(key) && typeof value === 'object' && value !== null) {
      const ruleData = value as any;
      if (ruleData.files && ruleData.metadata) {
        const files = parseFileReferences(ruleData.files);
        const labels = extractLabels(ruleData.metadata.label || []);
        
        findings.push({
          id: generateId('rule', key),
          appId,
          section: 'code',
          severity: mapSeverity(ruleData.metadata.severity || 'info'),
          labels,
          title: ruleData.metadata.description || `Rule ${key}`,
          description: ruleData.metadata.description || '',
          files,
        });
      }
    }
  });
  
  return findings;
};

// Parse permissions
const parsePermissions = (data: VulnerabilityAnalysisJSON): Permission[] => {
  const permissions: Permission[] = [];
  const malwarePermissions = new Set(data.malware_permissions?.top_malware_permissions || []);
  
  if (data.permissions) {
    Object.entries(data.permissions).forEach(([name, perm]) => {
      permissions.push({
        name,
        status: mapPermissionStatus(perm.status),
        description: perm.description || '',
        info: perm.info || '',
        isMalwareAbused: malwarePermissions.has(name),
      });
    });
  }
  
  return permissions;
};

// Parse trackers
const parseTrackers = (data: VulnerabilityAnalysisJSON): Tracker[] => {
  if (!data.trackers?.trackers) return [];
  
  return data.trackers.trackers.map(tracker => ({
    name: tracker.name,
    category: tracker.categories,
    url: tracker.url,
  }));
};

// Parse secrets
const parseSecrets = (data: VulnerabilityAnalysisJSON): Secret[] => {
  if (!data.secrets) return [];
  
  return data.secrets.map(secret => ({
    value: secret,
    isMasked: true, // Default to masked
  }));
};

// Parse certificate findings
const parseCertificateFindings = (data: VulnerabilityAnalysisJSON): CertificateFinding[] => {
  if (!data.certificate_analysis?.certificate_findings) return [];
  
  return data.certificate_analysis.certificate_findings.map(([severity, description, title]) => ({
    severity: mapSeverity(severity),
    title,
    description,
  }));
};

// Parse manifest flags
const parseManifestFlags = (data: VulnerabilityAnalysisJSON): ManifestFlag[] => {
  const flags: ManifestFlag[] = [];
  
  // Check for cleartext traffic
  if (data.manifest_analysis?.manifest_findings) {
    data.manifest_analysis.manifest_findings.forEach(finding => {
      if (finding.title.includes('Clear text traffic') || finding.title.includes('cleartext')) {
        flags.push({
          key: 'usesCleartextTraffic',
          value: true,
          severity: mapSeverity(finding.severity),
          description: finding.description,
        });
      }
    });
  }
  
  return flags;
};

// Parse logs
const parseLogs = (data: VulnerabilityAnalysisJSON): LogEvent[] => {
  if (!data.logs) return [];
  
  return data.logs.map(log => ({
    timestamp: log.timestamp,
    status: log.status,
    exception: log.exception,
  }));
};

// Generate app summary
const generateAppSummary = (
  data: VulnerabilityAnalysisJSON,
  findings: Finding[],
  permissions: Permission[],
  trackers: Tracker[],
  secrets: Secret[],
  appMeta: AppMeta
): AppSummary => {
  // Count findings by severity
  const findingsBySeverity: Record<Severity, number> = {
    high: 0,
    warning: 0,
    info: 0,
    secure: 0,
  };
  
  findings.forEach(finding => {
    findingsBySeverity[finding.severity]++;
  });
  
  // Count findings by section
  const findingsBySection: Record<Section, number> = {
    certificate: 0,
    manifest: 0,
    code: 0,
    permissions: 0,
    trackers: 0,
    secrets: 0,
    firebase: 0,
  };
  
  findings.forEach(finding => {
    findingsBySection[finding.section]++;
  });
  
  // Get top risks (high severity findings)
  const topRisks = findings
    .filter(f => f.severity === 'high')
    .slice(0, 5);
  
  // Check flags
  const flags = {
    usesCleartextTraffic: data.manifest_analysis?.manifest_findings?.some(f => 
      f.title.includes('Clear text traffic') || f.title.includes('cleartext')
    ) || false,
    debugCertificate: data.certificate_analysis?.certificate_findings?.some(f => 
      f[2].includes('debug certificate')
    ) || false,
    v1Signature: data.certificate_analysis?.certificate_findings?.some(f => 
      f[2].includes('Janus Vulnerability')
    ) || false,
    minSdkTooLow: parseInt(appMeta.sdk.min) < 29,
    exportedComponents: [], // Would need to parse manifest for this
  };
  
  // Calculate security score (0-100)
  const securityScore = data.appsec?.security_score || 50;
  
  return {
    securityScore,
    totalFindings: findings.length,
    findingsBySeverity,
    findingsBySection,
    topRisks,
    flags,
    permissions: {
      total: permissions.length,
      dangerous: permissions.filter(p => p.status === 'dangerous').length,
      malwareAbused: permissions.filter(p => p.isMalwareAbused).length,
    },
    trackers: {
      detected: trackers.length,
      total: data.trackers?.total_trackers || 0,
    },
    secrets: {
      count: secrets.length,
      critical: secrets.filter(s => s.value.length > 20).length, // Arbitrary threshold
    },
  };
};

// Main parser function
export const parseVulnerabilityAnalysis = (jsonData: VulnerabilityAnalysisJSON): AppData => {
  const appMeta = parseAppMeta(jsonData);
  const findings = parseFindings(jsonData, appMeta.id);
  const permissions = parsePermissions(jsonData);
  const trackers = parseTrackers(jsonData);
  const secrets = parseSecrets(jsonData);
  const certificateFindings = parseCertificateFindings(jsonData);
  const manifestFlags = parseManifestFlags(jsonData);
  const logs = parseLogs(jsonData);
  const summary = generateAppSummary(jsonData, findings, permissions, trackers, secrets, appMeta);
  
  return {
    meta: appMeta,
    findings,
    permissions,
    trackers,
    secrets,
    certificateFindings,
    manifestFlags,
    logs,
    summary,
    packages: jsonData.packages || [],
    rawData: jsonData,
  };
};

// Utility function to validate JSON structure
export const validateVulnerabilityAnalysisJSON = (data: any): data is VulnerabilityAnalysisJSON => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.app_name === 'string' &&
    typeof data.package_name === 'string' &&
    typeof data.md5 === 'string'
  );
};
