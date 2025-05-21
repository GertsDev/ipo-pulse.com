'use client';

import { ThemeToggle } from '@/components/theme-toogle';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="flex justify-between items-center ">
        <div className="text-xl font-bold flex text-dark-blue ps-4 gap-0.5 ">
          <Image
            className="dark:invert"
            src="/logo.png"
            alt="pulse-ipo logo"
            width="38"
            height="38"
            priority
          />
          Pulse - IPO
        </div>
        <div className="flex items-center p-4 gap-4 h-16">
          <ThemeToggle />
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      {children}
    </>
  );
}
