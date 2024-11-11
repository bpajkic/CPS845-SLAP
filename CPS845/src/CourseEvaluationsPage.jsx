import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import TemplatePage from "./TemplatePage";
import './main.css';

function CourseEvaluationsPage() {
  const { id } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      const { data, error } = await supabase
        .from('EVALUATIONS') // Replace with your Supabase evaluations table name
        .select()
        .eq('course_id', id);

      if (error) {
        setFetchError('Could not fetch evaluations');
        console.error(error);
      } else {
        setEvaluations(data);
        setFetchError(null);
      }
    };

    fetchEvaluations();
  }, [id]);

  return (
    <TemplatePage>
    <div className="evaluations-page">
      <h1>Evaluations for Course {id}</h1>
      {fetchError && <p className="error">{fetchError}</p>}
      <ul>
        {evaluations.map(evaluation => (
          <li key={evaluation.id}>
            <h3>{evaluation.title}</h3>
            <p>Score: {evaluation.score}</p>
            <p>Comments: {evaluation.comments}</p>
          </li>
        ))}
      </ul>
    </div>
    </TemplatePage>
  );
}

export default CourseEvaluationsPage;
