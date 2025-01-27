"use client";

import * as React from "react";
import { format } from "date-fns";
import { ActiveModifiers, SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";

import StyledButton from "@/components/ui/button/styled-button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CalendarIcon from "@/components/ui/icons/calender";

type DatePickerProps = {
  date: Date | undefined;
  id?: string;
  className?: string;
  setDate: SelectSingleEventHandler;
};

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ date: selectedDate, setDate, id = "", className = "" }, ref) => {
    const defaultInputClas = cn(
      "h-[50px] justify-left text-left font-normal",
      !selectedDate && "text-muted-foreground",
    );
    const isDisabledDate = (date: Date) => date < new Date();
    const handleSelect = (
      day: Date | undefined,
      selectedDay: Date,
      activeModifiers: ActiveModifiers,
      e: React.MouseEvent,
    ) => {
      console.log(day, selectedDay);
      if (!day) return;
      return setDate(day, selectedDay, activeModifiers, e);
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <StyledButton
            variant="outline"
            className={cn(defaultInputClas, className)}
            id={id}
            type="button"
            ref={ref}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "yyyy/MM/dd")
            ) : (
              <span>Choose an expiry date</span>
            )}
          </StyledButton>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" onModal>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={isDisabledDate}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

export default DatePicker;
