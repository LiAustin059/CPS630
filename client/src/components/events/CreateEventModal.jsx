import { useState } from "react";
import { Plus, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { apiFetch } from "../../lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function CreateEventModal({ isOpen, onOpenChange, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventLocation: '',
    eventDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiFetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to create event");

      toast.success("Event added successfully.");
      setFormData({ eventName: '', eventLocation: '', eventDate: '' });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="shrink-0 rounded-lg shadow-sm accent-button transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0a0a0c] border border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_80px_rgba(94,106,210,0.1)] rounded-2xl p-6 overflow-hidden">
        
        {/* Subtle top edge inner highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent opacity-50" />
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white mb-1">Create New Event</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Share your next big thing with the community. Everything is better together.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-mono tracking-widest text-[#8A8F98]">EVENT NAME</Label>
            <Input 
              id="name" 
              placeholder="e.g. Tech Meetup 2024" 
              required 
              value={formData.eventName}
              onChange={(e) => setFormData({...formData, eventName: e.target.value})}
              disabled={isSubmitting}
              className="bg-[#0F0F12] border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-1 focus-visible:border-primary transition-all rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc" className="text-xs font-mono tracking-widest text-[#8A8F98]">LOCATION</Label>
            <Input 
              id="loc" 
              placeholder="e.g. Toronto, ON" 
              required 
              value={formData.eventLocation}
              onChange={(e) => setFormData({...formData, eventLocation: e.target.value})}
              disabled={isSubmitting}
              className="bg-[#0F0F12] border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-1 focus-visible:border-primary transition-all rounded-lg"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="date" className="text-xs font-mono tracking-widest text-[#8A8F98]">DATE</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-[#0F0F12] border-white/10 text-white h-11 hover:bg-white/[0.05] hover:text-white transition-all rounded-lg",
                    !formData.eventDate && "text-white/30"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-3 h-4 w-4" />
                  {formData.eventDate ? format(new Date(formData.eventDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-white/10 bg-[#0a0a0c] text-white rounded-xl shadow-2xl" align="start">
                <ShadcnCalendar
                  mode="single"
                  selected={formData.eventDate ? new Date(formData.eventDate) : undefined}
                  onSelect={(date) => setFormData({...formData, eventDate: date ? format(date, 'yyyy-MM-dd') : ''})}
                  initialFocus
                  className="bg-transparent"
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter className="pt-6">
            <Button type="submit" disabled={isSubmitting} className="w-full accent-button text-sm h-11 tracking-wide font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateEventModal;
