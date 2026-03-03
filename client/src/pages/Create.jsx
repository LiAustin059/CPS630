import React, { useState } from 'react';

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
        <div className="max-w-xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-200">Create New Event</h2>
                <p className="text-gray-400 mt-2">
                    Share your next big thing with the community.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Event Name</label>
                    <input 
                        id="name" 
                        placeholder="e.g. Tech Meetup 2024" 
                        required 
                        onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                        className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                    <input 
                        id="loc" 
                        placeholder="e.g. Toronto, ON" 
                        required 
                        onChange={(e) => setFormData({...formData, eventLocation: e.target.value})}
                        className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Event Date</label>
                    <input 
                        id="date" 
                        type="date" 
                        required 
                        onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                        className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                >
                    Add Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;