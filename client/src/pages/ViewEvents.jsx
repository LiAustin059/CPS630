import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

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

  const joinEvent = () => {
    alert("You joined this event 🎉");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold">Discover Events</h2>
        <p className="text-gray-400 mt-2">
          Find your people. Be social.
        </p>
      </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-20 mb-8">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-[#1e293b] border border-gray-800 rounded-2xl p-6 transition hover:border-indigo-500 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold">
                {event.eventName}
              </h3>

              <p className="text-gray-400 mt-2 text-sm">
                📍 {event.eventLocation}
              </p>

              <p className="text-gray-500 text-sm mt-1">
                📅 {event.eventDate}
              </p>

              <button
                onClick={() => joinEvent(event._id)}
                className="mt-5 w-full bg-[#1a1a1a] hover:bg-indigo-500 text-white py-2 rounded-xl text-sm transition"
              >
                Join Event
              </button>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            No events match your search.
          </div>
      )}
    </div>
  );
}

export default ViewEvents;