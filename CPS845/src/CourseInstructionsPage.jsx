import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import './CourseInstructionsPage.css';

function CourseInstructionsPage() {
  const { id } = useParams();
  const [instructions, setInstructions] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchInstructions = async () => {
      const { data, error } = await supabase
        .from('INSTRUCTIONS') // Replace with your Supabase instructions table name
        .select()
        .eq('course_id', id);

      if (error) {
        setFetchError('Could not fetch instruction documents');
        console.error(error);
      } else {
        setInstructions(data);
        setFetchError(null);
      }
    };

    fetchInstructions();
  }, [id]);

  return (
    <div className="instructions-page">
      <h1>Instruction Documents for Course {id}</h1>
      {fetchError && <p className="error">{fetchError}</p>}
      <ul>
        {instructions.map(instruction => (
          <li key={instruction.id}>
            <h3>{instruction.title}</h3>
            <p>{instruction.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseInstructionsPage;
