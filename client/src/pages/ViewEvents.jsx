import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, MapPin, Calendar, Users } from "lucide-react";

import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";


function ViewEvents() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [joinMessage, setJoinMessage] = useState("");

  useEffect(() => {
    apiFetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));

    // Connect to Socket.io server
    const socket = io("http://localhost:8080");

    // Listen for new event creation
    socket.on('eventCreated', (newEvent) => {
      console.log('New event received:', newEvent);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    });

    // Listen for event updates
    socket.on('eventUpdated', (updatedEvent) => {
      console.log('Event updated:', updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    });

    // Listen for event deletions
    socket.on('eventDeleted', (deletedId) => {
      console.log('Event deleted:', deletedId);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== deletedId)
      );
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEvents = events.filter((event) => {
    const name = event.eventName || "";
    const location = event.eventLocation || "";
    const date = event.eventDate || "";
  
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());
  
    const matchesDate = filterDate
      ? date === filterDate
      : true;
  
    return matchesSearch && matchesDate;
  });

  const isOwnedByUser = (event) => {
    if (!user || !event.owner) {
      return false;
    }

    return event.owner._id === user.id || event.owner.id === user.id;
  };

  const isJoinedByUser = (event) => {
    if (!user || !Array.isArray(event.attendees)) {
      return false;
    }

    return event.attendees.some((attendee) => attendee?._id === user.id || attendee?.id === user.id);
  };

  const joinEvent = async (eventId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await apiFetch(`/api/events/${eventId}/join`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to join event");
      }

      setEvents((currentEvents) =>
        currentEvents.map((event) => (event._id === data._id ? data : event))
      );
      setJoinMessage("You joined the event.");
      refreshUser().catch(() => null);
    } catch (error) {
      setJoinMessage(error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white">Discover Events</h2>
        <p className="text-gray-400 mt-2">
          Find your people. Be social.
        </p>
        {!user && (
          <div className="mt-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">
            Browsing is open. Sign in to join events or manage your own.
          </div>
        )}
        {joinMessage && (
          <div className="mt-4 rounded-2xl border border-gray-800 bg-[#111827] px-4 py-3 text-sm text-gray-300">
            {joinMessage}
          </div>
        )}
      </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-[#1e293b] border border-gray-800 rounded-2xl p-6 transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {event.eventName}
                </h3>
                <button 
                  onClick={() => copyToClipboard(event._id)}
                  className="p-2 hover:bg-[#0f172a] rounded-lg transition-colors group/copy relative"
                  title="Copy ID"
                >
                  {copiedId === event._id ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500 group-hover/copy:text-gray-300" />
                  )}
                  {copiedId === event._id && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs text-white px-2 py-1 rounded shadow-lg animate-bounce">
                      Copied!
                    </span>
                  )}
                </button>
              </div>

              <div className="mb-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em]">
                {isOwnedByUser(event) && (
                  <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-1 text-indigo-300">
                    Your event
                  </span>
                )}
                {isJoinedByUser(event) && (
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
                    Joined
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <p className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  {event.eventLocation}
                </p>
                <p className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  {event.eventDate}
                </p>
                <code className="block mt-4 text-[11px] bg-[#0f172a] px-2 py-1 rounded border border-gray-800 text-gray-500 font-mono">
                  ID: {event._id}
                </code>
              </div>

              <button
                onClick={() => joinEvent(event._id)}
                disabled={isJoinedByUser(event)}
                className="w-full bg-[#0f172a] border border-gray-700 hover:bg-indigo-600 hover:border-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
              >
                {user ? (isJoinedByUser(event) ? "Already joined" : "Sign up for event") : "Sign in to sign up"}
              </button>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl mt-10">
            <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No events match your search.</p>
          </div>
        )}
      </div>
  );
}

export default ViewEvents;