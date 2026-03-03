import { useEffect, useState } from "react";
import { Copy, Check, MapPin, Calendar, Users } from "lucide-react";

function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
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

  const joinEvent = () => {
    alert("You joined this event 🎉");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white">Discover Events</h2>
        <p className="text-gray-400 mt-2">
          Find your people. Be social.
        </p>
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
                className="w-full bg-[#0f172a] border border-gray-700 hover:bg-indigo-600 hover:border-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
              >
                Join Event
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