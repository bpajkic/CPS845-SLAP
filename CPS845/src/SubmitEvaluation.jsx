import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import TemplatePage from "./TemplatePage";
import './main.css';

function SubmitEvaluation() {
    const { submission_id: submissionId } = useParams();
    const [submission, setSubmission] = useState(null);
    const [publicUrl, setPublicUrl] = useState("");
    const [grade, setGrade] = useState("");
    const [feedback, setFeedback] = useState("");
    const [fetchError, setFetchError] = useState(null);
    const [status, setStatus] = useState(""); // For success or error messages
    const navigate = useNavigate();

    // Fetch the submission details
    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const { data, error } = await supabase
                    .from('SUBMISSIONS')
                    .select()
                    .eq('submission_id', submissionId)
                    .single();

                if (error) {
                    setFetchError('Could not fetch submission details');
                    console.error(error);
                } else {
                    setSubmission(data);
                    setFetchError(null);

                    // Fetch the public URL for the submitted file
                    const { data: fileData } = supabase.storage
                        .from('submissions') // Bucket name
                        .getPublicUrl(data.FileName); // File path

                    setPublicUrl(fileData?.publicUrl || "File not found");
                }
            } catch (error) {
                console.error("Error fetching submission:", error);
                setFetchError("Could not fetch submission details. Please try again later.");
            }
        };

        fetchSubmission();
    }, [submissionId]);

    // Handle evaluation submission
    const handleSubmitEvaluation = async () => {
        if (!grade) {
            setStatus('Grade cannot be empty');
            return;
        }

        try {
            const { error } = await supabase
                .from('EVALUATIONS')
                .insert([
                    {
                        submission_id: submissionId,
                        grade: grade,
                        feedback: feedback,
                    },
                ]);

            if (error) {
                console.error('Error submitting evaluation:', error);
                setStatus('Error submitting evaluation. Please try again.');
            } else {
                setStatus('Evaluation submitted successfully!');
                setTimeout(() => navigate(-1), 2000); // Navigate back after success
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setStatus('Error submitting evaluation. Please try again.');
        }
    };

    return (
        <TemplatePage>
            <div className="submit-evaluations-container">
                <h1>Submit Evaluation</h1>

                {fetchError ? (
                    <p className="error">{fetchError}</p>
                ) : submission ? (
                    <>
                        <h3>Submission File</h3>
                        {publicUrl ? (
                            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                {submission.FileName}
                            </a>
                        ) : (
                            <p>File URL not available</p>
                        )}

                        <h3>Grade</h3>
                        <input
                            type="number"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />

                        <h3>Feedback</h3>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows="5"
                        />

                        <button onClick={handleSubmitEvaluation}>Submit Evaluation</button>
                        {status && <p className="status">{status}</p>}
                    </>
                ) : (
                    <p>Loading submission details...</p>
                )}
            </div>
        </TemplatePage>
    );
}

export default SubmitEvaluation;
