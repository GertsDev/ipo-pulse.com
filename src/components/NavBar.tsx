import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from './themeToggle';

const NavBar = () => {
  return (
    <header className="flex justify-between items-center ">
      <Link href="/">
        <div className="text-2xl font-bold flex text-dark-blue ps-4 gap-1.5 items-center">
          <Image
            className="dark:invert"
            src="/logo.png"
            alt="pulse-ipo logo"
            width="38"
            height="38"
            priority
          />
          <span>Pulse - IPO</span>
        </div>
      </Link>
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
  );
};

export default NavBar;
