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
    <header className="flex justify-between items-center ">
      <Link href="/">
        <div className="flex ps-4 gap-3 items-center">
          <Image
            className="dark:invert-0 invert"
            src="/logo.png"
            alt="IPO Pulse Logo"
            width={40}
            height={40}
          />
          <span className="text-2xl font-bold tracking-wide text-black dark:text-white">
            IPO PULSE
          </span>
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
