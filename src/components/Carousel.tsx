'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Trees, Waves, Building2, Landmark } from 'lucide-react';

interface SettlementType {
  county: string;
  capital: string;
  type: 'Urban' | 'Peri-Urban' | 'Rural' | 'Forest' | 'Coastal' | 'Remote';
  icon: React.ReactNode;
  gradient: string;
  description: string;
  stat: string;
}

const SETTLEMENTS: SettlementType[] = [
  {
    county: 'Montserrado County',
    capital: 'Bensonville (Monrovia)',
    type: 'Urban',
    icon: <Building2 className="w-5 h-5 text-white" />,
    gradient: 'from-[#0A3D91] to-[#1D8F8A]',
    description: 'High-density urban communities, informal settlements, and active commercial zones (e.g. West Point, District #10 pilot centers).',
    stat: '1,200+ Communities Mapped'
  },
  {
    county: 'Lofa County',
    capital: 'Voinjama',
    type: 'Forest',
    icon: <Trees className="w-5 h-5 text-white" />,
    gradient: 'from-[#2E7D32] to-[#1D8F8A]',
    description: 'Deep agricultural and forest settlements. Coordinates tracked with high-canopy GPS receivers to offset signal blocks.',
    stat: '450+ Leadership Profiles'
  },
  {
    county: 'Grand Cape Mount',
    capital: 'Robertsport',
    type: 'Coastal',
    icon: <Waves className="w-5 h-5 text-white" />,
    gradient: 'from-[#1D8F8A] to-[#0E4EC1]',
    description: 'Scenic coastal fishing communities. Tracking water points, tides, and local artisan council structures.',
    stat: '280+ Mapped Settlements'
  },
  {
    county: 'Nimba County',
    capital: 'Sanniquellie',
    type: 'Peri-Urban',
    icon: <Landmark className="w-5 h-5 text-white" />,
    gradient: 'from-[#D4A73B] to-[#BF2A2A]',
    description: 'Fast-growing commercial hubs and transit towns. Monitoring cross-border trade, public market councils, and local youth networks.',
    stat: '850+ Registered Leaders'
  },
  {
    county: 'Maryland County',
    capital: 'Harper',
    type: 'Coastal',
    icon: <Waves className="w-5 h-5 text-white" />,
    gradient: 'from-[#0A3D91] to-[#D4A73B]',
    description: 'South-eastern coastal structures. Managing schools, clinic coordinates, and traditional elder succession records.',
    stat: '340+ Registered Nodes'
  },
  {
    county: 'Gbarpolu County',
    capital: 'Bopolu',
    type: 'Remote',
    icon: <Trees className="w-5 h-5 text-white" />,
    gradient: 'from-[#BF2A2A] to-[#2E7D32]',
    description: 'Remote communities within dense forest tracks. Enabling low-bandwidth SMS-based reporting backups to MIA.',
    stat: '190+ Forest Communities'
  }
];

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % SETTLEMENTS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SETTLEMENTS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SETTLEMENTS.length) % SETTLEMENTS.length);
  };

  return (
    <div
      className="relative w-full h-[400px] md:h-[450px] rounded-3xl overflow-hidden glass-panel border border-border-gray/30 p-2 shadow-xl flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Graphic representing active county card */}
      {SETTLEMENTS.map((settlement, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={settlement.county}
            className={`absolute inset-2 rounded-2xl overflow-hidden transition-all duration-750 ease-out flex flex-col justify-between p-6 md:p-8 text-white ${
              isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
            }`}
          >
            {/* Visual gradient backdrop */}
            <div className={`absolute inset-0 bg-gradient-to-br ${settlement.gradient} opacity-85 -z-10`} />
            
            {/* Fine geometric pattern lines on top */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] -z-10" />

            {/* Header badges */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20">
                {settlement.icon}
                <span>{settlement.type} Settlement</span>
              </span>
              <span className="text-xs font-bold text-sand-gold uppercase tracking-widest drop-shadow-md">
                {settlement.stat}
              </span>
            </div>

            {/* Content info */}
            <div className="space-y-4 max-w-lg mt-auto pb-4">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sand-gold" />
                  <span>Liberia County Profiles</span>
                </p>
                <h3 className="text-2xl md:text-3xl font-black font-display tracking-tight leading-tight">
                  {settlement.county}
                </h3>
                <p className="text-xs font-semibold text-white/80">Capital: {settlement.capital}</p>
              </div>

              <p className="text-xs md:text-sm text-white/90 leading-relaxed font-light backdrop-blur-[2px] bg-black/10 p-3 rounded-xl border border-white/5">
                {settlement.description}
              </p>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/30 text-white backdrop-blur-md border border-white/10 pointer-events-auto transition-all cursor-pointer shadow-md"
          title="Previous County Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/30 text-white backdrop-blur-md border border-white/10 pointer-events-auto transition-all cursor-pointer shadow-md"
          title="Next County Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {SETTLEMENTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex ? 'w-5 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            title={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
