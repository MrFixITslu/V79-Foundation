import React, { useState } from 'react';
import { Project } from '../types.js';
import { useAppData } from '../context/AppDataContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { CommunityConfidenceMeter } from '../components/CommunityConfidenceMeter.tsx';
import { ProposalTrustSummary } from '../components/reputation/ProposalTrustSummary.tsx';
import { ProjectFeedbackSection } from '../components/reputation/ProjectFeedbackSection.tsx';
import {
  Heart,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  MessageSquare,
  ThumbsUp,
  Share2,
  Send,
  Plus,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  openDonateModal: (projectId?: string) => void;
  setCurrentTab: (tab: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onBack, openDonateModal, setCurrentTab }) => {
  const { pledgeNeed, applyVolunteer, addComment, likeUpdate, addExpense, addUpdate } = useAppData();
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'needs' | 'finances' | 'timeline' | 'volunteers'>('overview');
  const [commentText, setCommentText] = useState<{ [updateId: string]: string }>({});
  const [pledgeQty, setPledgeQty] = useState<{ [needId: string]: number }>({});

  // Form modals state
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);

  // New expense form state
  const [expenseForm, setExpenseForm] = useState({ category: 'Operations', description: '', approvedBudget: '1000', actualSpent: '950', vendor: '' });
  // New update form state
  const [updateForm, setUpdateForm] = useState({ title: '', content: '', mediaUrl: '' });

  const percent = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));

  const handlePledgeItem = async (needId: string) => {
    const qty = pledgeQty[needId] || 1;
    await pledgeNeed(needId, qty, user?.name, user?.email);
  };

  const handlePostComment = async (updateId: string) => {
    const text = commentText[updateId];
    if (!text || !text.trim()) return;
    await addComment(updateId, text, user?.name || 'Supporter', role);
    setCommentText((prev) => ({ ...prev, [updateId]: '' }));
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    await addExpense(project.id, expenseForm);
    setShowAddExpenseModal(false);
    setExpenseForm({ category: 'Operations', description: '', approvedBudget: '1000', actualSpent: '950', vendor: '' });
  };

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addUpdate(project.id, {
      title: updateForm.title,
      content: updateForm.content,
      mediaUrls: updateForm.mediaUrl ? [updateForm.mediaUrl] : [],
      authorName: user?.name || 'Project Coordinator',
      authorRole: role === 'admin' ? 'Project Director' : 'Field Lead',
    });
    setShowAddUpdateModal(false);
    setUpdateForm({ title: '', content: '', mediaUrl: '' });
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top back button & breadcrumb */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-[#F27D26] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects List</span>
      </button>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#050505] border border-white/10 shadow-2xl text-white">
        <div className="relative h-72 sm:h-96">
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <span className="bg-[#F27D26] text-black font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
              {project.status}
            </span>
            <span className="bg-[#050505]/80 backdrop-blur-md text-[#F27D26] font-bold text-xs px-3.5 py-1 rounded-full border border-white/10">
              {project.category}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26]">
              <MapPin className="w-4 h-4" />
              <span>{project.location.city}, {project.location.region}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">{project.title}</h1>
          </div>
        </div>

        {/* Funding Bar Header Card */}
        <div className="p-6 sm:p-8 bg-[#0a0a0a] border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex justify-between items-baseline text-sm font-bold">
              <div>
                <span className="text-2xl font-black text-white">${project.raisedAmount.toLocaleString()}</span>
                <span className="text-white/50 font-medium text-xs ml-1">raised of ${project.targetAmount.toLocaleString()} target</span>
              </div>
              <span className="text-[#F27D26] font-black">{percent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[#F27D26] rounded-full" style={{ width: `${percent}%` }} />
            </div>
          </div>

          <div className="md:col-span-4 flex gap-3">
            <button
              onClick={() => openDonateModal(project.id)}
              className="flex-1 py-3.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#F27D26]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-black text-black" />
              <span>Donate Now</span>
            </button>
            <button
              onClick={() => alert(`Project link copied to clipboard!`)}
              className="p-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-colors cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto border-b border-white/10 gap-2 pb-1">
        {[
          { id: 'overview', label: 'Overview & Story' },
          { id: 'needs', label: `Needs Board (${project.needs?.length || 0})` },
          { id: 'finances', label: `Expense Transparency (${project.expenses?.length || 0})` },
          { id: 'timeline', label: `Timeline & Updates (${project.updates?.length || 0})` },
          { id: 'volunteers', label: 'Volunteer Portal' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#F27D26] text-black shadow-sm'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/[0.03] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white">Project Story & Purpose</h2>
              <div className="text-sm text-white/70 leading-relaxed whitespace-pre-line space-y-3">
                {project.description}
              </div>
            </div>

            {/* Milestones Progress */}
            <div className="bg-white/[0.03] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-white">Milestone Progress</h2>
              <div className="space-y-4">
                {project.milestones?.map((m, idx) => (
                  <div key={m.id} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          m.status === 'Completed'
                            ? 'bg-[#F27D26] text-black'
                            : m.status === 'In Progress'
                            ? 'bg-[#F27D26]/30 text-[#F27D26] border border-[#F27D26]'
                            : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {m.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      {idx < project.milestones?.length || 0 - 1 && <div className="w-0.5 h-10 bg-white/10 my-1" />}
                    </div>

                    <div className="flex-1 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-white">{m.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/80">
                          {m.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 mt-1">{m.description}</p>
                      <div className="text-[11px] text-white/40 mt-2">Target Date: {m.targetDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post-Project Community Satisfaction & Reviews */}
            <ProjectFeedbackSection projectId={project.id} projectTitle={project.title} isCompleted={project.status === 'Completed'} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Community Confidence & Feasibility Meter */}
            <CommunityConfidenceMeter project={project} />

            {/* Direct Impact Box */}
            <div className="bg-[#F27D26]/10 border border-[#F27D26]/30 p-6 rounded-3xl space-y-3">
              <div className="text-xs font-bold text-[#F27D26] uppercase tracking-widest">Impact Summary</div>
              <p className="text-sm font-semibold text-white/90">{project.impactSummary}</p>
              <div className="text-xs text-white/70">
                Direct Beneficiaries: <span className="font-extrabold text-[#F27D26]">{project.beneficiariesCount.toLocaleString()} people</span>
              </div>
            </div>

            {/* Proposer Trust Summary */}
            <ProposalTrustSummary proposerName={project.team[0]?.name || 'Neil .V'} />

            {/* Team Members */}
            <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-bold text-sm text-white">Field Leadership Team</h3>
              <div className="space-y-3">
                {project.team?.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    <div>
                      <div className="font-bold text-xs text-white">{t.name}</div>
                      <div className="text-[11px] text-[#F27D26]">{t.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            {project.documents && project.documents.length > 0 && (
              <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 space-y-3">
                <h3 className="font-bold text-sm text-white">Project Documents</h3>
                {project.documents?.map((d, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-[#F27D26] shrink-0" />
                      <span className="font-medium text-white/80 truncate">{d.name}</span>
                    </div>
                    <span className="text-[10px] text-white/40 shrink-0">{d.size}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB CONTENT: NEEDS BOARD */}
      {activeTab === 'needs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Project Equipment & Supplies Requested</h2>
              <p className="text-xs text-white/50">Pledge physical units or direct funding for individual item sets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.needs?.map((need) => {
              const pPercent = Math.round((need.quantityPledged / need.quantityNeeded) * 100);
              return (
                <div key={need.id} className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20">
                      {need.category}
                    </span>
                    <span className="text-xs font-bold text-rose-400">{need.urgency} Urgency</span>
                  </div>

                  <h3 className="font-extrabold text-base text-white">{need.title}</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-white/60">Pledged: {need.quantityPledged} / {need.quantityNeeded} {need.unit}</span>
                      <span className="text-[#F27D26]">{pPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#F27D26] rounded-full" style={{ width: `${pPercent}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs flex justify-between">
                    <span className="text-white/50">Est. Cost / Unit:</span>
                    <span className="font-bold text-white">${need.estimatedCostPerUnit}</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      max={need.quantityNeeded - need.quantityPledged}
                      value={pledgeQty[need.id] || 1}
                      onChange={(e) => setPledgeQty({ ...pledgeQty, [need.id]: Number(e.target.value) })}
                      className="w-20 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-center text-white"
                    />
                    <button
                      onClick={() => handlePledgeItem(need.id)}
                      className="flex-1 py-2 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs cursor-pointer"
                    >
                      Pledge Item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: FINANCES */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Expense & Vendor Budget Breakdown</h2>
              <p className="text-xs text-white/50">Approved budget vs actual field expenditures.</p>
            </div>
            {role === 'admin' && (
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-4 py-2 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log Approved Expense</span>
              </button>
            )}
          </div>

          <div className="bg-white/[0.03] rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-white/50 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Category</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Approved Budget</th>
                    <th className="p-4">Actual Spent</th>
                    <th className="p-4">Vendor</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {project.expenses?.map((e) => (
                    <tr key={e.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-bold text-white">{e.category}</td>
                      <td className="p-4 text-white/70">{e.description}</td>
                      <td className="p-4 font-semibold text-white/80">${e.approvedBudget.toLocaleString()}</td>
                      <td className="p-4 font-bold text-[#F27D26]">${e.actualSpent.toLocaleString()}</td>
                      <td className="p-4 text-white/50">{e.vendor || 'N/A'}</td>
                      <td className="p-4 text-white/40">{e.date}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-[#F27D26]/10 text-[#F27D26] text-[10px] font-bold">
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TIMELINE & UPDATES */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Field Update Timeline</h2>
            {(role === 'admin' || role === 'volunteer') && (
              <button
                onClick={() => setShowAddUpdateModal(true)}
                className="px-4 py-2 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post Timeline Update</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {project.updates?.map((upd) => (
              <div key={upd.id} className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={upd.authorAvatar} alt={upd.authorName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    <div>
                      <div className="font-bold text-sm text-white">{upd.authorName}</div>
                      <div className="text-[11px] text-[#F27D26] font-semibold">{upd.authorRole} &bull; {new Date(upd.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {upd.isPinned && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F27D26]/20 text-[#F27D26]">Pinned Update</span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-white">{upd.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{upd.content}</p>

                {upd.mediaUrls && upd.mediaUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {upd.mediaUrls?.map((m, idx) => (
                      <img key={idx} src={m} alt="Update media" className="w-full h-48 rounded-2xl object-cover border border-white/10" />
                    ))}
                  </div>
                )}

                {/* Interactions */}
                <div className="flex items-center gap-4 pt-3 border-t border-white/10 text-xs">
                  <button
                    onClick={() => likeUpdate(upd.id)}
                    className="flex items-center gap-1.5 text-white/60 hover:text-[#F27D26] font-bold cursor-pointer"
                  >
                    <ThumbsUp className="w-4 h-4 text-[#F27D26]" />
                    <span>{upd.likesCount} Likes</span>
                  </button>
                  <span className="text-white/20">&bull;</span>
                  <span className="text-white/50 font-medium">{upd.comments?.length || 0} Comments</span>
                </div>

                {/* Comment List */}
                <div className="space-y-2 pt-2">
                  {upd.comments?.map((c) => (
                    <div key={c.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                      <div className="flex justify-between font-bold text-white">
                        <span>{c.userName} ({c.userRole})</span>
                        <span className="text-[10px] text-white/40">{new Date(c.date).toLocaleDateString()}</span>
                      </div>
                      <div className="text-white/70 mt-1">{c.content}</div>
                    </div>
                  ))}

                  {/* Add comment input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText[upd.id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [upd.id]: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs"
                    />
                    <button
                      onClick={() => handlePostComment(upd.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#F27D26] text-black font-extrabold text-xs cursor-pointer"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: VOLUNTEERS */}
      {activeTab === 'volunteers' && (
        <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 text-center space-y-4">
          <Users className="w-12 h-12 text-[#F27D26] mx-auto" />
          <h2 className="text-2xl font-black text-white">Join Field Volunteers for {project.title}</h2>
          <p className="text-xs text-white/60 max-w-md mx-auto">
            We are actively looking for technicians, educators, health workers, and community liaisons.
          </p>
          <button
            onClick={() => setCurrentTab('volunteers')}
            className="px-6 py-3 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs shadow-md cursor-pointer"
          >
            Apply as Volunteer on Volunteer Portal
          </button>
        </div>
      )}

      {/* MODAL: ADD EXPENSE */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full space-y-4 border">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Log Approved Expense</h3>
            <form onSubmit={handleCreateExpense} className="space-y-3">
              <input
                type="text"
                placeholder="Category (e.g. Surveying, Equipment)"
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border text-xs"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border text-xs"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Approved Budget ($)"
                  value={expenseForm.approvedBudget}
                  onChange={(e) => setExpenseForm({ ...expenseForm, approvedBudget: e.target.value })}
                  className="p-2.5 rounded-xl border text-xs"
                  required
                />
                <input
                  type="number"
                  placeholder="Actual Spent ($)"
                  value={expenseForm.actualSpent}
                  onChange={(e) => setExpenseForm({ ...expenseForm, actualSpent: e.target.value })}
                  className="p-2.5 rounded-xl border text-xs"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Vendor Name"
                value={expenseForm.vendor}
                onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                className="w-full p-2.5 rounded-xl border text-xs"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD UPDATE */}
      {showAddUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full space-y-4 border">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Post Field Update</h3>
            <form onSubmit={handleCreateUpdate} className="space-y-3">
              <input
                type="text"
                placeholder="Update Headline / Title"
                value={updateForm.title}
                onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border text-xs"
                required
              />
              <textarea
                rows={3}
                placeholder="Update Content & Field Details"
                value={updateForm.content}
                onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
                className="w-full p-2.5 rounded-xl border text-xs"
                required
              />
              <input
                type="text"
                placeholder="Photo Image URL (Optional)"
                value={updateForm.mediaUrl}
                onChange={(e) => setUpdateForm({ ...updateForm, mediaUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl border text-xs"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUpdateModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                  Post Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
