import React, { useState, useEffect } from 'react';
import { useAppData } from '../../context/AppDataContext.tsx';
import { Project, ImpactMetricConfig, ImpactTimelineEvent, LiveActivityItem } from '../../types.js';
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Eye,
  Filter,
  Flame,
  Globe,
  Heart,
  HelpCircle,
  Layers,
  MapPin,
  Megaphone,
  MessageSquare,
  Package,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';

interface ImpactHubMainProps {
  setCurrentTab: (tab: string) => void;
  onSelectProject: (p: Project) => void;
  openDonateModal: (projectId?: string) => void;
}

export const ImpactHubMain: React.FC<ImpactHubMainProps> = ({
  setCurrentTab,
  onSelectProject,
  openDonateModal,
}) => {
  const { impactHubData, projects, beneficiaries, gallery, refreshImpactHub } = useAppData();

  const [metricCategory, setMetricCategory] = useState<string>('all');
  const [mapCommunity, setMapCommunity] = useState<string>('all');
  const [mapStatus, setMapStatus] = useState<string>('all');
  const [mapType, setMapType] = useState<string>('all');
  const [timelineFilter, setTimelineFilter] = useState<string>('all');
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);
  const [shareModalProject, setShareModalProject] = useState<Project | null>(null);
  const [beforeAfterPos, setBeforeAfterPos] = useState<number>(50);

  const config = impactHubData?.config;
  const metrics = impactHubData?.calculatedMetrics || [];
  const timelineEvents = impactHubData?.timelineEvents || [];
  const liveActivity = impactHubData?.liveActivity || [];
  const scorecard = impactHubData?.scorecard;
  const healthData = impactHubData?.healthData;

  // Identify Featured Project (Manual Admin Override or Top Priority Active Project)
  const featuredProject =
    projects.find((p) => p.id === config?.featuredProjectId) ||
    projects.find((p) => p.featured) ||
    projects.find((p) => p.status === 'Active' || p.status === 'Fundraising') ||
    projects[0];

  // Filtered metrics
  const visibleMetrics = metrics
    .filter((m) => m.enabled)
    .filter((m) => metricCategory === 'all' || m.category === metricCategory)
    .sort((a, b) => a.order - b.order);

  // Map Filtered Projects
  const filteredMapProjects = projects.filter((p) => {
    if (mapCommunity !== 'all' && p.location) {
      const matchCommunity = p.location.city.toLowerCase() === mapCommunity.toLowerCase() || p.location.region.toLowerCase() === mapCommunity.toLowerCase();
      if (!matchCommunity) return false;
    }
    if (mapStatus !== 'all' && p.status.toLowerCase() !== mapStatus.toLowerCase()) return false;
    if (mapType !== 'all') {
      const typeLower = mapType.toLowerCase();
      const catLower = p.category?.toLowerCase() || '';
      const tagsString = p.tags?.join(' ').toLowerCase() || '';
      const matchesCategory = catLower.includes(typeLower) || tagsString.includes(typeLower) || p.title?.toLowerCase().includes(typeLower);
      if (!matchesCategory) return false;
    }
    return true;
  });

  // Timeline Filtered Events
  const filteredTimeline = timelineEvents.filter((e) => {
    if (timelineFilter === 'all') return true;
    return e.type === timelineFilter;
  });

  // Success Stories (Beneficiaries + Gallery Before/After)
  const stories = beneficiaries?.length || 0 > 0 ? beneficiaries : [];

  return (
    <div className="space-y-12 w-full">
      {/* 1. PINNED ANNOUNCEMENT BANNER */}
      {config?.pinnedAnnouncement?.active && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#F27D26]/20 via-white/[0.04] to-blue-500/10 border border-[#F27D26]/30 p-5 sm:p-6 backdrop-blur-md shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#F27D26]/20 text-[#F27D26] shrink-0 border border-[#F27D26]/30">
                <Megaphone className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#F27D26] text-black">
                    Pinned Announcement
                  </span>
                  <span className="text-xs text-white/50">{config.pinnedAnnouncement.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{config.pinnedAnnouncement.title}</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{config.pinnedAnnouncement.message}</p>
              </div>
            </div>

            {config.pinnedAnnouncement.link && (
              <a
                href={config.pinnedAnnouncement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all shrink-0 cursor-pointer"
              >
                Learn More
              </a>
            )}
          </div>
        </div>
      )}

      {/* 2. LIVE IMPACT METRICS GRID */}
      {config?.publicStatsEnabled !== false && (
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                  LIVE REAL-TIME AUDITED DATA
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Foundation Impact Metrics
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/10">
              {[
                { id: 'all', label: 'All Indicators' },
                { id: 'community', label: 'Community' },
                { id: 'projects', label: 'Projects' },
                { id: 'volunteers', label: 'Volunteers' },
                { id: 'financial', label: 'Financial' },
                { id: 'social_environmental', label: 'Social & Eco' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMetricCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    metricCategory === cat.id
                      ? 'bg-[#F27D26] text-black shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animated Counter Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
            {visibleMetrics.map((m) => {
              const displayVal = m.computedValue ?? m.value;
              return (
                <div
                  key={m.id}
                  className="bg-white/[0.03] border border-white/10 hover:border-[#F27D26]/40 rounded-2xl p-4 flex flex-col justify-between transition-all hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center justify-between text-white/40 group-hover:text-[#F27D26] transition-colors">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                      {m.category.replace('_', ' ')}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="my-2">
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-0.5">
                      {m.prefix && <span className="text-lg text-[#F27D26] font-extrabold">{m.prefix}</span>}
                      <span>{displayVal.toLocaleString()}</span>
                      {m.suffix && <span className="text-xs text-white/50 font-bold ml-0.5">{m.suffix}</span>}
                    </div>
                  </div>

                  <span className="text-xs text-white/70 font-semibold line-clamp-1">{m.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. FEATURED PROJECT SPOTLIGHT */}
      {featuredProject && (
        <section className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Flame className="w-64 h-64 text-[#F27D26]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image Box */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 aspect-video lg:aspect-square">
              <img
                src={featuredProject.imageUrl}
                alt={featuredProject.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#F27D26] text-black text-[10px] font-black uppercase tracking-wider">
                  SPOTLIGHT FEATURED MISSION
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                  {featuredProject.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                  <MapPin className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>{featuredProject.location ? `${featuredProject.location.city}, ${featuredProject.location.region}` : ''}</span>
                </div>
              </div>
            </div>

            {/* Project Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {featuredProject.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                  {featuredProject.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white/60">Funding Goal Progress</span>
                  <span className="text-[#F27D26]">
                    EC${featuredProject.raisedAmount.toLocaleString()} / EC${featuredProject.targetAmount.toLocaleString()}{' '}
                    ({Math.min(100, Math.round((featuredProject.raisedAmount / featuredProject.targetAmount) * 100))}%)
                  </span>
                </div>

                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#F27D26] to-amber-400 h-full rounded-full transition-all duration-1000 shadow-lg shadow-[#F27D26]/30"
                    style={{
                      width: `${Math.min(100, (featuredProject.raisedAmount / featuredProject.targetAmount) * 100)}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center border-t border-white/5">
                  <div>
                    <span className="text-xs text-white/50 block">Beneficiaries</span>
                    <span className="text-sm font-extrabold text-white">{featuredProject.beneficiaryCount || '1,200'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block">Volunteer Needs</span>
                    <span className="text-sm font-extrabold text-[#F27D26]">{featuredProject.volunteerRoles?.length || 4} Open Roles</span>
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block">Status</span>
                    <span className="text-sm font-extrabold text-emerald-400">{featuredProject.status}</span>
                  </div>
                </div>
              </div>

              {/* Recent Update snippet */}
              {featuredProject.updates && featuredProject.updates?.length || 0 > 0 && (
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/80 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#F27D26]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Latest Field Update ({featuredProject.updates[0].date})</span>
                  </div>
                  <p className="line-clamp-2 italic">"{featuredProject.updates[0].title}: {featuredProject.updates[0].content}"</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openDonateModal(featuredProject.id)}
                  className="px-6 py-3 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-[#F27D26]/20 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-black text-black" />
                  <span>Donate to Mission</span>
                </button>

                <button
                  onClick={() => onSelectProject(featuredProject)}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>View Full Details</span>
                </button>

                <button
                  onClick={() => setShareModalProject(featuredProject)}
                  className="px-4 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. INTERACTIVE IMPACT MAP */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-[#F27D26]">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest">REGIONAL FIELD COVERAGE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Interactive Impact Map
            </h2>
          </div>

          {/* Map Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={mapCommunity}
              onChange={(e) => setMapCommunity(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-xs rounded-xl px-3 py-2 outline-none font-bold cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Districts / Communities</option>
              <option value="Castries" className="bg-slate-900 text-white">Castries</option>
              <option value="Gros Islet" className="bg-slate-900 text-white">Gros Islet</option>
              <option value="Soufrière" className="bg-slate-900 text-white">Soufrière</option>
              <option value="Vieux Fort" className="bg-slate-900 text-white">Vieux Fort</option>
              <option value="Dennery" className="bg-slate-900 text-white">Dennery</option>
            </select>

            <select
              value={mapStatus}
              onChange={(e) => setMapStatus(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-xs rounded-xl px-3 py-2 outline-none font-bold cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Project Statuses</option>
              <option value="Active" className="bg-slate-900 text-white">Active</option>
              <option value="Completed" className="bg-slate-900 text-white">Completed</option>
              <option value="Planning" className="bg-slate-900 text-white">Planning</option>
            </select>

            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-xs rounded-xl px-3 py-2 outline-none font-bold cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Impact Categories</option>
              <option value="infrastructure" className="bg-slate-900 text-white">Infrastructure</option>
              <option value="education" className="bg-slate-900 text-white">Education</option>
              <option value="youth" className="bg-slate-900 text-white">Youth & Sports</option>
              <option value="environmental" className="bg-slate-900 text-white">Environmental</option>
            </select>
          </div>
        </div>

        {/* Map Stage Box */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-white/10 rounded-3xl p-6 relative min-h-[380px] flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Subtle grid background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#F27D26_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* District Pins Grid Canvas Simulation */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMapProjects.map((p) => {
              const isCompleted = p.status === 'Completed';
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#F27D26] rounded-2xl p-4 transition-all cursor-pointer group space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#F27D26]/20 text-[#F27D26]'}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-white/50 block">
                          {p.location ? `${p.location.city}, ${p.location.region}` : ''}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-[#F27D26] transition-colors line-clamp-1">
                          {p.title}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-[#F27D26]/10 text-[#F27D26] border-[#F27D26]/30'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-white/60 line-clamp-2">{p.description}</p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-white/50">Budget: EC${p.targetAmount.toLocaleString()}</span>
                    <span className="text-[#F27D26] group-hover:translate-x-1 transition-transform">View Project &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Active Mission</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Community Proposal</span>
            </div>
            <span>Showing {filteredMapProjects.length} Verified Field Locations</span>
          </div>
        </div>
      </section>

      {/* 5. IMPACT TIMELINE & RECENT ACTIVITY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Timeline (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-[#F27D26]">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest">CHRONOLOGICAL RECORD</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight mt-1">Foundation Impact Timeline</h3>
            </div>

            <select
              value={timelineFilter}
              onChange={(e) => setTimelineFilter(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-xs rounded-xl px-3 py-1.5 font-bold outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Milestones</option>
              <option value="project_completed" className="bg-slate-900 text-white">Commissions</option>
              <option value="funding_goal" className="bg-slate-900 text-white">Funding Goals</option>
              <option value="volunteer_event" className="bg-slate-900 text-white">Volunteer Drives</option>
              <option value="award" className="bg-slate-900 text-white">Awards & Recognition</option>
            </select>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {filteredTimeline.map((item) => (
              <div key={item.id} className="relative group">
                <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-[#F27D26] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F27D26]" />
                </div>

                <div className="bg-white/[0.03] border border-white/10 hover:border-[#F27D26]/30 rounded-2xl p-4 transition-all space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F27D26]/10 text-[#F27D26] font-extrabold uppercase text-[10px]">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-white/40 font-mono">{item.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-white/70 leading-relaxed">{item.description}</p>

                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-xl border border-white/10 mt-2"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Community Activity Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Activity className="w-4 h-4 animate-spin" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest">REAL-TIME STREAM</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight mt-1">Recent Community Activity</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase border border-emerald-500/30">
              Live Feed
            </span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {liveActivity.map((act) => (
              <div
                key={act.id}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 flex items-start gap-3 hover:bg-white/[0.06] transition-all"
              >
                <div className="p-2 rounded-xl bg-[#F27D26]/20 text-[#F27D26] shrink-0 mt-0.5">
                  <Heart className="w-3.5 h-3.5" />
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-white">
                      {act.isAnonymous ? 'Anonymous Donor' : act.actorName}
                    </span>
                    <span className="text-white/40 font-mono text-[10px]">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-white/70">{act.actionText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. FOUNDATION SCORECARD & HEALTH INDICATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Scorecard (6 cols) */}
        {scorecard && (
          <div className="lg:col-span-6 bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#F27D26]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">PERFORMANCE AUDIT</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mt-1">Foundation Scorecard</h3>
              </div>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                A+ Governance
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="text-xs text-white/50 block">Projects On Time</span>
                <span className="text-2xl font-black text-white">{scorecard.projectsOnTimePct}%</span>
                <span className="text-[10px] text-emerald-400 font-bold block">+2.4% vs prev quarter</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="text-xs text-white/50 block">Budget Performance</span>
                <span className="text-2xl font-black text-white">{scorecard.budgetPerformancePct}%</span>
                <span className="text-[10px] text-emerald-400 font-bold block">Zero overrun audit</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="text-xs text-white/50 block">Volunteer Rating</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black text-white">{scorecard.volunteerSatisfactionRating}</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-[10px] text-white/50 block">1,800+ surveyed</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="text-xs text-white/50 block">Community Satisfaction</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black text-white">{scorecard.communitySatisfactionRating}</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-[10px] text-white/50 block">Direct beneficiary feedback</span>
              </div>
            </div>
          </div>
        )}

        {/* Foundation Health Indicator (6 cols) */}
        {healthData && (healthData.publicVisibility || config?.healthScorePublic) && (
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900/90 to-black/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">FOUNDATION HEALTH METRICS</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mt-1">Health Score Index</h3>
              </div>

              <div className="text-right">
                <span className="text-3xl font-black text-emerald-400">{healthData.overallHealthScore}</span>
                <span className="text-[10px] text-white/50 block uppercase tracking-wider font-bold">/ 100 Overall</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Financial Health', score: healthData.financialHealthScore },
                { label: 'Volunteer Capacity', score: healthData.volunteerCapacityScore },
                { label: 'Project Completion Rate', score: healthData.projectCompletionScore },
                { label: 'Funding Pipeline', score: healthData.fundingPipelineScore },
                { label: 'Sponsor Engagement', score: healthData.sponsorEngagementScore },
                { label: 'Community Participation', score: healthData.communityParticipationScore },
              ].map((h) => (
                <div key={h.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white/70">{h.label}</span>
                    <span className="text-white">{h.score}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${h.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 7. SUCCESS STORIES CAROUSEL */}
      {stories.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-[#F27D26]">
                <Award className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest">BENEFICIARY TESTIMONIALS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Field Success Stories
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStoryIdx((prev) => (prev > 0 ? prev - 1 : stories.length - 1))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
              >
                &larr;
              </button>
              <span className="text-xs text-white/50 font-mono">
                {activeStoryIdx + 1} / {stories.length}
              </span>
              <button
                onClick={() => setActiveStoryIdx((prev) => (prev < stories.length - 1 ? prev + 1 : 0))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
              >
                &rarr;
              </button>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 rounded-2xl overflow-hidden border border-white/10 aspect-square">
              <img
                src={stories[activeStoryIdx].photoUrl}
                alt={stories[activeStoryIdx].beneficiaryName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#F27D26]/20 text-[#F27D26] text-[10px] font-extrabold uppercase border border-[#F27D26]/30">
                {stories[activeStoryIdx].projectName}
              </span>

              <blockquote className="text-xl sm:text-2xl font-bold text-white leading-snug italic">
                "{stories[activeStoryIdx].quote}"
              </blockquote>

              <p className="text-sm text-white/70 leading-relaxed">{stories[activeStoryIdx].fullStory}</p>

              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                <div>
                  <span className="font-extrabold text-white block">{stories[activeStoryIdx].beneficiaryName}</span>
                  <span className="text-white/50">{stories[activeStoryIdx].location}</span>
                </div>

                <button
                  onClick={() => openDonateModal()}
                  className="px-5 py-2.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Support Similar Missions
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SHARE MODAL */}
      {shareModalProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Share Project Mission</h3>
              <button
                onClick={() => setShareModalProject(null)}
                className="text-white/50 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70">
              Help spread the word for <strong className="text-white">{shareModalProject.title}</strong> across social networks or direct link!
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#F27D26]" />
                <span>Copy Link</span>
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=Support%20${encodeURIComponent(shareModalProject.title)}%20via%20Vision79%20Foundation`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-sky-500/30"
              >
                <span>Share on X</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
