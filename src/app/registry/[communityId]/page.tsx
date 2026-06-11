import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '../../../lib/db';
import { MapPin, CheckCircle2, AlertTriangle, XCircle, ArrowLeft, User, Phone, Calendar, ShieldCheck, Award, FileText } from 'lucide-react';

export const revalidate = 0; // Live database fetching

interface DetailPageProps {
  params: Promise<{
    communityId: string;
  }>;
}

export default async function CommunityDetailPage({ params }: DetailPageProps) {
  const { communityId } = await params;

  // Retrieve community along with all relations
  const community = await prisma.community.findUnique({
    where: { id: communityId },
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
      },
      leaderProfiles: {
        include: {
          role: true,
          certificates: {
            include: {
              program: true
            }
          }
        },
        orderBy: {
          roleId: 'asc'
        }
      },
      weeklyReports: {
        orderBy: { weekEnding: 'desc' },
        take: 5
      }
    }
  });

  if (!community) {
    notFound();
  }

  const district = community.town.clan.district;
  const county = district.county;
  const leaders = community.leaderProfiles;

  // Filter leaders by category
  const traditionalLeaders = leaders.filter(l => l.role.category === 'Traditional');
  const executiveLeaders = leaders.filter(l => ['CHAIR', 'VCHAIR', 'SEC'].includes(l.roleId));
  const inclusionLeaders = leaders.filter(l => ['WOMEN_REP', 'YOUTH_REP', 'PWD_REP'].includes(l.roleId));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Navigation breadcrumb */}
      <div>
        <Link
          href="/registry"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-indigo hover:text-hover-indigo transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to National Registry directory</span>
        </Link>
      </div>

      {/* Community Banner & Profile Header */}
      <div className="rounded-3xl border border-border-gray/30 p-6 sm:p-8 glass-panel shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Basic Metadata */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-extrabold uppercase text-coast-teal bg-coast-teal/5 border border-coast-teal/10 px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{county.name} County</span>
            </span>
            <span className={`flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
              community.verificationState === 'VERIFIED'
                ? 'bg-civic-green/10 text-civic-green border-civic-green/20'
                : community.verificationState === 'PENDING'
                ? 'bg-sand-gold/10 text-sand-gold border-sand-gold/20'
                : 'bg-signal-red/10 text-signal-red border-signal-red/20'
            }`}>
              {community.verificationState === 'VERIFIED' ? <CheckCircle2 className="w-2.5 h-2.5" /> :
               community.verificationState === 'PENDING' ? <AlertTriangle className="w-2.5 h-2.5" /> :
               <XCircle className="w-2.5 h-2.5" />}
              {community.verificationState}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black font-display text-ink tracking-tight leading-none">
              {community.name}
            </h1>
            <p className="text-xs text-body-gray">
              Township / Town Area: <strong className="text-ink">{community.town.name}</strong> · Clan: <strong className="text-ink">{community.town.clan.name}</strong> · District: <strong className="text-ink">{district.name}</strong>
            </p>
          </div>

          <p className="text-xs text-body-gray max-w-xl leading-relaxed italic bg-white/30 p-3 rounded-xl border border-border-gray/10">
            "{community.officialNotes || 'No official notes provided for this community profile.'}"
          </p>
        </div>

        {/* GIS Coordinates Plate */}
        <div className="md:col-span-1 bg-ink text-white rounded-2xl p-5 space-y-3.5 border border-white/5 relative overflow-hidden shadow-inner">
          <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-primary-indigo/35 rounded-full blur-2xl"></div>
          <span className="text-[9px] uppercase font-bold text-sand-gold tracking-widest block">Geospatial Benchmarks</span>
          
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-body-gray text-[9px]">LATITUDE:</span>
              <span>{community.latitude.toFixed(7)}° N</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-body-gray text-[9px]">LONGITUDE:</span>
              <span>{community.longitude.toFixed(7)}° W</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-body-gray text-[9px]">ELEVATION:</span>
              <span>{community.elevation ? `${community.elevation}m ASL` : 'Unrecorded'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-gray text-[9px]">INDEXING ACCURACY:</span>
              <span className="font-sans text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-coast-teal uppercase font-bold">
                {community.precision.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Leadership structure panel */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-ink font-display flex items-center gap-2">
          <ShieldCheck className="w-5.5 h-5.5 text-primary-indigo" />
          <span>Verified Local Leadership Board</span>
        </h2>

        {leaders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Traditional Authority */}
            <div className="rounded-2xl border border-border-gray/30 p-5 glass-panel space-y-4">
              <h3 className="text-xs uppercase font-extrabold text-primary-indigo tracking-wider border-b border-border-gray/30 pb-2">
                Traditional Leadership
              </h3>
              
              {traditionalLeaders.length > 0 ? (
                traditionalLeaders.map(l => (
                  <div key={l.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-ink">{l.firstName} {l.lastName}</span>
                        <span className="block text-[9px] uppercase font-semibold text-body-gray">{l.role.title}</span>
                      </div>
                      <span className="text-[8px] bg-civic-green/10 text-civic-green px-1.5 py-0.5 rounded uppercase font-bold border border-civic-green/20">
                        {l.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-body-gray space-y-1">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-coast-teal" /> {l.phone}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-coast-teal" /> Term start: {new Date(l.termStart).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-body-gray italic">No traditional chief profiles registered.</p>
              )}
            </div>

            {/* Executive Council */}
            <div className="rounded-2xl border border-border-gray/30 p-5 glass-panel space-y-4">
              <h3 className="text-xs uppercase font-extrabold text-primary-indigo tracking-wider border-b border-border-gray/30 pb-2">
                Executive Council
              </h3>
              
              {executiveLeaders.length > 0 ? (
                executiveLeaders.map(l => (
                  <div key={l.id} className="space-y-2 border-b border-border-gray/20 last:border-none pb-2 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-ink">{l.firstName} {l.lastName}</span>
                        <span className="block text-[9px] uppercase font-semibold text-body-gray">{l.role.title}</span>
                      </div>
                      <span className="text-[8px] bg-civic-green/10 text-civic-green px-1.5 py-0.5 rounded uppercase font-bold border border-civic-green/20">
                        {l.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-body-gray space-y-1">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-coast-teal" /> {l.phone}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-coast-teal" /> Term start: {new Date(l.termStart).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-body-gray italic">No executive leaders profiles registered.</p>
              )}
            </div>

            {/* Inclusion Representation */}
            <div className="rounded-2xl border border-border-gray/30 p-5 glass-panel space-y-4">
              <h3 className="text-xs uppercase font-extrabold text-primary-indigo tracking-wider border-b border-border-gray/30 pb-2">
                Inclusion Representation
              </h3>
              
              {inclusionLeaders.length > 0 ? (
                inclusionLeaders.map(l => (
                  <div key={l.id} className="space-y-2 border-b border-border-gray/20 last:border-none pb-2 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-ink">{l.firstName} {l.lastName}</span>
                        <span className="block text-[9px] uppercase font-semibold text-body-gray">{l.role.title}</span>
                      </div>
                      <span className="text-[8px] bg-civic-green/10 text-civic-green px-1.5 py-0.5 rounded uppercase font-bold border border-civic-green/20">
                        {l.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-body-gray space-y-1">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-coast-teal" /> {l.phone}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-coast-teal" /> Term start: {new Date(l.termStart).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-body-gray italic">No specific inclusion delegates registered.</p>
              )}
            </div>

          </div>
        ) : (
          <div className="text-center py-8 rounded-2xl border border-border-gray/30 bg-white/40 max-w-md mx-auto">
            <User className="w-8 h-8 text-body-gray/50 mx-auto mb-2" />
            <p className="text-xs text-body-gray">Leadership election structures have not been formalized for this community yet.</p>
          </div>
        )}
      </div>

      {/* Training and Reports Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        {/* UN-HABITAT Certificates */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-ink font-display flex items-center gap-2">
            <Award className="w-5 h-5 text-sand-gold" />
            <span>Capacity Certifications</span>
          </h3>
          
          <div className="rounded-2xl border border-border-gray/30 p-5 glass-panel space-y-3">
            {leaders.some(l => l.certificates.length > 0) ? (
              leaders.flatMap(l => l.certificates.map(cert => (
                <div key={cert.id} className="flex gap-4 items-start border-b border-border-gray/20 last:border-none pb-3 last:pb-0">
                  <span className="w-8 h-8 rounded-lg bg-sand-gold/15 flex items-center justify-center text-sand-gold shrink-0">
                    <Award className="w-4.5 h-4.5" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-ink">{cert.program.name}</span>
                    <p className="text-[10px] text-body-gray leading-normal">
                      Issued to Leader: <strong>{l.firstName} {l.lastName}</strong> ({l.role.title})
                    </p>
                    <span className="text-[9px] font-mono text-primary-indigo font-bold block pt-0.5">
                      No: {cert.certificateNumber} · Verified {new Date(cert.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )))
            ) : (
              <p className="text-xs text-body-gray italic text-center py-4">No leadership certificate records verified yet. Training program enrollment active.</p>
            )}
          </div>
        </div>

        {/* Weekly Reporting Timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-ink font-display flex items-center gap-2">
            <FileText className="w-5 h-5 text-coast-teal" />
            <span>Weekly Reporting Logs (Non-Sensitive)</span>
          </h3>

          <div className="rounded-2xl border border-border-gray/30 p-5 glass-panel space-y-3">
            {community.weeklyReports.length > 0 ? (
              community.weeklyReports.map(rep => (
                <div key={rep.id} className="flex justify-between items-center border-b border-border-gray/20 last:border-none pb-2.5 last:pb-0">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-ink">Week Ending: {new Date(rep.weekEnding).toLocaleDateString()}</span>
                    <p className="text-[10px] text-body-gray">
                      Submitted by: {rep.reporterName}
                    </p>
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                    rep.alertLevel === 'LOW'
                      ? 'bg-civic-green/10 text-civic-green border-civic-green/20'
                      : rep.alertLevel === 'MEDIUM'
                      ? 'bg-sand-gold/10 text-sand-gold border-sand-gold/20'
                      : 'bg-signal-red/10 text-signal-red border-signal-red/20'
                  }`}>
                    ALERT: {rep.alertLevel}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-body-gray italic text-center py-4">No weekly digital reports submitted yet. Pending pilot scheduling.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
