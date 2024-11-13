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

  const [courses, setCourses] = useState([]);
  const [messages, setMessages] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [accountType, setAccountType] = useState(null);

  // Get logged-in user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  // Fetch account type
  useEffect(() => {
    const fetchAccountType = async () => {
      if (!loggedInUser) return;

      const { data, error } = await supabase
        .from("USERS")
        .select("ACCOUNT_TYPE")
        .eq("id", loggedInUser.id);

      if (error) {
        console.error("Could not fetch account type", error);
        setAccountType(null);
      } else {
        setAccountType(data?.[0]?.ACCOUNT_TYPE);
      }
    };
    fetchAccountType();
  }, [loggedInUser]);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!loggedInUser) return;

      const { data, error } = await supabase
        .from("ENROLLMENT")
        .select("courseId")
        .eq("userId", loggedInUser.id);

      if (error) {
        setFetchError("Could not fetch enrolled courses");
        console.error(error);
        setCourses([]);
      } else {
        const enrolledCourseIds = data.map((enrollment) => enrollment.courseId);
        fetchCourses(enrolledCourseIds);
      }
    };

    const fetchCourses = async (courseIds) => {
      const { data, error } = await supabase
        .from("COURSES")
        .select("id, COURSE_CODE")
        .in("id", courseIds);

      if (error) {
        setFetchError("Could not fetch courses");
        setCourses([]);
        console.error(error);
      } else {
        setCourses(data);
        setFetchError(null);
      }
    };

    fetchEnrolledCourses();
  }, [loggedInUser]);

  // Fetch messages for the logged-in user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!loggedInUser) return;

      const { data, error } = await supabase
        .from("CHAT")
        .select("courseId, userId, sentBy, subject, seen")
        .eq("userId", loggedInUser.id);

      if (error) {
        console.error("Could not fetch messages:", error);
        setMessages([]);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [loggedInUser]);

  // Group messages by course and sender
  const getMessagesByCourse = () => {
    const groupedMessages = {};

    // Initialize groupedMessages with enrolled courses
    courses.forEach((course) => {
      groupedMessages[course.id] = {
        courseCode: course.COURSE_CODE,
        messages: {},
      };
    });

    // Group messages by course and sender, count unseen messages
    messages.forEach((message) => {
      const { courseId, sentBy, seen } = message;

      if (!groupedMessages[courseId]) return;

      if (!groupedMessages[courseId].messages[sentBy]) {
        groupedMessages[courseId].messages[sentBy] = {
          count: 0,
          seenMessages: [],
        };
      }

      if (!seen) {
        groupedMessages[courseId].messages[sentBy].count += 1;
      }
      groupedMessages[courseId].messages[sentBy].seenMessages.push(message);
    });

    return groupedMessages;
  };

  const groupedMessages = getMessagesByCourse();

  // Redirect to Admin Page if User is Admin
  if (accountType === "admin") {
    navigate("/admin");
    return false;
  }

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
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Menu</h2>
          <nav className="menu">
            <ul>
              <li className="submenu-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="submenu-item">
                <Link to="/home/ViewCourses">View Courses</Link>
              </li>
            </ul>
          </nav>

          <h2>Enrolled Courses</h2>
          <nav className="menu">
            {fetchError && <p className="error">{fetchError}</p>}
            {courses.map((course) => (
              <li key={course.id} className="course-options">
                <Link to={`/courses/${course.id}`}>{course.COURSE_CODE}</Link>
              </li>
            ))}
          </nav>

          <h2>Messages</h2>
          <nav className="chat-menu">
            <ul className="chat-submenu">
              {Object.keys(groupedMessages).map((courseId) => (
                <li key={courseId} className="submenu-item">
                  <h5>{groupedMessages[courseId].courseCode}</h5>
                  <ul className="chat-options">
                    {Object.entries(groupedMessages[courseId].messages).map(([sender, details], index) => (
                      <li key={index}>
                        <Link to={`/viewMessages/${courseId}/${sender}`}>
                          {sender}{" "}
                          {details.count > 0 && <span className="message-count">({details.count})</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>


          <button className="send-message" onClick={handleSendMessage}>
            Send Message
          </button>
          {accountType === "professor" && (
            <div>
              <h2>Options</h2>
              <nav className="option-menu">
                <ul>
                  <li>
                    <Link to="/home/CreateSLAP">Create New SLAPs</Link>
                  </li>
                  <li>
                    <Link to="/home/CreateProject">New Project</Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </aside>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}

export default TemplatePage;
