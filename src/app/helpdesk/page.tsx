import React from 'react';
import { revalidatePath } from 'next/cache';
import prisma from '../../lib/db';
import { HelpCircle, Send, CheckCircle2, MapPin, User, Tag, MessageSquare, AlertCircle } from 'lucide-react';

export const revalidate = 0; // Fresh database query for community selector

interface HelpdeskPageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

export default async function PublicHelpdeskPage({ searchParams }: HelpdeskPageProps) {
  const resolvedParams = await searchParams;
  const isSuccess = resolvedParams.success === 'true';
  const errorMessage = resolvedParams.error;

  // Fetch verified communities to populate the optional community selector
  const communities = await prisma.community.findMany({
    orderBy: { name: 'asc' }
  });

  // Server Action to process public support request submissions
  async function handleSubmitTicket(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const contactInfo = formData.get('contactInfo') as string;
    const category = formData.get('category') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const communityId = formData.get('communityId') as string;

    if (!name || !contactInfo || !category || !subject || !message) {
      return revalidatePath('/helpdesk?error=Please fill in all required fields.');
    }

    try {
      await prisma.helpdeskTicket.create({
        data: {
          name,
          contactInfo,
          category,
          subject,
          message,
          communityId: communityId || null,
          status: 'OPEN'
        }
      });

      // Log this public action in system audit logs
      await prisma.auditLog.create({
        data: {
          action: 'HELPDESK_SUBMIT_PUBLIC',
          details: `Public ticket submitted by [${name}] regarding [${category} - ${subject}].`,
          ipAddress: '127.0.0.1'
        }
      });

      // Redirect with success state using revalidatePath or similar
      // Since it's a server action in Next.js 16, redirecting is standard, or returning page updates
    } catch (err: any) {
      console.error(err);
      return revalidatePath('/helpdesk?error=An error occurred while saving your request. Please try again.');
    }

    // Redirect to the success view
    const { redirect } = await import('next/navigation');
    redirect('/helpdesk?success=true');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase text-coast-teal tracking-widest">Public Support & Inquiries</span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-ink tracking-tight leading-none flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-primary-indigo" />
          <span>Community Helpdesk Portal</span>
        </h1>
        <p className="text-xs sm:text-sm text-body-gray leading-relaxed font-light">
          Need to correct community details, get help registering a new settlement, or log a local boundary dispute? Submit your query to the Ministry of Local Government.
        </p>
      </div>

      {isSuccess ? (
        /* Success Receipt Card */
        <div className="max-w-xl mx-auto p-8 rounded-3xl border border-civic-green/20 bg-civic-green/5 text-center space-y-5 shadow-md">
          <div className="w-16 h-16 rounded-full bg-civic-green/10 flex items-center justify-center mx-auto text-civic-green animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-ink uppercase tracking-wide">Request Logged Successfully</h3>
            <p className="text-xs text-body-gray leading-relaxed max-w-xs mx-auto">
              Your inquiry has been stored securely in the Command Center queue. An MLG Desk Officer or County Coordinator will review it shortly.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="/helpdesk"
              className="inline-block px-6 py-2.5 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white text-xs font-bold transition-all shadow-sm"
            >
              Submit Another Inquiry
            </a>
          </div>
        </div>
      ) : (
        /* Ticket Submission Form */
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border border-border-gray/30 glass-panel shadow-md space-y-6">
          <div className="border-b border-border-gray/30 pb-3 flex items-center gap-2">
            <Tag className="w-5 h-5 text-coast-teal" />
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Log a New Support Request</h3>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl border border-signal-red/20 bg-signal-red/5 text-xs text-signal-red flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form action={handleSubmitTicket} className="space-y-4 text-xs">
            
            {/* Input Row: Name & Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-primary-indigo" />
                  <span>Your Full Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Chief Tamba Taylor"
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">
                  Contact Phone / Email *
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  required
                  placeholder="e.g. +231-886-900-880 or email@domain.com"
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink"
                />
              </div>
            </div>

            {/* Input Row: Category & Optional Community selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">
                  Request Category *
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink cursor-pointer bg-white"
                >
                  <option value="Data Correction">Data Correction (Update Names/Phone numbers)</option>
                  <option value="Registration Help">Registration Help (How to register community)</option>
                  <option value="Dispute Resolution">Dispute Resolution (Boundary / Leadership conflicts)</option>
                  <option value="Reporting Issue">Reporting Issue (Weekly reports submission help)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-coast-teal" />
                  <span>Associated Community (Optional)</span>
                </label>
                <select
                  name="communityId"
                  className="w-full px-3 py-2 rounded-xl glass-input text-ink cursor-pointer bg-white"
                >
                  <option value="">-- No Specific Community --</option>
                  {communities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">
                Subject Headline *
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="e.g. Request to correct youth representative phone number"
                className="w-full px-3 py-2 rounded-xl glass-input text-ink"
              />
            </div>

            {/* Message Details */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-primary-indigo" />
                <span>Detailed Message *</span>
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Provide as much details as possible, including names, dates, coordinates, or correction requests..."
                className="w-full px-3 py-2 rounded-xl glass-input text-ink leading-relaxed"
              />
            </div>

            {/* Mandatory confirmation terms */}
            <div className="p-3 bg-primary-indigo/5 border border-primary-indigo/15 rounded-xl text-[10px] text-primary-indigo flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-sand-gold fill-sand-gold/15" />
              <p>
                By submitting this ticket, you certify that the information provided is accurate and representative of the community. All submissions are automatically audited for traceability.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Support Ticket</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
