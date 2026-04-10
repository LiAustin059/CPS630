import { Search, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function EventSearchFilter({ search, setSearch, filterDate, setFilterDate }) {
  return (
    <Card className="glass-card shadow-sm border-transparent bg-transparent relative overflow-hidden group">
      {/* Animated gradient top border on hover */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(94,106,210,0.5), transparent)'
        }}
      />
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center relative z-10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F98]" />
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full bg-[#0F0F12] border-white/10 text-[#EDEDEF] placeholder:text-[#8A8F98] h-11 focus-visible:ring-1 focus-visible:border-primary transition-all rounded-lg"
          />
        </div>
        <div className="w-full md:w-[220px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-[#0F0F12] border-white/10 text-white h-11 hover:bg-white/[0.05] hover:text-[#EDEDEF] transition-all rounded-lg",
                  !filterDate && "text-[#8A8F98]"
                )}
              >
                <CalendarIcon className="mr-3 h-4 w-4 text-[#5E6AD2]" />
                {filterDate ? format(new Date(filterDate), "PPP") : <span>Filter by date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-white/10 bg-[#0a0a0c] text-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_80px_rgba(94,106,210,0.1)]">
              <ShadcnCalendar
                mode="single"
                selected={filterDate ? new Date(filterDate) : undefined}
                onSelect={(date) => setFilterDate(date ? format(date, 'yyyy-MM-dd') : '')}
                initialFocus
                className="bg-transparent"
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}

export default EventSearchFilter;
