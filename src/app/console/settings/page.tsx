import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '../../../lib/db';
import { getCurrentUser } from '../../../lib/auth';
import { getRolePermissions } from '../../../lib/session';
import ConsoleNav from '../../../components/ConsoleNav';
import { Shield, Settings, Server, Key, Info, CheckCircle2 } from 'lucide-react';

export const revalidate = 0; // Dynamic rendering

export default async function SettingsModulePage() {
  const currentUser = await getCurrentUser();
  const permissions = getRolePermissions(currentUser.role);

  if (!permissions.canViewConsole) {
    redirect('/login?error=Please sign in to access the Command Center');
  }

  if (currentUser.role !== 'Super Admin') {
    redirect('/console');
  }

  // Fetch active system settings from the database
  const settings = await prisma.systemSetting.findMany({
    orderBy: { id: 'asc' }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Dynamic Console Sub-navigation */}
      <ConsoleNav currentUser={currentUser} activeTab="settings" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: System settings key-values (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
            <div className="border-b border-border-gray/30 pb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary-indigo" />
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">Platform Configuration Keys</h3>
            </div>

            <div className="space-y-4 text-xs">
              {settings.map(sett => (
                <div key={sett.id} className="p-3.5 bg-white/40 border border-border-gray/20 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-sm font-bold text-ink font-mono">{sett.id}</strong>
                      <span className="block text-[10px] text-body-gray mt-0.5">{sett.description}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-primary-indigo/5 text-primary-indigo px-2 py-0.5 rounded border border-primary-indigo/15">
                      {sett.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database & GIS Adapter information */}
          <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
            <div className="border-b border-border-gray/30 pb-3 flex items-center gap-2">
              <Server className="w-5 h-5 text-coast-teal" />
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">Database & GIS Engine Status</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-body-gray leading-relaxed">
              <div className="p-4 bg-canvas-light/50 border border-border-gray/20 rounded-xl space-y-1">
                <strong className="text-ink">Dual-Mode Driver</strong>
                <p className="text-[11px]">Active Provider: <strong>SQLite (dev.db)</strong></p>
                <p className="text-[10px]">Configured to support local SQLite schemas for District 10 pilot. Prisma schema maps directly to PostgreSQL and PostGIS for full-scale deployments.</p>
              </div>

              <div className="p-4 bg-canvas-light/50 border border-border-gray/20 rounded-xl space-y-1">
                <strong className="text-ink">Geospatial Indexing</strong>
                <p className="text-[11px]">Mapping Provider: <strong>Vector Fallback Mode</strong></p>
                <p className="text-[10px]">Leaflet coordinate engine coordinates real GPS landmarks. In production, PostGIS geography calculations are executed via Prisma raw SQL query layers.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Permission Matrix Details (1 Col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
            <div className="border-b border-border-gray/30 pb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-sand-gold" />
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">Role Clearances</h3>
            </div>

            <div className="space-y-3.5 text-xs text-body-gray leading-relaxed">
              <p>
                Simulated User Identity: <strong className="text-ink">{currentUser.name}</strong><br />
                Security Clearance Level: <strong className="text-primary-indigo font-bold">{currentUser.role}</strong>
              </p>

              <div className="space-y-2 border-t border-border-gray/30 pt-3 text-[11px] font-semibold">
                <div className="flex items-center justify-between">
                  <span>Sign Certificates:</span>
                  <span className={permissions.canApproveLeaders ? 'text-civic-green' : 'text-signal-red'}>
                    {permissions.canApproveLeaders ? 'Authorized' : 'Locked'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Submit Weekly Reports:</span>
                  <span className={permissions.canSubmitReport ? 'text-civic-green' : 'text-signal-red'}>
                    {permissions.canSubmitReport ? 'Authorized' : 'Locked'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Manage Training Syllabus:</span>
                  <span className={permissions.canManageTraining ? 'text-civic-green' : 'text-signal-red'}>
                    {permissions.canManageTraining ? 'Authorized' : 'Locked'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Manage Helpdesk Tickets:</span>
                  <span className={permissions.canManageHelpdesk ? 'text-civic-green' : 'text-signal-red'}>
                    {permissions.canManageHelpdesk ? 'Authorized' : 'Locked'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#0A3D91]/5 border border-primary-indigo/20 rounded-xl space-y-1.5 mt-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary-indigo uppercase">
                  <Info className="w-3.5 h-3.5 text-sand-gold fill-sand-gold/20" />
                  <span>How RBAC is Simulated</span>
                </span>
                <p className="text-[10px] text-primary-indigo/80 leading-normal font-light">
                  A cookie named `clisp_email` stores the current demo identity email. Changing the role switcher sets this cookie and reloads, updating server component queries instantly.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
