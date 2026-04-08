import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

const DeleteEvent = () => {
    const navigate = useNavigate();
    const { user, isLoading, refreshUser } = useAuth();
    const [id, setId] = useState("");
    const [status, setStatus] = useState("");

    const handleDelete = async () => {
        if (!id) {
            setStatus("Please enter an ID.");
            return;
        }

        // Basic client-side validation for MongoDB ObjectId (24 hex characters)
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!objectIdRegex.test(id)) {
            setStatus("Invalid ID format. It should be 24 hex characters.");
            return;
        }

        try {
            const response = await apiFetch(`/api/events/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("Event successfully deleted! 🎉");
                setId("");
                refreshUser().catch(() => null);
            } else if (response.status === 401) {
                navigate("/login");
            } else if (response.status === 403) {
                setStatus(data.error || "You can only delete your own events.");
            } else if (response.status === 404) {
                setStatus("Event not found. Please check the ID.");
            } else if (response.status === 400) {
                setStatus("Invalid ID format. Please use a 24-character ID.");
            } else {
                setStatus("Failed to delete event. Server returned an error.");
            }
        } catch (err) {
            console.error(err);
            setStatus("An error occurred. Please try again.");
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
                    <h2 className="text-3xl font-semibold text-gray-200">Delete Event</h2>
                    <p className="text-gray-400 mt-2">
                        Sign in to delete events you created.
                    </p>
                </div>

                <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-8 space-y-4">
                    <p className="text-sm text-gray-300">
                        Deleting events is restricted to the account that created them.
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
                <h2 className="text-3xl font-semibold text-gray-200">Delete Event</h2>
                <p className="text-gray-400 mt-2">
                    Enter the event ID to remove it from the system.
                </p>
            </div>

            <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Event ID</label>
                    <input 
                        type="text" 
                        placeholder="e.g. 64a8f1..." 
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        You can find the ID for any event on the <span className="text-indigo-400">Explore</span> page.
                    </p>
                </div>

                <button 
                    onClick={handleDelete}
                    className="w-full bg-[#1a1a1a] hover:bg-red-500 text-white font-medium py-3 rounded-xl text-sm transition shadow-lg shadow-red-500/20 active:scale-[0.98]"
                >
                    Delete Event
                </button>

                {status && (
                    <p className={`text-center text-sm mt-4 ${status.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
};

export default DeleteEvent;