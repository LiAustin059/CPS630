import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EventCard from "../components/events/EventCard";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Derive counts
  const createdEvents = user.createdEvents || [];
  const joinedEvents = (user.joinedEvents || []).filter((event) => !createdEvents.some((createdEvent) => createdEvent._id === event._id));

  return (
    <div className="max-w-5xl mx-auto py-10 animate-in fade-in duration-500">
      
      {/* Profile Header */}
      <div className="glass-card rounded-2xl p-8 mb-12 relative overflow-hidden group border-transparent bg-transparent z-10">
        <div 
          className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(94,106,210,0.5), transparent)'
          }}
        />
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border border-white/10 shadow-xl">
            <AvatarImage src="" alt={user.name || "User"} />
            <AvatarFallback className="bg-white/5 text-foreground text-4xl font-light">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2">{user.name || "Anonymous User"}</h1>
            <p className="text-muted-foreground font-mono text-sm tracking-wider">{user.email}</p>
            
            <div className="flex justify-center md:justify-start gap-8 mt-8">
              <div className="flex flex-col">
                <span className="text-3xl font-light text-gradient-accent">{createdEvents.length}</span>
                <span className="text-xs tracking-widest font-mono text-muted-foreground uppercase mt-2">Organized</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-light text-white">{joinedEvents.length}</span>
                <span className="text-xs tracking-widest font-mono text-muted-foreground uppercase mt-2">Joined</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Tabs */}
      <div className="flex flex-col space-y-6">
        <Tabs defaultValue="organized" className="w-full">
          <TabsList className="w-full max-w-auto mb-8 bg-[#0F0F12] border border-white/10 p-1 rounded-xl">
            <TabsTrigger className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-r-none" value="organized">Organized By You</TabsTrigger>
            <TabsTrigger className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white font-medium rounded-l-none" value="joined">Joined Events</TabsTrigger>
          </TabsList>

          <TabsContent value="organized" className="mt-0 focus-visible:outline-none">
            {createdEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <div className="bg-white/5 p-4 rounded-full mb-4 ring-1 ring-white/10">
                  <UserPlus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium tracking-tight mb-2 text-white">No Organized Events</h3>
                <p className="text-muted-foreground text-sm max-w-[250px] mb-6">
                  You haven't created any events yet.
                </p>
                <Button onClick={() => navigate('/')} className="accent-button rounded-lg">
                  Explore Hub
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
                {createdEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="joined" className="mt-0 focus-visible:outline-none">
            {joinedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <div className="bg-white/5 p-4 rounded-full mb-4 ring-1 ring-white/10">
                  <LogIn className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium tracking-tight mb-2 text-white">No Joined Events</h3>
                <p className="text-muted-foreground text-sm max-w-[250px] mb-6">
                  You haven't joined any events yet. Look around!
                </p>
                <Button onClick={() => navigate('/')} className="accent-button rounded-lg">
                  Discover Events
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
                {joinedEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;