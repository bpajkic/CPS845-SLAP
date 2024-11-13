import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import TemplatePage from "./TemplatePage";
import './main.css';

function EditProject() {
    const { project_id: projectId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [status, setStatus] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data for projectId:', projectId); // Debugging line

                // Fetch courses
                const { data: coursesData, error: coursesError } = await supabase
                    .from('COURSES')
                    .select('id, COURSE_CODE');
                
                if (coursesError) throw new Error('Could not fetch courses');
                setCourses(coursesData);

                // Fetch project details
                const { data: projectData, error: projectError } = await supabase
                    .from('projects')
                    .select('name, description, course_id')
                    .eq('project_id', projectId)
                    .single();
                
                if (projectError) throw new Error('Could not fetch project details');
                
                if (projectData) {
                    setName(projectData.name);
                    setDescription(projectData.description);
                    setSelectedCourse(projectData.course_id || '');
                }
                
                setFetchError(null);
            } catch (error) {
                console.error('Fetch error:', error);
                setFetchError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [projectId]);

    if (fetchError) return <p className="error">{fetchError}</p>;
    if (loading) return <p>Loading project details...</p>;

    const handleUpdateProject = async () => {
        if (!name) {
            setStatus('Name cannot be empty');
            return;
        }
        if (!selectedCourse) {
            setStatus('Please select a course');
            return;
        }

        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    name,
                    description,
                    course_id: selectedCourse,
                })
                .eq('project_id', projectId);

            if (error) {
                console.error('Update error:', error);
                setStatus('Error updating project. Please try again.');
            } else {
                setStatus('Project updated successfully!');
                setTimeout(() => navigate('/projects'), 2000);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setStatus('Error updating project. Please try again.');
        }
    };

    return (
        <TemplatePage>
            <div className="edit-project-container">
                <h1>Edit Project</h1>
                
                <h3>Name</h3>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <h3>Description</h3>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="5"
                />

                <h3>Select Class:</h3>
                <select 
                    value={selectedCourse} 
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    <option value="" disabled>Select Course</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.COURSE_CODE}
                        </option>
                    ))}
                </select>

                <button onClick={handleUpdateProject}>Update Project</button>

                {status && <p className="status">{status}</p>}
            </div>
        </TemplatePage>
    );
}

export default EditProject;