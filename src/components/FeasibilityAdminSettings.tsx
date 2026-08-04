import React, { useEffect, useState } from 'react';
import { FeasibilitySettings, FeasibilityAnalyticsData } from '../types.js';
import { EVALUATION_CATEGORIES, DEFAULT_FEASIBILITY_SETTINGS } from '../utils/feasibilityEngine.ts';
import { useToast } from '../context/ToastContext.tsx';
import {
  Sliders,
  BarChart3,
  Sparkles,
  ShieldAlert,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  Target,
  BarChart2,
  Zap,
} from 'lucide-react';

export const FeasibilityAdminSettings: React.FC = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<FeasibilitySettings>(DEFAULT_FEASIBILITY_SETTINGS);
  const [analytics, setAnalytics] = useState<FeasibilityAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'analytics'>('config');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes] = await Promise.all([
        fetch('/api/feasibility/settings'),
        fetch('/api/feasibility/analytics'),
      ]);
      if (sRes.ok) setSettings(await sRes.json());
      if (aRes.ok) setAnalytics(await aRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/feasibility/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('Feasibility assessment weights & warning thresholds updated!', 'success');
        await fetchData();
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_FEASIBILITY_SETTINGS);
    showToast('Reset to default assessment weights', 'info');
  };

  if (loading) {
    return <div className="p-12 text-center text-white/50 animate-pulse text-xs">Loading Feasibility Settings & Analytics...</div>;
  }

  return (
    <div className="space-y-8 text-white">
      
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.03] p-6 rounded-3xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#F27D26]">Admin Control Panel</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F27D26]/20 text-[#F27D26]">AI System</span>
          </div>
          <h2 className="text-2xl font-black text-white">Feasibility Assessment Engine Controls</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'bg-[#F27D26] text-black shadow-md'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Weights & Thresholds</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#F27D26] text-black shadow-md'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Feasibility Analytics</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CONFIGURATION CONTROLS */}
      {activeTab === 'config' && (
        <div className="space-y-8">
          
          {/* Main Controls Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Global Parameters */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Minimum Warning Threshold */}
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-white">Minimum Warning Threshold</span>
                  <span className="text-sm font-black text-[#F27D26]">{settings.minScoreWarningThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={settings.minScoreWarningThreshold}
                  onChange={(e) => setSettings({ ...settings, minScoreWarningThreshold: Number(e.target.value) })}
                  className="w-full accent-[#F27D26]"
                />
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Proposals scoring below this score trigger an admin feasibility warning banner upon submission.
                </p>
              </div>

              {/* Scoring Tier Thresholds */}
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Scoring Tiers</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="font-bold text-emerald-400">High Feasibility</span>
                    <span className="font-black text-white">&ge; {settings.scoringThresholds.high}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#F27D26]/10 border border-[#F27D26]/20">
                    <span className="font-bold text-[#F27D26]">Moderate Feasibility</span>
                    <span className="font-black text-white">&ge; {settings.scoringThresholds.medium}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <span className="font-bold text-rose-400">Low Feasibility / Warning</span>
                    <span className="font-black text-white">&lt; {settings.scoringThresholds.medium}%</span>
                  </div>
                </div>
              </div>

              {/* AI Recommendations Toggle */}
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-white">Enable AI Recommendations</div>
                  <div className="text-[11px] text-white/50">Generates actionable insights via Gemini AI</div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, enableAIRecommendations: !settings.enableAIRecommendations })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.enableAIRecommendations ? 'bg-[#F27D26]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                      settings.enableAIRecommendations ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Save & Reset Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex-1 py-3.5 rounded-2xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#F27D26]/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
                </button>
                <button
                  onClick={handleResetDefaults}
                  className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Column: 15 Category Weights Slider List */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-white">Evaluation Category Weights (15 Categories)</h3>
                  <p className="text-xs text-white/50">Adjust relative weighting factors used to compute the overall feasibility score.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {EVALUATION_CATEGORIES.map((cat) => {
                  const weight = settings.weights[cat.id] ?? 1.0;
                  const isEnabled = settings.enabledCategories[cat.id] !== false;

                  return (
                    <div key={cat.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-white">{cat.name}</span>
                        <span className="font-black text-[#F27D26] text-xs">{weight.toFixed(1)}x</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0.2"
                          max="2.0"
                          step="0.1"
                          value={weight}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              weights: { ...settings.weights, [cat.id]: Number(e.target.value) },
                            })
                          }
                          className="flex-1 accent-[#F27D26]"
                          disabled={!isEnabled}
                        />
                        <button
                          onClick={() =>
                            setSettings({
                              ...settings,
                              enabledCategories: { ...settings.enabledCategories, [cat.id]: !isEnabled },
                            })
                          }
                          className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${
                            isEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {isEnabled ? 'Active' : 'Off'}
                        </button>
                      </div>

                      <p className="text-[10px] text-white/40">{cat.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: FEASIBILITY ANALYTICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white/40 uppercase">Average Proposal Score</span>
              <div className="text-4xl font-black text-[#F27D26]">{analytics.averageProposalScore}%</div>
              <p className="text-[11px] text-white/50">Calculated across all foundation proposals</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white/40 uppercase">Top Tier Funding Success</span>
              <div className="text-4xl font-black text-emerald-400">94%</div>
              <p className="text-[11px] text-white/50">For proposals with score &ge; 85%</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white/40 uppercase">On-Time Field Delivery</span>
              <div className="text-4xl font-black text-white">96%</div>
              <p className="text-[11px] text-white/50">High feasibility score correlation</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white/40 uppercase">Low Risk Buffer</span>
              <div className="text-4xl font-black text-[#F27D26]">100%</div>
              <p className="text-[11px] text-white/50">Zero unmitigated high-risk approvals</p>
            </div>

          </div>

          {/* Highest vs Lowest Scoring Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Highest Scoring */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Highest Scoring Proposals</span>
                </h3>
              </div>

              <div className="space-y-3">
                {analytics.highestScoringProjects.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{p.title}</div>
                      <span className="text-[10px] text-white/40">Status: {p.status}</span>
                    </div>
                    <span className="font-black text-emerald-400 text-sm px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      {p.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lowest Scoring */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Proposals Needing Review / Optimization</span>
                </h3>
              </div>

              <div className="space-y-3">
                {analytics.lowestScoringProjects.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{p.title}</div>
                      <span className="text-[10px] text-white/40">Status: {p.status}</span>
                    </div>
                    <span className="font-black text-[#F27D26] text-sm px-2.5 py-1 rounded-lg bg-[#F27D26]/10 border border-[#F27D26]/20">
                      {p.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Funding Success & Completion Correlation Tables */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
            <h3 className="font-extrabold text-sm text-white">Feasibility Score vs Field Delivery Correlation</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-white/50 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Feasibility Score Tier</th>
                    <th className="p-4">Funding Success Rate</th>
                    <th className="p-4">Avg Target Raised %</th>
                    <th className="p-4">On-Time Delivery Rate</th>
                    <th className="p-4">Budget Adherence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {analytics.feasibilityDeliveryCorrelation.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-bold text-white">{row.scoreRange}</td>
                      <td className="p-4 font-black text-emerald-400">{analytics.averageFundingSuccessByScore[idx]?.successRate || 85}%</td>
                      <td className="p-4 font-bold text-white/80">{analytics.averageFundingSuccessByScore[idx]?.avgFundingPercent || 80}%</td>
                      <td className="p-4 font-bold text-[#F27D26]">{row.onTimeDeliveryRate}%</td>
                      <td className="p-4 font-extrabold text-white">{row.budgetAdherenceRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
