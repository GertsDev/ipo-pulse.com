import Link from 'next/link';
import React from 'react';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <li>
      <Link
        href={href}
        className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200 text-sm"
      >
        {children}
      </Link>
    </li>
  );
};

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold  mb-4">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
};

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
