import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import './CourseProjectsPage.css';

function CourseProjectsPage({ courseId }) {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

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

  // Function to add a new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const { data, error } = await supabase
      .from('PROJECTS')
      .insert([
        { course_id: courseId, name: newProjectName, description: newProjectDescription },
      ]);

    if (error) {
      setSubmitError('Could not add project');
      console.error(error);
    } else {
      setProjects([...projects, ...data]);
      setNewProjectName('');
      setNewProjectDescription('');
    }
  };

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

      <h2>Add New Project</h2>
      <form onSubmit={handleAddProject} className="project-form">
        <input
          type="text"
          placeholder="Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          required
        />
        <textarea
          placeholder="Project Description"
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          required
        />
        <button type="submit">Add Project</button>
      </form>

      {submitError && <p className="error">{submitError}</p>}
    </div>
  );
}

export default CourseProjectsPage;
