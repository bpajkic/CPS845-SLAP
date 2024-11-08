import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import './CourseSubmissionsPage.css';

function CourseSubmissionsPage() {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from('SUBMISSIONS') // Replace with your Supabase submissions table name
        .select()
        .eq('course_id', id);

      if (error) {
        setFetchError('Could not fetch submissions');
        console.error(error);
      } else {
        setSubmissions(data);
        setFetchError(null);
      }
    };

    fetchSubmissions();
  }, [id]);

  return (
    <div className="submissions-page">
      <h1>Submissions for Course {id}</h1>
      {fetchError && <p className="error">{fetchError}</p>}
      <ul>
        {submissions.map(submission => (
          <li key={submission.id}>
            <h3>Student: {submission.student_name}</h3>
            <p>Submitted on: {submission.submission_date}</p>
            <p>Status: {submission.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseSubmissionsPage;
