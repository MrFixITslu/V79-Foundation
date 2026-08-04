import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, Users, Heart, Clock, DollarSign, FolderCheck, ShieldCheck, Sparkles, Search, Filter, Lock } from 'lucide-react';
import { LeaderboardEntry } from '../../types';
import { useAppData } from '../../context/AppDataContext';
import { UserProfileModal } from './UserProfileModal';

export const LeaderboardView: React.FC = () => {
  const { fetchLeaderboard, userReputations, currentUserReputation } = useAppData();
  const [activeCategory, setActiveCategory] = useState<'score' | 'volunteers' | 'donors' | 'supporters' | 'sponsors'>('score');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchLeaderboard(activeCategory).then((data) => {
      if (isMounted) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [activeCategory, fetchLeaderboard]);

  const filteredEntries = entries.filter((e) =>
    e.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.levelTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredEntries.slice(0, 3);
  const remainingList = filteredEntries.slice(3);

  const selectedRep = userReputations.find((r) => r.userId === selectedUserId || `anon_${r.userId}` === selectedUserId);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-4 h-4 text-amber-400" /> Community Champions & Trust
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Foundation Recognition Leaderboard
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Recognizing non-financial contributions, field volunteering, project proposals, and community leadership. Equal voting rights are maintained for every verified member.
          </p>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory('score')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              activeCategory === 'score'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Top Community Score
          </button>

          <button
            onClick={() => setActiveCategory('volunteers')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              activeCategory === 'volunteers'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            Top Volunteers
          </button>

          <button
            onClick={() => setActiveCategory('supporters')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              activeCategory === 'supporters'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FolderCheck className="w-4 h-4 text-sky-400" />
            Top Project Supporters
          </button>

          <button
            onClick={() => setActiveCategory('donors')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              activeCategory === 'donors'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" />
            Top Donors
          </button>

          <button
            onClick={() => setActiveCategory('sponsors')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              activeCategory === 'sponsors'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            Top Sponsors
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search leaderboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Loading Community Rankings...</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
              {/* #2 Rank */}
              {topThree[1] && (
                <div
                  onClick={() => setSelectedUserId(topThree[1].userId)}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md hover:shadow-lg transition-all cursor-pointer relative order-2 md:order-1 transform hover:-translate-y-1"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-800 font-black text-xs px-3 py-1 rounded-full shadow border border-slate-400 flex items-center gap-1">
                    <Medal className="w-3.5 h-3.5 text-slate-600" /> #2 Silver Champion
                  </div>

                  <div className="text-center mt-3">
                    <img
                      src={topThree[1].avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
                      alt={topThree[1].displayName}
                      className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-slate-200 shadow"
                    />
                    <h3 className="font-bold text-slate-900 text-sm mt-2">{topThree[1].displayName}</h3>
                    <div className="text-xs font-semibold text-sky-600">{topThree[1].levelTitle}</div>

                    <div className="mt-3 bg-slate-50 py-2 rounded-xl border border-slate-100 font-mono font-bold text-slate-800 text-sm">
                      {activeCategory === 'volunteers' ? `${topThree[1].value} hrs` : activeCategory === 'donors' || activeCategory === 'sponsors' ? `EC$${topThree[1].value.toLocaleString()}` : `${topThree[1].value} pts`}
                    </div>
                  </div>
                </div>
              )}

              {/* #1 Rank (Gold Centerpiece) */}
              {topThree[0] && (
                <div
                  onClick={() => setSelectedUserId(topThree[0].userId)}
                  className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-6 border-2 border-amber-300 shadow-xl hover:shadow-2xl transition-all cursor-pointer relative order-1 md:order-2 transform hover:-translate-y-2"
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full shadow-lg border border-amber-200 flex items-center gap-1.5 uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-slate-950 fill-amber-300" /> #1 Gold Leader
                  </div>

                  <div className="text-center mt-3">
                    <img
                      src={topThree[0].avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={topThree[0].displayName}
                      className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-amber-400 shadow-lg"
                    />
                    <h3 className="font-extrabold text-slate-900 text-base mt-2 flex items-center justify-center gap-1">
                      {topThree[0].displayName}
                      <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    </h3>
                    <div className="text-xs font-bold text-amber-600">{topThree[0].levelTitle}</div>

                    <div className="mt-3 bg-gradient-to-r from-amber-100 to-amber-50 py-2.5 rounded-xl border border-amber-200 font-mono font-extrabold text-amber-900 text-base shadow-inner">
                      {activeCategory === 'volunteers' ? `${topThree[0].value} Vol Hours` : activeCategory === 'donors' || activeCategory === 'sponsors' ? `EC$${topThree[0].value.toLocaleString()}` : `${topThree[0].value} Points`}
                    </div>
                  </div>
                </div>
              )}

              {/* #3 Rank */}
              {topThree[2] && (
                <div
                  onClick={() => setSelectedUserId(topThree[2].userId)}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md hover:shadow-lg transition-all cursor-pointer relative order-3 transform hover:-translate-y-1"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-800 text-amber-100 font-black text-xs px-3 py-1 rounded-full shadow border border-amber-700 flex items-center gap-1">
                    <Medal className="w-3.5 h-3.5 text-amber-400" /> #3 Bronze Champion
                  </div>

                  <div className="text-center mt-3">
                    <img
                      src={topThree[2].avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                      alt={topThree[2].displayName}
                      className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-amber-200 shadow"
                    />
                    <h3 className="font-bold text-slate-900 text-sm mt-2">{topThree[2].displayName}</h3>
                    <div className="text-xs font-semibold text-purple-600">{topThree[2].levelTitle}</div>

                    <div className="mt-3 bg-slate-50 py-2 rounded-xl border border-slate-100 font-mono font-bold text-slate-800 text-sm">
                      {activeCategory === 'volunteers' ? `${topThree[2].value} hrs` : activeCategory === 'donors' || activeCategory === 'sponsors' ? `EC$${topThree[2].value.toLocaleString()}` : `${topThree[2].value} pts`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Table for Remaining Ranks */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Community Contributor Rankings</h3>
              <span className="text-xs text-slate-500 font-medium">{filteredEntries.length} Verified Contributor Profiles</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.userId}
                  onClick={() => setSelectedUserId(entry.userId)}
                  className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-mono font-bold text-sm w-8 text-slate-400 text-center">
                      #{entry.rank}
                    </div>

                    <img
                      src={entry.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={entry.displayName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{entry.displayName}</span>
                        {entry.verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{entry.levelTitle}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-slate-900">
                      {activeCategory === 'volunteers'
                        ? `${entry.value} hrs`
                        : activeCategory === 'donors' || activeCategory === 'sponsors'
                        ? `EC$${entry.value.toLocaleString()}`
                        : `${entry.value} pts`}
                    </div>
                    <div className="text-[10px] text-slate-400">{entry.badgesCount} Badges Unlocked</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* User Profile Modal when clicking any contributor */}
      {selectedRep && (
        <UserProfileModal
          reputation={selectedRep}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          isCurrentUser={currentUserReputation?.userId === selectedRep.userId}
        />
      )}
    </div>
  );
};
