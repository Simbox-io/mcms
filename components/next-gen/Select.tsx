'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Listbox
      as="div"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`relative ${className}`}
      ref={selectRef}
    >
      {({ open }) => (
        <>
          <Listbox.Button
            className={`relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 sm:text-sm ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`block truncate ${selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              static
              className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `${active ? 'text-blue-900 bg-blue-100 dark:text-blue-100 dark:bg-blue-900' : 'text-gray-900 dark:text-gray-100'}
                     cursor-default select-none relative py-2 pl-10 pr-4`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                        {option.label}
                      </span>
                      {selected ? (
                        <span
                          className={`${active ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-400'}
                           absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
};

export default Select;