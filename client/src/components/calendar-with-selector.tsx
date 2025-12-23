import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CalendarWithSelectorProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function CalendarWithSelector({
  selected,
  onSelect,
  disabled,
  className,
}: CalendarWithSelectorProps) {
  const [year, setYear] = useState(selected?.getFullYear() ?? new Date().getFullYear());
  const [month, setMonth] = useState(selected?.getMonth() ?? new Date().getMonth());

  const currentDate = useMemo(() => {
    return new Date(year, month, 1);
  }, [year, month]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let i = currentYear - 50; i <= currentYear + 10; i++) {
      yearArray.push(i);
    }
    return yearArray;
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onSelect(date);
      // Update year and month when a date is selected
      setYear(date.getFullYear());
      setMonth(date.getMonth());
    }
  };

  return (
    <div className={`space-y-4 p-4 ${className || ""}`}>
      <div className="flex gap-2">
        <Select value={year.toString()} onValueChange={(val) => setYear(parseInt(val))}>
          <SelectTrigger className="w-1/2 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="h-[200px]">
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()} className="text-sm">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={month.toString()} onValueChange={(val) => setMonth(parseInt(val))}>
          <SelectTrigger className="w-1/2 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, idx) => (
              <SelectItem key={idx} value={idx.toString()} className="text-sm">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Calendar
        mode="single"
        selected={selected}
        onSelect={handleDateSelect}
        disabled={disabled}
        month={currentDate}
        onMonthChange={() => {}}
      />
    </div>
  );
}
