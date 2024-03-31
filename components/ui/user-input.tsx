'use client'
import * as React from "react";
import { cn } from "@/lib/utils";
import { User } from "@/lib/prisma";

export interface UserInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showList?: boolean;
  selectedUsers: User[];
  onSelectUser: (user: User) => void;
  onRemoveUser: (user: User) => void;
}

const UserInput = React.forwardRef<HTMLInputElement, UserInputProps>(
  ({ className, showList, selectedUsers, onSelectUser, onRemoveUser, ...props }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<User[]>([]);

    const fetchUsers = async (query: string) => {
      const res = await fetch(`/api/users?search=${encodeURIComponent(query)}`);
      const users = await res.json();
      setSuggestions(users);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      fetchUsers(query);
    };

    const handleUserSelect = (user: User) => {
      onSelectUser(user);
      setSearchQuery("");
      setSuggestions([]);
    };

    return (
      <div className="relative">
        <input
          type="text"
          className={cn(
            "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
            className
          )}
          ref={ref}
          value={searchQuery}
          onChange={handleInputChange}
          {...props}
          autoComplete="off"
        />
        {selectedUsers.length > 0 && showList && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center rounded-md bg-zinc-100 px-2 py-1 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {user.firstName} {user.lastName}
                <button
                  type="button"
                  className="ml-1 text-zinc-500 hover:text-zinc-700 focus:outline-none dark:text-zinc-400 dark:hover:text-zinc-200"
                  onClick={() => onRemoveUser(user)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800 sm:text-sm">
            {suggestions.map((user) => (
              <li
                key={user.id}
                className={cn(
                  "relative cursor-default select-none py-2 pl-3 pr-9 text-zinc-900 dark:text-zinc-100",
                  selectedUsers.some((selectedUser) => selectedUser.id === user.id)
                    ? "bg-zinc-100 dark:bg-zinc-700"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-700"
                )}
                onClick={() => handleUserSelect(user)}
              >
                {user.firstName} {user.lastName} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

UserInput.displayName = "UserInput";

export { UserInput };