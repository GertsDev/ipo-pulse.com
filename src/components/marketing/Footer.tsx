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
      <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-background)] border-t border-[var(--color-border)] text-[var(--color-foreground)] py-12 md:py-16">
      <div className="container px-4 mx-auto md:px-6">
        {/* Top section with link columns - will be added in the next step */}
        <div className="grid grid-cols-2 gap-8 mb-10 md:grid-cols-4">
          {/* Placeholder for link columns */}
        </div>

        {/* Bottom section for copyright and minimal links */}
        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--color-muted-foreground)]">
          <p>&copy; {currentYear} IPO Pulse Inc. All Rights Reserved.</p>
          <div className="flex mt-4 space-x-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-[var(--color-foreground)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-[var(--color-foreground)] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
