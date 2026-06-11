'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DemoUser, getRolePermissions } from '../lib/session';
import { handleSignOut } from '../app/actions';
import { LayoutDashboard, Lock, Globe, LogOut, User } from 'lucide-react';

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
              <div className="flex items-center -space-x-2">
                <div className="transform group-hover:rotate-6 transition-transform duration-300 w-10 h-10 relative bg-white rounded-full shadow-sm border border-border-gray/30 flex items-center justify-center overflow-hidden">
                  <img
                    src="/mlg-logo.png"
                    alt="Ministry of Local Government Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="transform group-hover:-rotate-6 transition-transform duration-300 z-10 w-10 h-10 relative bg-white rounded-full shadow-sm border border-border-gray/30 flex items-center justify-center overflow-hidden">
                  <img
                    src="/clef-logo.png"
                    alt="CLEF Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex flex-col pl-1">
                <span className="text-sm sm:text-base font-extrabold text-primary-indigo tracking-tight font-display">
                  CLISP<span className="text-coast-teal">Connect</span>
                </span>
                <span className="text-[9px] uppercase font-bold text-body-gray leading-none">
                  MLG & CLEF Liberia
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
              href="/#map"
              className="px-3 py-2 rounded-xl text-xs font-semibold tracking-wide text-body-gray hover:text-primary-indigo hover:bg-canvas-light transition-all"
            >
              Map View
            </Link>
            <Link
              href="/verify"
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                pathname === '/verify'
                  ? 'bg-primary-indigo/5 text-primary-indigo font-bold'
                  : 'text-body-gray hover:text-primary-indigo hover:bg-canvas-light'
              }`}
            >
              Verify Credentials
            </Link>
            <Link
              href="/helpdesk"
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                pathname === '/helpdesk'
                  ? 'bg-primary-indigo/5 text-primary-indigo font-bold'
                  : 'text-body-gray hover:text-primary-indigo hover:bg-canvas-light'
              }`}
            >
              Support & Helpdesk
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

          {/* User Console Control & Sign Out */}
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
            ) : null}

            {currentUser.role !== 'Public Visitor' ? (
              <>
                <div className="border-l border-border-gray/30 h-6 mx-1 hidden sm:block"></div>
                
                <div className="flex items-center gap-2">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-[10px] font-bold text-ink leading-tight">{currentUser.name}</span>
                    <span className="text-[8px] font-extrabold uppercase text-coast-teal leading-none">{currentUser.role}</span>
                  </div>
                  
                  <form action={handleSignOut}>
                    <button
                      type="submit"
                      className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold bg-signal-red/10 text-signal-red hover:bg-signal-red/20 border border-signal-red/10 transition-all cursor-pointer shadow-sm"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="border-l border-border-gray/30 h-6 mx-1"></div>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold bg-primary-indigo text-white hover:bg-hover-indigo transition-all shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
