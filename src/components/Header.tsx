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

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 border-b border-border-gray/30 glass-panel shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Brand Section */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center -space-x-1.5">
                <div className="transform group-hover:rotate-6 transition-transform duration-300 w-10 h-10 relative bg-white rounded-full p-0.5 shadow-sm border border-border-gray/30 flex items-center justify-center">
                  <img
                    src="/liberia-seal.png"
                    alt="Republic of Liberia Seal"
                    className="w-9 h-9 object-contain"
                  />
                </div>
                <div className="transform group-hover:-rotate-6 transition-transform duration-300 z-10 w-9 h-9 relative bg-white rounded-full p-0.5 shadow-sm border border-border-gray/30 flex items-center justify-center">
                  <img
                    src="/clef-logo.png"
                    alt="CLEF Logo"
                    className="w-8 h-8 object-contain"
                  />
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
