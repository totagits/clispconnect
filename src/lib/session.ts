export interface DemoUser {
  email: string;
  name: string;
  role: string;
  countyId?: string;
  districtId?: string;
  description: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'admin@clispconnect.gov.lr',
    name: 'Super Admin User',
    role: 'Super Admin',
    description: 'Full system authorization, setting management, logs oversight'
  },
  {
    email: 'mia.admin@clispconnect.gov.lr',
    name: 'Hon. Tamba Kollie',
    role: 'MIA National Admin',
    description: 'Ministry oversight, national dashboard, policy control'
  },
  {
    email: 'clef.admin@clispconnect.gov.lr',
    name: 'Madame Satta Sheriff',
    role: 'CLEF National Admin',
    description: 'Civil society oversight, training tracker, program monitoring'
  },
  {
    email: 'county.mont@clispconnect.gov.lr',
    name: 'Jefferson Koijee Jr.',
    role: 'County Coordinator',
    countyId: 'MONT',
    description: 'Montserrado County leadership verifications and audits'
  },
  {
    email: 'dist10.coord@clispconnect.gov.lr',
    name: 'Emmanuel Flomo',
    role: 'District Coordinator',
    countyId: 'MONT',
    districtId: 'MONT-D10',
    description: 'District #10 pilot overseer, report reviews, local certifications'
  },
  {
    email: 'registry.officer@clispconnect.gov.lr',
    name: 'Kofi Sackie',
    role: 'Registry Officer',
    description: 'National Registry (NRCL) community validation and geo-indexing'
  },
  {
    email: 'helpdesk@clispconnect.gov.lr',
    name: 'Sarah Mulbah',
    role: 'Community Desk Officer',
    description: 'Correction ticket manager, public dispute mediation support'
  },
  {
    email: 'trainer@clispconnect.gov.lr',
    name: 'Dr. Josephus Cooper',
    role: 'Trainer',
    description: 'UN-HABITAT course scheduling, attendance submission, certificates'
  },
  {
    email: 'leader.chugbor@clispconnect.gov.lr',
    name: 'Chief Jallah Coleman',
    role: 'Community Leader',
    description: 'Old Road Chugbor Chairperson. Approves weekly report contents'
  },
  {
    email: 'secretary.chugbor@clispconnect.gov.lr',
    name: 'Princess Kamara',
    role: 'Community Secretary',
    description: 'Old Road Chugbor Secretary. Drafts and submits weekly report sheets'
  },
  {
    email: 'visitor@clispconnect.gov.lr',
    name: 'Public Visitor',
    role: 'Public Visitor',
    description: 'Read-only access to public NRCL directory, pilot statistics'
  }
];

export interface RolePermissions {
  canApproveLeaders: boolean;
  canSubmitReport: boolean;
  canManageTraining: boolean;
  canManageHelpdesk: boolean;
  canViewConsole: boolean;
  isNationalAdmin: boolean;
  isCoordinator: boolean;
}

export const getRolePermissions = (role: string): RolePermissions => {
  return {
    canApproveLeaders: ['Super Admin', 'MIA National Admin', 'CLEF National Admin', 'Registry Officer', 'County Coordinator', 'District Coordinator'].includes(role),
    canSubmitReport: ['Super Admin', 'Community Leader', 'Community Secretary'].includes(role),
    canManageTraining: ['Super Admin', 'CLEF National Admin', 'Trainer'].includes(role),
    canManageHelpdesk: ['Super Admin', 'Community Desk Officer', 'MIA National Admin'].includes(role),
    canViewConsole: role !== 'Public Visitor',
    isNationalAdmin: ['Super Admin', 'MIA National Admin', 'CLEF National Admin'].includes(role),
    isCoordinator: ['County Coordinator', 'District Coordinator'].includes(role),
  };
};

export const DEFAULT_USER = DEMO_USERS.find(u => u.role === 'Public Visitor') || DEMO_USERS[DEMO_USERS.length - 1];
