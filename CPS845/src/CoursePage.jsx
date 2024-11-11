import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import './main.css';

function CoursePage() {
  const { id: courseId } = useParams(); // Get the course ID from URL parameters
  const [course, setCourse] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from('COURSES')
        .select()
        .eq('id', courseId)
        .single();

      if (error) {
        setFetchError('Could not fetch course');
        console.error(error);
      } else {
        setCourse(data);
        setFetchError(null);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (fetchError) return <p className="error">{fetchError}</p>;
  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-page">
      <h1>{course.COURSE_NAME}</h1>
      <p>Course Code: {course.COURSE_CODE}</p>

      <div className="course-section">
        <h2>Projects/Assignments</h2>
        <p>
          <Link to={`/courses/${courseId}/projects`}>View project/assignment details here.</Link>
        </p>
      </div>

      <div className="course-section">
        <h2>Submissions</h2>
        <p>
          <Link to={`/courses/${courseId}/submissions`}>View submissions here.</Link>
        </p>
      </div>

      <div className="course-section">
        <h2>Evaluations</h2>
        <p>
          <Link to={`/courses/${courseId}/evaluations`}>View evaluations here.</Link>
        </p>
      </div>
    </div>
  );
}

export default CoursePage;
