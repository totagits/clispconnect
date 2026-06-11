import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border-gray/30 bg-ink text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-indigo/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-coast-teal/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Organization Branding */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-white tracking-tight font-display">
              CLISP<span className="text-coast-teal font-normal">Connect</span>
            </span>
            <span className="text-[10px] uppercase font-bold bg-primary-indigo/30 text-sand-gold px-2 py-0.5 rounded border border-sand-gold/20">
              Pilot Release
            </span>
          </div>
          <p className="text-xs text-body-gray max-w-sm leading-relaxed">
            A joint civic-tech initiative of the <strong>Ministry of Internal Affairs (MIA)</strong> and the <strong>Community Leadership Empowerment Forum (CLEF)</strong>, Republic of Liberia. Developed to secure last-mile decentralization.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-body-gray/80 pt-2">
            <span>© {new Date().getFullYear()} CLISPConnect. All rights reserved.</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs uppercase font-extrabold text-sand-gold tracking-widest mb-4">Resources</h4>
          <ul className="space-y-2.5 text-xs text-body-gray">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">About CLISP Concept</Link>
            </li>
            <li>
              <Link href="/registry" className="hover:text-white transition-colors">National Registry (NRCL)</Link>
            </li>
            <li>
              <Link href="/#pilot" className="hover:text-white transition-colors">District #10 Playbook</Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link>
            </li>
          </ul>
        </div>

        {/* Contact/Support */}
        <div>
          <h4 className="text-xs uppercase font-extrabold text-sand-gold tracking-widest mb-4">Secretariat Support</h4>
          <p className="text-xs text-body-gray leading-relaxed mb-2">
            Community Leadership Secretariat<br />
            Ministry of Internal Affairs<br />
            Capitol Hill, Monrovia, Liberia
          </p>
          <p className="text-xs text-body-gray">
            Email: <a href="mailto:support@clispconnect.gov.lr" className="hover:text-white text-coast-teal transition-colors">support@clispconnect.gov.lr</a><br />
            Helpline: +231 777-654-321
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 text-center text-[10px] text-body-gray/50">
        Designed for low-bandwidth environments. Dynamic fallback maps active automatically when Google Maps is unreachable.
      </div>
    </footer>
  );
}
