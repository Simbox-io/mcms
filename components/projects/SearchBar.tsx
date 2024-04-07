// components/SearchBar.tsx
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder="Search projects..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}