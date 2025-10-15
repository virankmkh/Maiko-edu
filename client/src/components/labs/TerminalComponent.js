import React, { useEffect, useRef, useState } from 'react';

const TerminalComponent = ({ onCommand, isConnected }) => {
  const terminalRef = useRef(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(['Terminal ready...']);

  useEffect(() => {
    // Simple terminal simulation
    if (terminalRef.current) {
      terminalRef.current.focus();
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (onCommand) {
        onCommand(input);
      }
      setOutput(prev => [...prev, `$ ${input}`, 'Command executed']);
      setInput('');
    }
  };

  return (
    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
      <div ref={terminalRef} className="space-y-1">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div className="flex items-center">
          <span>$ </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-transparent text-green-400 outline-none flex-1"
            disabled={!isConnected}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalComponent;