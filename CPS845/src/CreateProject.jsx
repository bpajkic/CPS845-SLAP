import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import TemplatePage from "./TemplatePage";
import './main.css';

function CreateProject() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [status, setStatus] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            console.log("Fetching courses...");
            const { data, error } = await supabase
                .from('COURSES')
                .select('id, COURSE_CODE');

            if (error) {
                console.error('Fetch error:', error);
                setFetchError('Could not fetch courses');
            } else {
                console.log('Fetched courses:', data);
                setCourses(data);
                setFetchError(null);
            }
        };
        fetchCourses();
    }, []);

    if (fetchError) {
        console.error('Fetch error rendering:', fetchError);
        return <p className="error">{fetchError}</p>;
    }

    if (!courses) return <p>Loading...</p>;

    const handleCreateProject = async () => {
        if (!name) {
            setStatus('Name cannot be empty');
            return;
        }

        try {
            const { error } = await supabase
                .from('projects')
                .insert([
                    {
                        course_id: selectedCourse,
                        name: name,
                        description: description,
                    },
                ]);

            if (error) {
                console.error('Insert error:', error);
                setStatus('Error creating project. Please try again.');
            } else {
                setName('');
                setDescription('');
                setSelectedCourse(null);
                setStatus('Project created successfully!');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setStatus('Error creating project. Please try again.');
        }
    };

    return (
        <TemplatePage>
            <div className="create-project-container">
                <h1>Create Project</h1>

                <h3>Name</h3>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <h3>Description</h3>
                <textarea
                    placeholder="Enter your message here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="5"
                />

                <h3>Select Class:</h3>
                <select value={selectedCourse || ''} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="" disabled>Select Course</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.COURSE_CODE}
                        </option>
                    ))}
                </select>

                <button onClick={handleCreateProject}>Create Project</button>

                {status && <p className="status">{status}</p>}
            </div>
        </TemplatePage>
    );
}

export default CreateProject;