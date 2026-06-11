'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Search, Filter, Layers, Compass, ZoomIn, ZoomOut, CheckCircle2, AlertTriangle, XCircle, User, Activity, FileText } from 'lucide-react';

interface CommunityMapData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  precision: string;
  verificationState: 'VERIFIED' | 'PENDING' | 'REJECTED';
  notes: string;
  town: string;
  leadersCount: number;
  weeklyReportsCount: number;
}

const COMMUNITIES_MOCK: CommunityMapData[] = [
  { id: 'comm-chugbor', name: 'Old Road Chugbor', latitude: 6.2758, longitude: -10.7523, elevation: 12.4, precision: 'GPS_High_Precision', verificationState: 'VERIFIED', notes: 'CLEF Pilot headquarters. Fully mapped, structures and water points logged.', town: 'Congotown East', leadersCount: 6, weeklyReportsCount: 1 },
  { id: 'comm-gayetown', name: 'Gayetown', latitude: 6.2795, longitude: -10.7450, elevation: 14.1, precision: 'GPS_Standard', verificationState: 'VERIFIED', notes: 'Active weekly reporting since launch. 3 main water points logged.', town: 'Congotown East', leadersCount: 1, weeklyReportsCount: 1 },
  { id: 'comm-peaceisland', name: 'Peace Island', latitude: 6.2910, longitude: -10.7312, elevation: 5.2, precision: 'GPS_Standard', verificationState: 'VERIFIED', notes: 'Island community with high density, requires specific water point monitoring.', town: 'Congotown West', leadersCount: 1, weeklyReportsCount: 1 },
  { id: 'comm-keyhole', name: 'Keyhole', latitude: 6.2715, longitude: -10.7589, elevation: 10.8, precision: 'GPS_Standard', verificationState: 'VERIFIED', notes: 'Commercial activity hub, border roads verified.', town: 'Congotown East', leadersCount: 0, weeklyReportsCount: 0 },
  { id: 'comm-gsaroad', name: 'GSA Road Community', latitude: 6.2730, longitude: -10.7180, elevation: 16.5, precision: 'GPS_Standard', verificationState: 'PENDING', notes: 'Registration details submitted, leadership elections pending verification.', town: 'Congotown West', leadersCount: 0, weeklyReportsCount: 0 },
  { id: 'comm-fiamah', name: 'Fiamah Community', latitude: 6.2912, longitude: -10.7611, elevation: 9.3, precision: 'GPS_High_Precision', verificationState: 'VERIFIED', notes: 'Densely populated, youth leadership fully structured.', town: 'Congotown East', leadersCount: 0, weeklyReportsCount: 0 },
  { id: 'comm-matadi', name: 'Matadi Community', latitude: 6.2818, longitude: -10.7801, elevation: 8.1, precision: 'Rough_Estimate', verificationState: 'VERIFIED', notes: 'Housing estate area, includes public playground.', town: 'Congotown East', leadersCount: 0, weeklyReportsCount: 0 },
  { id: 'comm-sayetown', name: 'Saye Town', latitude: 6.3005, longitude: -10.7885, elevation: 11.2, precision: 'GPS_Standard', verificationState: 'REJECTED', notes: 'Boundary dispute with neighboring clan. Verification put on hold.', town: 'Congotown West', leadersCount: 0, weeklyReportsCount: 0 },
];

