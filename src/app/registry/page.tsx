import React from 'react';
import Link from 'next/link';
import prisma from '../../lib/db';
import { Search, MapPin, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Layers, FileText } from 'lucide-react';

export const revalidate = 0; // Disable caching to fetch updated states immediately

interface RegistryPageProps {
  searchParams: Promise<{
    query?: string;
    county?: string;
    status?: string;
  }>;
}

export default async function RegistryPage({ searchParams }: RegistryPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query || '';
  const countyFilter = resolvedParams.county || 'ALL';
  const statusFilter = resolvedParams.status || 'ALL';

  // Fetch all counties for the filter dropdown
  const counties = await prisma.county.findMany({
    orderBy: { name: 'asc' }
  });

  // Construct the search query
  const whereClause: any = {};
  
  if (countyFilter !== 'ALL') {
    whereClause.town = {
      clan: {
        district: {
          countyId: countyFilter
        }
      }
    };
  }

  if (statusFilter !== 'ALL') {
    whereClause.verificationState = statusFilter;
  }

  if (query) {
    whereClause.name = {
      contains: query
    };
  }

  // Fetch communities from the database matching the criteria
  const communities = await prisma.community.findMany({
    where: whereClause,
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
        where: { status: 'ACTIVE' }
      },
      weeklyReports: true
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-gray/30 pb-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase text-coast-teal tracking-wider">NRCL Portal</span>
          <h1 className="text-3xl font-black text-ink font-display tracking-tight leading-none">
            National Registry of Communities and Leaders
          </h1>
          <p className="text-xs text-body-gray leading-normal max-w-2xl font-light">
            Search the official digitized record of Liberia's communities, geospatial coordinates, and verified traditional/functional leadership councils.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary-indigo/5 border border-primary-indigo/10 p-3 rounded-xl">
          <span className="text-2xl font-black text-primary-indigo font-display">{communities.length}</span>
          <span className="text-[10px] font-bold text-body-gray uppercase tracking-wider leading-tight">
            Communities<br />Registered
          </span>
        </div>
      </div>

      {/* Search and Filters Sidebar / Header */}
      <form method="GET" action="/registry" className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white/45 border border-border-gray/30 p-4 rounded-2xl glass-panel shadow-sm">
        
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-body-gray/50" />
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Search by community name..."
            className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl glass-input text-ink"
          />
        </div>

        {/* County Filter */}
        <div className="md:col-span-3">
          <select
            name="county"
            defaultValue={countyFilter}
            className="w-full px-3 py-2.5 text-xs rounded-xl glass-input text-ink appearance-none cursor-pointer"
          >
            <option value="ALL">All Counties (15)</option>
            {counties.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} County
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            name="status"
            defaultValue={statusFilter}
            className="w-full px-3 py-2.5 text-xs rounded-xl glass-input text-ink appearance-none cursor-pointer"
          >
            <option value="ALL">All States</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Submit Filter Button */}
        <div className="md:col-span-1">
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white font-bold text-xs shadow-sm transition-all"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Grid of Community Cards */}
      {communities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communities.map((comm) => {
            const district = comm.town.clan.district;
            const county = district.county;
            
            // Inclusion metrics
            const activeLeaders = comm.leaderProfiles;
            const hasWomenRep = activeLeaders.some(l => l.roleId === 'WOMEN_REP');
            const hasYouthRep = activeLeaders.some(l => l.roleId === 'YOUTH_REP');
            const hasPwdRep = activeLeaders.some(l => l.roleId === 'PWD_REP');

            return (
              <div
                key={comm.id}
                className="rounded-2xl border border-border-gray/30 p-5 glass-card shadow-sm flex flex-col justify-between h-[300px]"
              >
                <div className="space-y-4">
                  
                  {/* Status header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-body-gray uppercase flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-coast-teal" />
                      <span>{county.name} County</span>
                    </span>
                    
                    <span className={`flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      comm.verificationState === 'VERIFIED'
                        ? 'bg-civic-green/10 text-civic-green border-civic-green/20'
                        : comm.verificationState === 'PENDING'
                        ? 'bg-sand-gold/10 text-sand-gold border-sand-gold/20'
                        : 'bg-signal-red/10 text-signal-red border-signal-red/20'
                    }`}>
                      {comm.verificationState === 'VERIFIED' ? <CheckCircle2 className="w-2.5 h-2.5" /> :
                       comm.verificationState === 'PENDING' ? <AlertTriangle className="w-2.5 h-2.5" /> :
                       <XCircle className="w-2.5 h-2.5" />}
                      {comm.verificationState}
                    </span>
                  </div>

                  {/* Title & Hierarchy */}
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-extrabold text-ink leading-tight font-display">{comm.name}</h3>
                    <p className="text-[10px] text-body-gray leading-none">
                      {district.name} · {comm.town.clan.name} · {comm.town.name}
                    </p>
                  </div>

                  {/* GIS Coordinates brief */}
                  <div className="flex items-center justify-between text-[10px] font-mono bg-canvas-light px-2.5 py-1.5 rounded-lg border border-border-gray/30">
                    <span>Lat: {comm.latitude.toFixed(4)}° N</span>
                    <span className="text-border-gray">|</span>
                    <span>Long: {comm.longitude.toFixed(4)}° W</span>
                  </div>

                  {/* Leadership Inclusivity Checkbox icons */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-body-gray tracking-wider">Representation Index</span>
                    <div className="flex items-center gap-4 text-[10px] font-semibold">
                      <span className={`flex items-center gap-1 ${hasWomenRep ? 'text-civic-green' : 'text-body-gray/50'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${hasWomenRep ? 'bg-civic-green' : 'bg-body-gray/30'}`} />
                        Women
                      </span>
                      <span className={`flex items-center gap-1 ${hasYouthRep ? 'text-civic-green' : 'text-body-gray/50'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${hasYouthRep ? 'bg-civic-green' : 'bg-body-gray/30'}`} />
                        Youth
                      </span>
                      <span className={`flex items-center gap-1 ${hasPwdRep ? 'text-civic-green' : 'text-body-gray/50'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${hasPwdRep ? 'bg-civic-green' : 'bg-body-gray/30'}`} />
                        PWD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer action button */}
                <div className="border-t border-border-gray/20 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-body-gray">
                    <span className="flex items-center gap-0.5">
                      <Layers className="w-3 h-3 text-primary-indigo" />
                      {activeLeaders.length} Active
                    </span>
                    <span className="flex items-center gap-0.5">
                      <FileText className="w-3 h-3 text-coast-teal" />
                      {comm.weeklyReports.length} Reports
                    </span>
                  </div>
                  
                  <Link
                    href={`/registry/${comm.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-primary-indigo hover:text-hover-indigo transition-colors"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-border-gray/30 bg-white/40 max-w-xl mx-auto space-y-4">
          <AlertTriangle className="w-10 h-10 text-sand-gold mx-auto" />
          <h3 className="text-sm font-bold text-ink uppercase">No Communities Found</h3>
          <p className="text-xs text-body-gray max-w-xs mx-auto">
            Try adjusting your query or county filter to find communities. Make sure your database is seeded.
          </p>
        </div>
      )}

    </div>
  );
}
