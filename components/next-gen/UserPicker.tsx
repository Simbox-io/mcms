// components/UserPicker.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/prisma';

interface UserPickerProps {
    selectedUsers: User[];
    onChange: (users: User[]) => void;
    placeholder?: string;
    className?: string;
    id?: string;
}

const UserPicker: React.FC<UserPickerProps> = ({
    selectedUsers,
    onChange,
    placeholder = 'Search users...',
    className = '',
    id,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (inputValue.trim() !== '') {
                const response = await fetch(`/api/users?search=${inputValue}`);
                const users = await response.json();
                setSuggestions(users);
            } else {
                setSuggestions([]);
            }
        };
        fetchSuggestions();
    }, [inputValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleUserSelect = (user: User) => {
        console.log('User selected:', user);
        if (!selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
            onChange([...selectedUsers, user]);
        }
        setSuggestions([]);
        setInputValue('');
        inputRef.current?.focus();
    };

    const handleUserRemove = (userToRemove: User) => {
        onChange(selectedUsers.filter((user) => user.id !== userToRemove.id));
    };

    return (
        <div
            id={id}
            className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 flex flex-wrap relative ${className}`}
        >
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedUsers.map((user) => (
                    <span
                        key={user.id}
                        className="bg-blue-500 text-white rounded-md px-2 py-1 text-sm flex items-center"
                    >
                        <img
                            src={user.avatar || ''}
                            alt={user.username}
                            className="w-5 h-5 rounded-full mr-2"
                        />
                        {user.username}
                        <button
                            type="button"
                            className="ml-1 focus:outline-none hover:text-red-500 transition-colors duration-200"
                            onClick={() => handleUserRemove(user)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </span>
                ))}
            </div>
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => {
                    setIsFocused(true);
                }}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="flex-grow focus:outline-none bg-transparent text-gray-800 dark:text-gray-200 px-2 mb-3"
            />
            {isFocused && suggestions.length > 0 && (
                  <ul className="top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {suggestions.map((user) => (
                    <li
                      key={user.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onMouseDown={() => {
                        console.log('User selected:', user);
                        handleUserSelect(user);
                        setInputValue('');
                        inputRef.current?.focus();
                      }}
                    >
                      <img
                        src={user.avatar || ''}
                        alt={user.username}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span>{user.username}</span>
                    </li>
                  ))}
                </ul>
            )}
        </div>
    );
};

export default UserPicker;