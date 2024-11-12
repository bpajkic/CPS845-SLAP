import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import "./main.css";

function TemplatePage({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/"); // Redirect to the login page
  };

  const handleSendMessage = () => {
    navigate("/sendMessage"); // Navigate to the SendMessage form page
  };

  // Fetching Courses
  const [courses, setCourses] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Get logged-in user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("COURSES").select();

      if (error) {
        setFetchError("Could not fetch courses");
        setCourses([]);
        console.error(error);
      } else {
        setCourses(data);
        setFetchError(null);
      }
    };

    fetchCourses();
  }, []);

  // Fetch messages for the logged-in user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!loggedInUser) return;

      const { data, error } = await supabase
        .from("CHAT")
        .select("courseid, subject, sentby, seen")
        .eq("userid", loggedInUser.id);

      if (error) {
        console.error("Could not fetch messages:", error);
        setMessages([]);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [loggedInUser]);

  // Group messages by course and count unseen messages
  const getMessagesByCourse = () => {
    const groupedMessages = {};

    // Initialize the groupedMessages with all courses
    courses.forEach((course) => {
      groupedMessages[course.id] = {
        courseCode: course.COURSE_CODE,
        messages: [],
      };
    });

    // Group messages by course and count unseen messages
    messages.forEach((message) => {
      const courseId = message.courseid;
      if (!groupedMessages[courseId]) return;

      const existingSubject = groupedMessages[courseId].messages.find(
        (msg) => msg.subject === message.subject
      );

      if (existingSubject) {
        existingSubject.count += message.seen ? 0 : 1;
      } else {
        groupedMessages[courseId].messages.push({
          subject: message.subject,
          count: message.seen ? 0 : 1,
          sentBy: message.sentby,
        });
      }
    });

    return groupedMessages;
  };

  const groupedMessages = getMessagesByCourse();

  return (
    <div>
      <header className="header">
        <div className="title">
          <h1>SLAP Interface</h1>
          <h3>Gould Street University</h3>
        </div>
        <div className="account-details">
          <h4>{loggedInUser?.fullName}'s SLAP Profile</h4>
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
                <Link to="/home">Home</Link>
              </li>
              <li className="submenu-item">
                <Link to="/home/ViewCourses">View Courses</Link>
              </li>
              {/* List of Courses for the Side Menu */}
              {fetchError && <p className="error">{fetchError}</p>}
              {courses.map((course) => (
                <li key={course.id} className="course-options">
                  <Link to={`/courses/${course.id}`}>{course.COURSE_CODE}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <h2>Messages</h2>
          <nav className="chat-menu">
            <ul className="chat-submenu">
              {Object.keys(groupedMessages).map((courseId) => (
                <li key={courseId} className="submenu-item">
                  <h5>{groupedMessages[courseId].courseCode}</h5>
                  <ul className="chat-options">
                    {groupedMessages[courseId].messages.length > 0 ? (
                      groupedMessages[courseId].messages.map((message, index) => (
                        <li key={index}>
                          {message.subject}{" "}
                          {message.count > 0 && (
                            <span className="message-count">({message.count})</span>
                          )}
                        </li>
                      ))
                    ) : (
                      <li>No new messages</li>
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
          <button className="send-message" onClick={handleSendMessage}>
            Send Message
          </button>
        </aside>
        {/* main */}
        <main className="content">
          {/* MAIN CONTENT GOES HERE */}
          {children}
        </main>
      </div>
    </div>
    
  );
}

export default TemplatePage;
