// components/DatePicker.tsx
'use client';
import React, { useState } from 'react';
import { format, isEqual, isSameMonth, isToday, parse } from 'date-fns';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  inputClassName?: string;
  calendarClassName?: string;
  dayClassName?: string;
  todayClassName?: string;
  selectedClassName?: string;
  disabledClassName?: string;
  monthFormat?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className = '',
  inputClassName = '',
  calendarClassName = '',
  dayClassName = '',
  todayClassName = '',
  selectedClassName = '',
  disabledClassName = '',
  monthFormat = 'MMMM yyyy',
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1));
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2">
      <button
        type="button"
        onClick={handlePrevMonth}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
      >
        <ChevronLeftIcon />
      </button>
      <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {format(currentMonth, monthFormat)}
      </span>
      <button
        type="button"
        onClick={handleNextMonth}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );

  const renderDays = () => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const isSelected = selectedDate && isEqual(date, selectedDate);
      const isCurrentMonth = isSameMonth(date, currentMonth);
      const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
      const isCurrentDay = isToday(date);

      days.push(
        <button
          key={i}
          type="button"
          onClick={() => handleDateClick(date)}
          disabled={isDisabled}
          className={`w-10 h-10 rounded-full focus:outline-none ${
            isSelected ? selectedClassName : ''
          } ${isCurrentMonth ? dayClassName : ''} ${isCurrentDay ? todayClassName : ''} ${
            isDisabled ? disabledClassName : ''
          }`}
        >
          {i}
        </button>
      );
    }

    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={selectedDate ? format(selectedDate, dateFormat) : ''}
        onClick={handleInputClick}
        readOnly
        className={`w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${inputClassName}`}
      />
      {isOpen && (
        <div className={`absolute z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mt-1 ${calendarClassName}`}>
          {renderHeader()}
          {renderDays()}
        </div>
      )}
    </div>
  );
};

const ChevronLeftIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default DatePicker;