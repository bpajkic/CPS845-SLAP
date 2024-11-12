import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from '../supabaseClient';
import CreateSLAP from "./CreateSLAP";
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
  const SidebarAndTemplate = ({ children }) => (
    <div>
      <header className="header">
        <div className="title">
          <h1>SLAP Interface</h1>
          <h3>Gould Street University</h3>
        </div>
        <div className="account-details">
          <button className="logout" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      </header>
      <div className="container">
        {/* sidebar */}
        <aside className="sidebar">
          <h2>Menu</h2>
          <nav className="menu">
            <ul className="submenu"></ul>
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
        </aside>
        {/* main */}
        <main className="content">
            {/* MAIN CONTENT GOES HERE */}
            {children}
          </main>
      </div>
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

    const [resetPasswordUsername, setResetPasswordUsername] = useState("");

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

    const generateRandomPassword = (length = 8) => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      return password;
    };

    const handlePasswordReset = () => {
      const newPassword = generateRandomPassword();
      if (resetPasswordUsername) {
        console.log(`Resetting password for: ${resetPasswordUsername}`);
        alert(`Password Reset To: ${newPassword}`);
        setResetPasswordUsername("");
      } else {
        alert("Please all required information");
      }
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
                <option value="admin">Student</option>
                <option value="user">Instructor</option>
                <option value="guest">Admin</option>
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
            value={resetPasswordUsername}
            onChange={(e) => setResetPasswordUsername(e.target.value)}
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
    const [courseDescription, setCourseDescription] = useState("");
    const [enrollmentDeadline, setEnrollmentDeadline] = useState("");
    const [courseStartDate, setCourseStartDate] = useState("");
    const [courseEndDate, setCourseEndDate] = useState("");

    const handleCreateCourse = () => {
      if (courseName && courseCode && courseDescription && enrollmentDeadline && courseStartDate && courseEndDate) {
        console.log(`Creating course: ${courseName} ${courseCode}`);
        alert(`Created course: ${courseName} ${courseCode}`);
        setCourseName("");
        setCourseCode("");
        setCourseDescription("");
        setEnrollmentDeadline("");
        setCourseStartDate("");
        setCourseEndDate("");
      } else {
        alert("Please all required information");
      }
      
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
          <input
            type="text"
            placeholder="Course Description"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
          />
          <p>Enrollment Deadline</p>
          <input
            type="date"
            placeholder="Enrollment Deadline"
            value={enrollmentDeadline}
            onChange={(e) => setEnrollmentDeadline(e.target.value)}
          />
          <p>Course Start Date</p>
          <input
            type="date"
            placeholder="Course Start Date"
            value={courseStartDate}
            onChange={(e) => setCourseStartDate(e.target.value)}
          />
          <p>Course End Date</p>
          <input
            type="date"
            placeholder="Course End Date"
            value={courseEndDate}
            onChange={(e) => setCourseEndDate(e.target.value)}
          />
          <button onClick={handleCreateCourse}>Create Course</button>
        </div>
      </div>
    );
  };

  // SLAPs Management Component
  const SlapsManagement = () => (
    <div>
      <CreateSLAP admin={true}/>
    </div>
  );

  // Contacts Component
  const Contacts = () => {
    const [sortedUsers, setSortedUsers] = useState(users);
    const [isSortedAsc, setIsSortedAsc] = useState(true);
    const [sortingColumn, setSortingColumn] = useState("firstName");
  
    const handleSortByFirstName = () => {
      const sortedArray = [...sortedUsers].sort((a, b) => {
        if (a.FIRST_NAME < b.FIRST_NAME) return isSortedAsc ? -1 : 1;
        if (a.FIRST_NAME > b.FIRST_NAME) return isSortedAsc ? 1 : -1;
        return 0;
      });
  
      setSortedUsers(sortedArray);
      setIsSortedAsc(!isSortedAsc); // Toggle sorting direction
      setSortingColumn("firstName");
    };


    const handleSortByLastName = () => {
      const sortedArray = [...sortedUsers].sort((a, b) => {
        if (a.LAST_NAME < b.LAST_NAME) return isSortedAsc ? -1 : 1;
        if (a.LAST_NAME > b.LAST_NAME) return isSortedAsc ? 1 : -1;
        return 0;
      });
  
      setSortedUsers(sortedArray);
      setIsSortedAsc(!isSortedAsc); // Toggle sorting direction
      setSortingColumn("lastName");
    };

    const handleSortByAccountType = () => {
      const sortedArray = [...sortedUsers].sort((a, b) => {
        if (a.ACCOUNT_TYPE < b.ACCOUNT_TYPE) return isSortedAsc ? -1 : 1;
        if (a.ACCOUNT_TYPE > b.ACCOUNT_TYPE) return isSortedAsc ? 1 : -1;
        return 0;
      });
  
      setSortedUsers(sortedArray);
      setIsSortedAsc(!isSortedAsc); // Toggle sorting direction
      setSortingColumn("accountType");
    };

    
    return (
      <table>
        <thead>
          <tr>
            <th onClick={handleSortByFirstName} style={{ cursor: "pointer" }}>
              First Name {sortingColumn === "firstName" ? (isSortedAsc ? "↑" : "↓") : "-" }
            </th>
            <th onClick={handleSortByLastName} style={{ cursor: "pointer" }}>
              Last Name {sortingColumn === "lastName" ? (isSortedAsc ? "↑" : "↓") : "-" }
            </th>
            <th onClick={handleSortByAccountType} style={{ cursor: "pointer" }}>
              Account Type {sortingColumn === "accountType" ? (isSortedAsc ? "↑" : "↓") : "-" }
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.FIRST_NAME}</td>
              <td>{user.LAST_NAME}</td>
              <td>{user.ACCOUNT_TYPE}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
      <SidebarAndTemplate>{renderContent()}</SidebarAndTemplate>
  );
};

export default Admin;
