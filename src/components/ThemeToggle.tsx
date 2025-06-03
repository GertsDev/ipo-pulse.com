'use client';

import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="size-9" aria-hidden="true" />; // Placeholder to maintain layout
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      //key={isDark ? 'sun' : 'moon'}
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="cursor-pointer group"
    >
      <motion.span
        animate={{
          rotate: isDark ? 180 : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 50 }}
        className="flex items-center justify-center "
      >
        {isDark ? <Sun className="size-6 " /> : <Moon className="size-6 " />}
      </motion.span>
    </Button>
  );
};

export default ThemeToggle;
