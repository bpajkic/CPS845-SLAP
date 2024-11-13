import React, { useState, useEffect } from 'react';
import supabase  from "../supabaseClient";
import TemplatePage from "./TemplatePage";
import './main.css';


function ResetPassword() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState(''); // State for storing the password fetched from the DB

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      if (user) {
          setLoggedInUser(user);
      }
  }, []);

  // Function to get the password from the USERS table based on USER_NAME
  const getPasswordForLoggedInUser = async () => {
      if (!loggedInUser) {
          console.error('No logged-in user found.');
          return null;
      }

      try {
          const { data, error } = await supabase
              .from('USERS')
              .select('PASSWORD')
              .eq('EMAIL', loggedInUser.EMAIL) // Assuming USER_NAME is stored in loggedInUser
              .single();

          if (error) {
              console.error('Error retrieving password:', error);
              return null;
          }

          // Set the password state (for verification purposes)
          setPassword(data ? data.PASSWORD : '');
      } catch (error) {
          console.error('Unexpected error:', error);
      }
  };

  // Call getPasswordForLoggedInUser when component mounts or loggedInUser changes
  useEffect(() => {
      if (loggedInUser) {
          getPasswordForLoggedInUser();
      }
  }, [loggedInUser]);

  // Function to handle changing the password
  const handleChangePassword = async (e) => {
      e.preventDefault();
      setError('');
      setMessage('');




      // Step 1: Validate the new password and confirm password match
      if (newPassword !== confirmPassword) {
          setError('New passwords do not match.');
          return;
      }

      // Validate new password length
      if (newPassword.length < 8) {
          setError('New password must be at least 8 characters.');
          return;
      }

      // Step 2: Verify old password matches the one in the database
      if (oldPassword !== password) {
          setError('Old password is incorrect.');
          return;
      }

      try {
          // Step 3: Update the password in the database
          const { error } = await supabase
              .from('USERS')
              .update({ PASSWORD: newPassword })
              .eq('EMAIL', loggedInUser.EMAIL);

          if (!error) {
              setMessage('Password changed successfully!');
          } else {
              setError('An error occurred while changing the password.');
          }
      } catch (err) {
          setError('An error occurred while changing the password.');
      }
  };
  


  return (
    <TemplatePage>
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>
            Old Password:
            <input
              type="text"
              value={oldPassword}
              
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            New Password:
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Confirm New Password:
            <input
              type="text"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button className="changePassword" type="submit">Change Password</button>
      </form>

      {/* Show error or success message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
    </TemplatePage>
  );
  }
  
  export default ResetPassword;
