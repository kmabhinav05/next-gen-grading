import * as React from "react";
import { Settings, Plus, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isSameDay, isToday } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- TYPE DEFINITIONS ---
export interface Day {
  date: Date;
  isCurrentMonth: boolean;
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

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// --- MAIN COMPONENT ---
export const GlassCalendar = React.forwardRef<HTMLDivElement, GlassCalendarProps>(
  ({ className, selectedDate: propSelectedDate, onDateSelect, onAddNote, onNewEvent, ...props }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(propSelectedDate || new Date());
    const [selectedDate, setSelectedDate] = React.useState(propSelectedDate || new Date());
    const [viewMode, setViewMode] = React.useState<"weekly" | "monthly">("monthly");

    React.useEffect(() => {
      if (propSelectedDate) {
        setSelectedDate(propSelectedDate);
        setCurrentMonth(propSelectedDate);
      }
    }, [propSelectedDate]);

    // Monthly 42-day grid (6 rows of 7, matching Windows 11 calendar layout)
    const monthGridDays = React.useMemo(() => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday
      const startDate = new Date(year, month, 1 - firstDayOfWeek);

      const days: Day[] = [];
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
        days.push({
          date,
          isCurrentMonth: date.getMonth() === month,
          isToday: isToday(date),
          isSelected: isSameDay(date, selectedDate),
        });
      }
      return days;
    }, [currentMonth, selectedDate]);

    // Weekly 7-day grid for the active week
    const weekGridDays = React.useMemo(() => {
      const baseDate = selectedDate || currentMonth;
      const dayOfWeek = baseDate.getDay(); // 0 = Sunday
      const weekStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - dayOfWeek);

      const days: Day[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
        days.push({
          date,
          isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
          isToday: isToday(date),
          isSelected: isSameDay(date, selectedDate),
        });
      }
      return days;
    }, [selectedDate, currentMonth]);

    const displayDays = viewMode === "weekly" ? weekGridDays : monthGridDays;

    const handleDateClick = (date: Date) => {
      setSelectedDate(date);
      if (date.getMonth() !== currentMonth.getMonth() || date.getFullYear() !== currentMonth.getFullYear()) {
        setCurrentMonth(date);
      }
      onDateSelect?.(date);
    };

    const handlePrev = () => {
      if (viewMode === "weekly") {
        const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 7);
        setSelectedDate(newDate);
        setCurrentMonth(newDate);
        onDateSelect?.(newDate);
      } else {
        setCurrentMonth(subMonths(currentMonth, 1));
      }
    };

    const handleNext = () => {
      if (viewMode === "weekly") {
        const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 7);
        setSelectedDate(newDate);
        setCurrentMonth(newDate);
        onDateSelect?.(newDate);
      } else {
        setCurrentMonth(addMonths(currentMonth, 1));
      }
    };

    const handleJumpToToday = () => {
      const today = new Date();
      setSelectedDate(today);
      setCurrentMonth(today);
      onDateSelect?.(today);
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
        {/* Header: Tabs and Settings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 rounded-xl bg-black/40 p-1 border border-white/5">
            <button
              type="button"
              onClick={() => setViewMode("weekly")}
              className={cn(
                "rounded-lg px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
                viewMode === "weekly"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white/60 hover:text-white"
              )}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              className={cn(
                "rounded-lg px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
                viewMode === "monthly"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white/60 hover:text-white"
              )}
            >
              Monthly
            </button>
          </div>
          <button
            type="button"
            onClick={handleJumpToToday}
            className="p-2 text-white/70 transition-colors hover:bg-white/10 rounded-full hover:text-white cursor-pointer"
            title="Jump to Today"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Date Display and Navigation */}
        <div className="my-5 flex items-center justify-between">
          <div>
            <motion.p
              key={format(currentMonth, "MMMM-yyyy")}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/75"
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
              onClick={handlePrev}
              className="p-1.5 rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
              title={viewMode === "weekly" ? "Previous Week" : "Previous Month"}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
              title={viewMode === "weekly" ? "Next Week" : "Next Month"}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 7-Column Weekday Headers (Su Mo Tu We Th Fr Sa) */}
        <div className="grid grid-cols-7 text-center mb-2">
          {WEEKDAYS.map((dayName) => (
            <span
              key={dayName}
              className="text-[11px] font-bold text-white/40 tracking-wider uppercase select-none"
            >
              {dayName}
            </span>
          ))}
        </div>

        {/* 7-Column Days Grid (Full month calendar matching Windows 11 flyout) */}
        <motion.div
          key={`${viewMode}-${format(currentMonth, "yyyy-MM")}-${viewMode === "weekly" ? format(selectedDate, "yyyy-ww") : ""}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-7 gap-y-2 place-items-center"
        >
          {displayDays.map((day) => {
            const isSelected = isSameDay(day.date, selectedDate);
            const isCurrentMonth = day.isCurrentMonth;
            const isCurrentToday = isToday(day.date);

            return (
              <button
                key={format(day.date, "yyyy-MM-dd")}
                type="button"
                onClick={() => handleDateClick(day.date)}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold select-none cursor-pointer transition-all duration-150",
                  isSelected
                    ? "bg-cyan-400 text-slate-950 font-extrabold shadow-lg shadow-cyan-400/35 scale-105 ring-2 ring-cyan-300/40"
                    : isCurrentMonth
                    ? "text-white/90 hover:bg-white/15 hover:text-white"
                    : "text-white/25 hover:text-white/60 hover:bg-white/5",
                  isCurrentToday && !isSelected && "ring-1 ring-cyan-400/40"
                )}
                title={format(day.date, "EEEE, MMMM d, yyyy")}
              >
                {day.date.getDate()}
                {isCurrentToday && !isSelected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Divider */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Footer Actions */}
        <div className="mt-4 flex items-center justify-between space-x-4">
          <button
            type="button"
            onClick={() => onAddNote?.(selectedDate)}
            className="flex items-center space-x-2 text-xs font-medium text-white/70 transition-colors hover:text-white cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5 text-pink-400" />
            <span>Add a note...</span>
          </button>
          <button
            type="button"
            onClick={() => onNewEvent?.(selectedDate)}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-white/15 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
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
