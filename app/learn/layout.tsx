import { ReactNode } from 'react';

export default function CoursesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <main className="flex-grow container mx-auto py-8">         
            {children}
      </main>
    </div>
  );
}