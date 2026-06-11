import React from 'react';
import { Shield, BookOpen, Map, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase text-coast-teal tracking-widest">About CLISP Blueprint</span>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-ink tracking-tight leading-none">
          Decentralizing Governance to the Last Mile
        </h1>
        <p className="text-sm text-body-gray leading-relaxed font-light">
          The Community Leadership Identification and Structuring Program (CLISP) is designed to create a structured registry of communities, formalize leadership, and capture ground-truth reporting.
        </p>
      </div>

      {/* Narrative grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-ink font-display">Closing the Last-Mile Gap</h2>
          <p className="text-xs text-body-gray leading-relaxed">
            While formal decentralization acts (such as the Local Government Act of 2018) establish county, district, and clan administrative boundaries, they do not reach the actual neighborhood settlements where citizens live. 
          </p>
          <p className="text-xs text-body-gray leading-relaxed">
            Without official digital registers, these communities remain unrecognized. Local leadership boards lack official structures, and there is no direct channel to report local projects, infrastructure needs, or emergency incidents. 
          </p>
          <p className="text-xs text-body-gray leading-relaxed">
            CLISP bridges this gap by creating the **National Registry of Communities and Leaders (NRCL)**. Overseen by the Ministry of Internal Affairs and implemented by CLEF, it creates a secure, georeferenced database of community nodes, maps structures, and initiates weekly digital reports.
          </p>
        </div>
        
        {/* Collaboration visual representation */}
        <div className="rounded-2xl border border-border-gray/30 p-8 glass-panel shadow-md space-y-6">
          <span className="text-xs font-bold uppercase text-sand-gold tracking-wider block">Collaborating Institutions</span>
          
          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-lg bg-primary-indigo/10 flex items-center justify-center font-bold text-xs text-primary-indigo shrink-0">MIA</span>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-ink uppercase">Ministry of Internal Affairs</h4>
              <p className="text-[11px] text-body-gray leading-normal">
                National administrator responsible for local governance and oversight. Manages the Command Center, registry approvals, and policy directives.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start border-t border-border-gray/30 pt-4">
            <span className="w-8 h-8 rounded-lg bg-coast-teal/10 flex items-center justify-center font-bold text-xs text-coast-teal shrink-0">CLEF</span>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-ink uppercase">Community Leadership Empowerment Forum</h4>
              <p className="text-[11px] text-body-gray leading-normal">
                Civil society partner managing field coordination, mapping, capacity training curriculum alignment, and data validation logistics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars In-Depth */}
      <div className="space-y-8 pt-10 border-t border-border-gray/30">
        <h3 className="text-2xl font-black text-ink font-display text-center">The Four Program Pillars</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-2xl glass-card border border-border-gray/30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary-indigo/10 flex items-center justify-center text-primary-indigo font-bold">I</span>
              <h4 className="text-sm font-bold text-ink uppercase">Leadership Formalization</h4>
            </div>
            <p className="text-xs text-body-gray leading-relaxed">
              Standardizes community councils to ensure balanced representation. Communities must document leadership structures with dedicated spots for women, youth, and PWDs before gaining verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-border-gray/30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-coast-teal/10 flex items-center justify-center text-coast-teal font-bold">II</span>
              <h4 className="text-sm font-bold text-ink uppercase">National GIS Registry (NRCL)</h4>
            </div>
            <p className="text-xs text-body-gray leading-relaxed">
              Georeferences every community. Coordinates are captured, accuracy indices calculated, and boundaries cataloged. This database is visible to the public to prevent duplication and boundary conflicts.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-border-gray/30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-sand-gold/10 flex items-center justify-center text-sand-gold font-bold">III</span>
              <h4 className="text-sm font-bold text-ink uppercase">Capacity Building & Certification</h4>
            </div>
            <p className="text-xs text-body-gray leading-relaxed">
              Enforces competency training. In partnership with UN-HABITAT guidelines, leaders are trained on democratic decisions, resource tracking, and conflict mediation, followed by certificate issuance.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-border-gray/30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-civic-green/10 flex items-center justify-center text-civic-green font-bold">IV</span>
              <h4 className="text-sm font-bold text-ink uppercase">Digital Reporting & Oversight</h4>
            </div>
            <p className="text-xs text-body-gray leading-relaxed">
              Closes the reporting loop. Weekly ground-truth reports regarding water safety, healthcare logistics, and local disputes flow to the MIA console. This enables county directors to respond dynamically.
            </p>
          </div>

        </div>
      </div>

      {/* UN-HABITAT Curriculum Alignment */}
      <div className="rounded-3xl border border-border-gray/30 p-8 glass-panel shadow-md grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-3">
          <span className="text-[10px] uppercase font-bold text-sand-gold tracking-wider block">Training Integrity</span>
          <h4 className="text-xl font-bold text-ink font-display leading-tight">UN-HABITAT Syllabus Alignment</h4>
          <p className="text-xs text-body-gray leading-relaxed">
            CLISP capacity building relies on structured training modules developed in alignment with UN-HABITAT guidelines.
          </p>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-2.5 items-start">
            <CheckCircle2 className="w-4 h-4 text-civic-green shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink">Democratic Methods</span>
              <p className="text-[10px] text-body-gray">Conducting town halls, representative voting mechanisms, and public reporting.</p>
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
            <CheckCircle2 className="w-4 h-4 text-civic-green shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink">Conflict Mediation</span>
              <p className="text-[10px] text-body-gray">Negotiating local land boundaries and customary disputes within statutory legal bounds.</p>
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
            <CheckCircle2 className="w-4 h-4 text-civic-green shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink">Social Inclusion</span>
              <p className="text-[10px] text-body-gray">Securing proportional council slots for women, youth delegates, and PWD representatives.</p>
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
            <CheckCircle2 className="w-4 h-4 text-civic-green shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink">Resource Accountability</span>
              <p className="text-[10px] text-body-gray">Bookkeeping, proposal planning, and data-driven reporting to the national registry.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
