import React from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import './main.css';

function TemplatePage( children ) {

  const navigate = useNavigate();
  const handleLogout = () => {
      navigate("/"); // Redirect to the login page
  };

  
  return (
    <div className="container">
      {/* sidebar */}
      <aside className="sidebar">
        <nav className="menu">
          <div className="menu-item">home</div>
          <div className="menu-item">classes</div>
          <ul className="submenu">
            <li className="submenu-item">class 1</li>
            <li className="submenu-item">class 2</li>
            <li className="submenu-item">class 3</li>
          </ul>
          <ul>
          <li>
            <Link to="/home/ViewCourses">View Courses</Link> {/* Using Link for navigation */}
          </li>
        </ul>
        </nav>
        <h2 id="chat">Chat</h2>
        <nav className="chat-menu">
          <ul className="chat-submenu">
            <li className="submenu-item">class 1 (1)</li>
            <ul className="chat-options">
              <li>project 1 (1)</li>
              <li>John Doe (1)</li>
              <li>all</li>
              <li>TA</li>
              <li>Instructor</li>
            </ul>
            <li className="submenu-item">class 2</li>
            <li className="submenu-item">class 3</li>
          </ul>
        </nav>
      </aside>
      {/* main */}
      <div>
        {children}
      </div>
    </div>
  );
}

export default TemplatePage;
