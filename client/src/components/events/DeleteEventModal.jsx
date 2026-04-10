import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "../../lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function DeleteEventModal({ isOpen, onOpenChange, eventToDelete, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteSubmit = async () => {
    if (!eventToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await apiFetch(`/api/events/${eventToDelete._id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success("Event successfully deleted! 🎉");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete event.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#0a0a0c] border border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_80px_rgba(255,69,58,0.1)] rounded-2xl overflow-hidden p-6">
        
        {/* Destructive Subtle top edge inner highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/[0.25] to-transparent opacity-50" />

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white mb-1">Delete Event</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Are you sure you want to delete <strong className="text-white">{eventToDelete?.eventName}</strong>? This action cannot be undone and will erase all data natively.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="pt-6 flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 mt-4 border-t border-white/[0.04]">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-white hover:bg-white/[0.05] transition-colors h-10 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteSubmit} 
            disabled={isSubmitting}
            className="transition-transform hover:scale-[1.02] active:scale-[0.98] h-10 w-full sm:w-auto shadow-[0_0_0_1px_rgba(255,69,58,0.5),0_4px_12px_rgba(255,69,58,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)]"
          >
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Delete Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteEventModal;
