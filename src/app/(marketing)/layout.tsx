'use client';

import { Footer } from '../../components/marketing/Footer';
import NavBar from '../../components/NavBar';

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
