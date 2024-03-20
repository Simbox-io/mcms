'use client';
import React, { useState } from 'react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
  inputClassName?: string;
  popupClassName?: string;
  format?: '12h' | '24h';
  hourStep?: number;
  minuteStep?: number;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  className = '',
  inputClassName = '',
  popupClassName = '',
  format = '12h',
  hourStep = 1,
  minuteStep = 1,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(value);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
    onChange(newTime);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    let formattedTime = time;

    if (format === '12h') {
      const suffix = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
      const formattedHours = parseInt(hours, 10) % 12 || 12;
      formattedTime = `${formattedHours}:${minutes} ${suffix}`;
    }

    return formattedTime;
  };

  const generateTimeOptions = () => {
    const options = [];

    for (let hour = 0; hour < 24; hour += hourStep) {
      for (let minute = 0; minute < 60; minute += minuteStep) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(
          <div
            key={time}
            className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
              selectedTime === time ? 'bg-blue-500 text-white' : ''
            }`}
            onClick={() => handleTimeChange(time)}
          >
            {formatTime(time)}
          </div>
        );
      }
    }

    return options;
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={formatTime(selectedTime)}
        onClick={handleInputClick}
        readOnly
        className={`w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${inputClassName}`}
      />
      {isOpen && (
        <div className={`absolute z-10 bg-white dark:bg-gray-800 rounded-md shadow-lg mt-1 overflow-y-auto max-h-48 ${popupClassName}`}>
          {generateTimeOptions()}
        </div>
      )}
    </div>
  );
};

export default TimePicker;