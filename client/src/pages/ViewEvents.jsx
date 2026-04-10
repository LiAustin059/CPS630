import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, Users, Trash2, Share2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

import EventCard from "../components/events/EventCard";
import CreateEventModal from "../components/events/CreateEventModal";
import DeleteEventModal from "../components/events/DeleteEventModal";
import EventSearchFilter from "../components/events/EventSearchFilter";

function ViewEvents() {
  const navigate = useNavigate();
  const { user, refreshUser, isLoading: userLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  
  const [copiedId, setCopiedId] = useState(null);
  
  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const fetchEvents = () => {
    setLoading(true);
    apiFetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load events");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Event ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareEventUrl = (eventId) => {
    const url = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(url);
    toast.success("Event URL copied to clipboard!");
  };

  const filteredEvents = events.filter((event) => {
    const name = event.eventName || "";
    const location = event.eventLocation || "";
    const date = event.eventDate || "";
    const id = event._id || "";
  
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase()) ||
      id.toLowerCase().includes(search.toLowerCase());
  
    const matchesDate = filterDate
      ? date === filterDate
      : true;
  
    return matchesSearch && matchesDate;
  });

  const isOwnedByUser = (event) => {
    if (!user || !event.owner) return false;
    return event.owner._id === user.id || event.owner.id === user.id;
  };

  const isJoinedByUser = (event) => {
    if (!user || !Array.isArray(event.attendees)) return false;
    return event.attendees.some((attendee) => attendee?._id === user.id || attendee?.id === user.id);
  };

  const joinEvent = async (eventId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await apiFetch(`/api/events/${eventId}/join`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to join event");

      setEvents((currentEvents) =>
        currentEvents.map((event) => (event._id === data._id ? data : event))
      );
      toast.success("You successfully joined the event!");
      refreshUser().catch(() => null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onEventCreated = () => {
    fetchEvents();
    refreshUser().catch(() => null);
  };

  const onEventDeleted = () => {
    fetchEvents();
    refreshUser().catch(() => null);
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-gradient">Discover Events</h2>
          <p className="text-muted-foreground text-lg mt-2 font-normal max-w-xl leading-relaxed">
            Find your people. Be social. Experience the premier platform for community connection.
          </p>
          {!user && !userLoading && (
            <Badge variant="secondary" className="mt-4 font-normal p-2">
              Browsing is open. Sign in to join events or manage your own.
            </Badge>
          )}
        </div>

        {user && (
          <CreateEventModal 
            isOpen={isCreateOpen} 
            onOpenChange={setIsCreateOpen} 
            onSuccess={onEventCreated} 
          />
        )}
      </div>

      <DeleteEventModal 
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        eventToDelete={eventToDelete}
        onSuccess={onEventDeleted}
      />

      <EventSearchFilter 
        search={search}
        setSearch={setSearch}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
      />

      {/* Events Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="flex flex-col h-[280px]">
              <CardHeader className="pb-3 border-b border-border/10">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-1 pt-4 space-y-4">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-1/3 mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium tracking-tight mb-1">No events found</h3>
          <p className="text-muted-foreground text-sm max-w-[250px]">
            We couldn't parse any events matching your current filters.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 align-stretch">
          {filteredEvents.map((event) => (
            <EventCard 
              key={event._id} 
              event={event} 
              headerActions={
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="shrink-0 h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                    onClick={(e) => { e.stopPropagation(); shareEventUrl(event._id); }}
                    title="Share Event URL"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  
                  {isOwnedByUser(event) ? (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="shrink-0 h-8 w-8 text-destructive/70 hover:text-white hover:bg-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEventToDelete(event);
                        setIsDeleteOpen(true);
                      }}
                      title="Delete Event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="shrink-0 h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(event._id); }}
                      title="Copy ID"
                    >
                      {copiedId === event._id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              }
              badges={
                <>
                  {isOwnedByUser(event) && (
                    <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                      Your event
                    </Badge>
                  )}
                  {isJoinedByUser(event) && (
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 bg-emerald-500/10">
                      Joined
                    </Badge>
                  )}
                </>
              }
              footerActions={
                isJoinedByUser(event) ? (
                  <Button
                    onClick={() => navigate(`/events/${event._id}/chat`)}
                    className="w-full shadow-sm rounded-xl"
                  >
                    Open Event Chat
                  </Button>
                ) : (
                  <Button
                    variant={user ? "secondary" : "outline"}
                    onClick={() => joinEvent(event._id)}
                    disabled={isJoinedByUser(event)}
                    className="w-full rounded-xl"
                  >
                    {user ? "Join Event" : "Sign in to join"}
                  </Button>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewEvents;