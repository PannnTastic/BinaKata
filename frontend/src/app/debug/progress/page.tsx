'use client';

import { useState } from 'react';
import { updateSpellingProgress, getChildProgress } from '@/lib/progress';

export default function DebugProgressPage() {
  const [childId, setChildId] = useState('1');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testUpdateSpelling = async () => {
    setLoading(true);
    try {
      const result = await updateSpellingProgress(
        childId,
        0, // word index
        1, // difficulty
        true, // is correct
        0 // hints used
      );
      setResponse(result);
      console.log('Update spelling result:', result);
    } catch (error) {
      console.error('Error updating spelling:', error);
      setResponse({ error: error.message });
    }
    setLoading(false);
  };

  const testGetProgress = async () => {
    setLoading(true);
    try {
      const result = await getChildProgress(childId);
      setResponse(result);
      console.log('Get progress result:', result);
    } catch (error) {
      console.error('Error getting progress:', error);
      setResponse({ error: error.message });
    }
    setLoading(false);
  };

  const testDirectAPI = async () => {
    setLoading(true);
    try {
      const result = await fetch('/api/progress/spelling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId,
          wordIndex: 1,
          difficulty: 2,
          isCorrect: true,
          hintsUsed: 1
        })
      });
      
      const data = await result.json();
      setResponse(data);
      console.log('Direct API result:', data);
    } catch (error) {
      console.error('Error calling direct API:', error);
      setResponse({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🐛 Debug Progress API
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child ID:
            </label>
            <input
              type="text"
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
              placeholder="Enter child ID"
            />
          </div>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={testUpdateSpelling}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Test Update Spelling'}
            </button>
            
            <button
              onClick={testGetProgress}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Test Get Progress'}
            </button>
            
            <button
              onClick={testDirectAPI}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Test Direct API'}
            </button>
          </div>
          
          {response && (
            <div className="bg-gray-100 rounded-md p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Response:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            📋 Debug Steps:
          </h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Check if PostgreSQL database is running</li>
            <li>Test if Child with ID exists in database</li>
            <li>Test API endpoints directly</li>
            <li>Check browser network tab for errors</li>
            <li>Check server console for errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}