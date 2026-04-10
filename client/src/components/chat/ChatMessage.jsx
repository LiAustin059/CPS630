import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ChatMessage({ message, isSelf }) {
  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"} group relative`}>
      <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
         
         {/* Avatar */}
         <Avatar className={`w-8 h-8 shrink-0 mt-1 shadow-[0_2px_10px_rgba(0,0,0,0.5)] border ${isSelf ? "bg-primary border-primary text-white" : "bg-[#0F0F12] border-white/10 text-white"}`}>
            <AvatarFallback className="text-[10px] font-bold bg-transparent">
               {(message.sender?.username?.[0] || "?").toUpperCase()}
            </AvatarFallback>
         </Avatar>

         {/* Message Bubble */}
         <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
            <span className="text-[11px] text-[#8A8F98] mb-1 mx-1 font-mono tracking-wide">
               {!isSelf && (message.sender?.username || "Unknown") + " • "}
               {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <div className={`rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed border ${
               isSelf 
               ? "bg-[#5E6AD2] border-[#6872D9]/50 text-white shadow-[0_4px_16px_rgba(94,106,210,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-tr-sm" 
               : "bg-[#0F0F12] border-white/10 text-[#EDEDEF] shadow-[0_4px_16px_rgba(0,0,0,0.4)] rounded-tl-sm"
            }`}>
               {message.text}
            </div>
         </div>

      </div>
    </div>
  );
}

export default ChatMessage;
