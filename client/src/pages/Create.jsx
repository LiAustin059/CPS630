import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        eventName: '',
        eventLocation: '',
        eventDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:3000/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert("Event Added!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <h1>Create Event</h1>
            <form id="eventForm" onSubmit={handleSubmit}>
                <input 
                    id="name" 
                    placeholder="Event Name" 
                    required 
                    onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                />
                <input 
                    id="loc" 
                    placeholder="Location" 
                    required 
                    onChange={(e) => setFormData({...formData, eventLocation: e.target.value})}
                />
                <input 
                    id="date" 
                    type="date" 
                    required 
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                />
                <button type="submit">Add Event</button>
                <div className="links-container">
                    <Link href="/view-events" className="links">View Events</Link>
                    <Link href="/delete" className="links">Delete Event</Link>
                </div>
            </form>
        </>
    );
};

export default CreateEvent;