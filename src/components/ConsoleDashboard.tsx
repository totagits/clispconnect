'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { 
  Shield, MapPin, Users, FileSpreadsheet, HelpCircle, FileText, 
  CheckSquare, Clock, AlertTriangle, ArrowUpRight, BookOpen, Award, PlusCircle, Calendar 
} from 'lucide-react';
import { DemoUser } from '../lib/session';

interface DashboardStats {
  countiesCount: number;
  communitiesCount: number;
  leadersCount: number;
  reportsCount: number;
  ticketsCount: number;
  approvalsCount: number;
}

interface ConsoleDashboardProps {
  currentUser: DemoUser;
  stats: DashboardStats;
  recentReports: any[];
  auditLogs: any[];
}

export default function ConsoleDashboard({ currentUser, stats, recentReports, auditLogs }: ConsoleDashboardProps) {
  
  // Recharts Data 1: Alerts Trend (Admins)
  const alertChartData = [
    { name: 'Week 21', Low: 4, Med: 2, High: 0 },
    { name: 'Week 22', Low: 6, Med: 1, High: 1 },
    { name: 'Week 23', Low: 8, Med: 3, High: 2 },
    { name: 'Week 24', Low: 7, Med: 2, High: 1 },
  ];

  // Recharts Data 2: Need Categories Distribution (Admins / Desk Officers)
  const categoryData = [
    { name: 'Infrastructure', value: 45, color: '#0A3D91' },
    { name: 'Public Health', value: 25, color: '#1D8F8A' },
    { name: 'Security', value: 15, color: '#BF2A2A' },
    { name: 'Disaster / Flood', value: 15, color: '#D4A73B' },
  ];

  // Determine dashboard layout type
  const isReporter = ['Community Leader', 'Community Secretary'].includes(currentUser.role);
  const isTrainer = currentUser.role === 'Trainer';
  const isDeskOfficer = currentUser.role === 'Community Desk Officer';
  const isAdmin = !isReporter && !isTrainer && !isDeskOfficer;

  return (
    <div className="space-y-6">
      
      {/* Console Welcome header */}
      <div className="glass-panel border border-border-gray/30 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Command Center</span>
          <h2 className="text-xl font-extrabold text-ink font-display">Welcome Back, {currentUser.name}</h2>
          <p className="text-xs text-body-gray">
            Role Profile: <strong className="text-primary-indigo font-bold">{currentUser.role}</strong> · Scope:{' '}
            {isReporter ? 'Old Road Chugbor Community' : 'Montserrado County Pilot Area'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-body-gray block uppercase">System Status</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-civic-green/10 text-civic-green border border-civic-green/20">
            <span className="w-1.5 h-1.5 rounded-full bg-civic-green animate-pulse" />
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. ADMINISTRATOR / COORDINATOR DASHBOARD VIEW        */}
      {/* ---------------------------------------------------- */}
      {isAdmin && (
        <>
          {/* Overview KPI grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-body-gray">
                <MapPin className="w-4 h-4 text-coast-teal" />
                <span className="text-[8px] font-bold uppercase tracking-wider">Counties</span>
              </div>
              <div>
                <span className="text-2xl font-black text-ink block leading-none font-display">{stats.countiesCount}</span>
                <span className="text-[9px] text-body-gray font-semibold">1 Active Pilot</span>
              </div>
            </div>

            <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-body-gray">
                <MapPin className="w-4 h-4 text-primary-indigo" />
                <span className="text-[8px] font-bold uppercase tracking-wider">Communities</span>
              </div>
              <div>
                <span className="text-2xl font-black text-ink block leading-none font-display">{stats.communitiesCount}</span>
                <span className="text-[9px] text-body-gray font-semibold">District 10 Mapped</span>
              </div>
            </div>

            <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-body-gray">
                <Users className="w-4 h-4 text-sand-gold" />
                <span className="text-[8px] font-bold uppercase tracking-wider">Leaders</span>
              </div>
              <div>
                <span className="text-2xl font-black text-ink block leading-none font-display">{stats.leadersCount}</span>
                <span className="text-[9px] text-body-gray font-semibold">Verified Councils</span>
              </div>
            </div>

            <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-body-gray">
                <FileSpreadsheet className="w-4 h-4 text-civic-green" />
                <span className="text-[8px] font-bold uppercase tracking-wider">Weekly Reports</span>
              </div>
              <div>
                <span className="text-2xl font-black text-ink block leading-none font-display">{stats.reportsCount}</span>
                <span className="text-[9px] text-body-gray font-semibold">Digital Submissions</span>
              </div>
            </div>

            <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-body-gray">
                <HelpCircle className="w-4 h-4 text-signal-red" />
                <span className="text-[8px] font-bold uppercase tracking-wider">Tickets</span>
              </div>
              <div>
                <span className="text-2xl font-black text-ink block leading-none font-display">{stats.ticketsCount}</span>
                <span className="text-[9px] text-body-gray font-semibold">Helpdesk Queue</span>
              </div>
            </div>

            <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-body-gray">
                <CheckSquare className="w-4 h-4 text-primary-indigo" />
                <span className="text-[8px] font-bold uppercase tracking-wider">Approvals</span>
              </div>
              <div>
                <span className="text-2xl font-black text-ink block leading-none font-display">{stats.approvalsCount}</span>
                <span className="text-[9px] text-body-gray font-semibold">Pending Verifications</span>
              </div>
            </div>
          </div>

          {/* Charts & Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-border-gray/20 pb-2">
                <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider">Weekly Report Alert Trends</h3>
                <span className="text-[9px] text-body-gray font-semibold">MLG Monitor Layer</span>
              </div>
              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#888" fontSize={10} />
                    <YAxis stroke="#888" fontSize={10} />
                    <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #ddd', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="Low" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Med" fill="#D4A73B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="High" fill="#BF2A2A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-1 p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-border-gray/20 pb-2">
                <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider">Need Shares Index</h3>
                <span className="text-[9px] text-body-gray font-semibold">Category Shares</span>
              </div>
              <div className="h-44 w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold pt-1 border-t border-border-gray/20">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="truncate text-body-gray">{c.name} ({c.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-border-gray/20 pb-2">
                <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5 text-coast-teal" />
                  <span>Recent Field Submissions</span>
                </h3>
                <Link href="/console/reporting" className="text-[10px] font-bold text-primary-indigo hover:underline flex items-center">
                  <span>View All</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {recentReports.map(rep => (
                  <div key={rep.id} className="p-3 bg-white/45 border border-border-gray/30 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-ink">{rep.community.name}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                        rep.alertLevel === 'LOW' ? 'bg-civic-green/10 text-civic-green border-civic-green/20' :
                        rep.alertLevel === 'MEDIUM' ? 'bg-sand-gold/10 text-sand-gold border-sand-gold/20' :
                        'bg-signal-red/10 text-signal-red border-signal-red/20'
                      }`}>
                        {rep.alertLevel} ALERT
                      </span>
                    </div>
                    <p className="text-[10px] text-body-gray italic line-clamp-1">
                      "{rep.projectUpdates || rep.infrastructureNeeds || 'Weekly log submitted without notes.'}"
                    </p>
                    <div className="flex justify-between items-center text-[9px] text-body-gray border-t border-border-gray/20 pt-1.5">
                      <span>Reporter: {rep.reporterName}</span>
                      <span>Week ending: {new Date(rep.weekEnding).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-border-gray/20 pb-2">
                <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4.5 h-4.5 text-sand-gold" />
                  <span>System Activity Logs</span>
                </h3>
                <span className="text-[9px] text-body-gray font-semibold">Security Audit</span>
              </div>
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex justify-between items-start gap-4 p-2 bg-canvas-light/50 border border-border-gray/20 rounded-xl text-[10px]">
                    <div className="space-y-0.5">
                      <span className="font-bold text-ink uppercase tracking-wide text-[8px] bg-primary-indigo/5 px-1 rounded text-primary-indigo inline-block">{log.action}</span>
                      <p className="text-body-gray">{log.details}</p>
                    </div>
                    <span className="text-body-gray/80 text-[9px] shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. FIELD REPORTER DASHBOARD VIEW (Secretary/Leader)  */}
      {/* ---------------------------------------------------- */}
      {isReporter && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: KPI & Timeline (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* KPI Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold uppercase text-body-gray">Active Leaders</span>
                <span className="text-3xl font-black text-ink font-display">6 Leaders</span>
              </div>
              <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold uppercase text-body-gray">Reports Logged</span>
                <span className="text-3xl font-black text-ink font-display">{stats.reportsCount} Sheets</span>
              </div>
              <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold uppercase text-body-gray">Inclusion Index</span>
                <span className="text-3xl font-black text-[#2E7D32] font-display">100%</span>
              </div>
            </div>

            {/* Recent Timeline */}
            <div className="p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4">
              <div className="border-b border-border-gray/20 pb-2 flex justify-between items-center">
                <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4.5 h-4.5 text-coast-teal" />
                  <span>Reporting History (Old Road Chugbor)</span>
                </h3>
                <Link href="/console/reporting" className="text-[10px] font-bold text-primary-indigo hover:underline flex items-center gap-1">
                  <span>Submit Weekly Sheet</span>
                  <PlusCircle className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {recentReports
                  .filter(rep => rep.community.name === 'Old Road Chugbor')
                  .map(rep => (
                    <div key={rep.id} className="p-3 border border-border-gray/20 rounded-xl bg-white/40 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <strong className="text-ink">Week Ending: {new Date(rep.weekEnding).toLocaleDateString()}</strong>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                          rep.alertLevel === 'LOW' ? 'bg-civic-green/10 text-civic-green border-civic-green/20' :
                          rep.alertLevel === 'MEDIUM' ? 'bg-sand-gold/10 text-sand-gold border-sand-gold/20' :
                          'bg-signal-red/10 text-signal-red border-signal-red/20'
                        }`}>
                          {rep.alertLevel} ALERT
                        </span>
                      </div>
                      
                      <div className="text-[11px] text-body-gray leading-relaxed pl-2 border-l-2 border-primary-indigo/35 space-y-1">
                        {rep.projectUpdates && <p><strong>Projects:</strong> {rep.projectUpdates}</p>}
                        {rep.infrastructureNeeds && <p><strong>Infrastructure:</strong> {rep.infrastructureNeeds}</p>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column: Training Checklist & Shortcuts (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4">
              <div className="border-b border-border-gray/20 pb-2">
                <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4.5 h-4.5 text-sand-gold" />
                  <span>UN-HABITAT Capacity Program</span>
                </h3>
                <span className="text-[9px] text-body-gray">Leadership Competency checklist</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-2 bg-civic-green/10 text-civic-green border border-civic-green/25 rounded-xl">
                  <Award className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Module 1: Leadership & Inclusivity</strong>
                    <span className="block text-[9px] text-[#236026] mt-0.5">COMPLETED · Certificate Issued</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2.5 p-2 bg-civic-green/10 text-civic-green border border-civic-green/25 rounded-xl">
                  <Award className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Module 2: Participatory Mapping</strong>
                    <span className="block text-[9px] text-[#236026] mt-0.5">COMPLETED · Certificate Issued</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2.5 p-2 bg-[#D4A73B]/10 text-[#7D5A0F] border border-[#D4A73B]/25 rounded-xl">
                  <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Module 3: Conflict Mediation & Land</strong>
                    <span className="block text-[9px] text-[#7D5A0F] mt-0.5">SCHEDULED · Next Week</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2.5 p-2 bg-body-gray/10 text-body-gray border border-border-gray/20 rounded-xl opacity-60">
                  <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Module 4: Incident Reporting Systems</strong>
                    <span className="block text-[9px] mt-0.5">NOT STARTED</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0A3D91] text-white space-y-3.5 shadow-md">
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#D4A73B]">Grassroots Toolkit</span>
              <h4 className="text-base font-extrabold font-display leading-tight">Need to log water point failures, road erosion, or local disputes?</h4>
              <p className="text-[11px] text-white/80 leading-relaxed font-light">
                Submit this week's field sheet. All reports are immediately pushed to the Ministry of Local Government Command Center.
              </p>
              <Link 
                href="/console/reporting" 
                className="w-full py-2.5 rounded-xl bg-[#D4A73B] hover:bg-[#bfa02c] text-white font-bold text-center text-xs block transition-all shadow-sm"
              >
                Launch Field Reporting Form
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. TRAINER DASHBOARD VIEW                            */}
      {/* ---------------------------------------------------- */}
      {isTrainer && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            
            {/* KPI grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold uppercase text-body-gray">Verified Communities</span>
                <span className="text-3xl font-black text-ink font-display">{stats.communitiesCount} Nodes</span>
              </div>
              <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold uppercase text-body-gray">Leaders Enrolled</span>
                <span className="text-3xl font-black text-ink font-display">{stats.leadersCount} Profiles</span>
              </div>
              <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold uppercase text-body-gray">Active Certificates</span>
                <span className="text-3xl font-black text-sand-gold font-display">2 Issued</span>
              </div>
            </div>

            {/* Upcoming seminars */}
            <div className="p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4">
              <div className="border-b border-border-gray/20 pb-2 flex justify-between items-center">
                <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4.5 h-4.5 text-coast-teal" />
                  <span>Scheduled Seminars Queue</span>
                </h3>
                <Link href="/console/training" className="text-[10px] font-bold text-primary-indigo hover:underline flex items-center gap-1">
                  <span>Schedule Seminar</span>
                  <PlusCircle className="w-3.5 h-3.5" />
                </Link>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 border border-border-gray/20 rounded-xl bg-white/40 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-primary-indigo/5 text-primary-indigo border border-primary-indigo/15">Syllabus Module 3</span>
                      <strong className="block text-sm text-ink mt-1">Old Road Chugbor Community Hall</strong>
                    </div>
                    <span className="text-[10px] text-body-gray font-mono">June 18, 2026 @ 10:00 AM</span>
                  </div>
                  <p className="text-body-gray">Course Title: **Conflict Resolution & Land Disputes**. Expected attendance: 6 community council leaders.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-5 h-fit">
            <div className="border-b border-border-gray/20 pb-2">
              <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider">UN-HABITAT Checklist</h3>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-body-gray">
              <p>Verify leaders attending course seminars to unlock official credentials.</p>
              
              <div className="space-y-2 border-t border-border-gray/25 pt-3">
                <div className="flex justify-between items-center">
                  <span>Module 1: Leadership</span>
                  <span className="text-civic-green font-bold">100% Complete</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Module 2: Mapping</span>
                  <span className="text-civic-green font-bold">100% Complete</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Module 3: Conflict</span>
                  <span className="text-[#D4A73B] font-bold">Scheduled</span>
                </div>
              </div>
              
              <Link 
                href="/console/training" 
                className="w-full py-2.5 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white font-bold text-center text-xs block transition-all shadow-sm mt-4"
              >
                Log Session Attendance
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. DESK OFFICER DASHBOARD VIEW                       */}
      {/* ---------------------------------------------------- */}
      {isDeskOfficer && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            
            {/* KPI grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold uppercase text-body-gray">Open Tickets</span>
                <span className="text-3xl font-black text-signal-red font-display">{stats.ticketsCount} Open</span>
              </div>
              <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold uppercase text-body-gray">Resolved Tickets</span>
                <span className="text-3xl font-black text-civic-green font-display">10 Closed</span>
              </div>
              <div className="glass-card border border-border-gray/30 p-4 rounded-xl flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold uppercase text-body-gray">Average Resolution</span>
                <span className="text-3xl font-black text-ink font-display">2.4 Days</span>
              </div>
            </div>

            {/* Helpdesk Queue */}
            <div className="p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4">
              <div className="border-b border-border-gray/20 pb-2">
                <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4.5 h-4.5 text-primary-indigo" />
                  <span>Pending Helpdesk Inquiry Logs</span>
                </h3>
              </div>
              
              <div className="p-4 border border-[#D4A73B] rounded-xl bg-amber-50/5 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-sand-gold/10 text-sand-gold border border-sand-gold/20">Data Correction</span>
                    <strong className="block text-sm text-ink mt-1.5">Request to correct Community Secretary Phone Number</strong>
                  </div>
                  <span className="text-[10px] text-body-gray font-mono">June 11, 2026</span>
                </div>
                <p className="text-body-gray leading-normal">From: Princess Kamara. "Typo in my registered cell number. Ends in 42 instead of 24."</p>
                <Link href="/console/helpdesk" className="inline-flex items-center gap-1 text-[9px] font-bold text-primary-indigo hover:underline mt-2">
                  <span>Open Ticket Resolution Panel</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4 h-fit">
            <div className="border-b border-border-gray/20 pb-2">
              <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider">Ticket Categories</h3>
            </div>
            
            <div className="h-44 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <Link 
              href="/console/helpdesk" 
              className="w-full py-2.5 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white font-bold text-center text-xs block transition-all shadow-sm"
            >
              Access Helpdesk Portal
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
