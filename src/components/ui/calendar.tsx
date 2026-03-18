"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react@0.487.0";
import { DayPicker } from "react-day-picker@8.10.1";
import { vi } from 'date-fns/locale';

import { cn } from "./utils";
import { buttonVariants } from "./button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onClear?: () => void;
  onToday?: () => void;
  showFooter?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onClear,
  onToday,
  showFooter = true,
  ...props
}: CalendarProps) {
  const [selectedMonth, setSelectedMonth] = React.useState<Date>(
    props.selected instanceof Date ? props.selected : new Date()
  );

  // Generate year range (current year ± 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  
  // Month names in Vietnamese
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const CustomCaption = ({ displayMonth }: { displayMonth: Date }) => {
    const [showMonthDropdown, setShowMonthDropdown] = React.useState(false);
    const [showYearDropdown, setShowYearDropdown] = React.useState(false);

    return (
      <div className="flex justify-center items-center gap-1 relative py-2">
        {/* Previous Month Button */}
        <button
          type="button"
          onClick={() => {
            const newMonth = new Date(displayMonth);
            newMonth.setMonth(displayMonth.getMonth() - 1);
            setSelectedMonth(newMonth);
          }}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          )}
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Month Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowMonthDropdown(!showMonthDropdown);
              setShowYearDropdown(false);
            }}
            className="flex items-center gap-1 px-2 py-1 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
          >
            {months[displayMonth.getMonth()]}
            <ChevronDown className="size-3" />
          </button>

          {showMonthDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMonthDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto min-w-[120px]">
                <div className="p-2 space-y-1">
                  {months.map((month, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        const newMonth = new Date(displayMonth);
                        newMonth.setMonth(index);
                        setSelectedMonth(newMonth);
                        setShowMonthDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-sm rounded hover:bg-gray-100 transition-colors text-left whitespace-nowrap",
                        displayMonth.getMonth() === index && "bg-[#4DBFAD] text-white hover:bg-[#3da999]"
                      )}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Year Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowYearDropdown(!showYearDropdown);
              setShowMonthDropdown(false);
            }}
            className="flex items-center gap-1 px-2 py-1 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
          >
            {displayMonth.getFullYear()}
            <ChevronDown className="size-3" />
          </button>

          {showYearDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowYearDropdown(false)}
              />
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        const newMonth = new Date(displayMonth);
                        newMonth.setFullYear(year);
                        setSelectedMonth(newMonth);
                        setShowYearDropdown(false);
                      }}
                      className={cn(
                        "w-full px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors text-left",
                        displayMonth.getFullYear() === year && "bg-[#4DBFAD] text-white hover:bg-[#3da999]"
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Next Month Button */}
        <button
          type="button"
          onClick={() => {
            const newMonth = new Date(displayMonth);
            newMonth.setMonth(displayMonth.getMonth() + 1);
            setSelectedMonth(newMonth);
          }}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          )}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={vi}
        month={selectedMonth}
        onMonthChange={setSelectedMonth}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col sm:flex-row gap-2",
          month: "flex flex-col gap-4",
          caption: "flex justify-center pt-1 relative items-center w-full",
          caption_label: "hidden", // Hide default label since we have custom caption
          nav: "hidden", // Hide default navigation since we have custom buttons
          table: "w-full border-collapse space-x-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md",
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 font-normal aria-selected:opacity-100",
          ),
          day_range_start:
            "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
          day_range_end:
            "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
          day_selected:
            "bg-[#4DBFAD] text-white hover:bg-[#3da999] hover:text-white focus:bg-[#4DBFAD] focus:text-white",
          day_today: "bg-blue-100 text-blue-900 font-semibold",
          day_outside:
            "day-outside text-muted-foreground aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          Caption: CustomCaption,
          IconLeft: ({ className, ...props }) => (
            <ChevronLeft className={cn("size-4", className)} {...props} />
          ),
          IconRight: ({ className, ...props }) => (
            <ChevronRight className={cn("size-4", className)} {...props} />
          ),
        }}
        {...props}
      />
      
      {/* Footer with Clear and Today buttons */}
      {showFooter && (
        <div className="flex justify-between items-center px-3 pb-3 pt-0 border-t border-gray-200">
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-gray-600 hover:text-[#4DBFAD] font-medium transition-colors"
          >
            Xóa
          </button>
          <button
            type="button"
            onClick={onToday}
            className="text-sm text-[#2563B4] hover:text-[#4DBFAD] font-medium transition-colors"
          >
            Hôm nay
          </button>
        </div>
      )}
    </div>
  );
}

export { Calendar };