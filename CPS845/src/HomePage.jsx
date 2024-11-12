import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import TemplatePage from "./TemplatePage";
import "./main.css";

function HomePage() {

  const [slaps, setSlaps] = useState([]);
  const [fetchError, setFetchError] = useState(null); 

  useEffect(() => {
    const fetchSlaps = async () => {
      const { data, error } = await supabase.from("SLAPS").select();

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

  return (
    <TemplatePage>
      <section className="main-content">
        <div className="calendar">
          <h2>Calendar</h2>
          <ul className="lists">
            <li>project 1 due Friday</li>
          </ul>
        </div>
      </section>
      <section className="main-content">
        <div className="slap-notifications">
          <h2>SLAPs</h2>
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
      </section>
    </TemplatePage>
  );
}

export default HomePage;