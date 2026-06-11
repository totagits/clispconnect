import React from 'react';
import prisma from '../../lib/db';
import { Award, ShieldCheck, XCircle, Search, Calendar, MapPin, User, CheckCircle2, ChevronRight, Printer } from 'lucide-react';

export const revalidate = 0; // Live lookup verified on demand

interface VerifyPageProps {
  searchParams: Promise<{
    cert?: string;
  }>;
}

export default async function CertificateVerifyPage({ searchParams }: VerifyPageProps) {
  const resolvedParams = await searchParams;
  const certQuery = resolvedParams.cert?.trim() || '';

  let certificate = null;
  let searchAttempted = false;

  if (certQuery) {
    searchAttempted = true;
    certificate = await prisma.certificate.findUnique({
      where: { certificateNumber: certQuery },
      include: {
        leader: {
          include: {
            role: true,
            community: {
              include: {
                town: {
                  include: {
                    clan: {
                      include: {
                        district: {
                          include: {
                            county: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        program: {
          include: {
            modules: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        }
      }
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase text-coast-teal tracking-widest font-display">Credential Integrity</span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-ink tracking-tight leading-none flex items-center justify-center gap-2">
          <Award className="w-8 h-8 text-sand-gold" />
          <span>Certificate Verification Portal</span>
        </h1>
        <p className="text-xs sm:text-sm text-body-gray leading-relaxed font-light">
          Verify the authenticity of UN-HABITAT capacity credentials issued to formalized traditional chiefs and community council leaders by MLG & CLEF Liberia.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="max-w-md mx-auto bg-white/45 border border-border-gray/30 p-4 rounded-2xl glass-panel shadow-sm">
        <form method="GET" action="/verify" className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 w-4 h-4 text-body-gray/50" />
            <input
              type="text"
              name="cert"
              defaultValue={certQuery}
              required
              placeholder="Enter Serial Number (e.g. CLEF-MLG-2026-0001)"
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input text-ink font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
          >
            Verify
          </button>
        </form>
      </div>

      {searchAttempted && (
        <div className="space-y-8 animate-fade-in">
          {certificate ? (
            /* VERIFIED: SUCCESS CARD & DIPLOMA REPLICA */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Verified Status & Syllabus Detail (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Verified Tag */}
                <div className="p-5 rounded-2xl border border-civic-green/20 bg-civic-green/5 space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-civic-green/10 flex items-center justify-center text-civic-green">
                      <ShieldCheck className="w-6 h-6" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-civic-green uppercase tracking-wide">Status: Officially Authenticated</span>
                      <h3 className="text-sm font-black text-ink uppercase">Valid Credential</h3>
                    </div>
                  </div>
                  <p className="text-xs text-body-gray leading-relaxed">
                    This serial ID matches our National Leadership database. The certificate holder has successfully completed all required training modules.
                  </p>
                </div>

                {/* Training Details Checklist */}
                <div className="p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md space-y-4">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block border-b border-border-gray/30 pb-2">
                    UN-HABITAT Training Modules Completed
                  </span>
                  
                  <div className="space-y-3 text-xs leading-normal">
                    {certificate.program.modules.map((mod: any) => (
                      <div key={mod.id} className="flex gap-2.5 items-start">
                        <CheckCircle2 className="w-4 h-4 text-civic-green shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <strong className="text-ink text-[11px] block">{mod.title}</strong>
                          <p className="text-[10px] text-body-gray">{mod.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Side: Certified Diploma Replica (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Printable certificate card */}
                <div className="relative rounded-3xl border-8 border-double border-[#D4A73B] p-8 sm:p-12 bg-amber-50/15 shadow-lg space-y-6 text-xs font-serif overflow-hidden text-center">
                  
                  {/* Watermark crest container */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
                    <img src="/mlg-logo.png" alt="watermark" className="w-72 h-72 object-contain" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-sans font-black tracking-widest text-[#0A3D91] uppercase">REPUBLIC OF LIBERIA</p>
                    <p className="text-[10px] font-sans font-extrabold text-[#D4A73B] uppercase tracking-wide leading-none">MINISTRY OF LOCAL GOVERNMENT & CLEF BOARD</p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0A3D91] border-b-2 border-amber-300 pb-3 max-w-md mx-auto">
                      Official Leadership Certificate
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <p className="italic text-body-gray text-xs">This document certifies that the community elections of</p>
                    <p className="font-sans font-extrabold text-ink text-lg uppercase tracking-wide leading-tight">
                      {certificate.leader.community.name} Community
                    </p>
                    <p className="text-[11px] font-sans text-body-gray italic">
                      {certificate.leader.community.town.clan.district.county.name} County · Liberia
                    </p>
                    
                    <p className="italic text-body-gray text-xs">have been audited and found compliant with structural inclusion frameworks, identifying</p>
                    <p className="font-sans font-black text-ink text-base tracking-wide uppercase">
                      {certificate.leader.firstName} {certificate.leader.lastName}
                    </p>
                    
                    <p className="italic text-body-gray text-xs">to serve in the officially verified capacity of</p>
                    <p className="font-sans font-extrabold text-[#1D8F8A] uppercase tracking-wider text-xs">
                      {certificate.leader.role.title}
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 gap-8 border-t border-amber-300/60 pt-6 font-sans text-[9px] text-body-gray">
                    <div className="text-center">
                      <span className="font-mono text-ink block font-bold">~ Hon. Tamba Kollie ~</span>
                      <span className="border-t border-border-gray/30 pt-0.5 inline-block">Minister, Ministry of Local Government</span>
                    </div>
                    <div className="text-center">
                      <span className="font-mono text-ink block font-bold">~ Madame Satta Sheriff ~</span>
                      <span className="border-t border-border-gray/30 pt-0.5 inline-block">Director, CLEF Board</span>
                    </div>
                  </div>

                  {/* Metadata serial numbers */}
                  <div className="flex justify-between items-center font-sans text-[9px] text-body-gray border-t border-border-gray/20 pt-4 mt-4">
                    <span>SERIAL NO: <strong className="font-mono text-primary-indigo font-bold">{certificate.certificateNumber}</strong></span>
                    <span>VERIFICATION STATE: <strong className="text-civic-green uppercase font-bold">VERIFIED</strong></span>
                    <span>DATE ISSUED: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                  </div>

                </div>

                {/* Print button */}
                <div className="text-right">
                  <button 
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Verified Copy</span>
                  </button>
                </div>

              </div>
            </div>
          ) : (
            /* UNVERIFIED: FAILURE WARNING CARD */
            <div className="max-w-xl mx-auto p-8 rounded-3xl border border-signal-red/25 bg-signal-red/5 text-center space-y-4 shadow-md animate-shake">
              <div className="w-16 h-16 rounded-full bg-signal-red/10 flex items-center justify-center mx-auto text-signal-red">
                <XCircle className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-ink uppercase tracking-wide">Verification Failed</h3>
                <p className="text-xs text-body-gray leading-relaxed max-w-sm mx-auto">
                  The serial ID <strong className="font-mono text-signal-red text-[11px] uppercase">"{certQuery}"</strong> could not be authenticated in the official registry. Please verify the serial number spelling.
                </p>
              </div>

              <div className="p-3 bg-amber-50/5 border border-amber-500/20 text-left rounded-xl text-[10px] text-amber-700 space-y-1 max-w-md mx-auto leading-relaxed">
                <span className="font-extrabold uppercase tracking-wide block">⚠️ Security Advisory:</span>
                <p>
                  Unofficial traditional leaders attempting to act in a statutory capacity without official certification violate Local Governance acts. If you suspect certificate forgery, please file a report at the <a href="/helpdesk" className="underline font-bold text-primary-indigo">Helpdesk Portal</a>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
