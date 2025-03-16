import { Calendar } from "@/components/ui/calendar";
import { PopoverContent } from "@/components/ui/popover";

import { ActiveModifiers, SelectSingleEventHandler } from "react-day-picker";

type DatePickerProps = {
  selectedDate: Date | undefined;
  setDate: SelectSingleEventHandler;
};

const DatePicker = ({ setDate, selectedDate }: DatePickerProps) => {
  const isDisabledDate = (date: Date) => date < new Date();
  const handleSelect = (
    day: Date | undefined,
    selectedDay: Date,
    activeModifiers: ActiveModifiers,
    e: React.MouseEvent,
  ) => {
    if (!day) return;
    return setDate(day, selectedDay, activeModifiers, e);
  };

  return (
    <PopoverContent className="w-auto p-0" onModal>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        disabled={isDisabledDate}
      />
    </PopoverContent>
  );
};

export default DatePicker;
