"use client";

import { format, setHours, setMinutes } from "date-fns";
import { CalendarIcon, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/helpers/utils";

interface DateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disableTime?: boolean;
  minDate?: Date;
  id?: string;
  "aria-describedby"?: string;
}

function TimeSpinner({
  value,
  onChange,
  min,
  max,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const increment = useCallback(() => {
    onChange(value >= max ? min : value + 1);
  }, [value, min, max, onChange]);

  const decrement = useCallback(() => {
    onChange(value <= min ? max : value - 1);
  }, [value, min, max, onChange]);

  const startHold = (fn: () => void) => {
    fn();
    intervalRef.current = setInterval(fn, 120);
  };

  const stopHold = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return stopHold;
  }, [stopHold]);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        tabIndex={-1}
        onPointerDown={() => startHold(increment)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
        aria-label={`Increase ${label}`}
      >
        <ChevronUp className="size-4" />
      </button>
      <span className="text-sm font-medium tabular-nums w-7 text-center select-none">
        {String(value).padStart(2, "0")}
      </span>
      <button
        type="button"
        tabIndex={-1}
        onPointerDown={() => startHold(decrement)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
        aria-label={`Decrease ${label}`}
      >
        <ChevronDown className="size-4" />
      </button>
    </div>
  );
}

function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date & time",
  disabled,
  disableTime,
  minDate,
  id,
  "aria-describedby": ariaDescribedBy,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const hours = value?.getHours() ?? 0;
  const minutes = value?.getMinutes() ?? 0;

  const handleDateSelect = (day: Date | undefined) => {
    if (!day) return;
    const updated = new Date(day);
    updated.setHours(hours, minutes, 0, 0);
    onChange(updated);
  };

  const handleHoursChange = (h: number) => {
    if (!value) {
      const now = new Date();
      now.setHours(h, minutes, 0, 0);
      onChange(now);
      return;
    }
    onChange(setHours(value, h));
  };

  const handleMinutesChange = (m: number) => {
    if (!value) {
      const now = new Date();
      now.setHours(hours, m, 0, 0);
      onChange(now);
      return;
    }
    onChange(setMinutes(value, m));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          className={cn(
            "w-full justify-start text-left font-normal h-9",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          {value ? (
            <span className="truncate">{format(value, "MMM d, yyyy  hh:mm a")}</span>
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={minDate ? { before: minDate } : undefined}
          defaultMonth={value}
          initialFocus
        />
        <Separator />
        <div
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-3",
            disableTime && "opacity-50 pointer-events-none",
          )}
          aria-disabled={disableTime}
        >
          <Clock className="size-4 text-muted-foreground shrink-0" />
          <TimeSpinner value={hours} onChange={handleHoursChange} min={0} max={23} label="hours" />
          <span className="text-sm font-bold text-muted-foreground select-none">:</span>
          <TimeSpinner
            value={minutes}
            onChange={handleMinutesChange}
            min={0}
            max={59}
            label="minutes"
          />
          <span className="text-xs text-muted-foreground ml-1 select-none">
            {hours >= 12 ? "PM" : "AM"}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DateTimePicker };
export type { DateTimePickerProps };
