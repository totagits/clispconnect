import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '../../lib/db';
import { getCurrentUser } from '../../lib/auth';
import { getRolePermissions } from '../../lib/session';
import ConsoleDashboard from '../../components/ConsoleDashboard';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const revalidate = 0; // Fresh database query for console actions

export default async function ConsolePage() {
  const currentUser = await getCurrentUser();
  const permissions = getRolePermissions(currentUser.role);

  // If the simulated user is a Public Visitor, block console access and redirect
  if (!permissions.canViewConsole) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl glass-panel border border-border-gray/30 text-center space-y-6 shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-signal-red/10 flex items-center justify-center text-signal-red mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black text-ink font-display uppercase">Access Restricted</h2>
          <p className="text-xs text-body-gray leading-relaxed">
            Public visitors do not have console clearance. To inspect the internal dashboards, please select a demo staff role in the header dropdown!
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary-indigo hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Landing Page</span>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch KPI counts
  const countiesCount = await prisma.county.count();
  const communitiesCount = await prisma.community.count();
  const leadersCount = await prisma.leaderProfile.count({
    where: { status: 'ACTIVE' }
  });
  const reportsCount = await prisma.weeklyReport.count();
  const ticketsCount = await prisma.helpdeskTicket.count({
    where: { status: 'OPEN' }
  });
  const approvalsCount = await prisma.verificationRequest.count({
    where: { status: 'PENDING' }
  });

  // Fetch recent weekly reports (last 5)
  const recentReports = await prisma.weeklyReport.findMany({
    orderBy: { submittedAt: 'desc' },
    take: 5,
    include: {
      community: true
    }
  });

  // Write a simulated visit audit log in the database
  const logDetails = `User logged into the command center. Role: [${currentUser.role}]. Dashboard synced.`;
  await prisma.auditLog.create({
    data: {
      action: 'CONSOLE_LOGIN',
      details: logDetails,
      ipAddress: '127.0.0.1',
    }
  });

  // Fetch audit logs for dashboard viewer (last 10)
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 8
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Console Sub-navigation Menu */}
      <div className="flex flex-wrap items-center gap-1 bg-white/45 border border-border-gray/30 p-2 rounded-2xl glass-panel shadow-sm text-xs font-bold">
        <Link href="/console" className="px-3.5 py-2 rounded-xl bg-primary-indigo text-white">
          Overview Dashboard
        </Link>
        <Link href="/console/reporting" className="px-3.5 py-2 rounded-xl text-body-gray hover:text-primary-indigo hover:bg-canvas-light">
          Field Reporting Module
        </Link>
        <Link href="/console/verification" className="px-3.5 py-2 rounded-xl text-body-gray hover:text-primary-indigo hover:bg-canvas-light">
          Leadership Approvals
        </Link>
        <Link href="/console/training" className="px-3.5 py-2 rounded-xl text-body-gray hover:text-primary-indigo hover:bg-canvas-light">
          Capacity Building
        </Link>
        <Link href="/console/helpdesk" className="px-3.5 py-2 rounded-xl text-body-gray hover:text-primary-indigo hover:bg-canvas-light">
          Community Helpdesk
        </Link>
        <Link href="/console/settings" className="px-3.5 py-2 rounded-xl text-body-gray hover:text-primary-indigo hover:bg-canvas-light">
          System Control Panel
        </Link>
      </div>

      {/* Main Console View */}
      <ConsoleDashboard
        currentUser={currentUser}
        stats={{ countiesCount, communitiesCount, leadersCount, reportsCount, ticketsCount, approvalsCount }}
        recentReports={recentReports}
        auditLogs={auditLogs}
      />

    </div>
  );
}
