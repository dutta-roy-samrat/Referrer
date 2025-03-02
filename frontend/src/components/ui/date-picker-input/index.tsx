"use client";

import * as React from "react";
import { format } from "date-fns";
import { SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";

import StyledButton from "@/components/ui/button/styled-button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import CalendarIcon from "@/components/ui/icons/calender";
import dynamic from "next/dynamic";

const DatePicker = dynamic(
  () => import("@/components/ui/date-picker-input/picker"),
);

type DatePickerInputProps = {
  date: Date | undefined;
  id?: string;
  className?: string;
  setDate: SelectSingleEventHandler;
};

const DatePickerInput = React.forwardRef<HTMLButtonElement, DatePickerInputProps>(
  ({ date: selectedDate, setDate, id = "", className = "" }, ref) => {
    const defaultInputClas = cn(
      "h-[50px] justify-left text-left font-normal",
      !selectedDate && "text-muted-foreground",
    );

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
        <DatePicker setDate={setDate} selectedDate={selectedDate} />
      </Popover>
    );
  },
);

DatePickerInput.displayName = "DatePickerInput";

export default DatePickerInput;
