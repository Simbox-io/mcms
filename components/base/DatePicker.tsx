import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay, isWithinInterval } from 'date-fns';

interface DatePickerProps {
  selected?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  inputClassName?: string;
  calendarClassName?: string;
  dayClassName?: string;
  selectedDayClassName?: string;
  disabledDayClassName?: string;
  monthYearClassName?: string;
  prevMonthClassName?: string;
  nextMonthClassName?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  minDate,
  maxDate,
  className = '',
  inputClassName = '',
  calendarClassName = '',
  dayClassName = '',
  selectedDayClassName = '',
  disabledDayClassName = '',
  monthYearClassName = '',
  prevMonthClassName = '',
  nextMonthClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(selected || new Date());

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isSelected = selected && isSameDay(date, selected);
      const isDisabled =
        (minDate && date < minDate) || (maxDate && date > maxDate);

      days.push(
        <button
          key={i}
          className={`day ${dayClassName} ${isSelected ? selectedDayClassName : ''} ${
            isDisabled ? disabledDayClassName : ''
          }`}
          onClick={() => handleDateChange(date)}
          disabled={isDisabled}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={`calendar ${calendarClassName}`}>
        <div className="header">
          <button
            className={`prev-month ${prevMonthClassName}`}
            onClick={handlePrevMonth}
            disabled={minDate && isWithinInterval(currentDate, { start: minDate, end: minDate })}
          >
            &lt;
          </button>
          <span className={`month-year ${monthYearClassName}`}>
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            className={`next-month ${nextMonthClassName}`}
            onClick={handleNextMonth}
            disabled={maxDate && isWithinInterval(currentDate, { start: maxDate, end: maxDate })}
          >
            &gt;
          </button>
        </div>
        <div className="weekdays">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
        <div className="days">{days}</div>
      </div>
    );
  };

  return (
    <div className={`date-picker ${className}`}>
      <input
        type="text"
        value={selected ? format(selected, 'MM/dd/yyyy') : ''}
        onClick={toggleCalendar}
        readOnly
        className={`input ${inputClassName}`}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="calendar-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {renderCalendar()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;