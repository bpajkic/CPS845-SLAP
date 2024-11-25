import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import TemplatePage from "./TemplatePage";
import './main.css';

function ProjectInstructions() {
  const { id: courseId, project_id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]); // State to store documents
  const [fetchError, setFetchError] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

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
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from('DOCUMENTS')
        .select()
        .eq('project_id', projectId);

      if (error) {
        console.error('Error fetching documents:', error.message);
      } else {
        setDocuments(data);
      }
    };

    if (project) {
      fetchDocuments(); // Fetch documents after project is loaded
    }
  }, [project]);

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

        <h4>Instruction Documents</h4>
        {documents.length > 0 ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <a 
                  href={`https://iymtqfvemlkysjgrwdnf.supabase.co/storage/v1/object/public/documents/${doc.FileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.Title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No instruction documents available for this project.</p>
        )}

        {accountType === "student" && (
          <button>
            <Link className="upload" to={`/courses/${courseId}/projects/${project.project_id}/SubmitAssignment`}>Submit Assignment</Link>
          </button>
        )}
        {accountType === "professor" && (
          <div>
            <button>
              <Link className="edit" to={`/courses/${courseId}/projects/${project.project_id}/EditProject`}>Edit</Link>
            </button>
            <button>
              <Link className="upload" to={`/courses/${courseId}/projects/${project.project_id}/UploadDocument`}>Upload Instruction Documents</Link>
            </button>
          </div>
        )}
      </div>
    </TemplatePage>
  );
}

export default ProjectInstructions;
