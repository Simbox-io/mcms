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
        <span className="text-gray-700">Switch to Dark Mode</span>
      ) : (
        <span className="text-yellow-400">Switch to Light Mode</span>
      )}
    </button>
  );
};

export default ThemeToggle;