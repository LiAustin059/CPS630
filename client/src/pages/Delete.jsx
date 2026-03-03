import React, { useState } from 'react';

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
                setStatus("Event successfully deleted! 🎉");
                setId("");
            } else {
                setStatus("Failed to delete event. Please check the ID.");
            }
        } catch (err) {
            console.error(err);
            setStatus("An error occurred. Please try again.");
        }
    };

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
                        type="number" 
                        placeholder="e.g. 123" 
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
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