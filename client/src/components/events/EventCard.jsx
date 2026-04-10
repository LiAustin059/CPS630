import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export function EventCard({ event, headerActions, badges, footerActions }) {
  const divRef = useRef(null);
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCardClick = (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    navigate(`/events/${event._id}`);
  };

  return (
    <Card 
      ref={divRef}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onFocus={() => { setIsFocused(true); setOpacity(1); }}
      onBlur={() => { setIsFocused(false); setOpacity(0); }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="relative flex flex-col h-full overflow-hidden transition-all duration-300 transform hover:-translate-y-1 glass-card group text-left border-transparent cursor-pointer"
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(94,106,210,0.15), transparent 40%)`,
        }}
      />
      
      {/* Animated gradient top border on hover */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(94,106,210,0.5), transparent)'
        }}
      />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl leading-tight line-clamp-2 title-hover group-hover:text-primary transition-colors text-foreground">
            {event.eventName}
          </CardTitle>
          {headerActions && <div>{headerActions}</div>}
        </div>
        {badges && (
          <div className="flex flex-wrap gap-2 mt-4 text-xs font-mono tracking-widest">
            {badges}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3 flex-1 flex flex-col justify-end relative z-10">
        <div className="flex items-center gap-2.5 text-sm text-foreground-muted">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate text-muted-foreground">{event.eventLocation}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-foreground-muted">
          <CalendarIcon className="w-4 h-4 text-primary shrink-0" />
          <span className="text-muted-foreground">{event.eventDate}</span>
        </div>
      </CardContent>

      {footerActions && (
        <CardFooter className="pt-4 border-t border-white/[0.06] bg-white/[0.02] relative z-10">
          {footerActions}
        </CardFooter>
      )}
    </Card>
  );
}

export default EventCard;
