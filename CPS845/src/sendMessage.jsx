import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../supabaseClient";
import TemplatePage from "./TemplatePage";
import "./main.css";

function SendMessage() {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(location.state?.courseId || "");
  const [recipientEmail, setRecipientEmail] = useState(location.state?.recipientEmail || "");
  const [recipientId, setRecipientId] = useState(null);
  const [subject, setSubject] = useState(location.state?.subject || "");
  const [message, setMessage] = useState("");
  const [sentBy, setSentBy] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("COURSES").select("id, COURSE_CODE");

      if (error) {
        setFetchError("Could not fetch courses");
        console.error(error);
      } else {
        setCourses(data);
        setFetchError(null);
      }
    };

    fetchCourses();
  }, []);

  // Set the logged-in user's name and email
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setSentBy(loggedInUser.fullName);
      setSenderEmail(loggedInUser.email);
    }
  }, []);

  // Fetch recipientId if recipientEmail is set from location.state
  useEffect(() => {
    if (recipientEmail) {
      fetchUserIdByEmail(recipientEmail);
    }
  }, [recipientEmail]);

  // Fetch userId based on the entered email
  const fetchUserIdByEmail = async (email) => {
    if (!email) return;

    const { data, error } = await supabase
      .from("USERS")
      .select("id")
      .eq("EMAIL", email)
      .single();

    if (error) {
      setFetchError("Could not find a user with that email");
      console.error(error);
      setRecipientId(null);
    } else {
      setFetchError(null);
      setRecipientId(data.id);
    }
  };

  // Handle email input change and fetch userId
  const handleEmailChange = async (e) => {
    const email = e.target.value;
    setRecipientEmail(email);

    // Fetch userId based on the entered email
    await fetchUserIdByEmail(email);
  };

  // Check if the user is enrolled in the selected course
  const checkUserEnrollment = async (userId, courseId) => {
    if (!userId || !courseId) return false;

    const { data, error } = await supabase
      .from("ENROLLMENT")
      .select("userId")
      .eq("userId", userId)
      .eq("courseId", courseId)
      .single();

    if (error || !data) {
      setFetchError("The user is not enrolled in the selected course");
      console.error(error || "User not enrolled");
      return false;
    }

    setFetchError(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch recipientId if it is not set
    if (!recipientId) {
      await fetchUserIdByEmail(recipientEmail);
    }

    // Check user enrollment
    const isEnrolled = await checkUserEnrollment(recipientId, selectedCourseId);
    if (!isEnrolled) return;

    if (!recipientId || !subject || !message || !selectedCourseId || !sentBy) {
      setFetchError("All fields are required, and the email must be valid");
      console.error("Form validation failed:", {
        recipientId,
        selectedCourseId,
        sentBy,
        subject,
        message,
        senderEmail,
      });
      return;
    }

    try {
      // Insert the message into the CHAT table with seen set to false
      const { data, error } = await supabase.from("CHAT").insert([
        {
          courseId: selectedCourseId,
          userId: recipientId,
          sentBy: sentBy,
          subject,
          message,
          seen: false, // Always set seen to false when sending a new message
          senderEmail: senderEmail,
        },
      ]);

      if (error) {
        console.error("Supabase insertion error:", error);
        setFetchError(`Could not send the message: ${error.message}`);
      } else {
        setFetchError(null);
        setSuccessMessage("Message sent successfully!");

        // Reset form fields for regular send mode
        setSelectedCourseId("");
        setRecipientEmail("");
        setRecipientId(null);
        setSubject("");
        setMessage("");
      }
    } catch (err) {
      console.error("Unexpected error during message submission:", err);
      setFetchError("An unexpected error occurred. Please check the console for details.");
    }
  };

  return (
    <TemplatePage>
      <div className="send-message-page">
        <h1>Send Message</h1>
        {successMessage && <p className="success">{successMessage}</p>}
        {fetchError && <p className="error">{fetchError}</p>}
        <form className="send-message-form" onSubmit={handleSubmit}>
          {/* Course Selection */}
          <div className="form-group">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              required
              disabled={Boolean(location.state?.courseId)}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.COURSE_CODE}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Email Input */}
          <div className="form-group">
            <label htmlFor="recipientEmail">Recipient Email:</label>
            <input
              type="email"
              id="recipientEmail"
              value={recipientEmail}
              onChange={handleEmailChange}
              placeholder="Enter the recipient's email"
              required
              disabled={Boolean(location.state?.recipientEmail)}
            />
          </div>

          {/* Subject Input */}
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter the subject"
              required
            />
          </div>

          {/* Message Input */}
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </div>
    </TemplatePage>
  );
}

export default SendMessage;
