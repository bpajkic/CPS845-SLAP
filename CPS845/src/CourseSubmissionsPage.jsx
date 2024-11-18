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
    // Fetch the logged-in user details from localStorage
    const fetchUser = async () => {
      const userData = JSON.parse(localStorage.getItem("loggedInUser"));

      if (!userData) {
        setFetchError("User not logged in.");
        return;
      }

      setUser(userData);
      console.log("User data loaded:", userData);
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

        // Fetch based on user account type
        if (user.ACCOUNT_TYPE === "student") {
          console.log("Fetching submissions for student:", user.id);
          query = query.eq("user_id", user.id); // Students can only see their submissions
        } else {
          console.log("Fetching all submissions for project:", id);
          query = query.eq("project_id", id); // Others can see all project submissions
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          console.log("Submissions fetched:", data);

          // Additional filtering in case Supabase RLS is unavailable
          const filteredSubmissions =
            user.ACCOUNT_TYPE === "student"
              ? data.filter((submission) => submission.user_id === user.id)
              : data;

          setSubmissions(filteredSubmissions);
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
