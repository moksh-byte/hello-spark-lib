import { useState } from 'react';
import '../../../App.css';

interface ServerControlsProps {
  onCreateServer: (serverName: string) => void;
  onJoinServer: (serverId: string) => void;
}

const ServerControls = ({ onCreateServer, onJoinServer }: ServerControlsProps) => {
  const [serverName, setServerName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const handleCreateServer = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = serverName.trim();
    if (trimmedName) {
      onCreateServer(trimmedName);
      setServerName('');
    }
  };

  const handleJoinServer = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = joinCode.trim();
    if (trimmedCode) {
      onJoinServer(trimmedCode);
      setJoinCode('');
    }
  };

  return (
    <div style={{ 
      width: '350px', 
      margin: '0 auto', 
      background: 'white', 
      padding: '2.5em', 
      borderRadius: '12px', 
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '1.5em', fontSize: '2em' }}>
        Join the Conversation
      </h1>
      
      <div style={{ marginBottom: '2em' }}>
        <h3 style={{ marginBottom: '1em', color: '#667eea' }}>Create New Server</h3>
        <form onSubmit={handleCreateServer}>
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            placeholder="Enter server name"
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e0e0e0', 
              borderRadius: '8px', 
              fontSize: '16px', 
              marginBottom: '1em',
              boxSizing: 'border-box'
            }}
          />
          <button type="submit" style={{ width: '100%', marginBottom: '1em' }}>
            Create Server
          </button>
        </form>
      </div>

      <div style={{ 
        margin: '2em 0', 
        textAlign: 'center', 
        color: '#999',
        position: 'relative'
      }}>
        <div style={{ 
          borderTop: '1px solid #e0e0e0', 
          position: 'relative' 
        }}>
          <span style={{ 
            background: 'white', 
            padding: '0 1em', 
            position: 'absolute', 
            top: '-0.5em', 
            left: '50%', 
            transform: 'translateX(-50%)' 
          }}>
            OR
          </span>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1em', color: '#764ba2' }}>Join Existing Server</h3>
        <form onSubmit={handleJoinServer}>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-character join code"
            maxLength={6}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #e0e0e0', 
              borderRadius: '8px', 
              fontSize: '16px', 
              marginBottom: '1em',
              boxSizing: 'border-box'
            }}
          />
          <button type="submit" style={{ width: '100%' }}>
            Join Server
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServerControls;