import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./main.css";

//Database Stuff
import supabase from "../supabaseClient";

function LoginPage() {
  // Fetching Users
  const [fetchError, setFetchError] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("USERS") // Name of table
        .select();

      if (error) {
        setFetchError("Could not fetch users");
        setUsers(null); // Set users to null if error occurred in case it had data from before
        console.log(error);
      }
      if (data) {
        setUsers(data);
        setFetchError(null);
      }
    };

    fetchUsers();
  }, []);
  // Fetching Users End

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      console.log("Attempting login with:");
      console.log("Username:", username.trim());
      console.log("Password:", password.trim());

      const { data, error } = await supabase
        .from("USERS")
        .select("id, EMAIL, USER_NAME, FIRST_NAME, LAST_NAME, PASSWORD")
        .eq("USER_NAME", username.trim())
        .eq("PASSWORD", password.trim())
        .single();

      if (error) {
        console.error("Supabase error:", error);
        setError("Invalid username or password. Please try again.");
      } else if (!data) {
        console.log("No user found with the given credentials.");
        setError("Invalid username or password. Please try again.");
      } else {
        console.log("Login successful:", data);
        setError("");
        const fullName = `${data.FIRST_NAME} ${data.LAST_NAME}`;

        // Store the logged-in user's email in localStorage
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ id: data.id, fullName, email: data.EMAIL })
        );

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
    setMessage("");
    setError("");
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // Query Supabase to check if the email exists
      const { data, error } = await supabase
        .from("USERS")
        .select("id") // Fetch only the ID field to verify existence
        .eq("EMAIL", email.trim())
        .single();

      if (error || !data) {
        setError("Email does not exist.");
      } else {
        setMessage("Email is valid. Request sent to admin!");
        setShowEmailInput(false);
      }
    } catch (err) {
      console.error("Error verifying email:", err);
      setError("An error occurred while checking the email. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <b>Account Examples:</b>
        {users && (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Account Type</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.USER_NAME}</td>
                  <td>{user.PASSWORD}</td>
                  <td>{user.ACCOUNT_TYPE}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
        {!showEmailInput && (
          <button onClick={handleForgotPasswordClick}>Forgot Password</button>
        )}
        {showEmailInput && (
          <form onSubmit={handleSendRequest}>
            <label>
              Enter your email:
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit">Send Request</button>
          </form>
        )}
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
