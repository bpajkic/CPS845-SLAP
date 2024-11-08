import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import './index.css'

//Database Stuff
import supabase from '../supabaseClient';


function LoginPage() {
  
  //Fetching Users
  const [fetchError, setFetchError] = useState(null)
  const [users, setUsers] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('USERS') //Name of table
        .select()

        if (error) {
          setFetchError('Could not fetch users')
          setUsers(null) // setsUsers to null if error occured incase it had data from before
          console.log(error)
        }
        if (data) {
          setUsers(data)
          setFetchError(null)
        }
    }

    fetchUsers()

  }, [])
  //Fetching Users End
  
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

      {/* BoskoTesting */}
      <div>
        <b>
          Bosko was here 😱 <br></br>
          Dharshini was here too 😱 <br></br>
          Please use one of the following accounts:
        </b>
        {fetchError && (<p>{fetchError}</p>)}
        {users && (
          <div className="users">
            {users.map(user => (
              <p>Username: {user.USER_NAME} Password: {user.PASSWORD}</p>
            ))}
          </div>
        )}
      </div>
      {/* BoskoTestingEnd */}

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
