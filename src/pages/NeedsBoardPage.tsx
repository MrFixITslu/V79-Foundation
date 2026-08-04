import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext.tsx';
import { NeedItem } from '../types.js';
import { FileText, CheckCircle2, Clock, AlertTriangle, Search, Filter, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NeedsBoardPageProps {
  openDonateModal: (projectId?: string) => void;
}

export const NeedsBoardPage: React.FC<NeedsBoardPageProps> = ({ openDonateModal }) => {
  const { needs, pledgeNeed } = useAppData();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [pledgeQty, setPledgeQty] = useState<{ [needId: string]: number }>({});

  const categories = ['All', 'Equipment', 'Materials', 'Electronics', 'Supplies', 'Medical Devices', 'Medical Supplies'];
  const urgencies = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filtered = needs.filter((n) => {
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
    if (selectedUrgency !== 'All' && n.urgency !== selectedUrgency) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchProject = (n.projectName || '').toLowerCase().includes(q);
      if (!matchTitle && !matchProject) return false;
    }
    return true;
  });

  const handlePledge = async (need: NeedItem) => {
    const qty = pledgeQty[need.id] || 1;
    await pledgeNeed(need.id, qty, user?.name, user?.email);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#050505] text-white border border-white/10 shadow-2xl space-y-4">
        <span className="text-xs font-bold text-[#F27D26] uppercase tracking-widest">
          Granular Itemized Resource Requests
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">The Project Needs Board</h1>
        <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
          Every field project breaks down its material requirements into tangible items—from solar pumps and laptops to medical diagnostic kits. Track needed, pledged, and received status live.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search requested items or project names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#F27D26]"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#F27D26]"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#050505] text-white">Category: {c}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#F27D26]"
          >
            {urgencies.map((u) => (
              <option key={u} value={u} className="bg-[#050505] text-white">Urgency: {u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((need) => {
          const pPercent = Math.round((need.quantityPledged / need.quantityNeeded) * 100);
          const rPercent = Math.round((need.quantityReceived / need.quantityNeeded) * 100);

          return (
            <div
              key={need.id}
              className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-[#F27D26]/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20">
                    {need.category}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      need.urgency === 'Critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : need.urgency === 'High'
                        ? 'bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/30'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {need.urgency} Urgency
                  </span>
                </div>

                <h3 className="font-black text-lg text-white leading-snug">{need.title}</h3>
                <p className="text-xs text-white/50 font-medium">Project: {need.projectName || 'Vision79 General'}</p>

                {/* Needed -> Pledged -> Received Pipeline Bar */}
                <div className="space-y-2 pt-2 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span>Needed: {need.quantityNeeded} {need.unit}</span>
                    <span className="text-[#F27D26]">${need.estimatedCostPerUnit} / unit</span>
                  </div>

                  {/* Dual Bar: Pledged vs Received */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-white/50 font-semibold">
                      <span>Pledged: {need.quantityPledged} ({pPercent}%)</span>
                      <span className="text-[#F27D26] font-bold">Received: {need.quantityReceived} ({rPercent}%)</span>
                    </div>
                    <div className="relative w-full h-3 rounded-full bg-white/10 overflow-hidden">
                      {/* Pledged bar */}
                      <div className="absolute inset-y-0 left-0 bg-[#F27D26]/40 rounded-full" style={{ width: `${pPercent}%` }} />
                      {/* Received bar */}
                      <div className="absolute inset-y-0 left-0 bg-[#F27D26] rounded-full" style={{ width: `${rPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, need.quantityNeeded - need.quantityPledged)}
                  value={pledgeQty[need.id] || 1}
                  onChange={(e) => setPledgeQty({ ...pledgeQty, [need.id]: Number(e.target.value) })}
                  className="w-20 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-center text-white"
                />
                <button
                  onClick={() => handlePledge(need)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs transition-all cursor-pointer"
                >
                  Pledge Selected Quantity
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
