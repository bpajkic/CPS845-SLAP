import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";
import TemplatePage from "./TemplatePage";
import "./main.css";

function CourseEvaluationsPage() {
  const { id: courseId } = useParams(); // `id` refers to the course ID
  const [evaluations, setEvaluations] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(user);
  }, []);

  // Fetch evaluations
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        let query = supabase
          .from("EVALUATIONS")
          .select(
            "id, created_at, grade, feedback, submission_id, SUBMISSIONS!inner(project_id, user_id)"
          )
          .eq("SUBMISSIONS.project_id", courseId);

        if (loggedInUser?.ACCOUNT_TYPE === "student") {
          query = query.eq("SUBMISSIONS.user_id", loggedInUser.id); // Students only see their evaluations
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setEvaluations(data || []);
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
        setFetchError("Could not fetch evaluations. Please try again later.");
      }
    };

    if (loggedInUser) {
      fetchEvaluations();
    }
  }, [courseId, loggedInUser]);

  return (
    <TemplatePage>
      <div className="evaluations-page">
        <h1>Evaluations for Course ID: {courseId}</h1>

        {fetchError && <p className="error">{fetchError}</p>}

        {evaluations.length > 0 ? (
          <ul>
            {evaluations.map((evaluation) => (
              <li key={evaluation.id}>
                <h3>Evaluation ID: {evaluation.id}</h3>
                <p>Submission ID: {evaluation.submission_id}</p>
                <p>Grade: {evaluation.grade}</p>
                <p>Feedback: {evaluation.feedback}</p>
                <p>Evaluated on: {new Date(evaluation.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No evaluations found for this course.</p>
        )}
      </div>
    </TemplatePage>
  );
}

export default CourseEvaluationsPage;
