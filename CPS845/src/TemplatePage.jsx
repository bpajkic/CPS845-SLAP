import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import supabase from '../supabaseClient';
import "./main.css";

function TemplatePage({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/"); // Redirect to the login page
  };

  //Fetching Courses
  const [courses, setCourses] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('COURSES') 
        .select();

      if (error) {
        setFetchError('Could not fetch courses');
        setCourses([]);
        console.error(error);
      } else {
        setCourses(data);
        setFetchError(null);
      }
    };

    fetchCourses();
  }, []);


  return (
    <div className="container">
      {/* sidebar */}
      <aside className="sidebar">
        <h2>Menu</h2>
        <nav className="menu">
          <ul className="submenu"></ul>
          <ul>
            <li className="submenu-item">
              <Link to="/home">Home</Link>
            </li>
            <li className="submenu-item">
              <Link to="/home/ViewCourses">View Courses</Link>
            </li>

            {/* List of Courses for the Side Menu */}
            {fetchError && <p className="error">{fetchError}</p>}
            {courses.map(course => (
                <li key={course.id} className="submenu-item">
                <Link to={`/courses/${course.id}`}>{course.COURSE_CODE}</Link>
              </li>
            ))}

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
        <main className="content">
          <header className="header">
            <h1>SLAP Interface</h1>
            <button className="logout" onClick={handleLogout}>
              LOGOUT
            </button>
          </header>
          <h4>Gould Street University</h4>

          {/* MAIN CONTENT GOES HERE */}
          {children}
        </main>
      </div>
    </div>
  );
}

export default TemplatePage;
