import React from 'react';
import { useAppSelectors } from '@/hooks/useAppSelectors';
import { useApp } from '@/context/AppContext';
import { SeverityBadge } from './SeverityBadge';
import { X, FileText, AlertTriangle } from 'lucide-react';

export const FindingDetailDrawer: React.FC = () => {
  const { selectedFinding } = useAppSelectors();
  const { dispatch } = useApp();

  if (!selectedFinding) return null;

  const closeDrawer = () => {
    dispatch({ type: 'SET_SELECTED_FINDING', payload: undefined });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={closeDrawer}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Finding Details</h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-sm text-gray-900">{selectedFinding.title}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <SeverityBadge severity={selectedFinding.severity} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {selectedFinding.section}
                    </span>
                  </div>
                </div>

                {selectedFinding.rule && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rule</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedFinding.rule}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedFinding.description}</p>
            </div>

            {/* Labels */}
            {selectedFinding.labels.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedFinding.labels.map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {selectedFinding.files.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Affected Files</h3>
                <div className="space-y-3">
                  {selectedFinding.files.map((file, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.path}
                          </p>
                          {file.lines.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Lines:</p>
                              <div className="flex flex-wrap gap-1">
                                {file.lines.slice(0, 10).map((line, lineIndex) => (
                                  <span
                                    key={lineIndex}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-white border border-gray-200"
                                  >
                                    {line}
                                  </span>
                                ))}
                                {file.lines.length > 10 && (
                                  <span className="text-xs text-gray-500">
                                    +{file.lines.length - 10} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Recommendations</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Review the affected files and understand the security implications</li>
                <li>• Implement proper input validation and sanitization</li>
                <li>• Follow secure coding practices and security guidelines</li>
                <li>• Consider using automated security testing tools</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};