// components/DatePicker.tsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  selected: Date;
  onChange: (date: Date | null) => void;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  startDate?: Date;
  endDate?: Date;
  dateFormat?: string;
  className?: string;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
  dateFormat = 'MMM d, yyyy',
  className = '',
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      selectsStart={selectsStart}
      selectsEnd={selectsEnd}
      startDate={startDate}
      endDate={endDate}
      dateFormat={dateFormat}
      className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default CustomDatePicker;