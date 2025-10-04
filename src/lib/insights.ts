import { AppData, Finding, Severity } from '@/types';

export interface SecurityInsights {
  riskScore: number; // 0-100, higher = more risky
  criticalIssuesPercentage: number;
  topAffectedModules: Array<{ path: string; count: number; severity: Severity }>;
  securityTrends: {
    highRiskCount: number;
    warningCount: number;
    infoCount: number;
    secureCount: number;
  };
  recommendations: string[];
  riskDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * Generate meaningful insights from vulnerability analysis data
 */
export const generateInsights = (appData: AppData): SecurityInsights => {
  const { findings, meta } = appData;
  
  // Calculate risk score (0-100, higher = more risky)
  const riskScore = calculateRiskScore(findings);
  
  // Critical issues percentage
  const criticalIssuesPercentage = (findings.filter(f => f.severity === 'high').length / findings.length) * 100;
  
  // Top affected modules
  const topAffectedModules = getTopAffectedModules(findings);
  
  // Security trends
  const securityTrends = {
    highRiskCount: findings.filter(f => f.severity === 'high').length,
    warningCount: findings.filter(f => f.severity === 'warning').length,
    infoCount: findings.filter(f => f.severity === 'info').length,
    secureCount: findings.filter(f => f.severity === 'secure').length,
  };
  
  // Generate recommendations
  const recommendations = generateRecommendations(findings, meta);
  
  // Risk distribution
  const riskDistribution = {
    critical: findings.filter(f => f.severity === 'high').length,
    high: findings.filter(f => f.severity === 'warning').length,
    medium: findings.filter(f => f.severity === 'info').length,
    low: findings.filter(f => f.severity === 'secure').length,
  };
  
  return {
    riskScore,
    criticalIssuesPercentage,
    topAffectedModules,
    securityTrends,
    recommendations,
    riskDistribution,
  };
};

/**
 * Calculate overall risk score based on findings severity and count
 */
const calculateRiskScore = (findings: Finding[]): number => {
  if (findings.length === 0) return 0;
  
  const severityWeights = {
    high: 10,
    warning: 5,
    info: 2,
    secure: 0,
  };
  
  const totalWeight = findings.reduce((sum, finding) => {
    return sum + severityWeights[finding.severity];
  }, 0);
  
  // Normalize to 0-100 scale
  const maxPossibleWeight = findings.length * 10;
  return Math.min(100, Math.round((totalWeight / maxPossibleWeight) * 100));
};

/**
 * Get top 5 most affected modules/files
 */
const getTopAffectedModules = (findings: Finding[]): Array<{ path: string; count: number; severity: Severity }> => {
  const moduleMap = new Map<string, { count: number; severity: Severity }>();
  
  findings.forEach(finding => {
    finding.files.forEach(file => {
      const path = file.path;
      if (!moduleMap.has(path)) {
        moduleMap.set(path, { count: 0, severity: finding.severity });
      }
      const module = moduleMap.get(path)!;
      module.count++;
      // Keep the highest severity for this module
      if (getSeverityWeight(finding.severity) > getSeverityWeight(module.severity)) {
        module.severity = finding.severity;
      }
    });
  });
  
  return Array.from(moduleMap.entries())
    .map(([path, data]) => ({ path, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

/**
 * Generate actionable security recommendations
 */
const generateRecommendations = (findings: Finding[], meta: any): string[] => {
  const recommendations: string[] = [];
  
  const highSeverityCount = findings.filter(f => f.severity === 'high').length;
  const warningCount = findings.filter(f => f.severity === 'warning').length;
  const permissionCount = findings.filter(f => f.section === 'permissions').length;
  const trackerCount = findings.filter(f => f.section === 'trackers').length;
  
  if (highSeverityCount > 0) {
    recommendations.push(`🚨 Address ${highSeverityCount} critical security issues immediately`);
  }
  
  if (warningCount > 5) {
    recommendations.push(`⚠️ Review ${warningCount} warning-level issues to improve security posture`);
  }
  
  if (permissionCount > 10) {
    recommendations.push(`🔐 Audit ${permissionCount} permissions - consider removing unnecessary ones`);
  }
  
  if (trackerCount > 0) {
    recommendations.push(`👁️ Remove or replace ${trackerCount} tracking libraries to improve privacy`);
  }
  
  // SDK recommendations
  const minSdk = parseInt(meta.sdk?.min || '0');
  if (minSdk < 23) {
    recommendations.push(`📱 Update minimum SDK version from ${minSdk} to 23+ for better security`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ No immediate security concerns detected');
  }
  
  return recommendations;
};

/**
 * Get severity weight for comparison
 */
const getSeverityWeight = (severity: Severity): number => {
  const weights = { high: 4, warning: 3, info: 2, secure: 1 };
  return weights[severity];
};

/**
 * Get risk level description
 */
export const getRiskLevel = (riskScore: number): { level: string; color: string; description: string } => {
  if (riskScore >= 80) {
    return { level: 'Critical', color: 'red', description: 'Immediate action required' };
  } else if (riskScore >= 60) {
    return { level: 'High', color: 'orange', description: 'Address within 1 week' };
  } else if (riskScore >= 40) {
    return { level: 'Medium', color: 'yellow', description: 'Address within 1 month' };
  } else if (riskScore >= 20) {
    return { level: 'Low', color: 'blue', description: 'Monitor and plan improvements' };
  } else {
    return { level: 'Minimal', color: 'green', description: 'Good security posture' };
  }
};

/**
 * Get security grade (A-F)
 */
export const getSecurityGrade = (riskScore: number): string => {
  if (riskScore >= 90) return 'F';
  if (riskScore >= 80) return 'D';
  if (riskScore >= 60) return 'C';
  if (riskScore >= 40) return 'B';
  if (riskScore >= 20) return 'A-';
  return 'A+';
};
