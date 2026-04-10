import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, MessageCircle, Send, Users } from "lucide-react";

const EventChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    apiFetch(`/api/events/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Unable to load event.");
        }
        return res.json();
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setIsLoaded(true));
  }, [id]);

  useEffect(() => {
    if (!user || !id) {
      return;
    }

    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const socketClient = io(socketUrl, {
      auth: {
        token: localStorage.getItem("eventhub_token") || "",
      },
    });

    setSocket(socketClient);

    socketClient.on("connect_error", (err) => {
      setError(err.message || "Connection error");
    });

    socketClient.on("chatHistory", (history) => {
      setMessages(history || []);
    });

    socketClient.on("chatMessage", (message) => {
      setMessages((current) => [...current, message]);
    });

    socketClient.emit("joinEventChat", id);

    return () => {
      socketClient.disconnect();
    };
  }, [id, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isJoined = () => {
    if (!event || !user) {
      return false;
    }

    const attendeeIds = Array.isArray(event.attendees)
      ? event.attendees.map((member) => member?._id?.toString() || member?.toString())
      : [];

    return attendeeIds.includes(user.id) || event.owner?._id === user.id || event.owner?.id === user.id;
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!draft.trim() || !socket) {
      return;
    }

    socket.emit("sendChatMessage", {
      eventId: id,
      text: draft,
    });

    setDraft("");
  };

  const title = event?.eventName || "Event Chat";
  const subtitle = event?.eventLocation ? `${event.eventLocation} • ${event.eventDate}` : "";

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-white">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-indigo-300 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="rounded-3xl border border-gray-800 bg-[#111827] p-8">
          <p className="text-lg font-semibold">Sign in to use event chat</p>
          <p className="mt-3 text-gray-400">Event chat is only available to authenticated users who are participants of this event.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-indigo-300 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="rounded-3xl border border-gray-800 bg-[#111827] p-8 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-indigo-300">
            <MessageCircle className="w-5 h-5" />
            <h1 className="text-3xl font-semibold text-white">{title}</h1>
          </div>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
          <p className="text-sm text-gray-400 mt-1">Chat with other attendees who joined this event.</p>
        </div>
      </div>

      {!isJoined() ? (
        <div className="rounded-3xl border border-gray-800 bg-[#111827] p-8">
          <div className="flex items-center gap-3 text-indigo-300 mb-4">
            <Users className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-white">Access restricted</h2>
          </div>
          <p className="text-gray-400">Only event participants can view and post messages. Join the event first to gain access.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className="rounded-2xl border border-red-600 bg-red-500/10 p-4 text-red-200">
              {error}
            </div>
          )}

          <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6 h-[60vh] overflow-hidden">
            <div className="h-full overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                  No chat messages yet. Say hello to the group.
                </div>
              ) : (
                messages.map((message) => {
                  const isSelf = message.sender?.id === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${isSelf ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded-3xl border px-4 py-3 ${isSelf ? "bg-indigo-600 text-white" : "bg-[#0f172a] border-gray-800 text-gray-200"}`}>
                        <div className="text-xs text-gray-400 mb-2">
                          {message.sender?.username || "Unknown"} • {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              className="flex-1 rounded-3xl border border-gray-800 bg-[#0f172a] px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your message..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventChat;
