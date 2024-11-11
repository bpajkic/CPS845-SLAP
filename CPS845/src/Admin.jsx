import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './main.css'; // Optional: Add CSS for styling

const Admin = () => {

// Sidebar Component
const Sidebar = () => (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/users">User Management</Link></li>
        <li><Link to="/courses">Course Management</Link></li>
        <li><Link to="/slaps">SLAPs Management</Link></li>
        <li><Link to="/contacts">Contacts</Link></li>
      </ul>
    </div>
  );
  
  // Dashboard Component
  const Dashboard = () => (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Admin Dashboard. Use the sidebar to navigate between sections.</p>
      {/* Add any additional dashboard content here */}
    </div>
  );
  
  // User Management Component
  const UserManagement = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleUserRegistration = () => {
      console.log(`Registering user: ${username}`);
      setUsername('');
      setPassword('');
    };
  
    const handlePasswordReset = () => {
      console.log(`Resetting password for: ${username}`);
      setUsername('');
    };
  
    return (
      <div>
        <h1>User Management</h1>
        <div>
          <h2>Register New User</h2>
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
          <button onClick={handleUserRegistration}>Register</button>
        </div>
        <div>
          <h2>Reset Password</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handlePasswordReset}>Reset Password</button>
        </div>
      </div>
    );
  };
  
  // Course Management Component
  const CourseManagement = () => {
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
  
    const handleCreateCourse = () => {
      console.log(`Creating course: ${courseName} (${courseCode})`);
      setCourseName('');
      setCourseCode('');
    };
  
    return (
      <div>
        <h1>Course Management</h1>
        <div>
          <h2>Create New Course</h2>
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course Code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />
          <button onClick={handleCreateCourse}>Create Course</button>
        </div>
      </div>
    );
  };
  
  // SLAPs Management Component
  const SlapsManagement = () => (
    <div>
      <h1>SLAPs Management</h1>
      <p>Manage SLAPs here. Add specific SLAPs functionalities as needed.</p>
      {/* Add SLAPs management functionality here */}
    </div>
  );
  
  // Contacts Component
  const Contacts = () => (
    <div>
      <h1>Contacts</h1>
      <p>Manage contact requests and communication with users here.</p>
      {/* Add contact management functionality here */}
    </div>
  );
  
  return (
      <div className="admin-container">
        <Sidebar/>
        <div className="content">
          <Dashboard/>
          <UserManagement/>
          <CourseManagement/>
          <SlapsManagement/>
          <Contacts/>
        </div>
      </div>
  );
};

export default Admin;
