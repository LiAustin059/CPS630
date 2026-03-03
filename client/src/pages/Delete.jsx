import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const DeleteEvent = () => {
    const [id, setId] = useState("");
    const [status, setStatus] = useState("");

    const handleDelete = async () => {
        if (!id) {
            setStatus("Please enter an ID.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/events/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setStatus("Deleted!");
                setId("");
            } else {
                setStatus("Error");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <h1>Delete Event by ID</h1>
            <div className="delete-container">
                <input 
                    type="number" 
                    placeholder="Enter Event ID" 
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <button onClick={handleDelete}>Delete Event</button>
            </div>
            <div className="links-container">
                <Link to="/view-events" className="links">View Events</Link>
                <Link to="/create" className="links">Create Event</Link>
            </div>
            <p>{status}</p>
        </>
    );
};

export default DeleteEvent;