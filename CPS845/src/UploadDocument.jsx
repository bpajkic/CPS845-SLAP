import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import TemplatePage from "./TemplatePage";
import './main.css';

function UploadDocument() {
  const { course_id: courseId, project_id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [fetchError, setFetchError] = useState(null); // Added fetchError state
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState(''); // Controls the title input

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

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

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }
  
    if (!title) {
      setMessage('Please provide a title for the document.');
      return;
    }
  
    // Check file size (max 50MB for free tier)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setMessage('File size exceeds the 50MB limit.');
      return;
    }
  
    try {
      setUploading(true);
  
      const sanitizeFileName = (fileName) => {
        return fileName.replace(/[^a-zA-Z0-9.-_]/g, '_');
      };
  
      const fileName = sanitizeFileName(file.name);
  
      // Step 1: Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents') 
      .upload(`${Date.now()}-${sanitizeFileName(file.name)}`, file);

  
      if (uploadError) {
        setMessage('Upload failed.');
        console.error('Error uploading file:', uploadError.message);
        console.log('File MIME type:', file.type);
        console.log('File size in bytes:', file.size);
        setUploading(false);
        return;
      }
  
      // Step 2: Insert file metadata into the DATABASE
      const { error: dbError } = await supabase
        .from('DOCUMENTS')
        .insert([
          {
            Title: title,
            FileName: fileName,
            project_id: projectId,
          },
        ]);
  
      if (dbError) {
        setMessage('Failed to save file metadata.');
        console.error('Error saving file metadata:', dbError.message);
      } else {
        setMessage('File uploaded successfully!');
        console.log('File uploaded:', uploadData);
        setTimeout(() => navigate(`/courses/${courseId}/projects/${projectId}`), 2000);
      }
  
    } catch (error) {
      setMessage('An unexpected error occurred during upload.');
      console.error('Error:', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <TemplatePage>
      <div className="upload-document-container"> {/* Fixed className */}
        {project && <h2>{project.name}</h2>}
        {fetchError && <p>{fetchError}</p>}
        <h3>Title</h3>
        <input type="text" value={title} onChange={handleTitleChange} /> {/* Controls title input */}
        <h3>Upload Document</h3>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
        {message && <p>{message}</p>}
      </div>
    </TemplatePage>
  );
}

export default UploadDocument;
