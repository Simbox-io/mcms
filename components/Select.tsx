'use client'
import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  errorText?: string;
  className?: string;
  isMulti?: boolean;
  required?: boolean;
  value?: Option | Option[];
  onChange: (value: Option | Option[]) => void;
}

export default function Select({
  options,
  label,
  placeholder,
  disabled,
  errorText,
  className,
  isMulti,
  required,
  value,
  onChange,
}: SelectProps) {
  const [selected, setSelected] = useState<Option | Option[]>(
    value || (isMulti ? [] : options[0])
  );

  const handleChange = (selectedOption: Option | Option[]) => {
    setSelected(selectedOption);
    onChange(selectedOption);
  };

  return (
    <Listbox value={selected} onChange={handleChange} disabled={disabled} multiple={isMulti}>
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Listbox.Label>
          )}
          <div className={`relative mt-2 ${className}`}>
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white dark:bg-gray-800 py-1.5 pl-3 pr-10 text-left text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">
                {isMulti
                  ? (selected as Option[]).map((option) => option.label).join(', ')
                  : (selected as Option)?.label || placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-gray-100',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate'
                          )}
                        >
                          {option.label}
                        </span>
                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
          {errorText && <p className="mt-1 text-sm text-red-500">{errorText}</p>}
        </>
      )}
    </Listbox>
  );
}