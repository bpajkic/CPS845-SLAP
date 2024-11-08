import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import './CoursePage.css';

function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from('COURSES')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        setFetchError('Could not fetch course details');
        console.error(error);
      } else {
        setCourse(data);
        setFetchError(null);
      }
    };

    fetchCourse();
  }, [id]);

  return (
    <div className="course-page">
      {fetchError && <p className="error">{fetchError}</p>}
      {course && (
        <>
          <h1>{course.COURSE_NAME}</h1>
          <h2>Instructor: {course.INSTRUCTOR_NAME}</h2>
          <div className="course-section">
            <h3>Projects/Assignments</h3>
            <p>View project/assignment details here.</p>
          </div>
          
          <div className="course-section">
            <h3>Instruction Documents</h3>
            <p>View instruction documents here.</p>
          </div>
          
          <div className="course-section">
            <h3>Submissions</h3>
            <p>View submissions here.</p>
          </div>
          <
            div className="course-section">
            <h3>Evaluations</h3>
            <p>View evaluations here.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default CoursePage;
