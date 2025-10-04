import React from 'react';
import { useApp } from '@/context/AppContext';
import { ChevronDown } from 'lucide-react';

export const AppSelector: React.FC = () => {
  const { state } = useApp();
  const activeAppId = state.activeAppId;

  const activeApp = activeAppId ? state.apps[activeAppId] : null;

  if (!activeApp) {
    return (
      <div className="text-sm text-gray-500">
        No app selected
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {activeApp.meta.appName}
        </div>
        <div className="text-sm text-gray-500 truncate">
          {activeApp.meta.packageName} • v{activeApp.meta.versionName}
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <span className="mr-2">
          {activeApp.summary.totalFindings} findings
        </span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
};
