"use client";

import { useEffect, useState } from 'react';
import portfolioDataRaw from '@/data/portfolio.json';

export function Demos() {
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    // On s'assure que les données sont bien un tableau
    if (Array.isArray(portfolioDataRaw)) {
      setTracks(portfolioDataRaw);
    }
  }, []);

  if (tracks.length === 0) return null;

  return (
    <section className="bg-black py-20 px-10" id="demos">
      <h2 className="text-orange-500 text-xs uppercase tracking-[0.3em] mb-12 font-bold">
        Portfolio / Audio
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {tracks.map((track, index) => (
          <div key={index} className="group border-b border-zinc-800 pb-8 hover:border-orange-500 transition-colors duration-500">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-white text-xl font-light tracking-tight capitalize">
                {track.title.replace(/_/g, ' ')}
              </h3>
              <span className="text-zinc-600 text-[10px] uppercase tracking-widest">
                {track.category}
              </span>
            </div>
            
            <audio controls className="w-full h-8 opacity-40 group-hover:opacity-100 transition-opacity duration-500 filter invert">
              <source src={track.url} type="audio/mpeg" />
            </audio>
            
            <p className="mt-4 text-zinc-500 text-[10px] leading-relaxed line-clamp-1 italic font-light">
              {track.transcript}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}