'use client';

import React, { useState, useEffect } from 'react';
import { DEMO_USERS, DemoUser } from '../lib/session';
import { Shield, ChevronDown, UserCheck, HelpCircle } from 'lucide-react';

interface RoleSwitcherProps {
  currentUser: DemoUser;
}

export default function RoleSwitcher({ currentUser }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ensure the cookies are set initially for consistency
    const cookieString = document.cookie;
    if (!cookieString.includes('clisp_email')) {
      document.cookie = `clisp_email=${currentUser.email}; path=/; max-age=604800`;
    }
  }, [currentUser]);

  const handleRoleChange = (email: string) => {
    document.cookie = `clisp_email=${email}; path=/; max-age=604800`;
    setIsOpen(false);
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold glass-panel text-primary-indigo border border-primary-indigo/20 hover:bg-primary-indigo/5 transition-all shadow-sm duration-200"
      >
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-sand-gold fill-sand-gold/20" />
          <span>Demo Role: <strong>{currentUser.role}</strong></span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop overlay to close */}
          <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-transparent" />
          
          <div className="absolute right-0 mt-2 w-80 max-h-[480px] overflow-y-auto rounded-2xl glass-panel border border-border-gray/30 p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 border-b border-border-gray/30 mb-1">
              <p className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Select Demo Identity</p>
              <p className="text-[11px] text-primary-indigo/80 mt-0.5">Toggle credentials to test different system privileges.</p>
            </div>
            
            <div className="space-y-0.5">
              {DEMO_USERS.map((user) => {
                const isActive = user.email === currentUser.email;
                return (
                  <button
                    key={user.email}
                    onClick={() => handleRoleChange(user.email)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex flex-col items-start gap-0.5 hover:bg-primary-indigo/5 ${
                      isActive ? 'bg-primary-indigo/10 border-l-4 border-primary-indigo pl-2' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-ink flex items-center gap-1">
                        {user.name}
                        {isActive && <UserCheck className="w-3.5 h-3.5 text-civic-green" />}
                      </span>
                      <span className="text-[9px] uppercase font-semibold bg-canvas-light text-primary-indigo px-1.5 py-0.5 rounded-md border border-border-gray/30">
                        {user.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-body-gray leading-tight">
                      {user.description}
                    </span>
                    <span className="text-[9px] text-primary-indigo/60 font-mono mt-0.5">
                      {user.email} · clisp123
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
