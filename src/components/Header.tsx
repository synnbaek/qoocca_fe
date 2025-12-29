'use client';

import Link from 'next/link';
import './Header.css';
import AuthSection from './AuthSection';

export default function Header() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        쿠카티처스
      </Link>
      <div className="navbar-links">
        <AuthSection />
      </div>
    </nav>
  );
}
