import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import { toast } from "sonner";
import { Calendar as CalendarIcon, MapPin, Users, ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiFetch(`/api/events/${id}`);
        if (!response.ok) {
           if (response.status === 404) throw new Error("Event not found");
           throw new Error("Unable to load event details");
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        toast.error(err.message);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const isJoined = () => {
    if (!user || !event?.attendees) return false;
    return event.attendees.some(a => (a._id || a) === user.id);
  };

  const handleJoin = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsJoining(true);
    try {
      const response = await apiFetch(`/api/events/${id}/join`, { method: "POST" });
      if (!response.ok) throw new Error("Unable to join event");
      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      toast.success("You successfully joined the event!");
      refreshUser().catch(() => null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="max-w-5xl mx-auto py-10 animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-8 text-muted-foreground hover:text-white hover:bg-white/5 transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
      </Button>

      {/* Main Event Card */}
      <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden group border-transparent bg-[#0a0a0c]">
        {/* Subtle top edge inner highlight */}
        <div 
          className="absolute top-0 left-0 right-0 h-px opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(94,106,210,0.5), transparent)'
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-8">
              {event.eventName}
            </h1>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4 text-foreground-muted">
                <div className="bg-[#0F0F12] border border-white/10 p-3 rounded-xl shadow-sm">
                   <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono tracking-widest text-[#8A8F98] uppercase">Location</span>
                   <span className="text-lg text-white font-medium">{event.eventLocation}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-foreground-muted">
                <div className="bg-[#0F0F12] border border-white/10 p-3 rounded-xl shadow-sm">
                   <CalendarIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono tracking-widest text-[#8A8F98] uppercase">Date</span>
                   <span className="text-lg text-white font-medium">{event.eventDate}</span>
                </div>
              </div>
            </div>

            {/* Organizer Block */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <span className="text-[10px] font-mono tracking-widest text-[#8A8F98] uppercase mb-4 block">
                Organized By
              </span>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  <AvatarFallback className="bg-[#0F0F12] text-white">
                    {(event.owner?.username || "?").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium text-lg leading-none mb-1.5">{event.owner?.username || "Anonymous"}</p>
                  <p className="text-sm text-[#8A8F98] font-mono">{event.owner?.email || "No email provided"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[320px] flex flex-col gap-6 shrink-0">
             <div className="bg-[#0F0F12] border border-white/10 rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                <span className="text-[10px] font-mono tracking-widest text-[#8A8F98] uppercase mb-5 block">
                   Action Center
                </span>
                {isJoined() ? (
                  <Button 
                     onClick={() => navigate(`/events/${event._id}/chat`)} 
                     className="w-full h-12 accent-button text-sm tracking-wide font-medium shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                     <MessageCircle className="mr-2 h-5 w-5" /> Open Event Chat
                  </Button>
                ) : (
                  <Button 
                     onClick={handleJoin} 
                     disabled={isJoining}
                     className="w-full h-12 bg-white text-black hover:bg-zinc-200 transition-colors font-semibold"
                  >
                     {isJoining ? <Loader2 className="h-5 w-5 animate-spin" /> : "Join Event"}
                  </Button>
                )}
             </div>

             <div className="bg-[#0F0F12] border border-white/10 rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                 <span className="text-[10px] font-mono tracking-widest text-[#8A8F98] uppercase mb-4 flex items-center gap-2">
                   <Users className="w-3.5 h-3.5" /> RSVPs
                 </span>
                 <p className="text-4xl font-light text-white mb-2">{event.attendees?.length || 0}</p>
                 <p className="text-sm text-[#8A8F98]">People are attending this event. Join them now!</p>
                 
                 {event.attendees?.length > 0 && (
                   <div className="flex -space-x-3 mt-4 pt-4 border-t border-white/10">
                     {event.attendees.slice(0, 5).map((attendee, idx) => (
                       <Avatar key={idx} className="h-8 w-8 border-2 border-[#0F0F12] shadow-sm">
                         <AvatarFallback className="bg-white/10 text-xs">
                           {(attendee.username || "U").charAt(0).toUpperCase()}
                         </AvatarFallback>
                       </Avatar>
                     ))}
                     {event.attendees.length > 5 && (
                       <div className="h-8 w-8 rounded-full border-2 border-[#0F0F12] bg-[#1A1A20] flex items-center justify-center text-[10px] font-semibold text-white shadow-sm">
                         +{event.attendees.length - 5}
                       </div>
                     )}
                   </div>
                 )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
