import React, { useState } from 'react';
import { useAppSelectors } from '@/hooks/useAppSelectors';
import { useApp } from '@/context/AppContext';
import { DataTable } from '@/components/DataTable';
import { FindingDetailDrawer } from '@/components/FindingDetailDrawer';
import { Card } from '@/components/Card';
import { SeverityBadge } from '@/components/SeverityBadge';
import { Severity, Section, Label } from '@/types';
import { Search, Filter, X } from 'lucide-react';

export const FindingsPage: React.FC = () => {
  const { 
    activeApp, 
    filteredFindings, 
    findingsBySeverity, 
    availableLabels,
    filterSummary 
  } = useAppSelectors();
  
  const { state, dispatch } = useApp();
  const [showFilters, setShowFilters] = useState(false);

  if (!activeApp) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No App Selected</h3>
          <p className="text-gray-500">Upload a vulnerability analysis JSON file to explore findings.</p>
        </div>
      </div>
    );
  }

  const handleFindingClick = (finding: any) => {
    dispatch({ type: 'SET_SELECTED_FINDING', payload: finding.id });
  };

  const handleSeverityFilter = (severity: Severity) => {
    const currentSeverities = state.filters.severity || [];
    const newSeverities = currentSeverities.includes(severity)
      ? currentSeverities.filter(s => s !== severity)
      : [...currentSeverities, severity];
    
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { severity: newSeverities } 
    });
  };

  const handleSectionFilter = (section: Section) => {
    const currentSections = state.filters.section || [];
    const newSections = currentSections.includes(section)
      ? currentSections.filter(s => s !== section)
      : [...currentSections, section];
    
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { section: newSections } 
    });
  };

  const handleLabelFilter = (label: Label) => {
    const currentLabels = state.filters.labels || [];
    const newLabels = currentLabels.includes(label)
      ? currentLabels.filter(l => l !== label)
      : [...currentLabels, label];
    
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { labels: newLabels } 
    });
  };

  const handleSearchChange = (search: string) => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { search } 
    });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const severityOptions: Severity[] = ['high', 'warning', 'info', 'secure'];
  const sectionOptions: Section[] = ['certificate', 'manifest', 'code', 'permissions', 'trackers', 'secrets', 'firebase'];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Security Findings</h1>
            <p className="text-gray-600">
              {filteredFindings.length} of {activeApp.findings.length} findings
              {filterSummary.length > 0 && (
                <span className="ml-2 text-sm text-blue-600">
                  ({filterSummary.join(', ')})
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            {filterSummary.length > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search findings, descriptions, or file paths..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>

            {/* Severity Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <div className="flex flex-wrap gap-2">
                {severityOptions.map(severity => (
                  <button
                    key={severity}
                    onClick={() => handleSeverityFilter(severity)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      (state.filters.severity || []).includes(severity)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <SeverityBadge severity={severity} className="mr-2" />
                    {severity.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <div className="flex flex-wrap gap-2">
                {sectionOptions.map(section => (
                  <button
                    key={section}
                    onClick={() => handleSectionFilter(section)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      (state.filters.section || []).includes(section)
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {section.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Label Filters */}
            {availableLabels.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labels
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableLabels.map(label => (
                    <button
                      key={label}
                      onClick={() => handleLabelFilter(label)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        (state.filters.labels || []).includes(label)
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(findingsBySeverity).map(([severity, count]) => (
            <Card key={severity} className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500 capitalize">{severity}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Findings Table */}
      <div className="flex-1 bg-white">
        <DataTable
          findings={filteredFindings}
          onRowClick={handleFindingClick}
          className="h-full"
        />
      </div>

      {/* Finding Detail Drawer */}
      <FindingDetailDrawer />
    </div>
  );
};