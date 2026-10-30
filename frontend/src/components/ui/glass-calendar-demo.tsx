import * as React from "react";
import { GlassCalendar } from "@/components/ui/glass-calendar";

export default function GlassCalendarDemo() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const backgroundImageUrl =
    "https://cdn.21st.dev/assets/mirror/6b/6b26d74b493809987a1077fff2770ce4fe1914e3032b286d07e410d034884e13.jpg";

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center p-4 bg-slate-900"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <GlassCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        className="max-w-[360px] transform transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
}

export { GlassCalendarDemo };
