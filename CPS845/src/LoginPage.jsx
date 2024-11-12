import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./main.css";

//Database Stuff
import supabase from "../supabaseClient";

function LoginPage() {
  //Fetching Users
  const [fetchError, setFetchError] = useState(null);
  const [users, setUsers] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("USERS") //Name of table
        .select();

      if (error) {
        setFetchError("Could not fetch users");
        setUsers(null); // setsUsers to null if error occured incase it had data from before
        console.log(error);
      }
      if (data) {
        setUsers(data);
        setFetchError(null);
      }
    };

    fetchUsers();
  }, []);
  //Fetching Users End

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const[message,setMessage] = useState('');
  const[error,setError] = useState('');
  const[email,setEmail] = useState('');
  const[showEmailInput, setShowEmailInput] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from("USERS")
        .select("id, EMAIL, USER_NAME")
        .eq("USER_NAME", username)
        .eq("PASSWORD", password)
        .single();
  
      if (error || !data) {
        setError("Invalid username or password. Please try again.");
        console.error("Login error:", error);
      } else {
        setError("");
        const fullName = `${data.FIRST_NAME} ${data.LAST_NAME}`;
  
        // Store the logged-in user's email in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify({ id: data.id, fullName}));
  
        // Navigate to the homepage
        navigate("/home");
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleForgotPasswordClick = () => {
    // Show the email input field
    setShowEmailInput(true);
    setMessage('');
    setError('');
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Send password reset email using Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password', // Adjust this URL to your reset password page
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link sent! Please check your email.');
      setShowEmailInput(false); // Hide the input field after sending the email
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
        {fetchError && <p>{fetchError}</p>}
        {users && (
          <div className="users">
            {users.map((user) => (
              <p>
                Username: {user.USER_NAME} Password: {user.PASSWORD}
              </p>
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
          placeholder="Slap ID"
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
        {!showEmailInput && (<button onClick={handleForgotPasswordClick}>Forgot Password</button>)}
        {showEmailInput && (
        <form onSubmit={handleSendResetLink}>
          <label>
            Enter your email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit">Send Reset Link</button>
        </form>)}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        
         
      </div>
    </div>
  );
}

export default LoginPage;