export default function MapGIS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<string>('ALL');
  const [mapMode, setMapMode] = useState<'TERRAIN' | 'SATELLITE'>('TERRAIN');
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityMapData | null>(COMMUNITIES_MOCK[0]);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Bounds for District #10 GPS projection
  const bounds = {
    minLong: -10.795,
    maxLong: -10.710,
    minLat: 6.265,
    maxLat: 6.305
  };

  // SVG dimensions
  const mapWidth = 800;
  const mapHeight = 500;

  // Convert GPS Coordinates to Local Map Canvas (X, Y)
  const projectCoords = (lat: number, lon: number) => {
    const x = ((lon - bounds.minLong) / (bounds.maxLong - bounds.minLong)) * mapWidth;
    // Invert Y because SVG coordinates start at top-left
    const y = mapHeight - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * mapHeight;
    return { x, y };
  };

  // Filtered communities
  const filteredCommunities = useMemo(() => {
    return COMMUNITIES_MOCK.filter(comm => {
      const matchesSearch = comm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            comm.town.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterState === 'ALL' || comm.verificationState === filterState;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterState]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full relative">
      
      {/* Search & Filter Control Panel */}
      <div className="lg:col-span-1 space-y-4 flex flex-col justify-between h-[550px] p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-gray/30 pb-3">
            <span className="text-sm font-extrabold text-primary-indigo font-display flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-coast-teal" />
              <span>Map Controller</span>
            </span>
            <span className="text-[10px] bg-primary-indigo/10 text-primary-indigo font-bold px-2 py-0.5 rounded-full border border-primary-indigo/10">
              District #10 Pilot
            </span>
          </div>

          {/* Search Community */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-body-gray/60" />
            <input
              type="text"
              placeholder="Search community name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input text-ink"
            />
          </div>

          {/* Filter Verification State */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Verification State</label>
            <div className="grid grid-cols-2 gap-1.5">
              {['ALL', 'VERIFIED', 'PENDING', 'REJECTED'].map((state) => (
                <button
                  key={state}
                  onClick={() => setFilterState(state)}
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${
                    filterState === state
                      ? 'bg-primary-indigo text-white border-primary-indigo'
                      : 'bg-white/40 text-body-gray border-border-gray/30 hover:bg-white/80'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Map Layer Mode */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-coast-teal" />
              <span>Layer View Style</span>
            </label>
            <div className="flex gap-2 p-1 bg-white/50 border border-border-gray/30 rounded-xl">
              <button
                onClick={() => setMapMode('TERRAIN')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  mapMode === 'TERRAIN' ? 'bg-primary-indigo text-white shadow-sm' : 'text-body-gray hover:text-ink'
                }`}
              >
                Terrain & Rivers
              </button>
              <button
                onClick={() => setMapMode('SATELLITE')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  mapMode === 'SATELLITE' ? 'bg-primary-indigo text-white shadow-sm' : 'text-body-gray hover:text-ink'
                }`}
              >
                Satellite Sim
              </button>
            </div>
          </div>
        </div>

        {/* Mapped Summary List */}
        <div className="flex-grow overflow-y-auto mt-4 max-h-[180px] space-y-1 pr-1 border-t border-border-gray/30 pt-3">
          <p className="text-[9px] uppercase font-bold text-body-gray tracking-widest mb-1">Results ({filteredCommunities.length})</p>
          {filteredCommunities.map((comm) => (
            <button
              key={comm.id}
              onClick={() => setSelectedCommunity(comm)}
              className={`w-full text-left p-1.5 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-primary-indigo/5 transition-all ${
                selectedCommunity?.id === comm.id ? 'bg-primary-indigo/10 text-primary-indigo border-l-2 border-primary-indigo pl-2' : 'text-ink'
              }`}
            >
              <span className="truncate">{comm.name}</span>
              <span className={`w-2 h-2 rounded-full ${
                comm.verificationState === 'VERIFIED' ? 'bg-civic-green' :
                comm.verificationState === 'PENDING' ? 'bg-sand-gold' : 'bg-signal-red'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Interactive GIS SVG Canvas */}
      <div className="lg:col-span-2 relative h-[550px] rounded-2xl border border-border-gray/30 shadow-md overflow-hidden bg-slate-900 flex items-center justify-center">
        
        {/* Terrain layer or Satellite simulated layer background */}
        {mapMode === 'TERRAIN' ? (
          <div className="absolute inset-0 bg-[#E8F0E6] transition-colors duration-300">
            {/* Simulated River */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${mapWidth} ${mapHeight}`} preserveAspectRatio="none">
              {/* Stockton Creek / Mesurado River simulator */}
              <path d="M-50,250 Q150,180 300,280 T650,200 T850,220" fill="none" stroke="#A5C9EB" strokeWidth="24" strokeLinecap="round" opacity="0.8" />
              <path d="M-50,250 Q150,180 300,280 T650,200 T850,220" fill="none" stroke="#B9D7F2" strokeWidth="12" strokeLinecap="round" opacity="0.8" />
              
              {/* Secondary swamp water paths */}
              <path d="M400,280 Q500,420 520,550" fill="none" stroke="#B9D7F2" strokeWidth="6" opacity="0.5" />
              
              {/* Swamp vegetation patterns (District 10 swamp edges) */}
              <rect x="420" y="320" width="100" height="80" rx="10" fill="#2E7D32" fillOpacity="0.05" />
              <text x="470" y="360" fill="#2E7D32" fillOpacity="0.3" fontSize="10" fontWeight="bold" textAnchor="middle">Swamp Zone</text>
              <rect x="180" y="100" width="220" height="90" rx="10" fill="#2E7D32" fillOpacity="0.05" />
              <text x="290" y="140" fill="#2E7D32" fillOpacity="0.3" fontSize="10" fontWeight="bold" textAnchor="middle">Forest / Canopy Zone</text>

              {/* Major Roads (Tubman Boulevard and Old Road) */}
              <path d="M0,400 Q300,380 600,450 T900,420" fill="none" stroke="#D5DDE6" strokeWidth="16" opacity="0.9" />
              <path d="M0,400 Q300,380 600,450 T900,420" fill="none" stroke="#7A8E99" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.8" />
              <text x="120" y="385" fill="#505A66" fillOpacity="0.7" fontSize="8" fontWeight="bold" transform="rotate(-3, 120, 385)">Tubman Boulevard</text>

              {/* Old Road linking branch */}
              <path d="M220,388 Q350,260 500,280 T750,442" fill="none" stroke="#D5DDE6" strokeWidth="10" opacity="0.9" />
              <path d="M220,388 Q350,260 500,280 T750,442" fill="none" stroke="#7A8E99" strokeWidth="1" strokeDasharray="4,4" opacity="0.8" />
              <text x="420" y="265" fill="#505A66" fillOpacity="0.7" fontSize="8" fontWeight="bold">Old Road</text>
            </svg>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#0B132B] transition-colors duration-300">
            {/* Grid structure overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b263b_1px,transparent_1px),linear-gradient(to_bottom,#1b263b_1px,transparent_1px)] bg-[size:30px_30px] opacity-40" />
            
            {/* Simulated Satellite Roads */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${mapWidth} ${mapHeight}`} preserveAspectRatio="none">
              {/* Rivers in deep blue */}
              <path d="M-50,250 Q150,180 300,280 T650,200 T850,220" fill="none" stroke="#1C3D5A" strokeWidth="24" opacity="0.5" />
              
              {/* Roads in bright lines */}
              <path d="M0,400 Q300,380 600,450 T900,420" fill="none" stroke="#1D8F8A" strokeWidth="3" opacity="0.7" />
              <path d="M220,388 Q350,260 500,280 T750,442" fill="none" stroke="#1D8F8A" strokeWidth="2" opacity="0.7" />

              {/* Simulated structure cluster boxes */}
              <circle cx="280" cy="320" r="15" fill="#D4A73B" fillOpacity="0.1" stroke="#D4A73B" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="680" cy="350" r="25" fill="#D4A73B" fillOpacity="0.1" stroke="#D4A73B" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
          </div>
        )}

        {/* GIS Compass Rose */}
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-700 text-white flex flex-col items-center shadow-lg">
          <Compass className="w-6 h-6 text-sand-gold animate-spin-slow" />
          <span className="text-[8px] mt-1 font-bold">GIS NORTH</span>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
          <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))} className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center cursor-pointer shadow-md transition-all">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))} className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center cursor-pointer shadow-md transition-all">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Render Interactive GPS Markers on the Map */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="w-full h-full relative transition-transform duration-500 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {filteredCommunities.map((comm) => {
              const { x, y } = projectCoords(comm.latitude, comm.longitude);
              const isSelected = selectedCommunity?.id === comm.id;
              
              // Select color based on verification state
              const pinColor = 
                comm.verificationState === 'VERIFIED' ? 'text-civic-green fill-civic-green/20' :
                comm.verificationState === 'PENDING' ? 'text-sand-gold fill-sand-gold/20' : 'text-signal-red fill-signal-red/20';

              return (
                <button
                  key={comm.id}
                  onClick={() => setSelectedCommunity(comm)}
                  style={{ left: `${x}px`, top: `${y}px` }}
                  className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center group z-30 cursor-pointer"
                >
                  {/* Glowing bubble for selection */}
                  {isSelected && (
                    <span className="absolute -top-3 w-8 h-8 bg-primary-indigo/30 rounded-full animate-ping pointer-events-none" />
                  )}
                  
                  {/* Pin Icon */}
                  <MapPin className={`w-6 h-6 transition-all duration-300 drop-shadow-lg ${pinColor} ${
                    isSelected ? 'scale-125 stroke-[2.5px]' : 'group-hover:scale-110'
                  }`} />
                  
                  {/* Label tooltip */}
                  <span className={`mt-0.5 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase shadow-sm border transition-all pointer-events-none ${
                    isSelected
                      ? 'bg-slate-950 text-white border-slate-800'
                      : 'bg-white/90 text-slate-800 border-slate-200 group-hover:bg-slate-950 group-hover:text-white'
                  }`}>
                    {comm.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Low latency connection notification */}
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-md border border-slate-700 text-[8px] font-bold text-emerald-400 flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LOCAL GIS DATA LOADED</span>
        </div>
      </div>

      {/* Drill-down Community Details Side-panel */}
      <div className="lg:col-span-1 p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md h-[550px] flex flex-col justify-between overflow-y-auto">
        {selectedCommunity ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-border-gray/30 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-ink font-display leading-tight">{selectedCommunity.name}</h4>
                <p className="text-[10px] text-body-gray">Township: {selectedCommunity.town}</p>
              </div>
              <span className={`flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                selectedCommunity.verificationState === 'VERIFIED'
                  ? 'bg-civic-green/10 text-civic-green border-civic-green/20'
                  : selectedCommunity.verificationState === 'PENDING'
                  ? 'bg-sand-gold/10 text-sand-gold border-sand-gold/20'
                  : 'bg-signal-red/10 text-signal-red border-signal-red/20'
              }`}>
                {selectedCommunity.verificationState === 'VERIFIED' ? <CheckCircle2 className="w-2.5 h-2.5" /> :
                 selectedCommunity.verificationState === 'PENDING' ? <AlertTriangle className="w-2.5 h-2.5" /> :
                 <XCircle className="w-2.5 h-2.5" />}
                {selectedCommunity.verificationState}
              </span>
            </div>

            {/* GIS Metadata Coordinates */}
            <div className="bg-canvas-light border border-border-gray/30 rounded-xl p-3 space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-body-gray tracking-wider">GIS Coordinate Metrics</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-ink">
                <div>
                  <span className="text-body-gray block text-[8px]">LATITUDE</span>
                  <span className="font-mono">{selectedCommunity.latitude.toFixed(6)}° N</span>
                </div>
                <div>
                  <span className="text-body-gray block text-[8px]">LONGITUDE</span>
                  <span className="font-mono">{selectedCommunity.longitude.toFixed(6)}° W</span>
                </div>
                <div>
                  <span className="text-body-gray block text-[8px]">ELEVATION</span>
                  <span className="font-mono">{selectedCommunity.elevation} meters</span>
                </div>
                <div>
                  <span className="text-body-gray block text-[8px]">ACCURACY INDEX</span>
                  <span className="font-sans text-[8px] bg-primary-indigo/5 px-1 py-0.5 rounded border border-primary-indigo/10 text-primary-indigo truncate inline-block">
                    {selectedCommunity.precision.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Descriptive official notes */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-body-gray tracking-wider block">Official Registrar Notes</span>
              <p className="text-xs text-body-gray leading-relaxed italic bg-white/30 border border-border-gray/20 rounded-xl p-3">
                "{selectedCommunity.notes}"
              </p>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="border border-border-gray/30 rounded-xl p-2.5 text-center flex flex-col items-center gap-1 bg-white/40">
                <User className="w-4 h-4 text-primary-indigo" />
                <span className="text-lg font-black text-ink leading-none">{selectedCommunity.leadersCount}</span>
                <span className="text-[8px] font-bold text-body-gray uppercase tracking-wider">Leadership Roles</span>
              </div>
              <div className="border border-border-gray/30 rounded-xl p-2.5 text-center flex flex-col items-center gap-1 bg-white/40">
                <FileText className="w-4 h-4 text-coast-teal" />
                <span className="text-lg font-black text-ink leading-none">{selectedCommunity.weeklyReportsCount}</span>
                <span className="text-[8px] font-bold text-body-gray uppercase tracking-wider">Weekly Reports</span>
              </div>
            </div>

            {selectedCommunity.id === 'comm-chugbor' && (
              <div className="border border-primary-indigo/20 bg-primary-indigo/5 rounded-xl p-2.5 text-center">
                <p className="text-[10px] font-semibold text-primary-indigo flex items-center justify-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-sand-gold fill-sand-gold/20" />
                  <span>Interactive Drill-Down Available</span>
                </p>
                <p className="text-[9px] text-primary-indigo/80 mt-0.5">Approved NRCL profiles can be viewed in the Registry section.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full text-body-gray">
            <MapPin className="w-8 h-8 opacity-40 mb-2" />
            <p className="text-xs">Select a community pin on the map to inspect GIS and leadership metrics.</p>
          </div>
        )}

        <div className="pt-3 border-t border-border-gray/30 mt-auto">
          <a
            href={`/registry/${selectedCommunity?.id || 'comm-chugbor'}`}
            className="w-full py-2.5 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <span>View Full Community Profile</span>
          </a>
        </div>
      </div>

    </div>
  );
}
