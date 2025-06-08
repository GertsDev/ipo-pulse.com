import Link from 'next/link';
import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="   pb-12 md:pb-16">
      <div className="container px-4 mx-auto md:px-6">
        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--color-muted-foreground)]">
          <p>&copy; {currentYear} IPO Pulse Inc. All Rights Reserved.</p>
          <div className="flex mt-4 space-x-4 md:mt-0">
            {/* Social media icons can be added here later if desired */}
            <Link
              href="https://x.com/ipopulse"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-foreground)] transition-colors"
            >
              {/* Placeholder for X icon */} X
            </Link>
            <Link
              href="https://linkedin.com/company/ipopulse"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-foreground)] transition-colors"
            >
              {/* Placeholder for LinkedIn icon */} LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
