import React, { useState } from 'react';
import supabase  from "../supabaseClient";
import { useNavigate, useLocation } from 'react-router-dom';
import './main.css';


function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
  
    const handlePasswordReset = async (e) => {
      e.preventDefault();
      setMessage('');
      setError('');
  
      const token = new URLSearchParams(location.search).get('token'); // Extract the token from URL
  
      if (!token) {
        setError('Invalid or missing reset token.');
        return;
      }
  
      // Complete the password reset process with the new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
  
      if (error) {
        setError(error.message);
      } else {
        setMessage('Password updated successfully! Redirecting to login...');
        setTimeout(() => navigate('/'), 2000); // Redirect to login page
      }
    };
  
    return (
      <div className="login-container">
        <h2>Reset Password</h2>
        <form onSubmit={handlePasswordReset}>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Reset Password</button>
        </form>
  
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }
  
  export default ResetPassword;
