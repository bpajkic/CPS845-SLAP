import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import supabase from "../supabaseClient";
import TemplatePage from "./TemplatePage";
import "./main.css";

function CourseSubmissionsPage() {
  const { id } = useParams(); // `id` refers to the project/course ID.
  const [submissions, setSubmissions] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

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

  useEffect(() => {
    if (!loggedInUser || !accountType) return;

    const fetchSubmissions = async () => {
      try {
        let query = supabase
          .from("SUBMISSIONS")
          .select("submission_id, created_at, FileName, user_id, project_id");

        // Fetch based on user account type
        if (accountType === "student") {
          console.log("Fetching submissions for student:", loggedInUser.id);
          query = query.eq("user_id", loggedInUser.id); // Students can only see their submissions
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
            accountType=== "student"
              ? data.filter((submission) => submission.user_id === loggedInUser.id)
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
  }, [id, loggedInUser, accountType]);

  return (
    <TemplatePage>
      <div className="submissions-page">
        <h1>Submissions for Project ID: {id}</h1>

        {fetchError && <p className="error">{fetchError}</p>}

        {submissions.length > 0 ? (
          <ul>
            {submissions.map((submission) => (
              <li key={submission.submission_id}>
                <h3>Submission ID: {submission.submission_id}</h3>
                <p>File Name: {submission.FileName}</p>
                <p>User ID: {submission.user_id}</p>
                <p>Project ID: {submission.project_id}</p>
                <p>Submitted on: {new Date(submission.created_at).toLocaleString()}</p>
                {(accountType === "professor" || accountType === "teaching-assistant") && (
                  <button className="submit">
                    <Link className="evaluate" to={`/courses/${id}/submissions/${submission.submission_id}/SubmitEvaluation`}>Submit Evaluation</Link>
                  </button>
                )}
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
