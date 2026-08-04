import React from 'react';
import { useAppData } from '../context/AppDataContext.tsx';
import { Project } from '../types.js';
import { HeroSection } from '../components/HeroSection.tsx';
import { ImpactHubMain } from '../components/impact/ImpactHubMain.tsx';
import {
  Heart,
  Droplets,
  Laptop,
  Stethoscope,
  Users,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
  onSelectProject: (p: Project) => void;
  openDonateModal: (projectId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentTab, onSelectProject, openDonateModal }) => {
  const { projects, needs, beneficiaries, sponsors, transparency, heroConfig } = useAppData();

  const featured = projects.filter((p) => p.featured || p.status === 'Active').slice(0, 3);
  const urgentNeeds = needs.filter((n) => n.urgency === 'High' || n.urgency === 'Critical').slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* FULL-SCREEN HERO SECTION */}
      <section className="w-full">
        <HeroSection
          heroConfig={heroConfig}
          setCurrentTab={setCurrentTab}
          openDonateModal={openDonateModal}
        />
      </section>

      <div id="next-landing-section" className="pt-2" />

      {/* FEATURE 15 — FOUNDATION IMPACT HUB & LIVE COMMUNITY DASHBOARD */}
      <section className="w-full">
        <ImpactHubMain
          setCurrentTab={setCurrentTab}
          onSelectProject={onSelectProject}
          openDonateModal={openDonateModal}
        />
      </section>

      {/* FEATURED PROJECTS (Ongoing Missions) */}

      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F27D26]">ONGOING MISSIONS</span>
            <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-ping" />
          </div>
          <button
            onClick={() => setCurrentTab('projects')}
            className="text-xs font-bold text-white/50 hover:text-[#F27D26] flex items-center gap-1 uppercase tracking-wider transition-colors"
          >
            <span>VIEW ALL ({projects.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((project) => {
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
                  <div className="absolute top-4 left-4 bg-[#050505]/80 backdrop-blur-md text-[#F27D26] text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
                    {project.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-[#F27D26] text-black text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                    {project.status}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
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

                  {/* Funding Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-white/80">${project.raisedAmount.toLocaleString()} / ${project.targetAmount.toLocaleString()}</span>
                      <span className="text-[#F27D26] font-bold">{percent}%</span>
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
                      Details
                    </button>
                    <button
                      onClick={() => openDonateModal(project.id)}
                      className="px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase cursor-pointer transition-all"
                    >
                      Pledge
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LIVE NEEDS BOARD SECTION */}
      <section className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">LIVE NEEDS BOARD</span>
              <span className="px-2 py-0.5 rounded bg-[#F27D26]/10 text-[#F27D26] font-bold text-[10px]">REAL-TIME</span>
            </div>
            <p className="text-xs text-white/50 mt-1">Itemized field supply requests tracked directly from vendor purchase to delivery.</p>
          </div>
          <button
            onClick={() => setCurrentTab('needs')}
            className="px-5 py-2.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer"
          >
            Explore Needs Board
          </button>
        </div>

        <div className="space-y-3">
          {urgentNeeds.map((need) => {
            const pPercent = Math.round((need.quantityPledged / need.quantityNeeded) * 100);
            return (
              <div key={need.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="md:col-span-5 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#F27D26]" />
                  <div>
                    <div className="text-xs font-bold text-white">{need.title}</div>
                    <div className="text-[10px] text-white/40">{need.category} &bull; Est ${need.estimatedCostPerUnit}/unit</div>
                  </div>
                </div>

                <div className="md:col-span-4 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#F27D26] rounded-full" style={{ width: `${pPercent}%` }} />
                  </div>
                  <span className="text-xs font-bold text-[#F27D26] w-12 text-right">{need.quantityPledged}/{need.quantityNeeded}</span>
                </div>

                <div className="md:col-span-3 text-right">
                  <button
                    onClick={() => setCurrentTab('needs')}
                    className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-[#F27D26] hover:text-black text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                  >
                    Pledge Item
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* BENEFICIARY STORIES & SPONSORS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stories */}
        <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="text-xs font-bold uppercase tracking-widest text-[#F27D26]">FIELD IMPACT VERIFICATION</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beneficiaries.map((story) => (
              <div
                key={story.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 flex flex-col justify-between"
              >
                <blockquote className="text-xs text-white/80 italic leading-relaxed">
                  "{story.quote}"
                </blockquote>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <img
                    src={story.photoUrl}
                    alt={story.beneficiaryName}
                    className="w-10 h-10 rounded-full object-cover border border-[#F27D26]/40"
                  />
                  <div>
                    <div className="font-bold text-xs text-white">{story.beneficiaryName}</div>
                    <div className="text-[10px] text-[#F27D26]">{story.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Transparency Summary */}
        <div className="lg:col-span-4 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">FINANCIAL EFFICIENCY</div>
            <div className="relative w-28 h-28 mx-auto my-4 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-8 border-[#F27D26] border-t-white/20 animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-white">92%</div>
            </div>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex justify-between"><span>Direct Aid</span><span className="font-bold text-white">92%</span></div>
              <div className="flex justify-between"><span>Operations</span><span className="font-bold text-white">4%</span></div>
              <div className="flex justify-between"><span>Growth</span><span className="font-bold text-white">4%</span></div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[10px] text-center text-white/40 font-mono">
            AUDIT LEDGER: V79-2026-CONFIRMED
          </div>
        </div>

      </section>

    </div>
  );
};
