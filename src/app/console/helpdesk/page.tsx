import React from 'react';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import prisma from '../../../lib/db';
import { getCurrentUser } from '../../../lib/auth';
import { getRolePermissions } from '../../../lib/session';
import ConsoleNav from '../../../components/ConsoleNav';
import { HelpCircle, AlertCircle, CheckCircle2, RefreshCw, MessageSquare, Tag, Clock } from 'lucide-react';

export const revalidate = 0; // Fresh database query for helpdesk queue

export default async function HelpdeskModulePage() {
  const currentUser = await getCurrentUser();
  const permissions = getRolePermissions(currentUser.role);

  if (!permissions.canViewConsole) {
    redirect('/login?error=Please sign in to access the Command Center');
  }

  const isAuthorized = permissions.canManageHelpdesk || permissions.isNationalAdmin || permissions.isCoordinator;
  if (!isAuthorized) {
    redirect('/console');
  }

  // Fetch all tickets from the database
  const tickets = await prisma.helpdeskTicket.findMany({
    include: {
      community: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Server Action to update ticket status
  async function handleResolveTicket(formData: FormData) {
    'use server';

    const ticketId = formData.get('ticketId') as string;
    const notes = formData.get('notes') as string;

    if (!ticketId) return;

    await prisma.helpdeskTicket.update({
      where: { id: ticketId },
      data: {
        status: 'RESOLVED',
        notes: notes || 'Resolved by helpdesk officer.',
      }
    });

    // Log the helpdesk ticket resolution
    await prisma.auditLog.create({
      data: {
        action: 'HELPDESK_RESOLVE',
        details: `Resolved helpdesk ticket ID [${ticketId}]. Notes: ${notes || 'None'}.`,
        userId: currentUser.email,
      }
    });

    revalidatePath('/console/helpdesk');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Dynamic Console Sub-navigation */}
      <ConsoleNav currentUser={currentUser} activeTab="helpdesk" />

      <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
        
        {/* Module Header */}
        <div className="border-b border-border-gray/30 pb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
            <HelpCircle className="w-5 h-5 text-primary-indigo" />
            <span>Community Desk / Helpdesk Portal</span>
          </span>
          <span className="text-[10px] bg-canvas-light text-primary-indigo font-bold px-2 py-0.5 rounded-full border border-border-gray/30">
            {tickets.filter(t => t.status === 'OPEN').length} Open Tickets
          </span>
        </div>

        {/* Tickets Grid */}
        {tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map(ticket => {
              const isOpen = ticket.status === 'OPEN';
              return (
                <div
                  key={ticket.id}
                  className={`border p-4 rounded-xl space-y-3.5 text-xs flex flex-col justify-between ${
                    isOpen ? 'border-[#D4A73B] bg-amber-50/5' : 'border-border-gray/30 bg-white/40'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Ticket Header Metadata */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-body-gray tracking-wide">
                          <Tag className="w-3.5 h-3.5 text-coast-teal" />
                          <span>{ticket.category}</span>
                        </span>
                        <strong className="text-sm text-ink leading-tight block">{ticket.subject}</strong>
                      </div>
                      
                      <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        isOpen
                          ? 'bg-sand-gold/10 text-sand-gold border-sand-gold/20'
                          : 'bg-civic-green/10 text-civic-green border-civic-green/20'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    {/* Ticket message details */}
                    <div className="space-y-1 bg-white/40 p-3 rounded-xl border border-border-gray/10">
                      <span className="text-[9px] uppercase font-bold text-body-gray tracking-wider flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-primary-indigo" /> Message details:
                      </span>
                      <p className="text-xs text-ink leading-relaxed">{ticket.message}</p>
                    </div>

                    {/* Resolution details */}
                    {!isOpen && ticket.notes && (
                      <div className="bg-civic-green/5 border border-civic-green/15 p-2.5 rounded-xl text-[10px] text-civic-green">
                        <strong className="uppercase font-bold tracking-wider text-[9px] block">Resolution Remarks</strong>
                        <p className="mt-0.5 italic">"{ticket.notes}"</p>
                      </div>
                    )}
                  </div>

                  {/* Submission and Resolution panel */}
                  <div className="border-t border-border-gray/20 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-body-gray">
                    <div className="space-y-0.5">
                      <span>Submitted by: <strong>{ticket.name}</strong></span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-coast-teal" /> {new Date(ticket.createdAt).toLocaleString()}</span>
                    </div>

                    {isOpen && permissions.canManageHelpdesk && (
                      <form className="flex items-center gap-2 w-full sm:w-auto">
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <input
                          type="text"
                          name="notes"
                          placeholder="Resolution comments..."
                          className="px-2.5 py-1 text-[9px] rounded-lg glass-input text-ink w-full sm:w-36"
                        />
                        <button
                          formAction={handleResolveTicket}
                          className="py-1 px-3 rounded-lg bg-civic-green hover:bg-[#236026] text-white font-bold text-[9px] flex items-center gap-1 transition-all cursor-pointer shrink-0"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Resolve</span>
                        </button>
                      </form>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-body-gray italic">
            <RefreshCw className="w-8 h-8 text-body-gray/30 mx-auto mb-2 animate-spin-slow" />
            <p>No helpdesk tickets logged in the database.</p>
          </div>
        )}

      </div>

    </div>
  );
}
