// components/ThemeToggle.tsx
'use client';
import { useTheme } from 'next-themes';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <span className="h-6 w-6 text-gray-700">Dark</span>
      ) : (
        <span className="h-6 w-6 text-yellow-400">Light</span>
      )}
    </button>
  );
};

export default ThemeToggle;