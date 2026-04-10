import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, MessageCircle, Send, Users, ShieldAlert, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ChatMessage from "../components/chat/ChatMessage";

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
  const scrollRef = useRef(null);

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

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
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
      <div className="max-w-4xl mx-auto py-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 px-4 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Card className="text-center py-12 px-4 shadow-sm bg-card border-muted/50">
           <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to use event chat</h2>
          <p className="text-muted-foreground">Event chat is only available to authenticated participants.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-6rem)] relative animate-in fade-in duration-500 pb-4">
      {/* Top Navigation */}
      <div className="pt-6 pb-4 shrink-0 flex items-center justify-between">
         <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-3 px-3 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
         </Button>
      </div>

      {/* Main Chat Interface */}
      <Card className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px] glass-card border-transparent bg-transparent relative overflow-hidden group z-10 transition-shadow">
         <div 
            className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
               background: 'linear-gradient(90deg, transparent, rgba(94,106,210,0.5), transparent)'
            }}
         />
         {/* Chat Header */}
         <div className="flex items-center p-4 border-b border-white/[0.06] bg-white/[0.02] shrink-0 z-10 relative">
            <h1 className="text-xl font-bold flex items-center gap-2 tracking-tight text-foreground">
               <MessageCircle className="w-5 h-5 text-primary" /> {title}
            </h1>
            {subtitle && <p className="text-sm text-muted-foreground ml-7 font-medium tracking-wide mt-0.5">{subtitle}</p>}
         </div>

         {!isJoined() ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/5">
               <div className="bg-muted p-4 rounded-full mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
               </div>
               <h2 className="text-xl font-semibold mb-2">Access restricted</h2>
               <p className="text-muted-foreground max-w-md">
                 Only event participants can view and post messages here. Go back and join the event first to gain access.
               </p>
            </div>
         ) : (
            <>
               {/* Messages Area */}
               <div 
                 ref={scrollRef} 
                 className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-card"
               >
                  {error && (
                     <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium mx-auto max-w-md text-center mb-6">
                        {error}
                     </div>
                  )}

                  {messages.length === 0 ? (
                     <div className="flex h-full items-center justify-center text-muted-foreground text-sm italic">
                        No chat messages yet. Introduce yourself!
                     </div>
                  ) : (
                     messages.map((message) => {
                        const isSelf = message.sender?.id === user.id;
                        return <ChatMessage key={message.id} message={message} isSelf={isSelf} />;
                     })
                  )}
               </div>

               {/* Input Area */}
               <div className="p-4 border-t border-white/[0.06] bg-white/[0.02] shrink-0 z-10 relative mt-auto">
                  <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto">
                     <Input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Message the event channel..."
                        className="flex-1 bg-[#0F0F12] border-white/10 text-white placeholder:text-[#8A8F98] h-11 focus-visible:ring-1 focus-visible:border-primary transition-all rounded-lg"
                     />
                     <Button type="submit" size="icon" disabled={!draft.trim()} className="h-11 w-11 accent-button shrink-0 transition-transform active:scale-95 shadow-[0_4px_12px_rgba(94,106,210,0.3)]">
                        <Send className="h-5 w-5" />
                     </Button>
                  </form>
               </div>
            </>
         )}
      </Card>
    </div>
  );
};

export default EventChat;
