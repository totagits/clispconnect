'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  MapPin, Search, Filter, Layers, Compass, ZoomIn, ZoomOut, 
  CheckCircle2, AlertTriangle, XCircle, User, Activity, FileText,
  ArrowLeft, ArrowUp, ArrowDown, Map as MapIcon, Globe
} from 'lucide-react';

export interface CommunityMapData {
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

// Bounding box bounds for dynamic geographic projection
const COUNTY_BOUNDS: Record<string, { minLong: number, maxLong: number, minLat: number, maxLat: number }> = {
  ALL: { minLong: -11.6, maxLong: -7.3, minLat: 4.3, maxLat: 8.6 },
  MONT: { minLong: -10.95, maxLong: -10.45, minLat: 6.18, maxLat: 6.52 },
  NIMB: { minLong: -9.15, maxLong: -8.25, minLat: 5.80, maxLat: 7.65 },
  LOFA: { minLong: -10.60, maxLong: -9.40, minLat: 7.20, maxLat: 8.60 },
  GBAS: { minLong: -10.45, maxLong: -9.45, minLat: 5.50, maxLat: 6.40 },
  SINO: { minLong: -9.30, maxLong: -8.20, minLat: 4.70, maxLat: 5.75 },
  MARG: { minLong: -10.55, maxLong: -10.15, minLat: 6.25, maxLat: 6.75 },
  BONG: { minLong: -10.20, maxLong: -9.10, minLat: 6.40, maxLat: 7.40 },
  MARY: { minLong: -8.00, maxLong: -7.40, minLat: 4.30, maxLat: 5.00 },
  GGED: { minLong: -8.50, maxLong: -7.80, minLat: 5.50, maxLat: 6.40 },
  RGEE: { minLong: -8.20, maxLong: -7.60, minLat: 4.80, maxLat: 5.60 },
  CMNT: { minLong: -11.60, maxLong: -11.00, minLat: 6.60, maxLat: 7.40 },
  BOMI: { minLong: -11.10, maxLong: -10.60, minLat: 6.50, maxLat: 7.00 },
  GBAR: { minLong: -10.80, maxLong: -10.00, minLat: 7.00, maxLat: 7.90 },
  RCES: { minLong: -9.80, maxLong: -9.20, minLat: 5.30, maxLat: 6.10 },
  GKRU: { minLong: -8.60, maxLong: -8.00, minLat: 4.50, maxLat: 5.10 },
};

const COUNTIES_LIST = [
  { id: 'ALL', name: 'All of Liberia' },
  { id: 'MONT', name: 'Montserrado' },
  { id: 'NIMB', name: 'Nimba' },
  { id: 'LOFA', name: 'Lofa' },
  { id: 'GBAS', name: 'Grand Bassa' },
  { id: 'SINO', name: 'Sinoe' },
  { id: 'MARY', name: 'Maryland' },
  { id: 'GGED', name: 'Grand Gedeh' },
  { id: 'RGEE', name: 'River Gee' },
  { id: 'CMNT', name: 'Grand Cape Mount' },
  { id: 'BOMI', name: 'Bomi' },
  { id: 'GBAR', name: 'Gbarpolu' },
  { id: 'MARG', name: 'Margibi' },
  { id: 'BONG', name: 'Bong' },
  { id: 'RCES', name: 'Rivercess' },
  { id: 'GKRU', name: 'Grand Kru' },
];

// High-fidelity border coordinates of Liberia to draw the landmass
const BORDER_COORDS = [
  { lat: 6.75, lon: -11.35 }, // Cape Mount
  { lat: 7.40, lon: -10.80 }, // Western border
  { lat: 8.25, lon: -10.35 }, // Northwest corner
  { lat: 8.58, lon: -9.98 },  // Northernmost tip (Lofa)
  { lat: 7.90, lon: -9.10 },  // North border
  { lat: 7.50, lon: -8.45 },  // Nimba northeast tip
  { lat: 6.70, lon: -8.20 },  // Mid-east border
  { lat: 5.90, lon: -8.10 },  // East border
  { lat: 5.20, lon: -7.40 },  // Southeast border
  { lat: 4.37, lon: -7.70 },  // Cape Palmas / Harper
  { lat: 5.01, lon: -9.04 },  // Greenville coast
  { lat: 5.88, lon: -10.05 }, // Buchanan coast
  { lat: 6.31, lon: -10.81 }, // Monrovia coast
];

// Major Liberian Highways coordinates
const HIGHWAYS = [
  {
    name: 'Monrovia-Gbarnga Highway',
    coords: [
      { lat: 6.31, lon: -10.81 }, // Monrovia
      { lat: 6.51, lon: -10.30 }, // Kakata
      { lat: 7.01, lon: -9.75 },  // Gbarnga
      { lat: 7.36, lon: -8.70 }   // Sanniquellie
    ]
  },
  {
    name: 'Coastal Corridor Route',
    coords: [
      { lat: 6.31, lon: -10.81 }, // Monrovia
      { lat: 5.88, lon: -10.05 }, // Buchanan
      { lat: 5.01, lon: -9.04 },  // Greenville
      { lat: 4.37, lon: -7.70 }   // Harper
    ]
  }
];

// Helper to choose the best panorama image based on community geography
const getPanoramaPath = (communityId: string) => {
  if (['comm-buchanan', 'comm-greenville'].includes(communityId)) {
    return '/panoramas/coastal.png';
  }
  if (['comm-sanniquellie', 'comm-voinjama', 'comm-gbarnga'].includes(communityId)) {
    return '/panoramas/lofa.png';
  }
  return '/panoramas/monrovia.png';
};

interface MapGISProps {
  initialCommunities?: CommunityMapData[];
}

export default function MapGIS({ initialCommunities = [] }: MapGISProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<string>('ALL');
  const [selectedCounty, setSelectedCounty] = useState<string>('ALL');
  const [mapMode, setMapMode] = useState<'TERRAIN' | 'SATELLITE'>('TERRAIN');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<'MAP' | 'STREETVIEW'>('MAP');
  const [useLiveGoogle, setUseLiveGoogle] = useState(false);

  // Drag-to-pan Street View States
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(400); // Default middle focus
  const [isWalking, setIsWalking] = useState(false); // Walking transition flash

  const panoramaRef = useRef<HTMLDivElement>(null);

  // SVG viewport dimensions
  const mapWidth = 800;
  const mapHeight = 500;

  // Retrieve current projection bounds based on selected county
  const currentBounds = useMemo(() => {
    return COUNTY_BOUNDS[selectedCounty] || COUNTY_BOUNDS.ALL;
  }, [selectedCounty]);

  // Convert GPS Coordinates (Lat/Long) to local Map Canvas SVG coordinates (X, Y)
  const projectCoords = (lat: number, lon: number) => {
    const x = ((lon - currentBounds.minLong) / (currentBounds.maxLong - currentBounds.minLong)) * mapWidth;
    const y = mapHeight - ((lat - currentBounds.minLat) / (currentBounds.maxLat - currentBounds.minLat)) * mapHeight;
    return { x, y };
  };

  // Build the landmass outline string
  const borderPointsString = useMemo(() => {
    return BORDER_COORDS.map(pt => {
      const { x, y } = projectCoords(pt.lat, pt.lon);
      return `${x},${y}`;
    }).join(' ');
  }, [currentBounds]);

  // Filtered communities to display on map and side panel
  const filteredCommunities = useMemo(() => {
    return initialCommunities.filter(comm => {
      const matchesSearch = comm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            comm.town.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterState === 'ALL' || comm.verificationState === filterState;
      const matchesCounty = selectedCounty === 'ALL' || comm.town.toLowerCase().includes(COUNTIES_LIST.find(c => c.id === selectedCounty)?.name.toLowerCase() || 'impossible_string');
      return matchesSearch && matchesFilter && matchesCounty;
    });
  }, [initialCommunities, searchQuery, filterState, selectedCounty]);

  // Handle active community pin selection
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityMapData | null>(null);

  // Auto-set first match on county filter changes
  useEffect(() => {
    if (filteredCommunities.length > 0) {
      setSelectedCommunity(filteredCommunities[0]);
    } else {
      setSelectedCommunity(null);
    }
  }, [selectedCounty]);

  // Loop around calculations for the 360° image container (2400px wide, 800px viewport, max offset 1600px)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    setStartX(e.pageX);
    setScrollOffset(prev => {
      let next = prev - dx * 1.2;
      if (next < 0) next = 1600; // loop back
      if (next > 1600) next = 0; // loop forward
      return next;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile/PWA
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = e.touches[0].clientX;
    const dx = clientX - startX;
    setStartX(clientX);
    setScrollOffset(prev => {
      let next = prev - dx * 1.2;
      if (next < 0) next = 1600;
      if (next > 1600) next = 0;
      return next;
    });
  };

  // Walking transition animation
  const handleWalk = () => {
    setIsWalking(true);
    setTimeout(() => {
      setIsWalking(false);
      // Shift offset randomly to simulate moving forward
      setScrollOffset(prev => (prev + 200) % 1600);
    }, 400);
  };

  // Calculate compass angle (1600px maps to 360 degrees)
  const compassAngle = useMemo(() => {
    return (scrollOffset / 1600) * 360;
  }, [scrollOffset]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full relative">
      
      {/* Search & Filter Control Panel */}
      <div className="lg:col-span-1 space-y-4 flex flex-col justify-between h-[550px] p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md">
        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="flex items-center justify-between border-b border-border-gray/30 pb-3">
            <span className="text-sm font-extrabold text-primary-indigo font-display flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-coast-teal" />
              <span>Map Controller</span>
            </span>
            <span className="text-[10px] bg-primary-indigo/10 text-primary-indigo font-bold px-2 py-0.5 rounded-full border border-primary-indigo/10">
              Liberia GIS Registry
            </span>
          </div>

          {/* Search Community */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-body-gray/60" />
            <input
              type="text"
              placeholder="Search community..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input text-ink"
            />
          </div>

          {/* County Selector */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">County / Region</label>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-ink cursor-pointer bg-white"
            >
              {COUNTIES_LIST.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Filter Verification State */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Verification State</label>
            <div className="grid grid-cols-2 gap-1.5">
              {['ALL', 'VERIFIED', 'PENDING', 'REJECTED'].map((state) => (
                <button
                  key={state}
                  onClick={() => setFilterState(state)}
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all border cursor-pointer ${
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
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  mapMode === 'TERRAIN' ? 'bg-primary-indigo text-white shadow-sm' : 'text-body-gray hover:text-ink'
                }`}
              >
                Terrain & Rivers
              </button>
              <button
                onClick={() => setMapMode('SATELLITE')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  mapMode === 'SATELLITE' ? 'bg-primary-indigo text-white shadow-sm' : 'text-body-gray hover:text-ink'
                }`}
              >
                Satellite Grid
              </button>
            </div>
          </div>
        </div>

        {/* Mapped Summary List */}
        <div className="flex-grow overflow-y-auto mt-4 max-h-[160px] space-y-1 pr-1 border-t border-border-gray/30 pt-3">
          <p className="text-[9px] uppercase font-bold text-body-gray tracking-widest mb-1">Results ({filteredCommunities.length})</p>
          {filteredCommunities.map((comm) => (
            <button
              key={comm.id}
              onClick={() => setSelectedCommunity(comm)}
              className={`w-full text-left p-1.5 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-primary-indigo/5 transition-all cursor-pointer ${
                selectedCommunity?.id === comm.id ? 'bg-primary-indigo/10 text-primary-indigo border-l-2 border-primary-indigo pl-2' : 'text-ink'
              }`}
            >
              <span className="truncate">{comm.name}</span>
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                comm.verificationState === 'VERIFIED' ? 'bg-civic-green' :
                comm.verificationState === 'PENDING' ? 'bg-sand-gold' : 'bg-signal-red'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Interactive GIS SVG Canvas OR Street View Panorama */}
      <div className="lg:col-span-2 relative h-[550px] rounded-2xl border border-border-gray/30 shadow-md overflow-hidden bg-[#050D1A] flex items-center justify-center">
        
        {viewMode === 'MAP' ? (
          <>
            {/* Ocean Background Layer */}
            <div className={`absolute inset-0 transition-colors duration-500 ${
              mapMode === 'TERRAIN' ? 'bg-[#D2E2EE]' : 'bg-[#050D1A]'
            }`} />

            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
              preserveAspectRatio="xMidYMid meet"
            >
              {/* 1. Liberia Landmass outline */}
              <polygon
                points={borderPointsString}
                fill={mapMode === 'TERRAIN' ? '#EFF6F2' : '#111D33'}
                stroke={mapMode === 'TERRAIN' ? '#C2DDD0' : '#1F3456'}
                strokeWidth="3.5"
                strokeLinejoin="round"
                className="transition-colors duration-500"
              />

              {/* 2. Forests overlays */}
              {mapMode === 'TERRAIN' && (
                <>
                  <path d="M 300,50 Q 330,80 390,40 T 420,120" fill="none" stroke="#D3EADF" strokeWidth="18" opacity="0.6" strokeLinecap="round" />
                  <path d="M 620,380 Q 690,410 740,390" fill="none" stroke="#D3EADF" strokeWidth="32" opacity="0.6" strokeLinecap="round" />
                </>
              )}

              {/* 3. Grid line overlay for Satellite simulation */}
              {mapMode === 'SATELLITE' && (
                <g opacity="0.1" stroke="#38BDF8" strokeWidth="0.5">
                  <line x1="0" y1="100" x2={mapWidth} y2="100" />
                  <line x1="0" y1="200" x2={mapWidth} y2="200" />
                  <line x1="0" y1="300" x2={mapWidth} y2="300" />
                  <line x1="0" y1="400" x2={mapWidth} y2="400" />
                  <line x1="150" y1="0" x2="150" y2={mapHeight} />
                  <line x1="300" y1="0" x2="300" y2={mapHeight} />
                  <line x1="450" y1="0" x2="450" y2={mapHeight} />
                  <line x1="600" y1="0" x2="600" y2={mapHeight} />
                </g>
              )}

              {/* 4. Infrastructure Transport Corridors (Highways) */}
              {HIGHWAYS.map((hw, idx) => {
                const pathPoints = hw.coords.map(pt => {
                  const { x, y } = projectCoords(pt.lat, pt.lon);
                  return `${x},${y}`;
                }).join(' L ');

                return (
                  <path
                    key={idx}
                    d={`M ${pathPoints}`}
                    fill="none"
                    stroke={mapMode === 'TERRAIN' ? '#E9A16E' : '#0EA5E9'}
                    strokeWidth={mapMode === 'TERRAIN' ? '2.5' : '1.5'}
                    strokeDasharray={mapMode === 'SATELLITE' ? '4,3' : 'none'}
                    opacity={mapMode === 'TERRAIN' ? '0.7' : '0.5'}
                  >
                    <title>{hw.name}</title>
                  </path>
                );
              })}
            </svg>

            {/* GIS Compass Rose */}
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-700 text-white flex flex-col items-center shadow-lg">
              <Compass className="w-5 h-5 text-sand-gold animate-spin-slow" />
              <span className="text-[8px] mt-1 font-bold">GIS NORTH</span>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
              <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))} className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center cursor-pointer shadow-md transition-all">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))} className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center cursor-pointer shadow-md transition-all">
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            {/* Render Interactive GPS Markers on the Map */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div 
                className="w-full h-full relative transition-transform duration-500 origin-center pointer-events-auto"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {filteredCommunities.map((comm) => {
                  const { x, y } = projectCoords(comm.latitude, comm.longitude);
                  const isSelected = selectedCommunity?.id === comm.id;
                  
                  if (x < 0 || x > mapWidth || y < 0 || y > mapHeight) return null;
                  
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
                      {isSelected && (
                        <span className="absolute -top-3 w-8 h-8 bg-primary-indigo/30 rounded-full animate-ping pointer-events-none" />
                      )}
                      
                      <MapPin className={`w-5 h-5 transition-all duration-300 drop-shadow-lg ${pinColor} ${
                        isSelected ? 'scale-125 stroke-[2.5px] text-primary-indigo' : 'group-hover:scale-110'
                      }`} />
                      
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
              <span>NATIONWIDE GIS CONNECTED</span>
            </div>
          </>
        ) : (
          /* STREET VIEW 360 PANORAMA VIEWPORT */
          <div className="w-full h-full relative bg-slate-950 flex flex-col text-white">
            
            {/* Top Info Bar */}
            <div className="absolute top-0 inset-x-0 bg-slate-950/80 backdrop-blur-md p-3 border-b border-slate-800 flex justify-between items-center z-40 text-xs">
              <button 
                onClick={() => setViewMode('MAP')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-extrabold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK TO GIS MAP</span>
              </button>
              
              <div className="text-center">
                <span className="font-extrabold block text-[11px] leading-tight">{selectedCommunity?.name}</span>
                <span className="text-[9px] text-body-gray">
                  GPS: {selectedCommunity?.latitude.toFixed(5)}° N, {selectedCommunity?.longitude.toFixed(5)}° W
                </span>
              </div>

              {/* Mode Toggle: Custom virtual vs Live Google Iframe */}
              <div className="flex gap-1.5 bg-slate-900 p-0.5 border border-slate-800 rounded-lg">
                <button 
                  onClick={() => setUseLiveGoogle(false)}
                  className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                    !useLiveGoogle ? 'bg-primary-indigo text-white' : 'text-body-gray hover:text-white'
                  }`}
                >
                  <Globe className="w-3 h-3 inline mr-1" />
                  <span>360° Virtual</span>
                </button>
                <button 
                  onClick={() => setUseLiveGoogle(true)}
                  className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                    useLiveGoogle ? 'bg-primary-indigo text-white' : 'text-body-gray hover:text-white'
                  }`}
                >
                  <MapIcon className="w-3 h-3 inline mr-1" />
                  <span>Live Google</span>
                </button>
              </div>
            </div>

            {/* Interactive display area */}
            <div className="flex-grow relative h-full w-full select-none">
              
              {!useLiveGoogle ? (
                /* 1. Custom Click-and-Drag Loopable 360° Panorama */
                <div 
                  className={`w-full h-full relative cursor-grab overflow-hidden flex items-center transition-all ${
                    isDragging ? 'cursor-grabbing' : ''
                  }`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                >
                  {/* Panoramic wide-aspect image container */}
                  <div 
                    ref={panoramaRef}
                    className="absolute h-full w-[2400px] bg-cover bg-center transition-transform duration-75 select-none pointer-events-none"
                    style={{ 
                      backgroundImage: `url(${selectedCommunity ? getPanoramaPath(selectedCommunity.id) : '/panoramas/monrovia.png'})`,
                      transform: `translateX(${-scrollOffset}px)`
                    }}
                  />

                  {/* Walking screen flash simulator */}
                  {isWalking && (
                    <div className="absolute inset-0 bg-white/70 animate-ping z-30 pointer-events-none" />
                  )}

                  {/* Street Navigation Arrows */}
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-40 pointer-events-none">
                    <button
                      onClick={handleWalk}
                      className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 pointer-events-auto cursor-pointer shadow-lg active:scale-95 transition-all hover:scale-105"
                      title="Step Forward"
                    >
                      <ArrowUp className="w-5 h-5 animate-pulse" />
                    </button>
                    <span className="px-2 py-0.5 bg-slate-900/90 border border-slate-800 text-[8px] font-bold rounded uppercase tracking-wider text-body-gray">
                      Move Down Path
                    </span>
                  </div>

                  {/* Panoramic compass dial */}
                  <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-700 flex flex-col items-center z-40">
                    <Compass 
                      className="w-8 h-8 text-sand-gold transition-transform duration-75" 
                      style={{ transform: `rotate(${-compassAngle}deg)` }}
                    />
                    <span className="text-[7px] mt-1 font-bold text-body-gray">BEARING: {Math.round(compassAngle)}°</span>
                  </div>

                  {/* Drag instructional tooltip */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900/70 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-800 text-[8px] font-bold tracking-wider uppercase text-body-gray/80 pointer-events-none">
                    ↕ Drag mouse or swipe to rotate 360°
                  </div>
                </div>
              ) : (
                /* 2. Live Google Maps street coordinates embed */
                <div className="w-full h-full relative z-30 pt-14">
                  {selectedCommunity ? (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${selectedCommunity.latitude},${selectedCommunity.longitude}&z=17&t=k&output=embed`}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-body-gray italic">
                      No coordinates selected.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Status bar */}
            <div className="bg-slate-950 px-4 py-2 border-t border-slate-900 flex justify-between items-center text-[8px] font-bold text-body-gray z-40">
              <span>ENVIRONMENT: SIMULATED PANORAMA</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                STREET VIEW PORTAL ONLINE
              </span>
            </div>

          </div>
        )}
      </div>

      {/* Drill-down Community Details Side-panel */}
      <div className="lg:col-span-1 p-5 rounded-2xl glass-panel border border-border-gray/30 shadow-md h-[550px] flex flex-col justify-between overflow-y-auto">
        {selectedCommunity ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-border-gray/30 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-ink font-display leading-tight">{selectedCommunity.name}</h4>
                <p className="text-[10px] text-body-gray">{selectedCommunity.town}</p>
              </div>
              <span className={`flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
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
                  <span className="font-mono">{selectedCommunity.elevation || '---'} meters</span>
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

            <div className="border border-primary-indigo/20 bg-primary-indigo/5 rounded-xl p-2.5 text-center">
              <p className="text-[10px] font-semibold text-primary-indigo flex items-center justify-center gap-1">
                <Activity className="w-3.5 h-3.5 text-sand-gold fill-sand-gold/20" />
                <span>Interactive Drill-Down Available</span>
              </p>
              <p className="text-[9px] text-primary-indigo/80 mt-0.5">Approved NRCL profiles can be viewed in the Registry section.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full text-body-gray">
            <MapPin className="w-8 h-8 opacity-40 mb-2" />
            <p className="text-xs">Select a community pin on the map to inspect GIS and leadership metrics.</p>
          </div>
        )}

        <div className="pt-3 border-t border-border-gray/30 mt-auto flex flex-col gap-2">
          <button
            onClick={() => {
              if (selectedCommunity) setViewMode('STREETVIEW');
            }}
            disabled={!selectedCommunity}
            className={`w-full py-2.5 rounded-xl bg-coast-teal hover:bg-[#166c68] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              !selectedCommunity ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Launch Street View (360°)</span>
          </button>
          
          <a
            href={`/registry/${selectedCommunity?.id || ''}`}
            onClick={(e) => {
              if (!selectedCommunity) e.preventDefault();
            }}
            className={`w-full py-2.5 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center ${
              !selectedCommunity ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>View Full Community Profile</span>
          </a>
        </div>
      </div>

    </div>
  );
}
