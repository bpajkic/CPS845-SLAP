import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";
import TemplatePage from "./TemplatePage";
import "./main.css";

function CourseSubmissionsPage() {
  const { id } = useParams(); // `id` refers to the project/course ID.
  const [submissions, setSubmissions] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user details from localStorage or Supabase session
    const fetchUser = async () => {
      const userData = JSON.parse(localStorage.getItem("loggedInUser"));

      if (!userData) {
        setFetchError("User not logged in.");
        return;
      }

      setUser(userData);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchSubmissions = async () => {
      try {
        let query = supabase
          .from("SUBMISSIONS")
          .select("id, created_at, FileName, user_id, project_id");

        // If the user is a student, fetch only their submissions
        if (user.accountType === "student") {
          query = query.eq("user_id", user.id);
        } else {
          // Admin, professor, or teaching assistant can view all submissions for the project
          query = query.eq("project_id", id);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          setSubmissions(data);
          setFetchError(null);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setFetchError("Could not fetch submissions. Please try again later.");
      }
    };

    fetchSubmissions();
  }, [id, user]);

  return (
    <TemplatePage>
      <div className="submissions-page">
        <h1>Submissions for Project ID: {id}</h1>

        {fetchError && <p className="error">{fetchError}</p>}

        {submissions.length > 0 ? (
          <ul>
            {submissions.map((submission) => (
              <li key={submission.id}>
                <h3>Submission ID: {submission.id}</h3>
                <p>File Name: {submission.FileName}</p>
                <p>User ID: {submission.user_id}</p>
                <p>Project ID: {submission.project_id}</p>
                <p>Submitted on: {new Date(submission.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No submissions found for this project.</p>
        )}
      </div>
    </TemplatePage>
  );
}

export default CourseSubmissionsPage;
