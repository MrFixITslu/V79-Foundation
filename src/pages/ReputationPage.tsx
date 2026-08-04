import React, { useState } from 'react';
import { Trophy, Crown, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { LeaderboardView } from '../components/reputation/LeaderboardView';
import { AnnualAwardsSection } from '../components/reputation/AnnualAwardsSection';

export const ReputationPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'leaderboard' | 'awards'>('leaderboard');

  return (
    <div className="space-y-8 pb-16">
      {/* Top Subtab Navigation */}
      <div className="flex items-center justify-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10 max-w-md mx-auto">
        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'leaderboard'
              ? 'bg-[#F27D26] text-slate-950 shadow-md'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Community Leaderboard
        </button>

        <button
          onClick={() => setActiveSubTab('awards')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'awards'
              ? 'bg-[#F27D26] text-slate-950 shadow-md'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Crown className="w-4 h-4" />
          Annual Honors & Awards
        </button>
      </div>

      {activeSubTab === 'leaderboard' && <LeaderboardView />}
      {activeSubTab === 'awards' && <AnnualAwardsSection />}
    </div>
  );
};
