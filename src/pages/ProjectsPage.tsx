import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext.tsx';
import { Project, ProjectStatus } from '../types.js';
import { MapComponent } from '../components/MapComponent.tsx';
import { Search, Filter, Grid, MapPin, SlidersHorizontal, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface ProjectsPageProps {
  onSelectProject: (p: Project) => void;
  openDonateModal: (projectId?: string) => void;
  setCurrentTab: (tab: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject, openDonateModal, setCurrentTab }) => {
  const { projects, projectCategories } = useAppData();
  const { role } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'funding' | 'newest' | 'target'>('funding');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const categories = ['All', ...(projectCategories && projectCategories.length > 0 ? projectCategories : ['Water & Sanitation', 'Education', 'Healthcare', 'Environment', 'Community Care'])];
  const statuses = ['All', 'Active', 'Fundraising', 'Planning', 'Completed'];

  let filtered = projects.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSummary = p.summary.toLowerCase().includes(q);
      const matchLocation = p.location.city.toLowerCase().includes(q) || p.location.region.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchLocation) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'funding') {
      const pA = a.raisedAmount / a.targetAmount;
      const pB = b.raisedAmount / b.targetAmount;
      return pB - pA;
    }
    if (sortBy === 'target') return b.targetAmount - a.targetAmount;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Community Field Projects</h1>
          <p className="text-sm text-white/60 mt-1">
            Browse verified community initiatives, inspect budgets, and support tangible goals.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className="px-4 py-2.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
          )}

          <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#F27D26] text-black shadow-xs' : 'text-white/50 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === 'map' ? 'bg-[#F27D26] text-black shadow-xs' : 'text-white/50 hover:text-white'}`}
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white/[0.03] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Filter by title, city, region or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#F27D26]"
            />
          </div>

          {/* Category */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0a0a0a] text-white">
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-[#0a0a0a] text-white">
                  Status: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none"
            >
              <option value="funding" className="bg-[#0a0a0a] text-white">Highest Funded %</option>
              <option value="target" className="bg-[#0a0a0a] text-white">Largest Goal</option>
              <option value="newest" className="bg-[#0a0a0a] text-white">Newest First</option>
            </select>
          </div>

        </div>
      </div>

      {/* View Content */}
      {viewMode === 'map' ? (
        <MapComponent projects={filtered} onSelectProject={onSelectProject} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => {
            const percent = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));
            return (
              <div
                key={project.id}
                className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-[#F27D26]/40 transition-all flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#050505]/80 backdrop-blur-md text-[#F27D26] text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    <span>{project.category}</span>
                    <span className="text-white/30">&bull;</span>
                    <span className="text-emerald-400 font-extrabold">{project.feasibilityAssessment?.overallScore || 88}% Score</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-[#F27D26] text-black text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                    {project.status}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-white/50 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#F27D26]" />
                      <span>{project.location.city}, {project.location.region}</span>
                    </div>

                    <h3
                      onClick={() => onSelectProject(project)}
                      className="font-bold text-base text-white hover:text-[#F27D26] cursor-pointer transition-colors line-clamp-1"
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs text-white/60 mt-1.5 line-clamp-2 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-white/80">${project.raisedAmount.toLocaleString()} raised</span>
                      <span className="text-[#F27D26] font-bold">{percent}% of ${project.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#F27D26] rounded-full transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors border border-white/10 cursor-pointer"
                    >
                      Details & Budget
                    </button>
                    <button
                      onClick={() => openDonateModal(project.id)}
                      className="px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase cursor-pointer transition-all"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-white/[0.02] rounded-3xl border border-white/10">
          <p className="text-sm text-white/50 font-medium">No projects match your current filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="px-4 py-2 rounded-full bg-[#F27D26] text-black text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
