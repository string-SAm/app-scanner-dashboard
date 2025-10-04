import React from 'react';
import { useAppSelectors } from '@/hooks/useAppSelectors';
import { Card } from '@/components/Card';
import { SecurityScore } from '@/components/SecurityScore';
import { SeverityBadge } from '@/components/SeverityBadge';
import { SeverityChart } from '@/charts/SeverityChart';
import { SectionChart } from '@/charts/SectionChart';
import { generateInsights, getRiskLevel, getSecurityGrade } from '@/lib/insights';
import { AlertTriangle, Shield, FileText, Eye, Lock } from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { 
    activeApp, 
    findingsBySeverity, 
    findingsBySection, 
    topRiskyFiles 
  } = useAppSelectors();

  if (!activeApp) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No App Selected</h3>
          <p className="text-gray-500">Upload a vulnerability analysis JSON file to get started.</p>
        </div>
      </div>
    );
  }

  const { meta, summary } = activeApp;

  // Generate insights
  const insights = generateInsights(activeApp);
  const riskLevel = getRiskLevel(insights.riskScore);
  const securityGrade = getSecurityGrade(insights.riskScore);

  // Convert data for charts
  const severityChartData = Object.entries(findingsBySeverity).map(([severity, count]) => ({
    severity: severity as any,
    count,
  }));

  const sectionChartData = Object.entries(findingsBySection).map(([section, count]) => ({
    section: section as any,
    count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{meta.appName}</h1>
            <p className="text-gray-600">{meta.packageName}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>Version: {meta.versionName}</span>
              <span>•</span>
              <span>Size: {meta.size}</span>
              <span>•</span>
              <span>SDK: {meta.sdk.min} - {meta.sdk.target}</span>
            </div>
          </div>
          <SecurityScore score={summary.securityScore} />
        </div>
      </div>

      {/* Security Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Risk Assessment" subtitle={`Grade: ${securityGrade}`}>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 text-${riskLevel.color}-600`}>
              {insights.riskScore}
            </div>
            <div className={`text-lg font-medium text-${riskLevel.color}-600 mb-1`}>
              {riskLevel.level}
            </div>
            <div className="text-sm text-gray-500">
              {riskLevel.description}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {insights.criticalIssuesPercentage.toFixed(1)}% critical issues
            </div>
          </div>
        </Card>

        <Card title="Top Affected Modules" subtitle="Most vulnerable files">
          <div className="space-y-2">
            {insights.topAffectedModules.slice(0, 3).map((module) => (
              <div key={module.path} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {module.path.split('/').pop()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {module.count} finding{module.count !== 1 ? 's' : ''}
                  </div>
                </div>
                <SeverityBadge severity={module.severity} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Security Recommendations" subtitle="Action items">
          <div className="space-y-2">
            {insights.recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="flex items-start text-sm text-gray-700">
                <span className="mr-2">{rec}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Findings" subtitle={`${summary.totalFindings} issues found`}>
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{summary.totalFindings}</div>
              <div className="text-sm text-gray-500">Security issues</div>
            </div>
          </div>
        </Card>

        <Card title="High Risk" subtitle={`${summary.findingsBySeverity.high} critical issues`}>
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-red-600">{summary.findingsBySeverity.high}</div>
              <div className="text-sm text-gray-500">Critical issues</div>
            </div>
          </div>
        </Card>

        <Card title="Permissions" subtitle={`${summary.permissions.dangerous} dangerous`}>
          <div className="flex items-center">
            <Lock className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{summary.permissions.total}</div>
              <div className="text-sm text-gray-500">
                {summary.permissions.dangerous} dangerous
              </div>
            </div>
          </div>
        </Card>

        <Card title="Trackers" subtitle={`${summary.trackers.detected} detected`}>
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-pink-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{summary.trackers.detected}</div>
              <div className="text-sm text-gray-500">Privacy trackers</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Findings by Severity" subtitle="Distribution of security issues">
          <SeverityChart data={severityChartData} />
        </Card>

        <Card title="Findings by Section" subtitle="Issues by category">
          <SectionChart data={sectionChartData} />
        </Card>
      </div>

      {/* Security Flags */}
      <Card title="Security Flags" subtitle="Key security indicators">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-600 mr-3" />
              <span className="font-medium">Debug Certificate</span>
            </div>
            <SeverityBadge 
              severity={summary.flags.debugCertificate ? 'high' : 'secure'} 
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-600 mr-3" />
              <span className="font-medium">Clear Text Traffic</span>
            </div>
            <SeverityBadge 
              severity={summary.flags.usesCleartextTraffic ? 'warning' : 'secure'} 
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-600 mr-3" />
              <span className="font-medium">V1 Signature</span>
            </div>
            <SeverityBadge 
              severity={summary.flags.v1Signature ? 'warning' : 'secure'} 
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-600 mr-3" />
              <span className="font-medium">Min SDK Too Low</span>
            </div>
            <SeverityBadge 
              severity={summary.flags.minSdkTooLow ? 'warning' : 'secure'} 
            />
          </div>
        </div>
      </Card>

      {/* Top Risks */}
      {summary.topRisks.length > 0 && (
        <Card title="Top Security Risks" subtitle="Most critical issues to address">
          <div className="space-y-3">
            {summary.topRisks.map((risk) => (
              <div key={risk.id} className="flex items-start justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <SeverityBadge severity={risk.severity} className="mr-3" />
                    <span className="font-medium text-gray-900">{risk.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{risk.description}</p>
                  {risk.files.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {risk.files.length} file(s) affected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top Risky Files */}
      {topRiskyFiles.length > 0 && (
        <Card title="Most Risky Files" subtitle="Files with the most security issues">
          <div className="space-y-2">
            {topRiskyFiles.slice(0, 5).map((file) => (
              <div key={file.path} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {file.path}
                  </div>
                  <div className="text-xs text-gray-500">
                    {file.count} finding{file.count !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {file.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
