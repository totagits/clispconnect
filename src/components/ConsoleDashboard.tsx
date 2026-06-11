'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Shield, MapPin, Users, FileSpreadsheet, HelpCircle, FileText, CheckSquare, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
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
  
  // Recharts Data 1: Alerts Trend
  const alertChartData = [
    { name: 'Week 21', Low: 4, Med: 2, High: 0 },
    { name: 'Week 22', Low: 6, Med: 1, High: 1 },
    { name: 'Week 23', Low: 8, Med: 3, High: 2 },
    { name: 'Week 24', Low: 7, Med: 2, High: 1 },
  ];

  // Recharts Data 2: Need Categories Distribution
  const categoryData = [
    { name: 'Infrastructure', value: 45, color: '#0A3D91' },
    { name: 'Public Health', value: 25, color: '#1D8F8A' },
    { name: 'Security', value: 15, color: '#BF2A2A' },
    { name: 'Disaster / Flood', value: 15, color: '#D4A73B' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Console Welcome header */}
      <div className="glass-panel border border-border-gray/30 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Command Center</span>
          <h2 className="text-xl font-extrabold text-ink font-display">Welcome Back, {currentUser.name}</h2>
          <p className="text-xs text-body-gray">Role Profile: <strong className="text-primary-indigo font-bold">{currentUser.role}</strong> · Scope: Montserrado County Pilot Area</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-body-gray block uppercase">System Status</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-civic-green/10 text-civic-green border border-civic-green/20">
            <span className="w-1.5 h-1.5 rounded-full bg-civic-green animate-pulse" />
            PILOT SYSTEM STABLE
          </span>
        </div>
      </div>

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

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border-gray/20 pb-2">
            <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider">Weekly Report Alert Trends</h3>
            <span className="text-[9px] text-body-gray font-semibold">MIA Monitor Layer</span>
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

        {/* Needs categories breakdown */}
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

      {/* Reports and Logs Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent reports list */}
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

        {/* Audit Logs list */}
        <div className="p-5 rounded-2xl border border-border-gray/30 glass-panel shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border-gray/20 pb-2">
            <h3 className="text-xs font-extrabold uppercase text-ink tracking-wider flex items-center gap-1.5">
              <Shield className="w-4.5 h-4.5 text-sand-gold" />
              <span>System Activity Logs</span>
            </h3>
            <span className="text-[9px] text-body-gray font-semibold">Security Audit</span>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {auditLogs.length > 0 ? (
              auditLogs.map(log => (
                <div key={log.id} className="flex justify-between items-start gap-4 p-2 bg-canvas-light/50 border border-border-gray/20 rounded-xl text-[10px]">
                  <div className="space-y-0.5">
                    <span className="font-bold text-ink uppercase tracking-wide text-[8px] bg-primary-indigo/5 px-1 rounded text-primary-indigo inline-block">{log.action}</span>
                    <p className="text-body-gray">{log.details}</p>
                  </div>
                  <span className="text-body-gray/80 text-[9px] shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <div className="p-3 bg-canvas-light text-center rounded-xl space-y-2 text-xs">
                <Clock className="w-6 h-6 text-body-gray/50 mx-auto" />
                <p className="text-[10px] text-body-gray">Local system initialized. Activity logged automatically.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
