import React, { useState } from 'react';
import { Award, Crown, Trophy, Star, Sparkles, Heart, Quote, Calendar, Users, ShieldCheck } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const AnnualAwardsSection: React.FC = () => {
  const { annualAwards } = useAppData();
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const years = Array.from(new Set(annualAwards.map((a) => a.year))).sort((a, b) => Number(b) - Number(a));
  const currentAwards = annualAwards.filter((a) => a.year === selectedYear);

  return (
    <div className="space-y-8">
      {/* Header Cover */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Crown className="w-4 h-4 text-amber-400" /> Annual Recognition Honors
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Vision79 Foundation Annual Community Awards
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Honoring exceptional volunteers, youth leaders, community champions, corporate partners, and impactful grassroots initiatives.
          </p>
        </div>
      </div>

      {/* Year Selector Tabs */}
      {years.length > 0 && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                selectedYear === y
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {y} Annual Awards
            </button>
          ))}
        </div>
      )}

      {/* Grid of Award Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentAwards.map((award) => (
          <div
            key={award.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Award Header Badge */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 border-b border-amber-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  {award.category}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{award.year}</span>
              </div>

              {/* Award Winner Info */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={award.winnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={award.winnerName}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-amber-100 shadow shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">{award.winnerName}</h3>
                    {award.winnerRoleOrOrg && (
                      <p className="text-xs text-indigo-600 font-semibold mt-0.5">{award.winnerRoleOrOrg}</p>
                    )}
                    {award.projectTitle && (
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Project: {award.projectTitle}</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{award.description}</p>

                {award.quote && (
                  <div className="bg-slate-50 p-3 rounded-xl border-l-4 border-amber-500 text-slate-700 italic text-xs leading-relaxed flex items-start gap-2">
                    <Quote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>"{award.quote}"</span>
                  </div>
                )}
              </div>
            </div>

            {/* Award Footer */}
            <div className="bg-slate-50 p-3 px-5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Presented by Board of Directors</span>
              <span className="font-mono">{award.dateAwarded}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
