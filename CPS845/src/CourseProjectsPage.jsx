import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import './CourseProjectsPage.css';

function CourseProjectsPage({ courseId }) {
  const [projects, setProjects] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Fetch projects when the component loads
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('PROJECTS')
        .select()
        .eq('course_id', courseId);

      if (error) {
        setFetchError('Could not fetch projects');
        console.error(error);
      } else {
        setProjects(data);
        setFetchError(null);
      }
    };

    fetchProjects();
  }, [courseId]);

  return (
    <div className="course-projects-page">
      <h1>Projects for Course {courseId}</h1>
      {fetchError && <p className="error">{fetchError}</p>}
      <ul className="project-list">
        {projects.map(project => (
          <li key={project.project_id} className="project-item">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseProjectsPage;
