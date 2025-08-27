'use client';

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-1 py-2 border-b-2  md:px-8 backdrop-blur-md ">
      <Link href="/">
        <div className="flex items-center gap-3 ps-4">
          <Image
            className="dark:invert-0 invert"
            src="/logo.png"
            alt="IPO Pulse Logo"
            width={40}
            height={40}
          />
          <span className="text-2xl font-bold tracking-wide  ">IPO PULSE</span>
        </div>
      </Link>
      <div className="flex items-center h-16 gap-4 p-4">
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
  );
};

export default NavBar;
