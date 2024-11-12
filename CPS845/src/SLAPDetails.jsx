import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import TemplatePage from "./TemplatePage";
import './main.css';

function SLAPDetails() {
    const { id: slapId } = useParams(); // Get slap ID from URL parameters
    const [slap, setSlap] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchSlap = async () => {
          const { data, error } = await supabase
            .from('SLAPS')
            .select()
            .eq('id', slapId)
            .single();
    
          if (error) {
            setFetchError('Could not fetch slap details');
            console.error(error);
          } else {
            setSlap(data);
            setFetchError(null);
          }
        };

        fetchSlap();
    }, [slapId]);

    if (fetchError) return <p className="error">{fetchError}</p>;
    if (!slap) return <p>Loading slap details...</p>;

    return (
        <TemplatePage>
        <div className="slap-details">
          <h3>{slap.Title}</h3>
          <p>{slap.Description}</p>
          <p>{slap.created_at}</p>
        </div>
        </TemplatePage>
      );
}

export default SLAPDetails;