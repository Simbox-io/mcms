import { Button } from '@/components/ui/button';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
      {/* Sidebar content */}
      <nav>
        {/* Navigation items */}
        <Button>Home</Button>
        <Button>Projects</Button>
        <Button>Courses</Button>
        {/* ... */}
      </nav>
    </aside>
  );
}