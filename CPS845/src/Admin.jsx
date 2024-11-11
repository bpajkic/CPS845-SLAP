import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from '../supabaseClient';
import "./main.css";

const Admin = () => {
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


  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/"); // Redirect to the login page
  };

  const [submenuVisibility, setSubmenuVisibility] = useState(1);

  // Sidebar Component
  const SidebarAndTemplate = () => (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <nav className="menu">
        <ul>
          <li className="submenu-item">
            <Link onClick={() => setSubmenuVisibility(1)}>Dashboard</Link>
          </li>
          <li className="submenu-item">
            <Link onClick={() => setSubmenuVisibility(2)}>User Management</Link>
          </li>
          <li className="submenu-item">
            <Link onClick={() => setSubmenuVisibility(3)}>Course Management</Link>
          </li>
          <li className="submenu-item">
            <Link onClick={() => setSubmenuVisibility(4)}>SLAPs Management</Link>
          </li>
          <li className="submenu-item">
            <Link onClick={() => setSubmenuVisibility(5)}>Contacts</Link>
          </li>
        </ul>
      </nav>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => (
    <div>
      <h1>Dashboard</h1>
      <p className="main-content">
        Welcome to the Admin Dashboard. Use the sidebar to navigate between
        sections.
      </p>
      {/* Add any additional dashboard content here */}
    </div>
  );

  
  // User Management Component
  const UserManagement = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [accountType, setAccountType] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleUserRegistration = () => {
      
      if (firstName && lastName && accountType && username && password) {
        console.log(`Registering user: ${username}`);
        alert("User Created");
        setFirstName("");
        setLastName("");
        setAccountType("");
        setUsername("");
        setPassword("");
      } else {
        alert("Please all required information");
      }
    };

    const handlePasswordReset = () => {
      console.log(`Resetting password for: ${username}`);
      setUsername("");
    };

    return (
      <div>
        <h1>User Management</h1>
        <div className="main-content">

          
          <h2>Register New User</h2>
          <div>
              <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              />
          </div>
          <div>
              <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              />
          </div>
          <div>
              <select
                type="text"
                placeholder="Account Type"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="">Select Account Type</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="guest">Guest</option>
              </select>
          </div>
          <div>
              <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleUserRegistration}>Register</button>
        </div>



        <div className="main-content">
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
    const [courseName, setCourseName] = useState("");
    const [courseCode, setCourseCode] = useState("");

    const handleCreateCourse = () => {
      console.log(`Creating course: ${courseName} (${courseCode})`);
      setCourseName("");
      setCourseCode("");
    };

    return (
      <div>
        <h1>Course Management</h1>
        <div className="main-content">
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
      <p className="main-content">Manage SLAPs here. Add specific SLAPs functionalities as needed.</p>
      {/* Add SLAPs management functionality here */}
    </div>
  );

  // Contacts Component
  const Contacts = () => (
    <div>
      <h1>Contacts</h1>
      <div className="main-content">
        <h2>Manage contact requests and communication with users here.</h2>
        {users.map((user) => (
          <p key={user.id}>
            Username: {user.USER_NAME} Password: {user.PASSWORD}
          </p>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (submenuVisibility) {
      case 1:
        return <Dashboard />;
      case 2:
        return <UserManagement />;
      case 3:
        return <CourseManagement />;
      case 4:
        return <SlapsManagement />;
      case 5:
        return <Contacts />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-container">
      <SidebarAndTemplate />
      <div className="content">
      <header className="header">
        <h1>SLAP Interface</h1>
        <button className="logout" onClick={handleLogout}>
          LOGOUT
        </button>
      </header>
      <h4>Gould Street University</h4>

      {renderContent()}

      </div>
    </div>
  );
};

export default Admin;
