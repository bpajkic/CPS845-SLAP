import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import './main.css';

function ProjectInstructions() {
  const { id: courseId, project_id: projectId } = useParams(); // Get course ID and project ID from URL parameters
  const [project, setProject] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select()
        .eq('project_id', projectId)
        .single();

      if (error) {
        setFetchError('Could not fetch project details');
        console.error(error);
      } else {
        setProject(data);
        setFetchError(null);
      }
    };

    fetchProject();
  }, [projectId]);

  if (fetchError) return <p className="error">{fetchError}</p>;
  if (!project) return <p>Loading project details...</p>;

  return (
    <div className="project-instructions">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
    </div>
  );
}

export default ProjectInstructions;
