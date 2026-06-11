import React from 'react';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import prisma from '../../../lib/db';
import { getCurrentUser } from '../../../lib/auth';
import { getRolePermissions } from '../../../lib/session';
import Link from 'next/link';
import { AlertCircle, FileText, Send, CheckCircle2, ShieldAlert, Waves, HeartPulse, HardHat, FileSpreadsheet } from 'lucide-react';

export const revalidate = 0; // Dynamic database loading

export default async function ReportingModulePage() {
  const currentUser = await getCurrentUser();
  const permissions = getRolePermissions(currentUser.role);

  if (!permissions.canViewConsole) {
    redirect('/');
  }

  // Fetch list of communities for report dropdown selector
  const communities = await prisma.community.findMany({
    orderBy: { name: 'asc' }
  });

  // Query submitted weekly reports from the database
  // If the user is a Community Leader/Secretary, only show their community's reports for privacy. Otherwise, show all.
  let reportsClause: any = {};
  if (currentUser.role === 'Community Leader' || currentUser.role === 'Community Secretary') {
    reportsClause.community = {
      name: 'Old Road Chugbor' // Seeded community for this demo leader
    };
  }

  const reports = await prisma.weeklyReport.findMany({
    where: reportsClause,
    include: {
      community: true
    },
    orderBy: { weekEnding: 'desc' }
  });

  // Server Action to process new report submissions
  async function handleReportSubmit(formData: FormData) {
    'use server';
    
    const communityId = formData.get('communityId') as string;
    const weekEndingString = formData.get('weekEnding') as string;
    const projectUpdates = formData.get('projectUpdates') as string;
    const securityIncidents = formData.get('securityIncidents') as string;
    const disasterIncidents = formData.get('disasterIncidents') as string;
    const healthTrends = formData.get('healthTrends') as string;
    const infrastructureNeeds = formData.get('infrastructureNeeds') as string;
    const alertLevel = formData.get('alertLevel') as string;

    if (!communityId || !weekEndingString) {
      return;
    }

    // Write to the weekly reports table
    await prisma.weeklyReport.create({
      data: {
        communityId,
        reporterId: currentUser.email,
        reporterName: currentUser.name,
        weekEnding: new Date(weekEndingString),
        status: 'SUBMITTED',
        projectUpdates: projectUpdates || null,
        securityIncidents: securityIncidents || null,
        disasterIncidents: disasterIncidents || null,
        healthTrends: healthTrends || null,
        infrastructureNeeds: infrastructureNeeds || null,
        alertLevel,
      }
    });

    // Log the submission activity
    await prisma.auditLog.create({
      data: {
        action: 'REPORT_SUBMIT',
        details: `Submitted weekly report for community ID [${communityId}]. Alert level: [${alertLevel}].`,
        userId: currentUser.email,
      }
    });

    revalidatePath('/console/reporting');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Console Sub-navigation Menu */}
      <div className="flex flex-wrap items-center gap-1 bg-white/45 border border-border-gray/30 p-2 rounded-2xl glass-panel shadow-sm text-xs font-bold">
        <Link href="/console" className="px-3.5 py-2 rounded-xl text-body-gray hover:text-primary-indigo hover:bg-canvas-light">
          Overview Dashboard
        </Link>
        <Link href="/console/reporting" className="px-3.5 py-2 rounded-xl bg-primary-indigo text-white">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Submit Form (Only shown if authorized) */}
        {permissions.canSubmitReport ? (
          <div className="lg:col-span-5 p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4 h-fit">
            <div className="border-b border-border-gray/30 pb-3 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-indigo" />
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">Submit Weekly Field Sheet</h3>
            </div>

            <form action={handleReportSubmit} className="space-y-3.5 text-xs">
              
              {/* Select target community */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Target Community</label>
                <select
                  name="communityId"
                  required
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink cursor-pointer"
                >
                  {currentUser.role === 'Community Leader' || currentUser.role === 'Community Secretary' ? (
                    // Lock to their designated community (Old Road Chugbor)
                    communities
                      .filter(c => c.name === 'Old Road Chugbor')
                      .map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                  ) : (
                    // Administrators see all communities
                    communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                  )}
                </select>
              </div>

              {/* Week Ending date picker */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Week Ending Date</label>
                <input
                  type="date"
                  name="weekEnding"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink"
                />
              </div>

              {/* Project Updates */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-civic-green" />
                  <span>Development Project Updates</span>
                </label>
                <textarea
                  name="projectUpdates"
                  rows={2}
                  placeholder="e.g. status of handpump repairs, community school maintenance..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink"
                />
              </div>

              {/* Security / Conflict */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-signal-red" />
                  <span>Security & Border Incidents</span>
                </label>
                <textarea
                  name="securityIncidents"
                  rows={2}
                  placeholder="e.g. property disputes, border conflicts, watch patrol reports..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink"
                />
              </div>

              {/* Weather / Disaster */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-sand-gold" />
                  <span>Disasters & Weather Incidents</span>
                </label>
                <textarea
                  name="disasterIncidents"
                  rows={2}
                  placeholder="e.g. heavy flooding, road erosion blocks, brushfires..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink"
                />
              </div>

              {/* Health Trends */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-coast-teal" />
                  <span>Public Health Trends</span>
                </label>
                <textarea
                  name="healthTrends"
                  rows={2}
                  placeholder="e.g. water safety issues, malaria case increases, clinic stockouts..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink"
                />
              </div>

              {/* Infrastructure Needs */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider flex items-center gap-1">
                  <HardHat className="w-3.5 h-3.5 text-primary-indigo" />
                  <span>Critical Infrastructure Needs</span>
                </label>
                <textarea
                  name="infrastructureNeeds"
                  rows={2}
                  placeholder="e.g. solar streetlight failures, collapsed bridge planks, well chlorination..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink"
                />
              </div>

              {/* Alert Level selector */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Local Alert Level</label>
                <div className="flex gap-4">
                  {['LOW', 'MEDIUM', 'HIGH'].map(level => (
                    <label key={level} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="alertLevel"
                        value={level}
                        defaultChecked={level === 'LOW'}
                        className="text-primary-indigo focus:ring-primary-indigo"
                      />
                      <span className={`text-[10px] font-bold ${
                        level === 'LOW' ? 'text-civic-green' :
                        level === 'MEDIUM' ? 'text-sand-gold' : 'text-signal-red'
                      }`}>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Weekly Sheet</span>
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div className="lg:col-span-5 p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md text-center space-y-4 h-fit text-xs text-body-gray leading-relaxed">
            <AlertCircle className="w-8 h-8 text-sand-gold mx-auto" />
            <h3 className="text-sm font-bold text-ink uppercase tracking-wide">Submission Locked</h3>
            <p>
              Your simulated role <strong>{currentUser.role}</strong> does not have permission to submit weekly report sheets.
            </p>
            <p className="bg-canvas-light p-2.5 rounded-lg border border-border-gray/20">
              To test the submission workflow, switch your role to <strong>Community Secretary</strong> or <strong>Community Leader</strong> in the header dropdown!
            </p>
          </div>
        )}

        {/* Right Side: Reports Timeline Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
            <div className="border-b border-border-gray/30 pb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
                <FileSpreadsheet className="w-5 h-5 text-coast-teal" />
                <span>Submitted Reports Timeline</span>
              </span>
              <span className="text-[10px] bg-canvas-light text-primary-indigo font-bold px-2 py-0.5 rounded-full border border-border-gray/30">
                {reports.length} Records
              </span>
            </div>

            {reports.length > 0 ? (
              <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                {reports.map((rep) => (
                  <div key={rep.id} className="border border-border-gray/30 p-4 rounded-xl space-y-3 bg-white/40 hover:bg-white/70 transition-all text-xs">
                    
                    {/* Header info card */}
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-sm text-ink">{rep.community.name}</strong>
                        <span className="block text-[10px] text-body-gray">Township: {rep.community.townId}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                          rep.alertLevel === 'LOW' ? 'bg-civic-green/10 text-civic-green border-civic-green/20' :
                          rep.alertLevel === 'MEDIUM' ? 'bg-sand-gold/10 text-sand-gold border-sand-gold/20' :
                          'bg-signal-red/10 text-signal-red border-signal-red/20'
                        }`}>
                          {rep.alertLevel} ALERT
                        </span>
                        
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded border bg-primary-indigo/5 text-primary-indigo border-primary-indigo/20">
                          {rep.status}
                        </span>
                      </div>
                    </div>

                    {/* Reported Fields list */}
                    <div className="space-y-2 border-t border-b border-border-gray/20 py-2 text-[11px] leading-relaxed text-body-gray">
                      {rep.projectUpdates && (
                        <div>
                          <strong className="text-ink text-[9px] uppercase tracking-wide flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-civic-green" /> Projects:
                          </strong>
                          <p className="pl-2">{rep.projectUpdates}</p>
                        </div>
                      )}
                      {rep.securityIncidents && (
                        <div>
                          <strong className="text-ink text-[9px] uppercase tracking-wide flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-signal-red" /> Security:
                          </strong>
                          <p className="pl-2">{rep.securityIncidents}</p>
                        </div>
                      )}
                      {rep.disasterIncidents && (
                        <div>
                          <strong className="text-ink text-[9px] uppercase tracking-wide flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-sand-gold" /> Weather/Disaster:
                          </strong>
                          <p className="pl-2">{rep.disasterIncidents}</p>
                        </div>
                      )}
                      {rep.healthTrends && (
                        <div>
                          <strong className="text-ink text-[9px] uppercase tracking-wide flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-coast-teal" /> Public Health:
                          </strong>
                          <p className="pl-2">{rep.healthTrends}</p>
                        </div>
                      )}
                      {rep.infrastructureNeeds && (
                        <div>
                          <strong className="text-ink text-[9px] uppercase tracking-wide flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-primary-indigo" /> Infrastructure:
                          </strong>
                          <p className="pl-2">{rep.infrastructureNeeds}</p>
                        </div>
                      )}
                    </div>

                    {/* Official Response */}
                    {rep.officialResponse && (
                      <div className="bg-primary-indigo/5 border border-primary-indigo/15 rounded-xl p-2.5">
                        <strong className="text-[9px] uppercase text-primary-indigo block tracking-wider">MIA Coordinator Feedback</strong>
                        <p className="text-[10px] text-primary-indigo/80 leading-normal mt-0.5 italic">"{rep.officialResponse}"</p>
                      </div>
                    )}

                    {/* Reporter details */}
                    <div className="flex justify-between items-center text-[9px] text-body-gray">
                      <span>Submitted by: <strong>{rep.reporterName}</strong> ({rep.reporterId})</span>
                      <span>Week ending: {new Date(rep.weekEnding).toLocaleDateString()}</span>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl border border-border-gray/30 bg-white/40">
                <FileText className="w-8 h-8 text-body-gray/40 mx-auto mb-2" />
                <p className="text-xs text-body-gray">No weekly reports have been logged in the database yet.</p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
