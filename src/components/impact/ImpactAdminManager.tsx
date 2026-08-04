import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext.tsx';
import { ImpactMetricConfig, ImpactTimelineEvent, PinnedAnnouncement } from '../../types.js';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Flame,
  Globe,
  Layers,
  Megaphone,
  Plus,
  Save,
  Settings,
  ShieldAlert,
  Sparkles,
  Sliders,
  Trash2,
  TrendingUp,
} from 'lucide-react';

export const ImpactAdminManager: React.FC = () => {
  const {
    impactHubData,
    projects,
    updateImpactHubConfig,
    saveTimelineEvent,
    deleteTimelineEvent,
    updateScorecard,
    updateHealthData,
  } = useAppData();

  const [activeTab, setActiveTab] = useState<'metrics' | 'announcement' | 'featured' | 'timeline' | 'scorecard' | 'health' | 'analytics'>('metrics');

  const config = impactHubData?.config;
  const metrics = impactHubData?.calculatedMetrics || [];
  const timelineEvents = impactHubData?.timelineEvents || [];
  const scorecard = impactHubData?.scorecard;
  const healthData = impactHubData?.healthData;
  const analytics = impactHubData?.analyticsData;

  // Local state for editing metrics
  const [editedMetrics, setEditedMetrics] = useState<ImpactMetricConfig[]>(config?.metricsConfig || metrics);
  const [refreshInterval, setRefreshInterval] = useState<number>(config?.refreshIntervalSeconds || 10);
  const [publicStatsEnabled, setPublicStatsEnabled] = useState<boolean>(config?.publicStatsEnabled ?? true);
  const [healthScorePublic, setHealthScorePublic] = useState<boolean>(config?.healthScorePublic ?? true);

  // Local state for Pinned Announcement
  const [pinnedAnnouncement, setPinnedAnnouncement] = useState<PinnedAnnouncement>(
    config?.pinnedAnnouncement || {
      id: 'ann-1',
      title: '',
      message: '',
      date: new Date().toISOString().slice(0, 10),
      type: 'event',
      active: false,
    }
  );

  // Local state for Featured Project Override
  const [featuredProjectId, setFeaturedProjectId] = useState<string>(config?.featuredProjectId || '');

  // Local state for New Timeline Event Modal/Form
  const [editingTimeline, setEditingTimeline] = useState<Partial<ImpactTimelineEvent>>({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'milestone',
  });

  // Local state for Scorecard
  const [scData, setScData] = useState(scorecard || {
    projectsOnTimePct: 95,
    budgetPerformancePct: 98,
    volunteerSatisfactionRating: 4.8,
    communitySatisfactionRating: 4.9,
    fundingSuccessRatePct: 90,
    proposalApprovalRatePct: 75,
    avgProjectDurationDays: 45,
    avgCommunityRating: 4.9,
    trends: [],
  });

  // Local state for Health
  const [hData, setHData] = useState(healthData || {
    financialHealthScore: 95,
    volunteerCapacityScore: 90,
    projectCompletionScore: 95,
    fundingPipelineScore: 88,
    sponsorEngagementScore: 92,
    communityParticipationScore: 94,
    overallHealthScore: 93,
    publicVisibility: true,
  });

  // Save Metrics & Settings
  const handleSaveMetrics = async () => {
    if (!config) return;
    const newConfig = {
      ...config,
      refreshIntervalSeconds: refreshInterval,
      publicStatsEnabled,
      healthScorePublic,
      metricsConfig: editedMetrics,
    };
    await updateImpactHubConfig(newConfig);
  };

  // Save Pinned Announcement
  const handleSaveAnnouncement = async () => {
    if (!config) return;
    const newConfig = {
      ...config,
      pinnedAnnouncement,
    };
    await updateImpactHubConfig(newConfig);
  };

  // Save Featured Project Override
  const handleSaveFeatured = async () => {
    if (!config) return;
    const newConfig = {
      ...config,
      featuredProjectId,
    };
    await updateImpactHubConfig(newConfig);
  };

  // Metric Edit Helper
  const handleMetricChange = (id: string, field: keyof ImpactMetricConfig, value: any) => {
    setEditedMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  return (
    <div className="space-y-8 bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[#F27D26]">
            <Sliders className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">FOUNDATION CONTROL CENTER</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Impact Hub & Real-Time Dashboard Manager
          </h2>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSaveMetrics}
          className="px-6 py-3 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F27D26]/20"
        >
          <Save className="w-4 h-4 fill-black text-black" />
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'metrics', label: 'Impact Metrics (23)', icon: Activity },
          { id: 'announcement', label: 'Pinned Announcement', icon: Megaphone },
          { id: 'featured', label: 'Featured Project', icon: Flame },
          { id: 'timeline', label: 'Impact Timeline', icon: Clock },
          { id: 'scorecard', label: 'Scorecard KPIs', icon: Settings },
          { id: 'health', label: 'Foundation Health', icon: TrendingUp },
          { id: 'analytics', label: 'Real-Time Analytics', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#F27D26] text-black shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: METRICS CONFIGURATION */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
            <div>
              <label className="text-white/60 font-bold block mb-1">Public Display Enabled</label>
              <button
                onClick={() => setPublicStatsEnabled(!publicStatsEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  publicStatsEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}
              >
                {publicStatsEnabled ? 'Visible to Public' : 'Hidden from Public'}
              </button>
            </div>

            <div>
              <label className="text-white/60 font-bold block mb-1">Live Polling Interval (Seconds)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/20 text-white rounded-xl px-3 py-2 outline-none font-bold"
              />
            </div>

            <div className="flex items-end">
              <span className="text-white/50 text-[11px]">
                Metrics calculate dynamically from field donations, volunteers, and project databases unless overridden.
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-white/70">
              Metric Display Controls ({editedMetrics.length} Configurable Metrics)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {editedMetrics.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    m.enabled ? 'bg-white/[0.04] border-white/10' : 'bg-white/[0.01] border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold">
                      #{idx + 1} • {m.category}
                    </span>
                    <button
                      onClick={() => handleMetricChange(m.id, 'enabled', !m.enabled)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer ${
                        m.enabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-white/50 border-white/10'
                      }`}
                    >
                      {m.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="space-y-2 mt-3 text-xs">
                    <div>
                      <label className="text-white/50 block text-[10px]">Display Name</label>
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => handleMetricChange(m.id, 'label', e.target.value)}
                        className="w-full bg-slate-900 border border-white/20 text-white rounded-xl px-3 py-1.5 font-bold outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-white/50 block text-[10px]">Override Value</label>
                        <input
                          type="number"
                          placeholder="Auto calculated"
                          value={m.customValue ?? ''}
                          onChange={(e) =>
                            handleMetricChange(
                              m.id,
                              'customValue',
                              e.target.value !== '' ? Number(e.target.value) : undefined
                            )
                          }
                          className="w-full bg-slate-900 border border-white/20 text-white rounded-xl px-3 py-1.5 font-mono outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-white/50 block text-[10px]">Suffix Tag</label>
                        <input
                          type="text"
                          placeholder="e.g. +, hrs"
                          value={m.suffix || ''}
                          onChange={(e) => handleMetricChange(m.id, 'suffix', e.target.value)}
                          className="w-full bg-slate-900 border border-white/20 text-white rounded-xl px-3 py-1.5 font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PINNED ANNOUNCEMENT */}
      {activeTab === 'announcement' && (
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Public Pinned Announcement</h3>
            <button
              onClick={() => setPinnedAnnouncement((prev) => ({ ...prev, active: !prev.active }))}
              className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                pinnedAnnouncement.active
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/10 text-white/50 border-white/10'
              }`}
            >
              {pinnedAnnouncement.active ? 'Active on Homepage' : 'Draft / Inactive'}
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-white/60 font-bold block mb-1">Announcement Headline</label>
              <input
                type="text"
                value={pinnedAnnouncement.title}
                onChange={(e) => setPinnedAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Annual Community Impact Briefing Released"
                className="w-full bg-slate-900 border border-white/20 text-white rounded-2xl p-3 font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-white/60 font-bold block mb-1">Detailed Message</label>
              <textarea
                rows={3}
                value={pinnedAnnouncement.message}
                onChange={(e) => setPinnedAnnouncement((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Message body visible on homepage banner..."
                className="w-full bg-slate-900 border border-white/20 text-white rounded-2xl p-3 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 font-bold block mb-1">Target Link URL (Optional)</label>
                <input
                  type="text"
                  value={pinnedAnnouncement.link || ''}
                  onChange={(e) => setPinnedAnnouncement((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-white/20 text-white rounded-2xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="text-white/60 font-bold block mb-1">Announcement Type</label>
                <select
                  value={pinnedAnnouncement.type}
                  onChange={(e) => setPinnedAnnouncement((prev) => ({ ...prev, type: e.target.value as any }))}
                  className="w-full bg-slate-900 border border-white/20 text-white rounded-2xl p-3 font-bold outline-none cursor-pointer"
                >
                  <option value="event">Event / Summit</option>
                  <option value="urgent">Urgent Field Appeal</option>
                  <option value="info">General Announcement</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveAnnouncement}
              className="px-6 py-3 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
            >
              Update Pinned Announcement
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FEATURED PROJECT OVERRIDE */}
      {activeTab === 'featured' && (
        <div className="space-y-6 max-w-xl">
          <h3 className="text-lg font-bold text-white">Manual Featured Project Override</h3>
          <p className="text-xs text-white/60">
            Select a project to pin in the Spotlight Featured Mission section on the Impact Hub.
          </p>

          <div className="space-y-4 text-xs">
            <select
              value={featuredProjectId}
              onChange={(e) => setFeaturedProjectId(e.target.value)}
              className="w-full bg-slate-900 border border-white/20 text-white rounded-2xl p-3 font-bold outline-none cursor-pointer"
            >
              <option value="">Auto Select (Highest Priority Active Project)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.location ? `${p.location.city}, ${p.location.region}` : ''} - {p.status})
                </option>
              ))}
            </select>

            <button
              onClick={handleSaveFeatured}
              className="px-6 py-3 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
            >
              Save Featured Choice
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: IMPACT TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Impact Timeline Events</h3>
          </div>

          {/* New Event Form */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4 text-xs">
            <span className="font-bold text-[#F27D26] uppercase tracking-wider block">Add / Edit Timeline Event</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Milestone Title"
                value={editingTimeline.title || ''}
                onChange={(e) => setEditingTimeline((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-slate-900 border border-white/20 text-white rounded-xl p-2.5 font-bold outline-none"
              />

              <input
                type="date"
                value={editingTimeline.date || ''}
                onChange={(e) => setEditingTimeline((prev) => ({ ...prev, date: e.target.value }))}
                className="bg-slate-900 border border-white/20 text-white rounded-xl p-2.5 font-mono outline-none"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Description..."
              value={editingTimeline.description || ''}
              onChange={(e) => setEditingTimeline((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full bg-slate-900 border border-white/20 text-white rounded-xl p-2.5 outline-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Image URL (Optional)"
                value={editingTimeline.imageUrl || ''}
                onChange={(e) => setEditingTimeline((prev) => ({ ...prev, imageUrl: e.target.value }))}
                className="bg-slate-900 border border-white/20 text-white rounded-xl p-2.5 outline-none"
              />

              <select
                value={editingTimeline.type || 'milestone'}
                onChange={(e) => setEditingTimeline((prev) => ({ ...prev, type: e.target.value as any }))}
                className="bg-slate-900 border border-white/20 text-white rounded-xl p-2.5 font-bold outline-none cursor-pointer"
              >
                <option value="project_started">Project Started</option>
                <option value="project_completed">Project Completed</option>
                <option value="milestone">Milestone Reached</option>
                <option value="funding_goal">Funding Goal Achieved</option>
                <option value="volunteer_event">Volunteer Drive</option>
                <option value="award">Award & Recognition</option>
              </select>
            </div>

            <button
              onClick={async () => {
                if (!editingTimeline.title) return alert('Title is required');
                await saveTimelineEvent(editingTimeline);
                setEditingTimeline({ title: '', description: '', date: new Date().toISOString().slice(0, 10), type: 'milestone' });
              }}
              className="px-5 py-2.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer"
            >
              Add Event to Timeline
            </button>
          </div>

          {/* List of existing timeline events */}
          <div className="space-y-3">
            {timelineEvents.map((e) => (
              <div key={e.id} className="bg-white/[0.03] p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#F27D26] font-mono font-bold">{e.date}</span> &bull; <strong className="text-white">{e.title}</strong>
                  <p className="text-white/60 line-clamp-1">{e.description}</p>
                </div>

                <button
                  onClick={() => deleteTimelineEvent(e.id)}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SCORECARD KPIS */}
      {activeTab === 'scorecard' && (
        <div className="space-y-6 max-w-xl">
          <h3 className="text-lg font-bold text-white">Foundation Scorecard KPIs</h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-white/60 font-bold block mb-1">Projects On Time %</label>
              <input
                type="number"
                value={scData.projectsOnTimePct}
                onChange={(e) => setScData({ ...scData, projectsOnTimePct: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-white/20 text-white rounded-xl p-2.5 font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-white/60 font-bold block mb-1">Budget Precision %</label>
              <input
                type="number"
                value={scData.budgetPerformancePct}
                onChange={(e) => setScData({ ...scData, budgetPerformancePct: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-white/20 text-white rounded-xl p-2.5 font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-white/60 font-bold block mb-1">Volunteer Rating (out of 5)</label>
              <input
                type="number"
                step="0.1"
                value={scData.volunteerSatisfactionRating}
                onChange={(e) => setScData({ ...scData, volunteerSatisfactionRating: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-white/20 text-white rounded-xl p-2.5 font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-white/60 font-bold block mb-1">Community Rating (out of 5)</label>
              <input
                type="number"
                step="0.1"
                value={scData.communitySatisfactionRating}
                onChange={(e) => setScData({ ...scData, communitySatisfactionRating: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-white/20 text-white rounded-xl p-2.5 font-bold outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => updateScorecard(scData)}
            className="px-6 py-3 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
          >
            Save Scorecard KPIs
          </button>
        </div>
      )}

      {/* TAB 6: FOUNDATION HEALTH */}
      {activeTab === 'health' && (
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Foundation Health Index</h3>
            <button
              onClick={() => setHData({ ...hData, publicVisibility: !hData.publicVisibility })}
              className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                hData.publicVisibility
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/10 text-white/50 border-white/10'
              }`}
            >
              {hData.publicVisibility ? 'Publicly Visible' : 'Internal Management Only'}
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { key: 'overallHealthScore', label: 'Overall Foundation Health Score' },
              { key: 'financialHealthScore', label: 'Financial Health Score' },
              { key: 'volunteerCapacityScore', label: 'Volunteer Capacity Score' },
              { key: 'projectCompletionScore', label: 'Project Completion Score' },
              { key: 'fundingPipelineScore', label: 'Funding Pipeline Score' },
              { key: 'sponsorEngagementScore', label: 'Sponsor Engagement Score' },
              { key: 'communityParticipationScore', label: 'Community Participation Score' },
            ].map((field) => (
              <div key={field.key} className="flex items-center justify-between gap-4">
                <span className="text-white/70 font-bold">{field.label}</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={(hData as any)[field.key]}
                  onChange={(e) => setHData({ ...hData, [field.key]: Number(e.target.value) })}
                  className="w-24 bg-slate-900 border border-white/20 text-white rounded-xl p-2 font-mono text-center outline-none"
                />
              </div>
            ))}

            <button
              onClick={() => updateHealthData(hData)}
              className="px-6 py-3 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg mt-4"
            >
              Save Health Score Index
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: REAL-TIME ANALYTICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Homepage & Engagement Analytics</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <span className="text-white/50 block">Homepage Views</span>
              <span className="text-2xl font-black text-white">{analytics.homepageViews.toLocaleString()}</span>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <span className="text-white/50 block">Donation Conversion</span>
              <span className="text-2xl font-black text-[#F27D26]">{analytics.donationConversionRate}%</span>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <span className="text-white/50 block">Volunteer Conversion</span>
              <span className="text-2xl font-black text-emerald-400">{analytics.volunteerConversionRate}%</span>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <span className="text-white/50 block">Returning Visitors</span>
              <span className="text-2xl font-black text-sky-400">{analytics.returningVisitorsPct}%</span>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
            <span className="font-bold text-white text-xs block">Most Viewed Missions</span>
            <div className="space-y-2 text-xs">
              {analytics.mostViewedProjects.map((p) => (
                <div key={p.projectId} className="flex items-center justify-between text-white/80 border-b border-white/5 pb-1.5">
                  <span>{p.title}</span>
                  <span className="font-mono text-[#F27D26] font-bold">{p.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
