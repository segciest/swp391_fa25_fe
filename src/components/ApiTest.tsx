'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

export default function ApiTest() {
  const [status, setStatus] = useState<string>('Checking...');
  const [backendData, setBackendData] = useState<any>(null);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      // Try to connect to backend health endpoint
      const response = await ApiService.get('/api/health');
      setStatus('✅ Backend Connected');
      setBackendData(response);
    } catch (error) {
      setStatus('❌ Backend Disconnected');
      console.error('Backend connection failed:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      <div className="space-y-2">
        <p><strong>Backend Status:</strong> {status}</p>
        <p><strong>API URL:</strong> http://localhost:8080</p>
        
        {backendData && (
          <div className="mt-4">
            <h3 className="font-semibold">Backend Response:</h3>
            <pre className="bg-gray-200 p-2 rounded text-sm">
              {JSON.stringify(backendData, null, 2)}
            </pre>
          </div>
        )}
        
        <button 
          onClick={checkBackendConnection}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Recheck Connection
        </button>
      </div>
    </div>
  );
}