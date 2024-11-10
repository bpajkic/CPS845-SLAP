import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import './CourseProjectsPage.css';

function CourseProjectsPage() {
  const { id: courseId } = useParams(); // Get the course ID from URL parameters
  const [projects, setProjects] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select()
        .eq('course_id', courseId); // Fetch projects related to the current course

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

  if (fetchError) return <p className="error">{fetchError}</p>;
  if (!projects.length) return <p>No projects available for this course.</p>;

  return (
    <div className="course-projects-page">
      <h1>Projects for Course {courseId}</h1>

      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.project_id} className="project-item">
            <h2>{project.name}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseProjectsPage;
