
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {theme === 'light' ? (
        <>
          <Moon size={16} />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun size={16} />
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </Button>
  );
};

export default ThemeToggle;
