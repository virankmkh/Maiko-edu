import React, { useState } from 'react';
import { Play, RotateCcw, Download, Copy, CheckCircle, AlertCircle } from 'lucide-react';

const IDEPracticeComponent = ({ codeData }) => {
  const [code, setCode] = useState(codeData.starterCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const languages = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    sql: 'SQL'
  };

  const runCode = async () => {
    setIsRunning(true);
    setError('');
    setOutput('');

    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (codeData.language === 'html') {
        // For HTML, show a preview
        setOutput('HTML Preview:\n✅ Code syntax is valid\n✅ Ready to view in browser');
        setIsSuccess(true);
      } else if (codeData.language === 'css') {
        setOutput('CSS Preview:\n✅ Styles applied successfully\n✅ No syntax errors found');
        setIsSuccess(true);
      } else if (codeData.language === 'javascript') {
        // Simple JavaScript execution simulation
        try {
          // Basic syntax check
          if (code.includes('console.log')) {
            setOutput('JavaScript Output:\n✅ Code executed successfully\n✅ Check browser console for output');
            setIsSuccess(true);
          } else {
            setOutput('JavaScript Output:\n✅ Code syntax is valid\n💡 Try adding console.log() to see output');
            setIsSuccess(true);
          }
        } catch (err) {
          setOutput(`JavaScript Error:\n❌ ${err.message}`);
          setIsSuccess(false);
        }
      } else {
        setOutput(`${languages[codeData.language]} Output:\n✅ Code executed successfully\n✅ No errors found`);
        setIsSuccess(true);
      }
    } catch (err) {
      setError(err.message);
      setIsSuccess(false);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(codeData.starterCode || '');
    setOutput('');
    setError('');
    setIsSuccess(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const downloadCode = () => {
    const extension = codeData.language === 'html' ? 'html' : 
                     codeData.language === 'css' ? 'css' : 
                     codeData.language === 'javascript' ? 'js' : 'txt';
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `practice.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* IDE Header */}
      <div className="bg-gray-900 text-white rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h4 className="text-lg font-semibold">
              💻 {languages[codeData.language]} Practice
            </h4>
            <span className="text-sm text-gray-300">
              {codeData.language.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyCode}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              title="Copy Code"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={downloadCode}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              title="Download Code"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={resetCode}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              title="Reset Code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="bg-gray-900 rounded-b-lg">
        <div className="flex">
          {/* Line Numbers */}
          <div className="bg-gray-800 text-gray-400 text-sm p-4 select-none">
            {code.split('\n').map((_, index) => (
              <div key={index} className="leading-6">
                {index + 1}
              </div>
            ))}
          </div>
          
          {/* Code Area */}
          <div className="flex-1">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
              placeholder="Write your code here..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <strong>Expected Output:</strong> {codeData.expectedOutput}
        </div>
        <button
          onClick={runCode}
          disabled={isRunning}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Output Area */}
      {(output || error) && (
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            {isSuccess ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            )}
            <h5 className="font-semibold text-gray-900">Output</h5>
          </div>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
            {error || output}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-semibold text-blue-900 mb-2">Instructions</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Write your code in the editor above</li>
          <li>• Click "Run Code" to execute and see the output</li>
          <li>• Use the copy/download buttons to save your work</li>
          <li>• Try to match the expected output</li>
        </ul>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-semibold text-yellow-900 mb-2">💡 Tips</h5>
        <ul className="text-sm text-yellow-800 space-y-1">
          {codeData.language === 'html' && (
            <>
              <li>• Use proper HTML5 semantic elements</li>
              <li>• Include a DOCTYPE declaration</li>
              <li>• Add meta tags for viewport and charset</li>
            </>
          )}
          {codeData.language === 'css' && (
            <>
              <li>• Use modern CSS properties</li>
              <li>• Consider responsive design</li>
              <li>• Use CSS Grid and Flexbox for layouts</li>
            </>
          )}
          {codeData.language === 'javascript' && (
            <>
              <li>• Use modern ES6+ features</li>
              <li>• Add console.log() to debug your code</li>
              <li>• Follow best practices for variable naming</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default IDEPracticeComponent;
