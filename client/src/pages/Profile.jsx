import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="max-w-5xl mx-auto px-4 py-10 text-gray-400">Loading your profile...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-8">
          <h2 className="text-3xl font-semibold text-gray-200">Profile</h2>
          <p className="text-gray-400 mt-2">Sign in to see your own events and joined events.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-5 rounded-xl text-sm transition shadow-lg shadow-indigo-500/20">
              Sign in
            </Link>
            <Link to="/register" className="bg-[#0f172a] border border-gray-700 hover:border-gray-500 text-white font-medium py-3 px-5 rounded-xl text-sm transition">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const createdEvents = user.createdEvents || [];
  const joinedEvents = (user.joinedEvents || []).filter((event) => !createdEvents.some((createdEvent) => createdEvent._id === event._id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white">Profile</h2>
        <p className="text-gray-400 mt-2">Manage your own event data in one place.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Account</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{user.username}</h3>
          <p className="mt-2 text-gray-400">{user.email}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
              <p className="text-gray-500">Created</p>
              <p className="mt-1 text-2xl font-semibold text-white">{createdEvents.length}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
              <p className="text-gray-500">Joined</p>
              <p className="mt-1 text-2xl font-semibold text-white">{joinedEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Your events</p>
          <div className="mt-4 space-y-3">
            {createdEvents.length === 0 ? (
              <p className="text-sm text-gray-400">You have not created any events yet.</p>
            ) : (
              createdEvents.map((event) => (
                <div key={event._id} className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
                  <h4 className="font-medium text-white">{event.eventName}</h4>
                  <p className="text-sm text-gray-400">{event.eventLocation}</p>
                  <p className="text-sm text-gray-400">{event.eventDate}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-6 lg:col-span-2">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Joined events</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {joinedEvents.length === 0 ? (
              <p className="text-sm text-gray-400">You have not joined any events yet.</p>
            ) : (
              joinedEvents.map((event) => (
                <div key={event._id} className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
                  <h4 className="font-medium text-white">{event.eventName}</h4>
                  <p className="text-sm text-gray-400">{event.eventLocation}</p>
                  <p className="text-sm text-gray-400">{event.eventDate}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;