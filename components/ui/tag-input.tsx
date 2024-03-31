'use client'
import * as React from "react";
import { cn } from "@/lib/utils";
import { Tag } from "@/lib/prisma";

export interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showList?: boolean;
  selectedTags: Tag[];
  onSelectTag: (tag: Tag) => void;
  onRemoveTag: (tag: Tag) => void;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ className, showList, selectedTags, onSelectTag, onRemoveTag, ...props }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<Tag[]>([]);

    const fetchTags = async (query: string) => {
      const res = await fetch(`/api/tags?query=${encodeURIComponent(query)}`);
      const tags = await res.json();
      setSuggestions(tags);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      fetchTags(query);
    };

    const handleTagSelect = (tag: Tag) => {
      onSelectTag(tag);
      setSearchQuery("");
      setSuggestions([]);
    };

    const handleCreateTag = async () => {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: searchQuery }),
      });
      if (res.ok) {
        const newTag = await res.json();
        onSelectTag(newTag);
        setSearchQuery("");
        setSuggestions([]);
      }
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
          autoComplete="off"
          {...props}
        />
        {selectedTags.length > 0 && showList && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center rounded-md bg-zinc-100 px-2 py-1 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {tag.name}
                <button
                  type="button"
                  className="ml-1 text-zinc-500 hover:text-zinc-700 focus:outline-none dark:text-zinc-400 dark:hover:text-zinc-200"
                  onClick={() => onRemoveTag(tag)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800 sm:text-sm">
            {suggestions.map((tag) => (
              <li
                key={tag.id}
                className={cn(
                  "relative cursor-default select-none py-2 pl-3 pr-9 text-zinc-900 dark:text-zinc-100",
                  selectedTags.some((selectedTag) => selectedTag.id === tag.id)
                    ? "bg-zinc-100 dark:bg-zinc-700"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-700"
                )}
                onClick={() => handleTagSelect(tag)}
              >
                {tag.name}
              </li>
            ))}
          </ul>
        )}
        {searchQuery && !suggestions.some((tag) => tag.name === searchQuery) && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800 sm:text-sm">
            <li
              className="relative cursor-default select-none py-2 pl-3 pr-9 text-zinc-900 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-700"
              onClick={handleCreateTag}
            >
              Create &quot;{searchQuery}&quot;
            </li>
          </ul>
        )}
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export { TagInput };