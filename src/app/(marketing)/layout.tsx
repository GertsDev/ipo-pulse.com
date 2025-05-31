'use client';

import NavBar from '@/components/NavBar';
import { Footer } from '../../components/marketing/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      {children}
      <Footer/>
    </>
  );
}
