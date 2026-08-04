import React, { useState } from 'react';
import { Award, ShieldCheck, Trophy, Settings, Plus, Edit2, Trash2, UserPlus, Zap, Crown, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { AnnualCommunityAward, PointRule, CommunityLevel, Badge } from '../../types';

export const ReputationAdminManager: React.FC = () => {
  const {
    reputationConfig,
    userReputations,
    annualAwards,
    adjustUserPoints,
    awardUserBadge,
    createAnnualAward,
    deleteAnnualAward,
    updateReputationConfig,
  } = useAppData();

  const [activeTab, setActiveTab] = useState<'adjust' | 'badges' | 'awards' | 'rules'>('adjust');

  // Manual Adjust Form
  const [selectedUser, setSelectedUser] = useState('');
  const [pointsDelta, setPointsDelta] = useState(50);
  const [adjustCategory, setAdjustCategory] = useState('Community Leadership');
  const [adjustReason, setAdjustReason] = useState('');

  // Award Badge Form
  const [badgeUser, setBadgeUser] = useState('');
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [badgeReason, setBadgeReason] = useState('');

  // New Annual Award Form
  const [awardYear, setAwardYear] = useState(2026);
  const [awardCategory, setAwardCategory] = useState('Volunteer of the Year');
  const [awardWinnerName, setAwardWinnerName] = useState('');
  const [awardRole, setAwardRole] = useState('');
  const [awardProject, setAwardProject] = useState('');
  const [awardDesc, setAwardDesc] = useState('');
  const [awardQuote, setAwardQuote] = useState('');
  const [awardAvatar, setAwardAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !adjustReason) return;
    await adjustUserPoints(selectedUser, pointsDelta, adjustCategory, adjustReason);
    setAdjustReason('');
  };

  const handleAwardBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeUser || !selectedBadgeId) return;
    await awardUserBadge(badgeUser, selectedBadgeId, badgeReason);
    setBadgeReason('');
  };

  const handleCreateAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardWinnerName || !awardDesc) return;
    await createAnnualAward({
      year: awardYear,
      category: awardCategory,
      winnerName: awardWinnerName,
      winnerRoleOrOrg: awardRole,
      projectTitle: awardProject,
      description: awardDesc,
      quote: awardQuote,
      winnerAvatar: awardAvatar,
      dateAwarded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setAwardWinnerName('');
    setAwardDesc('');
    setAwardQuote('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" /> Community Reputation & Honors Governance
          </h3>
          <p className="text-xs text-slate-500">
            Configure point rules, award badges of honor, adjust points, and publish annual community awards.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-2 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('adjust')}
          className={`pb-2 border-b-2 transition-colors ${activeTab === 'adjust' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'}`}
        >
          Manual Point Adjustments
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-2 border-b-2 transition-colors ${activeTab === 'badges' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'}`}
        >
          Award Honour Badges
        </button>

        <button
          onClick={() => setActiveTab('awards')}
          className={`pb-2 border-b-2 transition-colors ${activeTab === 'awards' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'}`}
        >
          Annual Awards Publisher
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-2 border-b-2 transition-colors ${activeTab === 'rules' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'}`}
        >
          Config & Point Rules
        </button>
      </div>

      {activeTab === 'adjust' && (
        <form onSubmit={handleAdjustPoints} className="space-y-4 max-w-xl bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="font-bold text-slate-900 text-sm">Issue Point Adjustments / Recognition</h4>

          <div className="space-y-3 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1">Select Verified Member</label>
              <select
                required
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
              >
                <option value="">-- Choose User --</option>
                {userReputations.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.userName} ({u.score} pts - {u.levelTitle})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Point Change (+/-)</label>
                <input
                  type="number"
                  required
                  value={pointsDelta}
                  onChange={(e) => setPointsDelta(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1">Category</label>
                <select
                  value={adjustCategory}
                  onChange={(e) => setAdjustCategory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                >
                  <option value="Community Leadership">Community Leadership</option>
                  <option value="Volunteer Excellence">Volunteer Excellence</option>
                  <option value="Proposal Excellence">Proposal Excellence</option>
                  <option value="In-Kind Support">In-Kind Support</option>
                  <option value="Disciplinary Deduction">Disciplinary Deduction</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">Audit Log Reason / Notes</label>
              <textarea
                required
                rows={2}
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="State the reason for this point adjustment..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
          >
            Apply Point Adjustment
          </button>
        </form>
      )}

      {activeTab === 'badges' && (
        <form onSubmit={handleAwardBadge} className="space-y-4 max-w-xl bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="font-bold text-slate-900 text-sm">Award Order of Merit / Achievement Badge</h4>

          <div className="space-y-3 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1">Select Member</label>
              <select
                required
                value={badgeUser}
                onChange={(e) => setBadgeUser(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
              >
                <option value="">-- Choose User --</option>
                {userReputations.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.userName} ({u.levelTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Select Badge to Award</label>
              <select
                required
                value={selectedBadgeId}
                onChange={(e) => setSelectedBadgeId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
              >
                <option value="">-- Choose Badge --</option>
                {reputationConfig?.badges.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.description})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Citation Note</label>
              <input
                type="text"
                value={badgeReason}
                onChange={(e) => setBadgeReason(e.target.value)}
                placeholder="e.g. Awarded for leading Hurricane Beryl relief logistics"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
          >
            Award Honour Badge
          </button>
        </form>
      )}

      {activeTab === 'awards' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateAward} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">Create New Annual Community Award</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Year</label>
                <input
                  type="number"
                  value={awardYear}
                  onChange={(e) => setAwardYear(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1">Award Category</label>
                <select
                  value={awardCategory}
                  onChange={(e) => setAwardCategory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                >
                  <option value="Volunteer of the Year">Volunteer of the Year</option>
                  <option value="Community Champion">Community Champion</option>
                  <option value="Youth Leader of the Year">Youth Leader of the Year</option>
                  <option value="Corporate Partner of the Year">Corporate Partner of the Year</option>
                  <option value="Most Impactful Project">Most Impactful Project</option>
                  <option value="Grassroots Innovation Award">Grassroots Innovation Award</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Winner Name / Entity</label>
                <input
                  type="text"
                  required
                  value={awardWinnerName}
                  onChange={(e) => setAwardWinnerName(e.target.value)}
                  placeholder="e.g. Neil .V"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Role / Organization (Optional)</label>
                <input
                  type="text"
                  value={awardRole}
                  onChange={(e) => setAwardRole(e.target.value)}
                  placeholder="e.g. Field Logistics Lead"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1">Project Associated (Optional)</label>
                <input
                  type="text"
                  value={awardProject}
                  onChange={(e) => setAwardProject(e.target.value)}
                  placeholder="e.g. Clean Water Well Project"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Award Citation & Description</label>
                <textarea
                  required
                  rows={2}
                  value={awardDesc}
                  onChange={(e) => setAwardDesc(e.target.value)}
                  placeholder="Describe the exceptional impact and dedication of the recipient..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1">Inspirational Quote</label>
                <input
                  type="text"
                  value={awardQuote}
                  onChange={(e) => setAwardQuote(e.target.value)}
                  placeholder="e.g. True leadership is serving those who need it most."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
            >
              Publish Annual Award
            </button>
          </form>

          {/* List of Published Awards */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Published Annual Honors</h4>
            <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200">
              {annualAwards.map((a) => (
                <div key={a.id} className="p-3 px-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{a.winnerName}</span>
                    <span className="text-slate-500 ml-2">({a.category} - {a.year})</span>
                  </div>
                  <button
                    onClick={() => deleteAnnualAward(a.id)}
                    className="p-1.5 hover:bg-rose-100 text-rose-600 rounded transition-colors"
                    title="Remove Award"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 text-sm">System Point Rules</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reputationConfig?.pointRules.map((rule) => (
              <div key={rule.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{rule.actionName}</div>
                  <div className="text-[10px] text-slate-500">{rule.category}</div>
                </div>
                <div className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                  +{rule.points} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
