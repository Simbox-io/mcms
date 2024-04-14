import { Button } from '@/components/ui/button';

export function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-100 dark:bg-zinc-800 p-4">
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