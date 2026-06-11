import React from 'react';
import Link from 'next/link';
import { DemoUser, getRolePermissions } from '../lib/session';

interface ConsoleNavProps {
  currentUser: DemoUser;
  activeTab: 'overview' | 'reporting' | 'verification' | 'training' | 'helpdesk' | 'settings';
}

export default function ConsoleNav({ currentUser, activeTab }: ConsoleNavProps) {
  const permissions = getRolePermissions(currentUser.role);

  // Tab definitions with associated permission checks
  const tabs = [
    {
      id: 'overview',
      label: 'Overview Dashboard',
      href: '/console',
      show: true, // visible to all console users
    },
    {
      id: 'reporting',
      label: 'Field Reporting Module',
      href: '/console/reporting',
      show: permissions.canSubmitReport || permissions.isNationalAdmin || permissions.isCoordinator,
    },
    {
      id: 'verification',
      label: 'Leadership Approvals',
      href: '/console/verification',
      show: permissions.canApproveLeaders,
    },
    {
      id: 'training',
      label: 'Capacity Building',
      href: '/console/training',
      show: permissions.canManageTraining || permissions.isNationalAdmin || permissions.isCoordinator,
    },
    {
      id: 'helpdesk',
      label: 'Community Helpdesk',
      href: '/console/helpdesk',
      show: permissions.canManageHelpdesk || permissions.isNationalAdmin || permissions.isCoordinator,
    },
    {
      id: 'settings',
      label: 'System Control Panel',
      href: '/console/settings',
      show: currentUser.role === 'Super Admin',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 bg-white/45 border border-border-gray/30 p-2 rounded-2xl glass-panel shadow-sm text-xs font-bold">
      {tabs
        .filter((tab) => tab.show)
        .map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-primary-indigo text-white shadow-sm font-bold'
                : 'text-body-gray hover:text-primary-indigo hover:bg-canvas-light font-semibold'
            }`}
          >
            {tab.label}
          </Link>
        ))}
    </div>
  );
}
