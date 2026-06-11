import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing database records...');
  // Delete in order of dependencies
  await prisma.auditLog.deleteMany({});
  await prisma.systemSetting.deleteMany({});
  await prisma.helpdeskTicket.deleteMany({});
  await prisma.weeklyReport.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.trainingSession.deleteMany({});
  await prisma.trainingModule.deleteMany({});
  await prisma.trainingProgram.deleteMany({});
  await prisma.approvalRecord.deleteMany({});
  await prisma.verificationRequest.deleteMany({});
  await prisma.leaderProfile.deleteMany({});
  await prisma.leadershipRole.deleteMany({});
  await prisma.community.deleteMany({});
  await prisma.town.deleteMany({});
  await prisma.clan.deleteMany({});
  await prisma.district.deleteMany({});
  await prisma.county.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding System Settings...');
  await prisma.systemSetting.createMany({
    data: [
      { id: 'PLATFORM_NAME', value: 'CLISPConnect', description: 'Name of the main platform' },
      { id: 'PILOT_DISTRICT', value: 'District #10, Montserrado County', description: 'Current active pilot district' },
      { id: 'REPORTING_FREQUENCY', value: 'WEEKLY', description: 'Reporting interval for community secretaries' },
      { id: 'SYSTEM_STATUS', value: 'PILOT_ACTIVE', description: 'Current system operational phase' },
    ],
  });

  console.log('Seeding Leadership Roles...');
  const leadershipRoles = [
    { id: 'CHAIR', title: 'Community Chairperson', category: 'Functional', description: 'Elected leader managing community affairs' },
    { id: 'VCHAIR', title: 'Community Vice-Chairperson', category: 'Functional', description: 'Assists the chairperson in leadership duties' },
    { id: 'CHIEF', title: 'Town Chief / Elder', category: 'Traditional', description: 'Traditional authority and custodian of customary rules' },
    { id: 'WOMEN_REP', title: "Women's Representative", category: 'Women', description: 'Represents and coordinates women interests and forums' },
    { id: 'YOUTH_REP', title: 'Youth Representative', category: 'Youth', description: 'Voice for youth mobilization and capacity programs' },
    { id: 'PWD_REP', title: 'PWD Representative', category: 'PWD', description: 'Advocates for inclusion and rights of Persons with Disabilities' },
    { id: 'SEC', title: 'Community Secretary / Reporter', category: 'Functional', description: 'Maintains documentation and submits weekly reports to MLG' },
  ];

  for (const role of leadershipRoles) {
    await prisma.leadershipRole.create({ data: role });
  }

  console.log('Seeding Users (Demo Credentials)...');
  // Passwords will be stored in plain text or a mock hash for the demo, e.g. "clisp123"
  const demoUsers = [
    {
      email: 'admin@clispconnect.gov.lr',
      name: 'Super Admin User',
      passwordHash: 'clisp123',
      role: 'Super Admin',
    },
    {
      email: 'mia.admin@clispconnect.gov.lr',
      name: 'Hon. Tamba Kollie',
      passwordHash: 'clisp123',
      role: 'MLG National Admin',
    },
    {
      email: 'clef.admin@clispconnect.gov.lr',
      name: 'Madame Satta Sheriff',
      passwordHash: 'clisp123',
      role: 'CLEF National Admin',
    },
    {
      email: 'county.mont@clispconnect.gov.lr',
      name: 'Jefferson Koijee Jr.',
      passwordHash: 'clisp123',
      role: 'County Coordinator',
      countyId: 'MONT',
    },
    {
      email: 'dist10.coord@clispconnect.gov.lr',
      name: 'Emmanuel Flomo',
      passwordHash: 'clisp123',
      role: 'District Coordinator',
      countyId: 'MONT',
      districtId: 'MONT-D10',
    },
    {
      email: 'registry.officer@clispconnect.gov.lr',
      name: 'Kofi Sackie',
      passwordHash: 'clisp123',
      role: 'Registry Officer',
    },
    {
      email: 'helpdesk@clispconnect.gov.lr',
      name: 'Sarah Mulbah',
      passwordHash: 'clisp123',
      role: 'Community Desk Officer',
    },
    {
      email: 'trainer@clispconnect.gov.lr',
      name: 'Dr. Josephus Cooper',
      passwordHash: 'clisp123',
      role: 'Trainer',
    },
    {
      email: 'leader.chugbor@clispconnect.gov.lr',
      name: 'Chief Jallah Coleman',
      passwordHash: 'clisp123',
      role: 'Community Leader',
    },
    {
      email: 'secretary.chugbor@clispconnect.gov.lr',
      name: 'Princess Kamara',
      passwordHash: 'clisp123',
      role: 'Community Secretary',
    },
    {
      email: 'visitor@clispconnect.gov.lr',
      name: 'Public Visitor',
      passwordHash: 'clisp123',
      role: 'Public Visitor',
    },
  ];

  for (const u of demoUsers) {
    await prisma.user.create({ data: u });
  }

  console.log('Seeding Counties...');
  const counties = [
    { id: 'MONT', name: 'Montserrado', code: 'LR-MO', latitude: 6.3106, longitude: -10.7969 },
    { id: 'NIMB', name: 'Nimba', code: 'LR-NI', latitude: 7.1432, longitude: -8.7291 },
    { id: 'LOFA', name: 'Lofa', code: 'LR-LO', latitude: 8.2140, longitude: -9.8458 },
    { id: 'GBAS', name: 'Grand Bassa', code: 'LR-GB', latitude: 5.9232, longitude: -9.8458 },
    { id: 'SINO', name: 'Sinoe', code: 'LR-SI', latitude: 5.3850, longitude: -8.6601 },
    { id: 'MARY', name: 'Maryland', code: 'LR-MY', latitude: 4.5447, longitude: -7.7124 },
    { id: 'GGED', name: 'Grand Gedeh', code: 'LR-GG', latitude: 5.9620, longitude: -8.1348 },
    { id: 'RGEE', name: 'River Gee', code: 'LR-RG', latitude: 5.2393, longitude: -7.9546 },
    { id: 'CMNT', name: 'Grand Cape Mount', code: 'LR-CM', latitude: 6.9406, longitude: -11.2361 },
    { id: 'BOMI', name: 'Bomi', code: 'LR-BM', latitude: 6.6433, longitude: -10.8402 },
    { id: 'GBAR', name: 'Gbarpolu', code: 'LR-GP', latitude: 7.4984, longitude: -10.2223 },
    { id: 'MARG', name: 'Margibi', code: 'LR-MG', latitude: 6.5152, longitude: -10.3048 },
    { id: 'BONG', name: 'Bong', code: 'LR-BG', latitude: 7.0090, longitude: -9.7508 },
    { id: 'RCES', name: 'Rivercess', code: 'LR-RC', latitude: 5.6791, longitude: -9.4891 },
    { id: 'GKRU', name: 'Grand Kru', code: 'LR-GK', latitude: 4.7797, longitude: -8.2244 },
  ];

  for (const c of counties) {
    await prisma.county.create({ data: c });
  }

  console.log('Seeding District #10 (Montserrado) administrative tree...');
  const district = await prisma.district.create({
    data: {
      id: 'MONT-D10',
      name: 'District #10',
      countyId: 'MONT',
    },
  });

  const clan = await prisma.clan.create({
    data: {
      id: 'MONT-D10-C1',
      name: 'Congotown Clan',
      districtId: district.id,
    },
  });

  const town1 = await prisma.town.create({
    data: { id: 'MONT-D10-C1-T1', name: 'Congotown East', clanId: clan.id },
  });
  const town2 = await prisma.town.create({
    data: { id: 'MONT-D10-C1-T2', name: 'Congotown West', clanId: clan.id },
  });

  console.log('Seeding Communities in District #10 with GIS markers...');
  const communities = [
    {
      id: 'comm-chugbor',
      name: 'Old Road Chugbor',
      townId: town1.id,
      latitude: 6.2758,
      longitude: -10.7523,
      elevation: 12.4,
      precision: 'GPS_High_Precision',
      verificationState: 'VERIFIED',
      publicStatus: true,
      officialNotes: 'Official CLEF Pilot headquarters. Fully mapped with structures cataloged.',
    },
    {
      id: 'comm-gayetown',
      name: 'Gayetown',
      townId: town1.id,
      latitude: 6.2795,
      longitude: -10.7450,
      elevation: 14.1,
      precision: 'GPS_Standard',
      verificationState: 'VERIFIED',
      publicStatus: true,
      officialNotes: 'Active weekly reporting since launch.',
    },
    {
      id: 'comm-peaceisland',
      name: 'Peace Island',
      townId: town2.id,
      latitude: 6.2910,
      longitude: -10.7312,
      elevation: 5.2,
      precision: 'GPS_Standard',
      verificationState: 'VERIFIED',
      publicStatus: true,
      officialNotes: 'Island community with high density, requires specific water point monitoring.',
    },
    {
      id: 'comm-keyhole',
      name: 'Keyhole',
      townId: town1.id,
      latitude: 6.2715,
      longitude: -10.7589,
      elevation: 10.8,
      precision: 'GPS_Standard',
      verificationState: 'VERIFIED',
      publicStatus: true,
      officialNotes: 'Commercial activity hub, border roads verified.',
    },
    {
      id: 'comm-gsaroad',
      name: 'GSA Road Community',
      townId: town2.id,
      latitude: 6.2730,
      longitude: -10.7180,
      elevation: 16.5,
      precision: 'GPS_Standard',
      verificationState: 'PENDING',
      publicStatus: false,
      officialNotes: 'Registration details submitted, leadership elections pending verification.',
    },
    {
      id: 'comm-fiamah',
      name: 'Fiamah Community',
      townId: town1.id,
      latitude: 6.2912,
      longitude: -10.7611,
      elevation: 9.3,
      precision: 'GPS_High_Precision',
      verificationState: 'VERIFIED',
      publicStatus: true,
      officialNotes: 'Densely populated, youth leadership fully structured.',
    },
    {
      id: 'comm-matadi',
      name: 'Matadi Community',
      townId: town1.id,
      latitude: 6.2818,
      longitude: -10.7801,
      elevation: 8.1,
      precision: 'Rough_Estimate',
      verificationState: 'VERIFIED',
      publicStatus: true,
      officialNotes: 'Housing estate area, includes public playground.',
    },
    {
      id: 'comm-sayetown',
      name: 'Saye Town',
      townId: town2.id,
      latitude: 6.3005,
      longitude: -10.7885,
      elevation: 11.2,
      precision: 'GPS_Standard',
      verificationState: 'REJECTED',
      publicStatus: false,
      officialNotes: 'Boundary dispute with neighboring clan. Verification put on hold.',
    },
  ];

  for (const comm of communities) {
    await prisma.community.create({ data: comm });
  }

  console.log('Seeding Leader Profiles for Old Road Chugbor (Full Structure)...');
  const leadersChugbor = [
    {
      firstName: 'Jallah',
      lastName: 'Coleman',
      phone: '+231-886-554-321',
      email: 'jallah.coleman@clisp.gov.lr',
      gender: 'Male',
      isYouth: false,
      isPWD: false,
      roleId: 'CHAIR',
      communityId: 'comm-chugbor',
      termStart: new Date('2024-01-10'),
      status: 'ACTIVE',
    },
    {
      firstName: 'Princess',
      lastName: 'Kamara',
      phone: '+231-770-443-889',
      email: 'princess.kamara@clisp.gov.lr',
      gender: 'Female',
      isYouth: true,
      isPWD: false,
      roleId: 'SEC',
      communityId: 'comm-chugbor',
      termStart: new Date('2024-01-10'),
      status: 'ACTIVE',
    },
    {
      firstName: 'Sando',
      lastName: 'Kenneh',
      phone: '+231-886-902-114',
      email: 'sando.kenneh@clisp.gov.lr',
      gender: 'Female',
      isYouth: false,
      isPWD: false,
      roleId: 'WOMEN_REP',
      communityId: 'comm-chugbor',
      termStart: new Date('2024-01-12'),
      status: 'ACTIVE',
    },
    {
      firstName: 'Arthur',
      lastName: 'Sheriff',
      phone: '+231-775-110-229',
      email: 'arthur.sheriff@clisp.gov.lr',
      gender: 'Male',
      isYouth: true,
      isPWD: false,
      roleId: 'YOUTH_REP',
      communityId: 'comm-chugbor',
      termStart: new Date('2024-01-15'),
      status: 'ACTIVE',
    },
    {
      firstName: 'Emmanuel',
      lastName: 'Toe',
      phone: '+231-886-444-999',
      email: 'emmanuel.toe@clisp.gov.lr',
      gender: 'Male',
      isYouth: false,
      isPWD: true,
      roleId: 'PWD_REP',
      communityId: 'comm-chugbor',
      termStart: new Date('2024-01-20'),
      status: 'ACTIVE',
    },
    {
      firstName: 'Elder Moses',
      lastName: 'Gboko',
      phone: '+231-886-332-111',
      gender: 'Male',
      isYouth: false,
      isPWD: false,
      roleId: 'CHIEF',
      communityId: 'comm-chugbor',
      termStart: new Date('2018-05-01'),
      status: 'ACTIVE',
    },
  ];

  for (const lp of leadersChugbor) {
    await prisma.leaderProfile.create({ data: lp });
  }

  // Seed some other leaders in Peace Island and Gayetown
  await prisma.leaderProfile.create({
    data: {
      firstName: 'Fatu',
      lastName: 'Bility',
      phone: '+231-776-880-990',
      email: 'fatu.bility@clisp.gov.lr',
      gender: 'Female',
      isYouth: false,
      isPWD: false,
      roleId: 'CHAIR',
      communityId: 'comm-peaceisland',
      termStart: new Date('2024-02-01'),
      status: 'ACTIVE',
    },
  });

  await prisma.leaderProfile.create({
    data: {
      firstName: 'Garmai',
      lastName: 'Flomo',
      phone: '+231-886-112-233',
      email: 'garmai.flomo@clisp.gov.lr',
      gender: 'Female',
      isYouth: true,
      isPWD: false,
      roleId: 'SEC',
      communityId: 'comm-gayetown',
      termStart: new Date('2024-01-15'),
      status: 'ACTIVE',
    },
  });

  console.log('Seeding Weekly Reports (Weekly digital reporting flow)...');
  const reports = [
    {
      communityId: 'comm-chugbor',
      reporterId: 'secretary.chugbor@clispconnect.gov.lr',
      reporterName: 'Princess Kamara',
      weekEnding: new Date('2026-06-07'),
      submittedAt: new Date('2026-06-07T16:30:00Z'),
      status: 'SUBMITTED',
      projectUpdates: 'Construction of the new community handpump is 80% complete. Casing has been poured.',
      securityIncidents: 'No major security issues. Peaceful community watch patrols carried out.',
      disasterIncidents: 'Minor drainage blockage near the main market after Wednesday rain, cleared by local youth.',
      healthTrends: 'Increase in malaria cases reported among children; request bed net distribution.',
      infrastructureNeeds: 'Need for additional solar streetlights along the dark Keyhole-Chugbor link road.',
      alertLevel: 'LOW',
      officialResponse: 'MLG Registry Desk: Report received. Coordinating with Ministry of Health for bed nets.',
    },
    {
      communityId: 'comm-peaceisland',
      reporterId: 'fatu.bility@clisp.gov.lr',
      reporterName: 'Fatu Bility',
      weekEnding: new Date('2026-06-07'),
      submittedAt: new Date('2026-06-07T17:15:00Z'),
      status: 'SUBMITTED',
      projectUpdates: 'Youth community garden project harvested first batch of greens for elderly residents.',
      securityIncidents: 'Land dispute argument resolved peacefully by the Traditional Chief. No police required.',
      disasterIncidents: 'High tide caused minor flooding in low-lying waterfront houses. Residents relocated temporarily.',
      healthTrends: 'Public clinic running low on standard rehydration salts. Local clinic staff issued warning.',
      infrastructureNeeds: 'Bridge connecting Peace Island to the mainland has loose planks, dangerous for motorbikes. Critical repair needed.',
      alertLevel: 'MEDIUM',
      officialResponse: 'MLG District Coordinator: Technical team dispatched to assess bridge planks.',
    },
    {
      communityId: 'comm-gayetown',
      reporterId: 'garmai.flomo@clisp.gov.lr',
      reporterName: 'Garmai Flomo',
      weekEnding: new Date('2026-05-31'),
      submittedAt: new Date('2026-05-31T15:00:00Z'),
      status: 'REVIEWED',
      projectUpdates: 'Sanitation clean-up campaign successfully completed on Saturday. 45 youth participated.',
      securityIncidents: 'Market area petty theft incident reported; suspect apprehended and turned over to police.',
      disasterIncidents: 'Erosion threatening the foundation of the community library building near the swamp.',
      healthTrends: 'No major health outbreaks. Water points chlorinated this week.',
      infrastructureNeeds: 'Requires support to block swamp erosion with concrete retaining wall.',
      alertLevel: 'HIGH',
      officialResponse: 'CLEF Office: Contacting Ministry of Public Works regarding library erosion threat.',
    },
  ];

  for (const rep of reports) {
    await prisma.weeklyReport.create({ data: rep });
  }

  console.log('Seeding Capacity Building (UN-HABITAT Competency syllabus)...');
  const program = await prisma.trainingProgram.create({
    data: {
      id: 'UNH-CL',
      name: 'UN-HABITAT Community Leadership Competency Certificate',
      description: 'Standard curriculum for formal leadership of urban and rural communities, focusing on inclusion, reporting, and sustainable development.',
    },
  });

  const modules = [
    { id: 'UNH-MOD1', title: 'Democratic & Representative Decision Making', description: 'Techniques for conducting inclusive town halls, voting, and consensus building.', orderIndex: 1, programId: program.id },
    { id: 'UNH-MOD2', title: 'Conflict Mediation & Dispute Resolution', description: 'Traditional and legal framework negotiation models to de-escalate community disputes.', orderIndex: 2, programId: program.id },
    { id: 'UNH-MOD3', title: 'Social Inclusion & Gender Equity', description: 'Ensuring women, youth, and PWD voice in council resolutions and project designs.', orderIndex: 3, programId: program.id },
    { id: 'UNH-MOD4', title: 'Resource Accountability & Local Development', description: 'Financial bookkeeping, project proposal writing, and weekly ground-truth reporting.', orderIndex: 4, programId: program.id },
  ];

  for (const mod of modules) {
    await prisma.trainingModule.create({ data: mod });
  }

  // Create active session
  const activeLeader = await prisma.leaderProfile.findFirst({
    where: { firstName: 'Jallah', lastName: 'Coleman' },
  });

  if (activeLeader) {
    const session = await prisma.trainingSession.create({
      data: {
        moduleId: 'UNH-MOD1',
        trainerName: 'Dr. Josephus Cooper',
        date: new Date('2026-06-01T09:00:00Z'),
        location: 'District #10 Town Hall, Old Road',
        communityId: 'comm-chugbor',
      },
    });

    await prisma.attendanceRecord.create({
      data: {
        sessionId: session.id,
        leaderId: activeLeader.id,
        status: 'PRESENT',
      },
    });

    // Create a mock Certificate for the Chairperson
    await prisma.certificate.create({
      data: {
        leaderId: activeLeader.id,
        programId: program.id,
        issueDate: new Date('2026-06-02'),
        certificateNumber: 'CLEF-MLG-2026-0001',
        isVerified: true,
      },
    });
  }

  console.log('Seeding Helpdesk Tickets...');
  await prisma.helpdeskTicket.createMany({
    data: [
      {
        communityId: 'comm-chugbor',
        name: 'Chief Jallah Coleman',
        contactInfo: '+231-886-554-321',
        category: 'Data Correction',
        subject: 'Updating Secretary Mobile Number',
        message: 'The phone number for our secretary Princess Kamara was registered incorrectly. It should be +231-770-443-889.',
        status: 'RESOLVED',
        notes: 'Updated database phone number manually. Notified leader via SMS.',
      },
      {
        communityId: 'comm-gsaroad',
        name: 'Pastor Abraham Cooper',
        contactInfo: '+231-777-502-311',
        category: 'Registration Help',
        subject: 'Pending Verification for GSA Road',
        message: 'We submitted our community coordinates and leadership list three weeks ago, but our profile is still pending. We want to start submitting weekly reports.',
        status: 'OPEN',
        notes: 'Waiting for District Coordinator to sign off on elections minutes.',
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
