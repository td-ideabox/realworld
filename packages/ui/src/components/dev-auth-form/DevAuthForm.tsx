'use client';

import { useState } from 'react';

interface DevAuthFormProps {
  onLogin: (email: string, username?: string) => Promise<void>;
  isLoading: boolean;
}

export function DevAuthForm({ onLogin, isLoading }: DevAuthFormProps) {
  const [email, setEmail] = useState('test@example.com');
  const [username, setUsername] = useState('testuser');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && username) {
      await onLogin(email, username);
    }
  };

  return (
    <div style={{
      border: '2px dashed #f39c12',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#fef9e7',
      borderRadius: '5px'
    }}>
      <h3 style={{ color: '#e67e22', margin: '0 0 15px 0' }}>
        🚧 Development Mode Auth
      </h3>
      <p style={{ color: '#d35400', fontSize: '14px', margin: '0 0 15px 0' }}>
        This is a local development auth form. In production, this will use Cognito.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter any email"
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            placeholder="Enter any username"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
          style={{ width: '100%' }}
        >
          {isLoading ? 'Signing in...' : 'Sign in (Dev Mode)'}
        </button>
      </form>

      <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '10px' }}>
        This generates a mock JWT token that works with the API.
      </p>
    </div>
  );
}