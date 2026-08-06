// src/App.tsx
import React from 'react';
import SimpleEditor from './components/SimpleEditor';
import './index.css';

function App() {
  const clientId = 1;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-gray-100/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📝</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SyncEdit
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                CRDT-based Collaborative Editor — Single User Mode
              </p>
            </div>
          </div>
        </div>

        {/* Editor */}
        <SimpleEditor clientId={clientId} />

        {/* Footer Info */}
        <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
              <span className="text-lg">💡</span>
              Type, delete, arrow keys
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
              <span className="text-lg">👤</span>
              Client: <span className="font-mono font-semibold text-blue-600">{clientId}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
              <span className="text-lg">⚡</span>
              RGA CRDT
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
              <span className="text-lg">📦</span>
              Pure CRDT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;