import React, { useState } from 'react';
import supabase  from "../supabaseClient";
import TemplatePage from "./TemplatePage";
import './main.css';


function ResetPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
const [loggedInUser, setLoggedInUser] = useState(null);


  


  

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

  

      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (user) {
        setLoggedInUser(user);
      }
  
    

    // Step 1: Validate the new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    // Validate new password length (optional)
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    try {
      

      const {data, error } = await supabase
        .from('USERS')
        .select()
        .eq('USER_NAME', loggedInUser.USER_NAME)
        .eq('PASSWORD', loggedInUser.PASSWORD)
        .single 

        

        if(error){
          setError('User not logged in')
          return;
        }

        if(loggedInUser.PASSWORD !== oldPassword){
          setError('Old password is incorrect')
          return;
        }

        try{
          const {error} = await supabase
          .from('USERS')
          .update({PASSWORD: confirmPassword})
          .eq('USER_NAME', loggedInUser.USER_NAME)

          if(!error){
            setMessage('Password changed successfully!');
          }
          
        }catch(error){
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
              type="password"
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
              type="password"
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
              type="password"
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
