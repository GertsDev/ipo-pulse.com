'use client';

import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !theme) {
    return <div className="size-9" />; // Placeholder to maintain layout
  }

  const isDark = theme === 'dark';

  return (
    <Button
      key={isDark ? 'sun' : 'moon'}
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="group cursor-pointer"
    >
      <motion.span
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 50 }}
        className="flex items-center justify-center "
      >
        {isDark ? <Sun className="size-6 " /> : <Moon className="size-6 " />}
      </motion.span>
    </Button>
  );
};

export default ThemeToggle;
