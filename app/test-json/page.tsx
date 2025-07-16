"use client";
import { useState } from 'react';

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  details?: unknown;
  timestamp: string;
}

export default function TestJsonPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, success: boolean, message: string, details?: unknown) => {
    setResults(prev => [...prev, { 
      test, 
      success, 
      message, 
      details,
      timestamp: new Date().toISOString() 
    }]);
  };

  const testApiCall = async (url: string, name: string) => {
    try {
      console.log(`Testing ${name}: ${url}`);
      
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      
      console.log(`${name} - Status:`, response.status);
      console.log(`${name} - Content-Type:`, contentType);
      
      if (!response.ok) {
        const text = await response.text();
        console.log(`${name} - Error response:`, text);
        addResult(name, false, `HTTP ${response.status}: ${response.statusText}`, text);
        return;
      }
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log(`${name} - Non-JSON response:`, text);
        addResult(name, false, 'Response is not JSON', text);
        return;
      }
      
      const data = await response.json();
      console.log(`${name} - Success:`, data);
      addResult(name, true, 'JSON parsed successfully', data);
      
    } catch (error) {
      console.error(`${name} - Error:`, error);
      addResult(name, false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
    }
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    // Test the same APIs that are called in the main page
    await testApiCall('/api/services', 'Services API');
    await testApiCall('/api/products', 'Products API');
    await testApiCall('/api/test', 'Test API');
    await testApiCall('/api/test-db', 'Database Test API');

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-purple-800 to-slate-700 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">JSON Parsing Test</h1>
        
        <button 
          onClick={runTests}
          disabled={loading}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run API Tests'}
        </button>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-900/20 border-green-500/30 text-green-100' 
                  : 'bg-red-900/20 border-red-500/30 text-red-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {result.success ? '✅' : '❌'}
                </span>
                <h3 className="font-bold">{result.test}</h3>
                <span className="text-sm opacity-70">{result.timestamp}</span>
              </div>
              <p className="mb-2">{result.message}</p>
              {result.details && (
                <details className="text-sm">
                  <summary className="cursor-pointer hover:text-cyan-300">Ver detalles</summary>
                  <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-x-auto">
                    {typeof result.details === 'string' 
                      ? result.details 
                      : JSON.stringify(result.details as Record<string, unknown>, null, 2)
                    }
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        {results.length === 0 && !loading && (
          <div className="text-center text-white/70 py-12">
            <p>Haz clic en &quot;Run API Tests&quot; para comenzar las pruebas</p>
          </div>
        )}
      </div>
    </div>
  );
} 