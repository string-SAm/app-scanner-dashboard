import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Finding, Severity, Section, Label } from '@/types';

// Custom hook for app selectors
export const useAppSelectors = () => {
  const { state } = useApp();

  // Get active app data
  const activeApp = useMemo(() => {
    if (!state.activeAppId) return null;
    return state.apps[state.activeAppId] || null;
  }, [state.apps, state.activeAppId]);

  // Get filtered findings
  const filteredFindings = useMemo(() => {
    if (!activeApp) return [];
    
    let findings = activeApp.findings;

    // Filter by severity
    if (state.filters.severity.length > 0) {
      findings = findings.filter(finding => 
        state.filters.severity.includes(finding.severity)
      );
    }

    // Filter by section
    if (state.filters.section.length > 0) {
      findings = findings.filter(finding => 
        state.filters.section.includes(finding.section)
      );
    }

    // Filter by labels
    if (state.filters.labels.length > 0) {
      findings = findings.filter(finding => 
        state.filters.labels.some(label => finding.labels.includes(label))
      );
    }

    // Filter by search term
    if (state.filters.search) {
      const searchTerm = state.filters.search.toLowerCase();
      findings = findings.filter(finding => 
        finding.title.toLowerCase().includes(searchTerm) ||
        finding.description.toLowerCase().includes(searchTerm) ||
        finding.files.some(file => 
          file.path.toLowerCase().includes(searchTerm)
        )
      );
    }

    // Filter by file path
    if (state.filters.filePath) {
      const filePath = state.filters.filePath.toLowerCase();
      findings = findings.filter(finding => 
        finding.files.some(file => 
          file.path.toLowerCase().includes(filePath)
        )
      );
    }

    return findings;
  }, [activeApp, state.filters]);

  // Get findings by severity
  const findingsBySeverity = useMemo(() => {
    const counts: Record<Severity, number> = {
      high: 0,
      warning: 0,
      info: 0,
      secure: 0,
    };

    filteredFindings.forEach(finding => {
      counts[finding.severity]++;
    });

    return counts;
  }, [filteredFindings]);

  // Get findings by section
  const findingsBySection = useMemo(() => {
    const counts: Record<Section, number> = {
      certificate: 0,
      manifest: 0,
      code: 0,
      permissions: 0,
      trackers: 0,
      secrets: 0,
      firebase: 0,
    };

    filteredFindings.forEach(finding => {
      counts[finding.section]++;
    });

    return counts;
  }, [filteredFindings]);

  // Get unique labels from filtered findings
  const availableLabels = useMemo(() => {
    const labelSet = new Set<Label>();
    filteredFindings.forEach(finding => {
      finding.labels.forEach(label => labelSet.add(label));
    });
    return Array.from(labelSet).sort();
  }, [filteredFindings]);

  // Get files with findings count
  const filesWithFindings = useMemo(() => {
    const fileMap = new Map<string, { path: string; findings: Finding[]; count: number }>();
    
    filteredFindings.forEach(finding => {
      finding.files.forEach(file => {
        if (!fileMap.has(file.path)) {
          fileMap.set(file.path, {
            path: file.path,
            findings: [],
            count: 0,
          });
        }
        const fileData = fileMap.get(file.path)!;
        fileData.findings.push(finding);
        fileData.count++;
      });
    });

    return Array.from(fileMap.values()).sort((a, b) => b.count - a.count);
  }, [filteredFindings]);

  // Get top risky files (most findings)
  const topRiskyFiles = useMemo(() => {
    return filesWithFindings.slice(0, 10);
  }, [filesWithFindings]);

  // Get selected finding
  const selectedFinding = useMemo(() => {
    if (!state.ui.selectedFindingId || !activeApp) return null;
    return activeApp.findings.find(f => f.id === state.ui.selectedFindingId) || null;
  }, [state.ui.selectedFindingId, activeApp]);


  // Get filter summary
  const filterSummary = useMemo(() => {
    const activeFilters = [];
    
    if (state.filters.severity.length > 0) {
      activeFilters.push(`${state.filters.severity.length} severity`);
    }
    if (state.filters.section.length > 0) {
      activeFilters.push(`${state.filters.section.length} section`);
    }
    if (state.filters.labels.length > 0) {
      activeFilters.push(`${state.filters.labels.length} labels`);
    }
    if (state.filters.search) {
      activeFilters.push('search');
    }
    if (state.filters.filePath) {
      activeFilters.push('file path');
    }

    return activeFilters;
  }, [state.filters]);

  return {
    // App data
    activeApp,
    
    // Filtered data
    filteredFindings,
    findingsBySeverity,
    findingsBySection,
    availableLabels,
    filesWithFindings,
    topRiskyFiles,
    
    // UI state
    selectedFinding,
    filterSummary,
    
    // Raw state
    filters: state.filters,
    ui: state.ui,
  };
};
