import React from 'react';
import { Project } from '../types.js';
import { MapPin, Navigation } from 'lucide-react';

interface MapComponentProps {
  projects: Project[];
  onSelectProject?: (p: Project) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ projects, onSelectProject }) => {
  return (
    <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-center p-6 text-slate-100">
      {/* Visual stylized interactive canvas map representation */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs font-bold flex items-center gap-2">
        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
        <span>Live Impact Map — {projects?.length || 0} Field Locations</span>
      </div>

      <div className="relative z-10 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {projects.slice(0, 6).map((p, idx) => (
          <div
            key={p.id}
            onClick={() => onSelectProject && onSelectProject(p)}
            className="p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 truncate">{p.location.city}</span>
            </div>
            <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
              {p.title}
            </h4>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>{p.category}</span>
              <span className="font-semibold text-slate-200">${p.raisedAmount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
