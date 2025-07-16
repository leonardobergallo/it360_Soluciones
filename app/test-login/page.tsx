"use client";
import { useState } from 'react';

export default function TestLoginPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, success: boolean, message: string) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    // Test 1: Verificar que el servidor esté funcionando
    try {
      const response = await fetch('/api/test');
      if (response.ok) {
        const data = await response.json();
        addResult('Servidor API', true, 'API funcionando correctamente');
      } else {
        addResult('Servidor API', false, `Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      addResult('Servidor API', false, `Error de conexión: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 2: Verificar endpoint de login
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
      });

      if (response.status === 401) {
        addResult('Endpoint Login', true, 'Endpoint funcionando (401 esperado para credenciales inválidas)');
      } else if (response.ok) {
        addResult('Endpoint Login', true, 'Login exitoso (usuario de prueba válido)');
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          addResult('Endpoint Login', false, `Error ${response.status}: ${data.message || 'Error desconocido'}`);
        } else {
          addResult('Endpoint Login', false, `Error ${response.status}: Respuesta no es JSON`);
        }
      }
    } catch (error) {
      addResult('Endpoint Login', false, `Error de conexión: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 3: Verificar variables de entorno
    try {
      const response = await fetch('/api/test-env');
      if (response.ok) {
        const data = await response.json();
        addResult('Variables de Entorno', true, 'Variables configuradas correctamente');
      } else {
        addResult('Variables de Entorno', false, 'Error verificando variables de entorno');
      }
    } catch (error) {
      addResult('Variables de Entorno', false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Diagnóstico del Sistema de Login</h1>
        
        <div className="mb-8">
          <button
            onClick={runTests}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Ejecutando tests...' : 'Ejecutar Diagnóstico'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-cyan-400">Resultados de las pruebas:</h2>
            
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-2xl ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                    {result.success ? '✅' : '❌'}
                  </span>
                  <div>
                    <h3 className="font-semibold">{result.test}</h3>
                    <p className="text-sm text-white/70">{result.message}</p>
                    <p className="text-xs text-white/50">{result.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">📋 Soluciones comunes:</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>• <strong>Error de conexión:</strong> Verifica que el servidor esté corriendo con <code className="bg-white/10 px-2 py-1 rounded">npm run dev</code></li>
            <li>• <strong>Error de base de datos:</strong> Ejecuta <code className="bg-white/10 px-2 py-1 rounded">npm run db:migrate</code></li>
            <li>• <strong>Sin usuarios:</strong> Crea un admin con <code className="bg-white/10 px-2 py-1 rounded">npm run create-admin</code></li>
            <li>• <strong>Variables de entorno:</strong> Configura con <code className="bg-white/10 px-2 py-1 rounded">npm run setup:env</code></li>
            <li>• <strong>Diagnóstico completo:</strong> Ejecuta <code className="bg-white/10 px-2 py-1 rounded">npm run diagnose:login</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
} 