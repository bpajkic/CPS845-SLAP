import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import './index.css'

function LoginPage() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Basic login validation
    if (username && password) {
      // Redirect to homepage after "login"
      navigate('/home');
    } else {
      alert('Please enter both username and password.');
    }
  };

  return (
    <div>
      <h1>SLAP</h1>
      <h4>Gould Street University</h4>
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
    </div>
  );
}

export default LoginPage;
