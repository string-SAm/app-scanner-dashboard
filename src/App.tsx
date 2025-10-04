import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { parseVulnerabilityAnalysis } from '@/lib/parser';
import { OverviewPage } from '@/features/overview/OverviewPage';
import { FindingsPage } from '@/features/findings/FindingsPage';
import { FileUploadPage } from '@/features/upload/FileUploadPage';
import { AppLayout } from '@/components/AppLayout';
import { AppSelector } from '@/components/AppSelector';
import { Upload, BarChart3, Search } from 'lucide-react';

// Sample data loader for development
const loadSampleData = async () => {
  try {
    const response = await fetch('/vulnerability_analysis.json');
    const jsonData = await response.json();
    return parseVulnerabilityAnalysis(jsonData);
  } catch (error) {
    console.error('Failed to load sample data:', error);
    return null;
  }
};

const App: React.FC = () => {
  const { state, dispatch } = useApp();

  // Load sample data on first render
  useEffect(() => {
    if (Object.keys(state.apps).length === 0) {
      loadSampleData().then(appData => {
        if (appData) {
          dispatch({ type: 'ADD_APP', payload: appData });
        }
      });
    }
  }, [state.apps, dispatch]);

  const navigation = [
    { name: 'Overview', href: '/', icon: BarChart3 },
    { name: 'Findings', href: '/findings', icon: Search },
    { name: 'Upload', href: '/upload', icon: Upload },
  ];

  return (
    <AppLayout navigation={navigation}>
      <div className="flex-1 flex flex-col">
        {/* App Selector */}
        {Object.keys(state.apps).length > 0 && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <AppSelector />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/findings" element={<FindingsPage />} />
            <Route path="/upload" element={<FileUploadPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AppLayout>
  );
};

export default App;
