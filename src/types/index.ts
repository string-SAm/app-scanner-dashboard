// Core domain types for the App Scanner Dashboard

export type Severity = 'high' | 'warning' | 'info' | 'secure';

export type Section = 'certificate' | 'manifest' | 'code' | 'permissions' | 'trackers' | 'secrets' | 'firebase';

export type PermissionStatus = 'normal' | 'dangerous' | 'unknown';

export type Label = 
  | 'collection' 
  | 'control' 
  | 'network' 
  | 'sms' 
  | 'calllog' 
  | 'calendar' 
  | 'accessibility service'
  | 'other';

// App metadata
export interface AppMeta {
  id: string;
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: string;
  size: string;
  hashes: {
    md5: string;
    sha1: string;
    sha256: string;
  };
  sdk: {
    min: string;
    target: string;
    max?: string;
  };
  mainActivity: string;
  activities: string[];
  services: string[];
  receivers: string[];
  providers: string[];
  libraries: string[];
  iconPath?: string;
  uploadedAt: Date;
}

// Individual finding/rule
export interface Finding {
  id: string;
  appId: string;
  section: Section;
  severity: Severity;
  labels: Label[];
  title: string;
  description: string;
  files: FileReference[];
  rule?: string;
}

export interface FileReference {
  path: string;
  lines: number[];
}

// Permission details
export interface Permission {
  name: string;
  status: PermissionStatus;
  description: string;
  info: string;
  isMalwareAbused?: boolean;
}

// Tracker information
export interface Tracker {
  name: string;
  category: string;
  url: string;
}

// Secret/hardcoded value
export interface Secret {
  value: string;
  category?: string;
  isMasked?: boolean;
}

// Certificate finding
export interface CertificateFinding {
  severity: Severity;
  title: string;
  description: string;
}

// Manifest flag
export interface ManifestFlag {
  key: string;
  value: any;
  severity: Severity;
  description: string;
}

// Log event
export interface LogEvent {
  timestamp: string;
  status: string;
  exception?: string;
}

// Summary statistics
export interface AppSummary {
  securityScore: number;
  totalFindings: number;
  findingsBySeverity: Record<Severity, number>;
  findingsBySection: Record<Section, number>;
  topRisks: Finding[];
  flags: {
    usesCleartextTraffic: boolean;
    debugCertificate: boolean;
    v1Signature: boolean;
    minSdkTooLow: boolean;
    exportedComponents: string[];
  };
  permissions: {
    total: number;
    dangerous: number;
    malwareAbused: number;
  };
  trackers: {
    detected: number;
    total: number;
  };
  secrets: {
    count: number;
    critical: number;
  };
}

// Raw JSON structure (for parsing)
export interface VulnerabilityAnalysisJSON {
  title: string;
  version: string;
  file_name: string;
  app_name: string;
  app_type: string;
  size: string;
  md5: string;
  sha1: string;
  sha256: string;
  package_name: string;
  main_activity: string;
  activities: string[];
  services: string[];
  receivers: string[];
  providers: string[];
  libraries: string[];
  target_sdk: string;
  min_sdk: string;
  max_sdk?: string;
  version_name: string;
  version_code: string;
  icon_path?: string;
  certificate_analysis?: {
    certificate_info: string;
    certificate_findings: [string, string, string][];
    certificate_summary: Record<string, number>;
  };
  permissions?: Record<string, {
    status: string;
    info: string;
    description: string;
  }>;
  malware_permissions?: {
    top_malware_permissions: string[];
    other_abused_permissions: string[];
    total_malware_permissions: number;
    total_other_permissions: number;
  };
  manifest_analysis?: {
    manifest_findings: Array<{
      rule: string;
      title: string;
      severity: string;
      description: string;
      name: string;
      component?: string[];
    }>;
  };
  // Dynamic findings (rule-based)
  [key: string]: any;
  trackers?: {
    detected_trackers: number;
    total_trackers: number;
    trackers: Array<{
      name: string;
      categories: string;
      url: string;
    }>;
  };
  secrets?: string[];
  logs?: Array<{
    timestamp: string;
    status: string;
    exception?: string;
  }>;
  packages?: string[];
  appsec?: {
    high: Array<{
      title: string;
      description: string;
      section: string;
    }>;
    warning: Array<{
      title: string;
      description: string;
      section: string;
    }>;
    info: Array<{
      title: string;
      description: string;
      section: string;
    }>;
    secure: Array<{
      title: string;
      description: string;
      section: string;
    }>;
    hotspot: Array<{
      title: string;
      description: string;
      section: string;
    }>;
    total_trackers: number;
    trackers: number;
    security_score: number;
    app_name: string;
    file_name: string;
    hash: string;
    version_name: string;
  };
  average_cvss?: number | null;
  dynamic_analysis_done?: boolean;
  virus_total?: any;
}

// UI State types
export interface FilterState {
  severity: Severity[];
  section: Section[];
  labels: Label[];
  search: string;
  filePath?: string;
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  selectedFindingId?: string;
}

// App state
export interface AppState {
  apps: Record<string, AppData>;
  activeAppId?: string;
  filters: FilterState;
  ui: UIState;
}

export interface AppData {
  meta: AppMeta;
  findings: Finding[];
  permissions: Permission[];
  trackers: Tracker[];
  secrets: Secret[];
  certificateFindings: CertificateFinding[];
  manifestFlags: ManifestFlag[];
  logs: LogEvent[];
  summary: AppSummary;
  packages: string[];
  rawData: VulnerabilityAnalysisJSON;
}

