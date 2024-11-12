import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import TemplatePage from "./TemplatePage";
import './main.css';

function CreateSLAP({ admin }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('all');
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

    const handleSendSLAP = async () => {
        if (!title) {
            setStatus('Title cannot be empty');
            return;
        }

        try {
            const { error } = await supabase
                .from('SLAPS')
                .insert([
                    {
                        created_at: new Date(),
                        Title: title,
                        Description: description,
                        course_id: selectedCourse === 'all' ? null : selectedCourse,
                    },
                ]);

            if (error) {
                console.error('Insert error:', error);
                setStatus('Error sending SLAP. Please try again.');
            } else {
                setTitle('');
                setDescription('');
                setSelectedCourse('all');
                setStatus('SLAP sent successfully!');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setStatus('Error sending SLAP. Please try again.');
        }
    };

    const slapTemplate = () => {
        return (
        <div className="create-slap-container">
                <h1>Create New SLAPs</h1>

                <h3>Title</h3>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <h3>Description</h3>
                <textarea
                    placeholder="Enter your message here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="5"
                />

                <h3>Select Class:</h3>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="all">All Courses</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.COURSE_CODE}
                        </option>
                    ))}
                </select>

                <button onClick={handleSendSLAP}>Send SLAP</button>

                {status && <p className="status">{status}</p>}
            </div>

        );
    }

    if (admin) {
        return (
            <>
                { slapTemplate() }
            </>  
        );
    } else {
        return (
            <TemplatePage>
                { slapTemplate() }
            </TemplatePage>
        );
    }
    
}

export default CreateSLAP;
