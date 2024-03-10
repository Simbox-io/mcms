// components/DatePicker.tsx
'use client'
import React, { useState } from 'react';
import { format, isEqual, isSameMonth, isToday, parse } from 'date-fns';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, className = '' }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onChange(date);
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
        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      >
        &lt;
      </button>
      <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {format(currentMonth, 'MMMM yyyy')}
      </span>
      <button
        type="button"
        onClick={handleNextMonth}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      >
        &gt;
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
      const isCurrentDay = isToday(date);

      days.push(
        <button
          key={i}
          type="button"
          onClick={() => handleDateClick(date)}
          className={`w-10 h-10 rounded-full ${
            isSelected
              ? 'bg-blue-500 text-white'
              : isCurrentMonth
              ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-400 dark:text-gray-600'
          } ${isCurrentDay ? 'font-semibold' : ''}`}
        >
          {i}
        </button>
      );
    }

    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ${className}`}>
      {renderHeader()}
      {renderDays()}
    </div>
  );
};

export default DatePicker;