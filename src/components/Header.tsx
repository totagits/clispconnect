'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DemoUser, getRolePermissions } from '../lib/session';
import RoleSwitcher from './RoleSwitcher';
import { LayoutDashboard, Lock, Globe } from 'lucide-react';

interface HeaderProps {
  currentUser: DemoUser;
}

export default function Header({ currentUser }: HeaderProps) {
  const pathname = usePathname();
  const permissions = getRolePermissions(currentUser.role);

  // MIA Seal Vector SVG
  const MiaSeal = () => (
    <svg className="w-10 h-10 text-sand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#0A3D91" stroke="#D4A73B" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#D4A73B" strokeWidth="1" strokeDasharray="3,3" />
      {/* Palm Tree Shield Silhouette */}
      <path d="M48 65 V45 C48 40 40 40 38 34 C42 36 47 38 50 42 C53 38 58 36 62 34 C60 40 52 40 52 45 V65" fill="#D4A73B" />
      {/* Water and Ship */}
      <path d="M30 65 Q40 63 50 65 Q60 67 70 65" stroke="#D4A73B" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 60 L44 57 L46 60 Z" fill="#D4A73B" />
      {/* Stars */}
      <path d="M50 20 L52 25 L57 25 L53 28 L55 33 L50 30 L45 33 L47 28 L43 25 L48 25 Z" fill="#D4A73B" />
      {/* Circular text representation */}
      <path id="seal-text-path" d="M20,50 A30,30 0 1,1 80,50" fill="none" />
      <text fill="#D4A73B" fontSize="6.5" fontWeight="bold" letterSpacing="1.2">
        <textPath href="#seal-text-path" startOffset="50%" textAnchor="middle">
          REPUBLIC OF LIBERIA
        </textPath>
      </text>
    </svg>
  );

  // CLEF Logo Vector SVG
  const ClefLogo = () => (
    <svg className="w-9 h-9 text-coast-teal" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#1D8F8A" strokeWidth="2" />
      {/* Stylized Hands holding a community leaf */}
      <path d="M35 65 C35 55 45 45 50 40 C55 45 65 55 65 65 C65 75 55 80 50 80 C45 80 35 75 35 65 Z" fill="#1D8F8A" fillOpacity="0.2" stroke="#1D8F8A" strokeWidth="3" />
      <path d="M43 55 C43 45 50 35 50 35 C50 35 57 45 57 55" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
      {/* Small glowing gold community node */}
      <circle cx="50" cy="30" r="6" fill="#D4A73B" className="pulse-glow" />
    </svg>
  );

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 border-b border-border-gray/30 glass-panel shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Brand Section */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center -space-x-2">
                <div className="transform group-hover:rotate-6 transition-transform duration-300">
                  <MiaSeal />
                </div>
                <div className="transform group-hover:-rotate-6 transition-transform duration-300 z-10">
                  <ClefLogo />
                </div>
              </div>
              <div className="flex flex-col pl-1">
                <span className="text-sm sm:text-base font-extrabold text-primary-indigo tracking-tight font-display">
                  CLISP<span className="text-coast-teal">Connect</span>
                </span>
                <span className="text-[9px] uppercase font-bold text-body-gray leading-none">
                  MIA & CLEF Liberia
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/about"
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                pathname === '/about'
                  ? 'bg-primary-indigo/5 text-primary-indigo font-bold'
                  : 'text-body-gray hover:text-primary-indigo hover:bg-canvas-light'
              }`}
            >
              About CLISP
            </Link>
            <Link
              href="/registry"
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                pathname.startsWith('/registry')
                  ? 'bg-primary-indigo/5 text-primary-indigo font-bold'
                  : 'text-body-gray hover:text-primary-indigo hover:bg-canvas-light'
              }`}
            >
              Public Registry (NRCL)
            </Link>
            <Link
              href="/#pilot"
              className="px-3 py-2 rounded-xl text-xs font-semibold tracking-wide text-body-gray hover:text-primary-indigo hover:bg-canvas-light transition-all"
            >
              District #10 Pilot
            </Link>
            <Link
              href="/#faq"
              className="px-3 py-2 rounded-xl text-xs font-semibold tracking-wide text-body-gray hover:text-primary-indigo hover:bg-canvas-light transition-all"
            >
              FAQs
            </Link>
            <Link
              href="/#contact"
              className="px-3 py-2 rounded-xl text-xs font-semibold tracking-wide text-body-gray hover:text-primary-indigo hover:bg-canvas-light transition-all"
            >
              Contact
            </Link>
          </nav>

          {/* User Console Control & Switcher */}
          <div className="flex items-center gap-3">
            {permissions.canViewConsole ? (
              <Link
                href="/console"
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  pathname.startsWith('/console')
                    ? 'bg-primary-indigo text-white hover:bg-hover-indigo'
                    : 'bg-primary-indigo/10 text-primary-indigo hover:bg-primary-indigo/20 border border-primary-indigo/10'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Command Center</span>
                <span className="sm:hidden">Console</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  alert("Access Restricted: Public Visitors do not have console accounts. Please use the 'Demo Role' switcher on the right to simulate an administrator or leader profile!");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold bg-body-gray/10 text-body-gray border border-body-gray/10 cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5 text-body-gray/70" />
                <span className="hidden sm:inline">Command Center</span>
                <span className="sm:hidden">Console</span>
              </button>
            )}

            <div className="border-l border-border-gray/30 h-6 mx-1 hidden sm:block"></div>

            <RoleSwitcher currentUser={currentUser} />
          </div>

        </div>
      </div>
    </header>
  );
}
