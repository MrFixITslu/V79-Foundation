import React, { useState } from 'react';
import { X, ShieldCheck, Award, Zap, Heart, Crown, Footprints, Trophy, Building2, Sparkles, Users, TreePine, GraduationCap, Dumbbell, Medal, Eye, EyeOff, Lock, CheckCircle2, Calendar, Clock, DollarSign, FolderCheck, FileText } from 'lucide-react';
import { UserReputation, Badge } from '../../types';
import { useAppData } from '../../context/AppDataContext';

interface UserProfileModalProps {
  reputation: UserReputation | null;
  isOpen: boolean;
  onClose: () => void;
  isCurrentUser?: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  reputation,
  isOpen,
  onClose,
  isCurrentUser = false,
}) => {
  const { updatePrivacySettings, reputationConfig } = useAppData();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'activity' | 'privacy'>('overview');
  const [leaderboardVis, setLeaderboardVis] = useState<'public' | 'anonymous' | 'hidden'>(
    reputation?.privacySettings?.leaderboardVisibility || 'public'
  );
  const [showDonations, setShowDonations] = useState<boolean>(
    reputation?.privacySettings?.showDonations ?? true
  );
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  if (!isOpen || !reputation) return null;

  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    await updatePrivacySettings(reputation.userId, {
      leaderboardVisibility: leaderboardVis,
      showDonations,
    });
    setSavingPrivacy(false);
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <Footprints className="w-5 h-5 text-indigo-500" />;
      case 'Shield': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-sky-500" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'Users': return <Users className="w-5 h-5 text-teal-500" />;
      case 'TreePine': return <TreePine className="w-5 h-5 text-green-600" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5 text-orange-500" />;
      case 'Medal': return <Medal className="w-5 h-5 text-rose-500" />;
      default: return <Award className="w-5 h-5 text-amber-500" />;
    }
  };

  const nextLevel = reputationConfig?.levels.find((l) => l.levelNumber === reputation.levelNumber + 1);
  const currentLevelObj = reputationConfig?.levels.find((l) => l.levelNumber === reputation.levelNumber);
  const minPts = currentLevelObj?.minPoints || 0;
  const maxPts = nextLevel ? nextLevel.minPoints : reputation.score + 500;
  const progressPct = Math.min(100, Math.max(5, Math.round(((reputation.score - minPts) / (maxPts - minPts)) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header Cover */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 pb-16">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" /> Vision79 Verified Member Profile
          </div>
          <h2 className="text-xl font-bold">Community Reputation & Impact</h2>
        </div>

        {/* Profile Card Intro Overlay */}
        <div className="px-6 -mt-12 relative mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 bg-white p-4 rounded-xl shadow-md border border-slate-200">
            <div className="flex items-center gap-4">
              <img
                src={reputation.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={reputation.userName}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{reputation.userName}</h3>
                  {reputation.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Member
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                  <span className="font-semibold text-amber-600">{reputation.levelTitle}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-700 font-medium">{reputation.score} Points</span>
                </div>
              </div>
            </div>

            <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <div className="text-xs text-slate-500 font-medium">Community Rank Level</div>
              <div className="text-lg font-black text-indigo-700">Level {reputation.levelNumber}</div>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="px-6 mb-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-slate-700">
                Current: <span className="text-indigo-700">{reputation.levelTitle}</span>
              </span>
              <span className="text-slate-500 font-mono">
                {reputation.score} / {nextLevel ? `${nextLevel.minPoints} pts` : 'Max Level'}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-[11px] text-slate-500 mt-1.5">
                Earn <span className="font-bold text-slate-700">{nextLevel.minPoints - reputation.score} more points</span> to unlock <span className="font-semibold text-indigo-600">Level {nextLevel.levelNumber}: {nextLevel.title}</span>.
              </p>
            )}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'}`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`pb-3 border-b-2 transition-colors ${activeTab === 'badges' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'}`}
          >
            Badges Earned ({reputation.badges.length})
          </button>
          {isCurrentUser && (
            <button
              onClick={() => setActiveTab('privacy')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'privacy' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'}`}
            >
              Privacy & Settings
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[380px] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              
              {/* Key Impact Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <FolderCheck className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
                  <div className="text-xl font-bold text-slate-900">{reputation.projectsSupportedCount}</div>
                  <div className="text-[11px] font-medium text-slate-500">Projects Supported</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <Clock className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                  <div className="text-xl font-bold text-slate-900">{reputation.volunteerHours} hrs</div>
                  <div className="text-[11px] font-medium text-slate-500">Volunteer Service</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <FileText className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                  <div className="text-xl font-bold text-slate-900">{reputation.projectsProposedCount}</div>
                  <div className="text-[11px] font-medium text-slate-500">Proposals Submitted</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <DollarSign className="w-5 h-5 mx-auto text-sky-600 mb-1" />
                  <div className="text-xl font-bold text-slate-900">
                    {reputation.privacySettings?.showDonations ? `EC$${reputation.totalDonatedEC.toLocaleString()}` : 'Private'}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 font-sans">Contributions Given</div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Verified Trust Indicators</h4>
                <div className="flex flex-wrap gap-2">
                  {reputation.trustIndicators.map((ti, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-medium border border-indigo-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      {ti}
                    </span>
                  ))}
                </div>
              </div>

              {/* Impact Statement */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Impact Summary
                </h4>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {reputation.userName} has contributed <span className="font-semibold">{reputation.volunteerHours} field hours</span> and supported <span className="font-semibold">{reputation.projectsSupportedCount} community projects</span>. Equal voting rights are preserved for all verified members regardless of score.
                </p>
              </div>

            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              <p className="text-xs text-slate-500 mb-4">
                Badges are permanent achievements unlocked through verified community participation, volunteering, and field leadership.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reputation.badges.map((badge) => (
                  <div key={badge.id} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 shrink-0">
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{badge.name}</span>
                        {badge.isManualAward && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-semibold">Honour</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{badge.description}</p>
                      {badge.unlockedAt && (
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Unlocked {badge.unlockedAt}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && isCurrentUser && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600" /> Community Leaderboard Privacy
                </h4>
                <p className="text-xs text-slate-600">
                  Control how your reputation score and display name appear on public community leaderboards.
                </p>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={leaderboardVis === 'public'}
                      onChange={() => setLeaderboardVis('public')}
                      className="text-indigo-600"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-indigo-600" /> Public Leaderboard
                      </div>
                      <div className="text-slate-500 text-[11px]">Display name and profile photo visible on top ranking boards.</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="privacy"
                      value="anonymous"
                      checked={leaderboardVis === 'anonymous'}
                      onChange={() => setLeaderboardVis('anonymous')}
                      className="text-indigo-600"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5 text-amber-600" /> Anonymous Contributor
                      </div>
                      <div className="text-slate-500 text-[11px]">Show points and level title (e.g. "Anonymous Community Builder") without name.</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="privacy"
                      value="hidden"
                      checked={leaderboardVis === 'hidden'}
                      onChange={() => setLeaderboardVis('hidden')}
                      className="text-indigo-600"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-rose-600" /> Completely Hidden
                      </div>
                      <div className="text-slate-500 text-[11px]">Do not appear on public leaderboards. Your voting power remains equal.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Donation Privacy Toggle */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Financial Contribution Visibility</h4>
                  <p className="text-xs text-slate-600">Show cumulative donation totals on your public profile card.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDonations}
                    onChange={(e) => setShowDonations(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="text-right pt-2">
                <button
                  onClick={handleSavePrivacy}
                  disabled={savingPrivacy}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
                >
                  {savingPrivacy ? 'Saving...' : 'Save Privacy Preferences'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center text-xs text-slate-500">
          <span>Member since {reputation.createdAt}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
