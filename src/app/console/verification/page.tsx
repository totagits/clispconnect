import React from 'react';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import prisma from '../../../lib/db';
import { getCurrentUser } from '../../../lib/auth';
import { getRolePermissions } from '../../../lib/session';
import Link from 'next/link';
import { CheckSquare, ShieldCheck, AlertCircle, FileText, CheckCircle2, XCircle, Award, Printer } from 'lucide-react';

export const revalidate = 0; // Fresh database query for approvals queue

export default async function VerificationPage() {
  const currentUser = await getCurrentUser();
  const permissions = getRolePermissions(currentUser.role);

  if (!permissions.canViewConsole) {
    redirect('/');
  }

  // Fetch pending verification requests
  const pendingRequests = await prisma.verificationRequest.findMany({
    where: { status: 'PENDING' },
    include: {
      community: {
        include: {
          town: {
            include: {
              clan: {
                include: {
                  district: true
                }
              }
            }
          }
        }
      }
    }
  });

  // Fetch active certificates for preview/verification
  const certificates = await prisma.certificate.findMany({
    include: {
      leader: {
        include: {
          role: true,
          community: true
        }
      },
      program: true
    },
    orderBy: { issueDate: 'desc' }
  });

  // Server Action to approve a verification request
  async function handleApprove(formData: FormData) {
    'use server';

    const requestId = formData.get('requestId') as string;
    const comments = formData.get('comments') as string;

    if (!requestId) return;

    // Update the request status
    const request = await prisma.verificationRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
      include: { community: true }
    });

    // Update the community verification state
    await prisma.community.update({
      where: { id: request.communityId },
      data: { verificationState: 'VERIFIED', publicStatus: true }
    });

    // Log the approval action
    await prisma.approvalRecord.create({
      data: {
        requestId,
        approverId: currentUser.email,
        approverName: currentUser.name,
        decision: 'APPROVED',
        comments,
      }
    });

    // Log in the system audit logs
    await prisma.auditLog.create({
      data: {
        action: 'COMMUNITY_VERIFY',
        details: `Approved verification for community: [${request.community.name}]. Remarks: ${comments || 'None'}.`,
        userId: currentUser.email,
      }
    });

    revalidatePath('/console/verification');
    revalidatePath('/registry');
  }

  // Server Action to reject a verification request
  async function handleReject(formData: FormData) {
    'use server';

    const requestId = formData.get('requestId') as string;
    const comments = formData.get('comments') as string;

    if (!requestId) return;

    const request = await prisma.verificationRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' }
    });

    await prisma.community.update({
      where: { id: request.communityId },
      data: { verificationState: 'REJECTED' }
    });

    await prisma.approvalRecord.create({
      data: {
        requestId,
        approverId: currentUser.email,
        approverName: currentUser.name,
        decision: 'REJECTED',
        comments,
      }
    });

    revalidatePath('/console/verification');
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
        <Link href="/console/verification" className="px-3.5 py-2 rounded-xl bg-primary-indigo text-white">
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
        
        {/* Left: Pending Requests Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
            <div className="border-b border-border-gray/30 pb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
                <CheckSquare className="w-5 h-5 text-primary-indigo" />
                <span>Verification Queue</span>
              </span>
              <span className="text-[10px] bg-canvas-light text-primary-indigo font-bold px-2 py-0.5 rounded-full border border-border-gray/30">
                {pendingRequests.length} Pending
              </span>
            </div>

            {permissions.canApproveLeaders ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map(req => (
                    <div key={req.id} className="p-4 border border-border-gray/30 rounded-xl bg-white/40 space-y-3 text-xs">
                      <div>
                        <strong className="text-sm text-ink">{req.community.name}</strong>
                        <p className="text-[10px] text-body-gray">
                          District: {req.community.town.clan.district.name} · Clan: {req.community.town.clan.name}
                        </p>
                        <p className="text-[9px] text-body-gray font-mono mt-1">
                          GPS: {req.community.latitude.toFixed(5)}° N, {req.community.longitude.toFixed(5)}° W
                        </p>
                      </div>

                      {req.notes && (
                        <p className="text-[10px] text-body-gray leading-normal italic bg-canvas-light p-2 rounded-lg border border-border-gray/20">
                          Requester note: "{req.notes}"
                        </p>
                      )}

                      {/* Approval/Rejection Actions */}
                      <form className="space-y-2 border-t border-border-gray/20 pt-3">
                        <input type="hidden" name="requestId" value={req.id} />
                        
                        <input
                          type="text"
                          name="comments"
                          placeholder="Provide approval/rejection remarks..."
                          className="w-full px-2.5 py-1.5 text-[10px] rounded-lg glass-input text-ink"
                        />
                        
                        <div className="flex gap-2">
                          <button
                            formAction={handleApprove}
                            className="flex-1 py-1.5 rounded-lg bg-civic-green hover:bg-[#236026] text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Registry</span>
                          </button>
                          <button
                            formAction={handleReject}
                            className="flex-1 py-1.5 rounded-lg bg-signal-red hover:bg-[#9d2222] text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject Request</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-body-gray italic">
                    <ShieldCheck className="w-8 h-8 text-civic-green/50 mx-auto mb-1.5 animate-pulse" />
                    <p>All leadership verification requests have been cleared.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-canvas-light text-center rounded-xl space-y-2 text-xs text-body-gray leading-relaxed">
                <AlertCircle className="w-6 h-6 text-sand-gold mx-auto" />
                <p>
                  Your simulated role <strong>{currentUser.role}</strong> does not have clearance to sign leadership certificates or approve registries.
                </p>
                <p className="bg-white/40 p-2 rounded-lg border border-border-gray/20">
                  Switch to <strong>MIA National Admin</strong> or <strong>District Coordinator</strong> to test approving this queue!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Certified Leaders & Certificate Previewer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
            <div className="border-b border-border-gray/30 pb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-5 h-5 text-sand-gold" />
                <span>Certified Leader Certificates</span>
              </span>
              <span className="text-[10px] bg-canvas-light text-primary-indigo font-bold px-2 py-0.5 rounded-full border border-border-gray/30">
                {certificates.length} Issued
              </span>
            </div>

            {certificates.length > 0 ? (
              <div className="space-y-6">
                
                {/* Print/Preview layout wrapper */}
                {certificates.map(cert => (
                  <div key={cert.id} className="relative rounded-2xl border-4 border-[#D4A73B] p-6 bg-amber-50/20 shadow-md space-y-4 text-xs font-serif overflow-hidden">
                    
                    {/* Background faint crest watermarks */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    {/* Certificate Header */}
                    <div className="text-center space-y-1">
                      <p className="text-[9px] font-sans font-black tracking-widest text-[#0A3D91] uppercase">REPUBLIC OF LIBERIA</p>
                      <p className="text-[10px] font-sans font-extrabold text-[#D4A73B] uppercase tracking-wide">MINISTRY OF INTERNAL AFFAIRS & CLEF SECRETARIAT</p>
                      <h4 className="text-sm sm:text-base font-bold text-[#0A3D91] border-b border-amber-300 pb-2 max-w-md mx-auto">
                        Official Leadership Certificate
                      </h4>
                    </div>

                    {/* Certificate Body */}
                    <div className="text-center space-y-3">
                      <p className="italic text-body-gray">This document certifies that the community elections of</p>
                      <p className="font-sans font-extrabold text-ink text-base uppercase tracking-wide">{cert.leader.community.name} Community</p>
                      <p className="italic text-body-gray">have been audited and found compliant with structural inclusion frameworks, identifying</p>
                      <p className="font-sans font-black text-ink text-sm tracking-wide">{cert.leader.firstName} {cert.leader.lastName}</p>
                      <p className="italic text-body-gray">to serve in the officially verified capacity of</p>
                      <p className="font-sans font-bold text-[#1D8F8A] uppercase tracking-wide text-xs">{cert.leader.role.title}</p>
                    </div>

                    {/* Certificate Footer Signatures */}
                    <div className="grid grid-cols-2 gap-8 border-t border-amber-300/50 pt-4 font-sans text-[9px] text-body-gray">
                      <div className="text-center">
                        <span className="font-mono text-ink block font-bold">~ Hon. Tamba Kollie ~</span>
                        <span className="border-t border-border-gray/30 pt-0.5 inline-block">Minister, Ministry of Internal Affairs</span>
                      </div>
                      <div className="text-center">
                        <span className="font-mono text-ink block font-bold">~ Madame Satta Sheriff ~</span>
                        <span className="border-t border-border-gray/30 pt-0.5 inline-block">Director, CLEF Board</span>
                      </div>
                    </div>

                    {/* Serial Number plate */}
                    <div className="flex justify-between items-center font-sans text-[8px] text-body-gray border-t border-border-gray/20 pt-3">
                      <span>Serial No: <strong className="font-mono text-primary-indigo font-bold">{cert.certificateNumber}</strong></span>
                      <span>Verified: {new Date(cert.issueDate).toLocaleDateString()}</span>
                      
                      <button 
                        onClick={() => alert("Connecting to system print spooler... Printing certificate " + cert.certificateNumber)}
                        className="flex items-center gap-1 text-[9px] font-bold text-primary-indigo hover:text-hover-indigo cursor-pointer"
                        title="Print Certificate"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-body-gray italic text-center py-8">No formalized certificates logged in the database yet.</p>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
