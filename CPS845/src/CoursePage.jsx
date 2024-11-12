import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import TemplatePage from "./TemplatePage";
import './main.css';

function CoursePage() {
  const { id: courseId } = useParams(); // Get the course ID from URL parameters
  const [course, setCourse] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [slaps, setSlaps] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from('COURSES')
        .select()
        .eq('id', courseId)
        .single();

      if (error) {
        setFetchError('Could not fetch course');
        console.error(error);
      } else {
        setCourse(data);
        setFetchError(null);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchSlaps = async () => {
      const { data, error } = await supabase.from("SLAPS")
      .select()
      .or(`course_id.eq.${courseId},course_id.is.null`);
      
      if (error) {
        setFetchError("Could not fetch slaps");
        setSlaps([]); 
        console.error(error);
      } else {
        setSlaps(data);
        setFetchError(null);
      }
    };

    fetchSlaps();
  }, []);

  if (fetchError) return <p className="error">{fetchError}</p>;
  if (!course) return <p>Loading...</p>;

  console.log('Slaps:', slaps); // Debugging: log the fetched slaps
  console.log('Course ID:', courseId); // Debugging: log the courseId

  return (
    <TemplatePage>
      <div className="course-page">
      <h1>{course.COURSE_NAME}</h1>
      <p>Course Code: {course.COURSE_CODE}</p>

      <div className="course-section">
        <h2>Projects/Assignments</h2>
        <p>
          <Link to={`/courses/${courseId}/projects`}>View project/assignment details here.</Link>
        </p>
      </div>

      <div className="course-section">
        <h2>Submissions</h2>
        <p>
          <Link to={`/courses/${courseId}/submissions`}>View submissions here.</Link>
        </p>
      </div>

      <div className="course-section">
        <h2>Evaluations</h2>
        <p>
          <Link to={`/courses/${courseId}/evaluations`}>View evaluations here.</Link>
        </p>
      </div>

      <div className="course-section">
        <h2>SLAPS</h2>
        <ul className="lists">
          {fetchError && <p className="error">{fetchError}</p>}
          {slaps.length === 0 && !fetchError && <p>No SLAPs available.</p>} {/* Display a message if no slaps */}
          {slaps.map((slap) => (
            <li key={slap.id} className="slap-options">
              <Link to={`/slaps/${slap.id}`}>{slap.Title}</Link>
            </li>
            ))}
        </ul>
      </div>
    </div>
    </TemplatePage>
  );
}

export default CoursePage;
