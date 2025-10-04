import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useApp } from '@/context/AppContext';
import { parseVulnerabilityAnalysis, validateVulnerabilityAnalysisJSON } from '@/lib/parser';
import { Card } from '@/components/Card';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export const FileUploadPage: React.FC = () => {
  const { dispatch } = useApp();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      if (!validateVulnerabilityAnalysisJSON(jsonData)) {
        throw new Error('Invalid vulnerability analysis JSON format');
      }

      const appData = parseVulnerabilityAnalysis(jsonData);
      dispatch({ type: 'ADD_APP', payload: appData });
      
      setUploadStatus('success');
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to parse JSON file');
      setUploadStatus('error');
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    multiple: false
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Analysis File</h1>
        <p className="text-gray-600">
          Upload a vulnerability analysis JSON file to get started with the dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card title="Upload File" subtitle="Drag and drop your JSON file here">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${uploadStatus === 'uploading' ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {uploadStatus === 'uploading' ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Processing file...</p>
              </div>
            ) : uploadStatus === 'success' ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                <p className="text-green-600 font-medium">File uploaded successfully!</p>
                <p className="text-sm text-gray-500 mt-2">You can now view the analysis in the Overview or Findings pages.</p>
              </div>
            ) : uploadStatus === 'error' ? (
              <div className="flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
                <p className="text-red-600 font-medium">Upload failed</p>
                <p className="text-sm text-gray-500 mt-2">{errorMessage}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? 'Drop the file here' : 'Drag & drop a JSON file here'}
                </p>
                <p className="text-gray-500">or click to browse</p>
                <p className="text-sm text-gray-400 mt-4">
                  Supports .json files up to 50MB
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Instructions */}
        <Card title="File Format" subtitle="Expected JSON structure">
          <div className="space-y-4">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Vulnerability Analysis JSON</h4>
                <p className="text-sm text-gray-600">
                  The file should contain app metadata, findings, permissions, and security analysis data.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Required Fields:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• app_name, package_name, version_name</li>
                <li>• md5, sha1, sha256 hashes</li>
                <li>• permissions, trackers, secrets</li>
                <li>• certificate_analysis, manifest_analysis</li>
                <li>• appsec findings and security_score</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Sample Data</h5>
              <p className="text-sm text-blue-700">
                A sample vulnerability analysis file is already loaded for demonstration purposes.
                You can explore it in the Overview and Findings pages.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
