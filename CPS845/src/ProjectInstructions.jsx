import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import TemplatePage from "./TemplatePage";
import './main.css';

function ProjectInstructions() {
  const { id: courseId, project_id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // Added loggedInUser state

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchAccountType = async () => {
      if (!loggedInUser) return;

      const { data, error } = await supabase
        .from("USERS")
        .select("ACCOUNT_TYPE")
        .eq("id", loggedInUser.id);

      if (error) {
        console.error("Could not fetch account type", error);
        setAccountType(null);
      } else {
        setAccountType(data?.[0]?.ACCOUNT_TYPE); 
      }
    };
    fetchAccountType();
  }, [loggedInUser]);

  if (fetchError) return <p className="error">{fetchError}</p>;
  if (!project) return <p>Loading project details...</p>;

  return (
    <TemplatePage>
      <div className="project-instructions">
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        {accountType === "professor" && (
          <button>
            <Link className="edit" to={`/courses/${courseId}/projects/${project.project_id}/EditProject`}>Edit</Link>
          </button>
        )}
      </div>
    </TemplatePage>
  );
}

export default ProjectInstructions;