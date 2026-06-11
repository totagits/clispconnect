import React from 'react';
import Link from 'next/link';
import Carousel from '../components/Carousel';
import MapGIS from '../components/MapGIS';
import { ShieldAlert, BookOpen, FileSpreadsheet, Map, Users, ChevronRight, HelpCircle, Check, Send } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section & County Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content Left */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-indigo/10 border border-primary-indigo/20 text-primary-indigo">
              <span className="w-1.5 h-1.5 rounded-full bg-sand-gold animate-pulse" />
              <span>Pilot Live: District #10, Montserrado</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-ink tracking-tight leading-none">
              Every Community, <span className="text-primary-indigo">Recognized.</span> <br className="hidden md:inline" />
              Every Voice, <span className="text-coast-teal">Counted.</span>
            </h1>
            
            <p className="text-sm sm:text-base text-body-gray leading-relaxed max-w-xl font-light">
              CLISPConnect formalizes community leadership, builds Liberia’s first national GIS-enabled registry, and powers weekly ground-truth reporting for inclusive, data-driven decentralized governance.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/registry"
                className="px-6 py-3 rounded-xl bg-primary-indigo hover:bg-hover-indigo active:bg-active-indigo text-white font-bold text-sm text-center shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Explore Public Registry (NRCL)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-xl glass-panel text-primary-indigo font-bold text-sm text-center border border-primary-indigo/20 hover:bg-primary-indigo/5 transition-all flex items-center justify-center"
              >
                Learn About CLISP Pillar System
              </Link>
            </div>

            {/* Impact Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-border-gray/30 pt-8 mt-6">
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-black text-primary-indigo leading-none font-display">15</p>
                <p className="text-[10px] font-bold text-body-gray uppercase tracking-wider">Counties Engaged</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-black text-coast-teal leading-none font-display">8</p>
                <p className="text-[10px] font-bold text-body-gray uppercase tracking-wider">Pilot Communities</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-black text-civic-green leading-none font-display">75+</p>
                <p className="text-[10px] font-bold text-body-gray uppercase tracking-wider">Leaders Trained</p>
              </div>
            </div>
          </div>

          {/* Carousel Slide Right */}
          <div className="lg:col-span-6 w-full">
            <Carousel />
          </div>

        </div>
      </section>

      {/* Program Collaborations / Stakeholder Partnerships */}
      <section className="bg-canvas-light py-8 border-y border-border-gray/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-[10px] uppercase font-bold text-body-gray tracking-widest">Sponsored & Overseen By</span>
              <p className="text-xs font-bold text-primary-indigo">MLG Secretariat & CLEF National Steering Council</p>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-75">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink">Ministry of Local Government (MLG)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink">Community Leadership Empowerment Forum (CLEF)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink">UN-HABITAT Competency Standards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why CLISP Matters / Program Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase text-coast-teal tracking-widest">Bridging the Last-Mile Gap</span>
          <h2 className="text-3xl md:text-4xl font-black text-ink font-display tracking-tight leading-none">
            Why CLISP Connect Matters for Liberia
          </h2>
          <p className="text-sm text-body-gray leading-relaxed">
            Liberia's local government decentralization cannot stop at county capitals. True grassroots governance requires official recognition of community units, capacity training for local leaders, and direct weekly reporting structures to capture security, health, and developmental updates.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl glass-card border border-border-gray/30 hover:border-primary-indigo/30 transition-all flex flex-col justify-between h-64">
            <div className="w-10 h-10 rounded-xl bg-primary-indigo/10 flex items-center justify-center text-primary-indigo">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1 mt-4">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">1. Formalization</h3>
              <p className="text-xs text-body-gray leading-relaxed font-light">
                Documenting local structures including Traditional Chiefs, Youth Chairs, Women Leaders, and PWD representatives to secure inclusive local councils.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-border-gray/30 hover:border-coast-teal/30 transition-all flex flex-col justify-between h-64">
            <div className="w-10 h-10 rounded-xl bg-coast-teal/10 flex items-center justify-center text-coast-teal">
              <Map className="w-5 h-5" />
            </div>
            <div className="space-y-1 mt-4">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">2. National Registry</h3>
              <p className="text-xs text-body-gray leading-relaxed font-light">
                Building the National Registry of Communities and Leaders (NRCL) – a verified GIS database of settlements, boundary lines, and leader terms.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-border-gray/30 hover:border-sand-gold/30 transition-all flex flex-col justify-between h-64">
            <div className="w-10 h-10 rounded-xl bg-sand-gold/10 flex items-center justify-center text-sand-gold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1 mt-4">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">3. Capacity Training</h3>
              <p className="text-xs text-body-gray leading-relaxed font-light">
                Enforcing UN-HABITAT competency-aligned training courses covering representative decision-making, mediation, and financial transparency.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-border-gray/30 hover:border-civic-green/30 transition-all flex flex-col justify-between h-64">
            <div className="w-10 h-10 rounded-xl bg-civic-green/10 flex items-center justify-center text-civic-green">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="space-y-1 mt-4">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">4. Digital Reporting</h3>
              <p className="text-xs text-body-gray leading-relaxed font-light">
                Weekly mobile reporting of local water access issues, health trends, and security incidents directly to the Ministry of Local Government.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* GIS Mapping Live Preview Embed */}
      <section id="pilot" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <span className="text-xs font-extrabold uppercase text-primary-indigo tracking-widest">Live Interactive Map</span>
          <h2 className="text-3xl font-black text-ink font-display tracking-tight leading-none">
            District #10 GIS Pilot Registry
          </h2>
          <p className="text-xs text-body-gray max-w-xl mx-auto">
            Visualizing the pilot implementation in Montserrado County. Use the controls below to toggle layer filters, search community profiles, and inspect structured leadership boards.
          </p>
        </div>

        {/* Embedded custom GIS Map */}
        <div className="p-2 sm:p-4 rounded-3xl glass-panel border border-border-gray/30 shadow-lg bg-white/20">
          <MapGIS />
        </div>
      </section>

      {/* District #10 Pilot Implementation Stats */}
      <section className="bg-ink text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background visual graphics */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-indigo/15 rounded-full blur-[160px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative">
          <div className="md:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-sand-gold">Pilot Spotlight</span>
            <h3 className="text-3xl font-black font-display tracking-tight">Montserrado District #10 Framework</h3>
            <p className="text-xs text-body-gray leading-relaxed">
              District #10 serves as the primary incubator for the CLISPConnect digital blueprint. The pilot maps and structures eight key communities including Old Road Chugbor, Peace Island, Gayetown, and Matadi to construct the *Pilot Implementation Playbook* ahead of nationwide rollout.
            </p>
            <ul className="space-y-2.5 text-xs text-body-gray">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-coast-teal" />
                <span>Geotagging of all settlements, water points, and public schools.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-coast-teal" />
                <span>Formal election verification & certificate generation for 75 community leaders.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-coast-teal" />
                <span>Digitized weekly reports from community secretaries directly to the Command Center.</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/15 p-5 rounded-2xl text-center space-y-1 backdrop-blur-sm">
              <span className="text-3xl font-extrabold text-sand-gold font-display">100%</span>
              <p className="text-[10px] text-body-gray font-semibold uppercase tracking-wider">Weekly Report rate</p>
            </div>
            <div className="bg-white/5 border border-white/15 p-5 rounded-2xl text-center space-y-1 backdrop-blur-sm">
              <span className="text-3xl font-extrabold text-sand-gold font-display">8 / 8</span>
              <p className="text-[10px] text-body-gray font-semibold uppercase tracking-wider">Communities Mapped</p>
            </div>
            <div className="bg-white/5 border border-white/15 p-5 rounded-2xl text-center space-y-1 backdrop-blur-sm">
              <span className="text-3xl font-extrabold text-sand-gold font-display">75</span>
              <p className="text-[10px] text-body-gray font-semibold uppercase tracking-wider">Registered Councils</p>
            </div>
            <div className="bg-white/5 border border-white/15 p-5 rounded-2xl text-center space-y-1 backdrop-blur-sm">
              <span className="text-3xl font-extrabold text-sand-gold font-display">24h</span>
              <p className="text-[10px] text-body-gray font-semibold uppercase tracking-wider">MLG Desk Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase text-coast-teal tracking-widest">Answering Key Questions</span>
          <h2 className="text-3xl font-black text-ink font-display tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl glass-card border border-border-gray/30 space-y-2">
            <h4 className="text-sm font-bold text-ink flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-primary-indigo shrink-0 mt-0.5" />
              <span>What is the primary objective of CLISP?</span>
            </h4>
            <p className="text-xs text-body-gray leading-relaxed pl-6">
              The Community Leadership Identification and Structuring Program (CLISP) aims to build a verified registry of communities and formalized councils. This connects the decentralized administrative tiers (Counties, Districts, Clans) with grassroots governance structures on the ground.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-border-gray/30 space-y-2">
            <h4 className="text-sm font-bold text-ink flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-primary-indigo shrink-0 mt-0.5" />
              <span>How are community coordinates and leadership boards verified?</span>
            </h4>
            <p className="text-xs text-body-gray leading-relaxed pl-6">
              A Registry Officer visits the location to audit boundaries and coordinates. Meanwhile, the District Coordinator reviews election logs. Once verified, the profile is officially published to the National Registry (NRCL), and leaders receive official certified status.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-border-gray/30 space-y-2">
            <h4 className="text-sm font-bold text-ink flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-primary-indigo shrink-0 mt-0.5" />
              <span>How does the weekly digital reporting system work?</span>
            </h4>
            <p className="text-xs text-body-gray leading-relaxed pl-6">
              Each formalized community designates a Secretary. Using a low-bandwidth mobile format, the Secretary inputs local infrastructure needs, public health trends, and security or weather incidents. This aggregates into the MLG Command Center for national monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#0A3D91] to-[#1D8F8A] p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
          {/* visual lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <div className="max-w-2xl space-y-6 relative">
            <h3 className="text-2xl md:text-4xl font-black font-display tracking-tight leading-tight">
              Ready to secure last-mile governance in your district?
            </h3>
            <p className="text-xs md:text-sm text-white/90 leading-relaxed font-light">
              CLEF and the Ministry of Local Government are preparing the next phase of community mapping. Sign up for technical resources, download the pilot playbook, or request registration guidelines.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                placeholder="Enter email to get updates..."
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-white/60 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sand-gold focus:border-transparent min-w-[240px] backdrop-blur-md"
              />
              <button className="px-6 py-3 rounded-xl bg-sand-gold hover:bg-[#c29832] text-ink font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer">
                <Send className="w-3.5 h-3.5" />
                <span>Submit Query</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
