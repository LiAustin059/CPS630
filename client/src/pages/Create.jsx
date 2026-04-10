import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

const CreateEvent = () => {
    const navigate = useNavigate();
    const { user, isLoading, refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        eventName: '',
        eventLocation: '',
        eventDate: ''
    });
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiFetch('/api/events', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/login");
                    return;
                }

                throw new Error(data.error || "Unable to create event");
            }

            setStatus("Event added successfully.");
            setFormData({ eventName: '', eventLocation: '', eventDate: '' });
            refreshUser().catch(() => null);
        } catch (err) {
            setStatus(err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-xl mx-auto px-4 py-10 text-gray-400">
                Loading your session...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-semibold text-gray-200">Create New Event</h2>
                    <p className="text-gray-400 mt-2">
                        Sign in or create an account to post an event.
                    </p>
                </div>

                <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-8 space-y-4">
                    <p className="text-sm text-gray-300">
                        Event creation is available after login so each user keeps their own events.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/login" className="flex-1 text-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-500/20">
                            Sign in
                        </Link>
                        <Link to="/register" className="flex-1 text-center bg-[#0f172a] border border-gray-700 hover:border-gray-500 text-white font-medium py-3 rounded-xl text-sm transition">
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                        value={formData.eventName}
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
                        value={formData.eventLocation}
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
                        value={formData.eventDate}
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

                {status && (
                    <p className="text-sm text-center text-gray-300">{status}</p>
                )}
            </form>
        </div>
    );
};

export default CreateEvent;