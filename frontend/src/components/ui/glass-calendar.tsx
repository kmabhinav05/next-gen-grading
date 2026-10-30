import * as React from "react";
import { Settings, Plus, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isSameDay, isToday, getDate, getDaysInMonth, startOfMonth } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- TYPE DEFINITIONS ---
export interface Day {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
}

export interface GlassCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onAddNote?: (date: Date) => void;
  onNewEvent?: (date: Date) => void;
  className?: string;
  title?: string;
}

// --- HELPER TO HIDE SCROLLBAR ---
const ScrollbarHide = () => (
  <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

// --- MAIN COMPONENT ---
export const GlassCalendar = React.forwardRef<HTMLDivElement, GlassCalendarProps>(
  ({ className, selectedDate: propSelectedDate, onDateSelect, onAddNote, onNewEvent, ...props }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(propSelectedDate || new Date());
    const [selectedDate, setSelectedDate] = React.useState(propSelectedDate || new Date());
    const [viewMode, setViewMode] = React.useState<"weekly" | "monthly">("monthly");

    // Generate all days for the current month
    const monthDays = React.useMemo(() => {
      const start = startOfMonth(currentMonth);
      const totalDays = getDaysInMonth(currentMonth);
      const days: Day[] = [];
      for (let i = 0; i < totalDays; i++) {
        const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
        days.push({
          date,
          isToday: isToday(date),
          isSelected: isSameDay(date, selectedDate),
        });
      }
      return days;
    }, [currentMonth, selectedDate]);

    const handleDateClick = (date: Date) => {
      setSelectedDate(date);
      onDateSelect?.(date);
    };

    const handlePrevMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(addMonths(currentMonth, 1));
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-[360px] rounded-3xl p-5 shadow-2xl overflow-hidden",
          "bg-slate-900/95 backdrop-blur-xl border border-white/10",
          "text-white font-sans transition-all duration-300",
          className
        )}
        {...props}
      >
        <ScrollbarHide />
        {/* Header: Tabs and Settings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 rounded-xl bg-black/40 p-1 border border-white/5">
            <button
              type="button"
              onClick={() => setViewMode("weekly")}
              className={cn(
                "rounded-lg px-3.5 py-1 text-xs font-bold transition-all",
                viewMode === "weekly"
                  ? "bg-white text-black shadow-md"
                  : "text-white/60 hover:text-white"
              )}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              className={cn(
                "rounded-lg px-3.5 py-1 text-xs font-bold transition-all",
                viewMode === "monthly"
                  ? "bg-white text-black shadow-md"
                  : "text-white/60 hover:text-white"
              )}
            >
              Monthly
            </button>
          </div>
          <button
            type="button"
            className="p-2 text-white/70 transition-colors hover:bg-white/10 rounded-full"
            title="Calendar Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Date Display and Navigation */}
        <div className="my-5 flex items-center justify-between">
          <div>
            <motion.p
              key={format(currentMonth, "MMMM-yyyy")}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70"
            >
              {format(currentMonth, "MMMM")}
            </motion.p>
            <span className="text-xs text-white/40 font-mono font-medium">
              {format(currentMonth, "yyyy")} • Selected: {format(selectedDate, "MMM d")}
            </span>
          </div>
          <div className="flex items-center space-x-1 bg-black/30 rounded-full p-1 border border-white/5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-full text-white/70 transition-colors hover:bg-white/10"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-full text-white/70 transition-colors hover:bg-white/10"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Monthly Calendar Grid */}
        <div className="overflow-x-auto scrollbar-hide -mx-5 px-5 py-2">
          <div className="flex space-x-3.5 min-w-max">
            {monthDays.map((day) => (
              <div
                key={format(day.date, "yyyy-MM-dd")}
                className="flex flex-col items-center space-y-1.5 flex-shrink-0"
              >
                <span className="text-[11px] font-bold text-white/40 uppercase">
                  {format(day.date, "E").charAt(0)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDateClick(day.date)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-2xl text-xs font-bold transition-all duration-200 relative select-none",
                    {
                      "bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 text-white shadow-lg shadow-pink-500/30 scale-105 ring-2 ring-white/20":
                        day.isSelected,
                      "hover:bg-white/15 text-white/90 bg-white/5 border border-white/5":
                        !day.isSelected,
                    }
                  )}
                >
                  {day.isToday && !day.isSelected && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-pink-400"></span>
                  )}
                  {getDate(day.date)}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Footer Actions */}
        <div className="mt-4 flex items-center justify-between space-x-4">
          <button
            type="button"
            onClick={() => onAddNote?.(selectedDate)}
            className="flex items-center space-x-2 text-xs font-medium text-white/70 transition-colors hover:text-white"
          >
            <Edit2 className="h-3.5 w-3.5 text-pink-400" />
            <span>Add a note...</span>
          </button>
          <button
            type="button"
            onClick={() => onNewEvent?.(selectedDate)}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-white/15 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:bg-white/10"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Event</span>
          </button>
        </div>
      </div>
    );
  }
);

GlassCalendar.displayName = "GlassCalendar";

export default GlassCalendar;
