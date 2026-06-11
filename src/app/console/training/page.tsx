import React from 'react';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import prisma from '../../../lib/db';
import { getCurrentUser } from '../../../lib/auth';
import { getRolePermissions } from '../../../lib/session';
import Link from 'next/link';
import { BookOpen, Calendar, MapPin, Users, Award, AlertCircle, PlusCircle, CheckCircle } from 'lucide-react';

export const revalidate = 0; // Dynamic database updates

export default async function TrainingModulePage() {
  const currentUser = await getCurrentUser();
  const permissions = getRolePermissions(currentUser.role);

  if (!permissions.canViewConsole) {
    redirect('/');
  }

  // Fetch training program and modules
  const program = await prisma.trainingProgram.findFirst({
    include: {
      modules: {
        orderBy: { orderIndex: 'asc' }
      }
    }
  });

  // Fetch active sessions with attendance records
  const sessions = await prisma.trainingSession.findMany({
    include: {
      module: true,
      community: true,
      attendanceRecords: {
        include: {
          leader: true
        }
      }
    },
    orderBy: { date: 'desc' }
  });

  // Fetch communities to schedule training
  const communities = await prisma.community.findMany({
    where: { verificationState: 'VERIFIED' },
    orderBy: { name: 'asc' }
  });

  // Server Action to schedule a new training session
  async function handleAddSession(formData: FormData) {
    'use server';

    const moduleId = formData.get('moduleId') as string;
    const dateString = formData.get('date') as string;
    const location = formData.get('location') as string;
    const communityId = formData.get('communityId') as string;

    if (!moduleId || !dateString || !location || !communityId) {
      return;
    }

    await prisma.trainingSession.create({
      data: {
        moduleId,
        trainerName: currentUser.name,
        date: new Date(dateString),
        location,
        communityId,
      }
    });

    // Log the training creation
    await prisma.auditLog.create({
      data: {
        action: 'TRAINING_SCHEDULE',
        details: `Scheduled training session for module [${moduleId}] in community ID [${communityId}].`,
        userId: currentUser.email,
      }
    });

    revalidatePath('/console/training');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Console Sub-navigation Menu */}
      <div className="flex flex-wrap items-center gap-1 bg-white/45 border border-border-gray/30 p-2 rounded-2xl glass-panel shadow-sm text-xs font-bold">
        <Link href="/console" className="px-3.5 py-2 rounded-xl text-body-gray hover:text-primary-indigo hover:bg-canvas-light">
          Overview Dashboard
        </Link>
        <Link href="/console/reporting" className="px-3.5 py-2 rounded-xl text-body-gray hover:text-primary-indigo hover:bg-canvas-light">
          Field Reporting Module
        </Link>
        <Link href="/console/verification" className="px-3.5 py-2 rounded-xl text-body-gray hover:text-primary-indigo hover:bg-canvas-light">
          Leadership Approvals
        </Link>
        <Link href="/console/training" className="px-3.5 py-2 rounded-xl bg-primary-indigo text-white">
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
        
        {/* Left Side: Syllabus Modules Checklist (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
            <div className="border-b border-border-gray/30 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-indigo" />
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">UN-HABITAT Syllabus</h3>
            </div>

            {program ? (
              <div className="space-y-4">
                <div className="bg-primary-indigo/5 border border-primary-indigo/15 p-3 rounded-xl space-y-1">
                  <strong className="text-xs text-primary-indigo">{program.name}</strong>
                  <p className="text-[10px] text-body-gray leading-normal">{program.description}</p>
                </div>

                <div className="space-y-2.5">
                  {program.modules.map(mod => (
                    <div key={mod.id} className="p-3 bg-white/40 border border-border-gray/20 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-coast-teal uppercase">Module {mod.orderIndex}</span>
                      <h4 className="text-xs font-bold text-ink leading-tight">{mod.title}</h4>
                      <p className="text-[10px] text-body-gray leading-normal">{mod.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-body-gray italic">No capacity program details configured.</p>
            )}
          </div>
        </div>

        {/* Middle: Active Session Log & Schedule Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Schedule Form (Trainer / Admin Only) */}
          {permissions.canManageTraining ? (
            <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
              <div className="border-b border-border-gray/30 pb-2.5 flex items-center gap-2">
                <PlusCircle className="w-4.5 h-4.5 text-primary-indigo" />
                <h4 className="text-xs font-extrabold uppercase text-ink tracking-wide">Schedule Training Seminar</h4>
              </div>

              <form action={handleAddSession} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Select Module</label>
                  <select name="moduleId" required className="w-full px-3 py-2 rounded-xl glass-input text-ink cursor-pointer">
                    {program?.modules.map(mod => (
                      <option key={mod.id} value={mod.id}>Mod {mod.orderIndex}: {mod.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Community Venue</label>
                  <select name="communityId" required className="w-full px-3 py-2 rounded-xl glass-input text-ink cursor-pointer">
                    {communities.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Date & Time</label>
                  <input type="datetime-local" name="date" required className="w-full px-3 py-2 rounded-xl glass-input text-ink" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Hall/Building Location</label>
                  <input type="text" name="location" required placeholder="e.g. Old Road Community School Hall" className="w-full px-3 py-2 rounded-xl glass-input text-ink" />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer">
                    <span>Schedule & Broadcast to Secretariat</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md text-center space-y-2 text-xs text-body-gray leading-relaxed">
              <AlertCircle className="w-6 h-6 text-sand-gold mx-auto" />
              <p>
                Your simulated role <strong>{currentUser.role}</strong> is not registered as an official Trainer or CLEF coordinator.
              </p>
              <p className="bg-canvas-light p-2 rounded-lg border border-border-gray/20">
                To test scheduling and submitting attendance sheets, switch your identity to <strong>Trainer</strong>!
              </p>
            </div>
          )}

          {/* Training Session Logs */}
          <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
            <div className="border-b border-border-gray/30 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-coast-teal" />
                <span>Attendance Logbook</span>
              </span>
              <span className="text-[10px] bg-canvas-light text-primary-indigo font-bold px-2 py-0.5 rounded-full border border-border-gray/30">
                {sessions.length} Seminars
              </span>
            </div>

            {sessions.length > 0 ? (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {sessions.map(s => (
                  <div key={s.id} className="p-4 border border-border-gray/30 rounded-xl bg-white/40 space-y-2.5 text-xs">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-coast-teal bg-coast-teal/5 px-2 py-0.5 rounded border border-coast-teal/20">{s.module.title}</span>
                        <h4 className="text-sm font-extrabold text-ink mt-1.5">{s.community.name} Venue</h4>
                      </div>
                      <span className="text-[10px] text-body-gray font-mono">{new Date(s.date).toLocaleString()}</span>
                    </div>

                    {/* Venue details */}
                    <div className="flex items-center gap-4 text-[10px] text-body-gray border-t border-b border-border-gray/20 py-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary-indigo" /> {s.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary-indigo" /> Trainer: {s.trainerName}</span>
                    </div>

                    {/* Attendance summary list */}
                    <div className="space-y-1.5 pt-1.5">
                      <span className="text-[9px] uppercase font-bold text-body-gray tracking-wider block">Attendance Sheets</span>
                      
                      {s.attendanceRecords.length > 0 ? (
                        <div className="space-y-1">
                          {s.attendanceRecords.map(a => (
                            <div key={a.id} className="flex justify-between items-center bg-canvas-light p-1.5 rounded-lg border border-border-gray/10 text-[10px]">
                              <span>{a.leader.firstName} {a.leader.lastName}</span>
                              <span className="flex items-center gap-1 font-bold text-civic-green">
                                <CheckCircle className="w-3 h-3" />
                                {a.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[9px] text-body-gray italic">No attendance list marked. Trainer validation pending.</p>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-body-gray italic text-center py-6">No seminars have been scheduled yet.</p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
