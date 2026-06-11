import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '../../lib/db';
import { getCurrentUser } from '../../lib/auth';
import { getRolePermissions } from '../../lib/session';
import ConsoleDashboard from '../../components/ConsoleDashboard';
import ConsoleNav from '../../components/ConsoleNav';

export const revalidate = 0; // Fresh database query for console actions

export default async function ConsolePage() {
  const currentUser = await getCurrentUser();
  const permissions = getRolePermissions(currentUser.role);

  if (!permissions.canViewConsole) {
    redirect('/login?error=Please sign in to access the Command Center');
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
      
      {/* Dynamic Console Sub-navigation */}
      <ConsoleNav currentUser={currentUser} activeTab="overview" />

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
