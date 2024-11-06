import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import './ViewCoursesPage.css';

function ViewCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('COURSES') // Name of your table in Supabase
        .select();

      if (error) {
        setFetchError('Could not fetch courses');
        setCourses([]);
        console.error(error);
      } else {
        setCourses(data);
        setFetchError(null);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="view-courses-container">
      <h1>Available Courses</h1>
      {fetchError && <p className="error">{fetchError}</p>}
      <ul className="courses-list">
        {courses.map(course => (
          <li key={course.id} className="course-item">
            <h2>{course.COURSE_CODE}</h2>
            <p>{course.COURSE_NAME}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewCoursesPage;
