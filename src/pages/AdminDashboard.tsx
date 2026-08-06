import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { FeasibilityAdminSettings } from '../components/FeasibilityAdminSettings.tsx';
import { FeasibilityScorecardModal } from '../components/FeasibilityScorecardModal.tsx';
import { HeroAdminManager } from '../components/HeroAdminManager.tsx';
import { ImpactAdminManager } from '../components/impact/ImpactAdminManager.tsx';
import { ReputationAdminManager } from '../components/reputation/ReputationAdminManager.tsx';
import { SecurityHardeningCenter } from '../components/SecurityHardeningCenter.tsx';
import { Project } from '../types.js';


import {
  Shield,
  Plus,
  Edit,
  Trash,
  Check,
  X,
  Users,
  FileText,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  Copy,
  Clock,
  AlertCircle,
  BarChart2,
  Printer,
  Search,
  Calendar,
  RefreshCw,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    projects,
    needs,
    volunteers,
    auditLogs,
    cmsPages,
    createProject,
    updateProject,
    deleteProject,
    approveVolunteer,
    updateCmsPage,
    addNeed,
    donations,
    makeDonation,
    projectCategories,
    addProjectCategory,
    updateProjectCategory,
    deleteProjectCategory,
  } = useAppData();

  const { role, setRole } = useAuth();

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('vision79_admin_unlocked') === 'true';
  });
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPasswords = ['admin', 'admin123', 'vision79', 'admin79'];
    if (validPasswords.includes(inputPassword.trim().toLowerCase())) {
      sessionStorage.setItem('vision79_admin_unlocked', 'true');
      setIsAdminUnlocked(true);
      setAuthError(null);
      if (role !== 'admin') {
        setRole('admin');
      }
    } else {
      setAuthError("Incorrect password. Default password is 'admin'.");
    }
  };

  const handleLockAdmin = () => {
    sessionStorage.removeItem('vision79_admin_unlocked');
    setIsAdminUnlocked(false);
    setInputPassword('');
  };

  const [activeTab, setActiveTab] = useState<'projects' | 'needs' | 'volunteers' | 'cms' | 'audit' | 'feasibility' | 'hero' | 'impact_hub' | 'reputation' | 'donations' | 'ffpro2' | 'security' | 'categories'>('projects');

  // Category management local state
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategoryOld, setEditingCategoryOld] = useState<string | null>(null);
  const [editingCategoryNew, setEditingCategoryNew] = useState('');

  // FFPRO2 Integration States
  const [ffpro2ApiKey, setFfpro2ApiKey] = useState('');
  const [ffpro2TestLoading, setFfpro2TestLoading] = useState(false);
  const [ffpro2TestResult, setFfpro2TestResult] = useState<any | null>(null);
  const [ffpro2SyncLoading, setFfpro2SyncLoading] = useState<Record<string, boolean>>({});
  const [ffpro2SyncRecords, setFfpro2SyncRecords] = useState<any[]>([]);

  const fetchFfpro2SyncRecords = async () => {
    try {
      const res = await fetch('/api/ffpro2/sync-records');
      if (res.ok) {
        const data = await res.json();
        setFfpro2SyncRecords(data);
      }
    } catch (err) {
      console.error('Failed to fetch ffpro2 records', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'ffpro2') {
      fetchFfpro2SyncRecords();
    }
  }, [activeTab]);

  const handleTestHandshake = async () => {
    setFfpro2TestLoading(true);
    setFfpro2TestResult(null);
    try {
      const res = await fetch('/api/ffpro2/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-FFPRO2-API-KEY': ffpro2ApiKey
        },
        body: JSON.stringify({ email: 'admin@vision79.org' })
      });
      const data = await res.json();
      setFfpro2TestResult(data);
    } catch (err) {
      setFfpro2TestResult({ success: false, error: 'Connection Error', message: 'Failed to dispatch API handshake request to backend.' });
    } finally {
      setFfpro2TestLoading(false);
    }
  };

  const handleSyncProject = async (projectId: string, simulateError: boolean = false) => {
    setFfpro2SyncLoading(prev => ({ ...prev, [projectId]: true }));
    try {
      const res = await fetch('/api/ffpro2/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-FFPRO2-API-KEY': ffpro2ApiKey
        },
        body: JSON.stringify({ projectId, simulateError, email: 'admin@vision79.org' })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh records
        await fetchFfpro2SyncRecords();
      } else {
        await fetchFfpro2SyncRecords();
        alert(`Sync Failed (Simulated Error): ${data.message || data.error}`);
      }
    } catch (err) {
      alert('Network failure syncing project to FFPRO2');
    } finally {
      setFfpro2SyncLoading(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const [selectedProjectScorecard, setSelectedProjectScorecard] = useState<Project | null>(null);

  // Create Project Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Water & Sanitation',
    targetAmount: 25000,
    city: 'Kilifi',
    region: 'Coastal Region',
    summary: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=800',
    beneficiariesCount: 2000,
  });

  // Create Need Modal state
  const [showNeedModal, setShowNeedModal] = useState(false);
  const [newNeed, setNewNeed] = useState({
    projectId: projects[0]?.id || '',
    title: '',
    category: 'Equipment',
    quantityNeeded: 10,
    unit: 'Units',
    estimatedCostPerUnit: 150,
    urgency: 'High',
  });

  // CMS Edit state
  const [selectedCmsSlug, setSelectedCmsSlug] = useState('about');
  const [cmsTitle, setCmsTitle] = useState('');
  const [cmsContent, setCmsContent] = useState('');

  // Cash Donation Logging state
  const [cashProjectId, setCashProjectId] = useState('');
  const [cashDonorName, setCashDonorName] = useState('');
  const [cashDonorEmail, setCashDonorEmail] = useState('');
  const [cashAmount, setCashAmount] = useState<number | ''>('');
  const [cashDate, setCashDate] = useState(new Date().toISOString().split('T')[0]);
  const [cashIsAnonymous, setCashIsAnonymous] = useState(false);
  const [cashIsCorporate, setCashIsCorporate] = useState(false);
  const [isSubmittingCash, setIsSubmittingCash] = useState(false);
  const [cashLogSearch, setCashLogSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  if (!isAdminUnlocked) {
    return (
      <div className="py-16 px-4 max-w-md mx-auto">
        <div className="bg-[#0a0a0b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Admin Hub Protected</h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Enter the master administrator password to access management controls, audit ledgers, and project tools.
            </p>
          </div>

          <form onSubmit={handleUnlockAdmin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#F27D26] focus:ring-1 focus:ring-[#F27D26] transition-all"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 text-xs font-semibold px-1 py-0.5"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-400 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#F27D26] hover:bg-[#d96b1f] text-black font-black text-sm shadow-lg shadow-[#F27D26]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              Unlock Admin Hub
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 text-[11px] text-white/40">
            Default Password: <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-white/70">admin</code>
          </div>
        </div>
      </div>
    );
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject({
      ...newProject,
      location: { city: newProject.city, region: newProject.region, country: 'Kenya' },
      status: 'Active',
    });
    setShowCreateModal(false);
  };

  const handleNeedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNeed(newNeed.projectId, newNeed);
    setShowNeedModal(false);
  };

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCmsPage(selectedCmsSlug, { title: cmsTitle, content: cmsContent });
    alert('CMS Page updated successfully!');
  };

  const handleCashDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashAmount || Number(cashAmount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsSubmittingCash(true);
    const success = await makeDonation({
      projectId: cashProjectId || undefined,
      donorName: cashIsAnonymous ? 'Anonymous Donor' : cashDonorName.trim() || 'Offline Supporter',
      donorEmail: cashDonorEmail.trim() || 'supporter@vision79.org',
      amount: Number(cashAmount),
      type: cashIsCorporate ? 'Corporate' : 'Cash',
      isAnonymous: cashIsAnonymous,
      date: cashDate ? new Date(cashDate).toISOString() : new Date().toISOString(),
      status: 'Completed',
    });

    setIsSubmittingCash(false);
    if (success) {
      setCashDonorName('');
      setCashDonorEmail('');
      setCashAmount('');
      setCashIsAnonymous(false);
      setCashIsCorporate(false);
      setCashProjectId('');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="p-8 rounded-3xl bg-[#050505] text-white border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26] uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>Executive Command Center</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-1">Foundation Admin Director Hub</h1>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
          <button
            onClick={() => setShowNeedModal(true)}
            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#F27D26]" />
            <span>Add Need Item</span>
          </button>
          <button
            onClick={handleLockAdmin}
            className="px-4 py-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-extrabold text-xs flex items-center gap-1.5 border border-rose-500/20 cursor-pointer transition-colors"
            title="Lock Admin Hub"
          >
            <Lock className="w-4 h-4" />
            <span>Lock Admin</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-white/10 gap-2 pb-2">
        {[
          { id: 'projects', label: `Projects Management (${projects?.length || 0})` },
          { id: 'categories', label: `Project Categories (${projectCategories?.length || 0})` },
          { id: 'donations', label: 'Record Cash Donations' },
          { id: 'ffpro2', label: 'Planning Sync (FFPRO2)' },
          { id: 'impact_hub', label: 'Impact Hub & Live Dashboard' },
          { id: 'reputation', label: 'Reputation & Honors Governance' },
          { id: 'needs', label: `Needs Board Items (${needs?.length || 0})` },
          { id: 'volunteers', label: `Volunteer Approvals (${volunteers?.length || 0})` },
          { id: 'cms', label: 'CMS Content Editor' },
          { id: 'hero', label: 'Full-Screen Hero Video' },
          { id: 'audit', label: `Audit Log Ledger (${auditLogs?.length || 0})` },
          { id: 'feasibility', label: 'Feasibility & AI Settings' },
          { id: 'security', label: '🛡️ Security Hardening Center' },
        ].map((tab) => (


          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#F27D26] text-black shadow-sm'
                : 'text-white/60 hover:text-white bg-white/5 border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#F27D26]" />
              <span>Project Categories Management</span>
            </h3>
            <p className="text-xs text-white/60">
              Add, rename, or remove project categories. Renaming a category automatically updates all associated projects.
            </p>

            {/* Add Category Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCategoryInput.trim()) return;
                const success = await addProjectCategory(newCategoryInput.trim());
                if (success) setNewCategoryInput('');
              }}
              className="flex gap-2 max-w-md pt-2"
            >
              <input
                type="text"
                placeholder="New Category Name..."
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </form>
          </div>

          <div className="bg-white/[0.03] rounded-3xl border border-white/10 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-white/50 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Assigned Projects Count</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-medium">
                {(projectCategories || []).map((cat) => {
                  const count = projects.filter((p) => p.category === cat).length;
                  const isEditing = editingCategoryOld === cat;
                  return (
                    <tr key={cat} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-bold text-white">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingCategoryNew}
                            onChange={(e) => setEditingCategoryNew(e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#F27D26]"
                          />
                        ) : (
                          cat
                        )}
                      </td>
                      <td className="p-4 text-white/60">{count} projects</td>
                      <td className="p-4 text-right space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={async () => {
                                if (!editingCategoryNew.trim()) return;
                                const success = await updateProjectCategory(cat, editingCategoryNew.trim());
                                if (success) {
                                  setEditingCategoryOld(null);
                                  setEditingCategoryNew('');
                                }
                              }}
                              className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingCategoryOld(null);
                                setEditingCategoryNew('');
                              }}
                              className="px-3 py-1 rounded bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingCategoryOld(cat);
                                setEditingCategoryNew(cat);
                              }}
                              className="p-1.5 rounded bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 cursor-pointer"
                              title="Rename Category"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete category "${cat}"?`)) {
                                  await deleteProjectCategory(cat);
                                }
                              }}
                              className="p-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="bg-white/[0.03] rounded-3xl border border-white/10 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-white/50 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Target Goal</th>
                <th className="p-4">Raised</th>
                <th className="p-4">Feasibility</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-medium">
              {projects.map((p) => {
                const fScore = p.feasibilityAssessment?.overallScore || 85;
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-white">{p.title}</td>
                    <td className="p-4 text-white/50">{p.category}</td>
                    <td className="p-4 font-bold text-white/80">${p.targetAmount.toLocaleString()}</td>
                    <td className="p-4 font-bold text-[#F27D26]">${p.raisedAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedProjectScorecard(p)}
                        className="px-2.5 py-1 rounded-full bg-[#F27D26]/10 hover:bg-[#F27D26]/20 border border-[#F27D26]/30 text-[#F27D26] font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{fScore}% Ready</span>
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 text-[10px] font-bold">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="p-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: REPUTATION & HONORS GOVERNANCE */}
      {activeTab === 'reputation' && <ReputationAdminManager />}

      {/* TAB: VOLUNTEERS */}
      {activeTab === 'volunteers' && (
        <div className="bg-white/[0.03] rounded-3xl border border-white/10 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-white/50 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Volunteer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Skills</th>
                <th className="p-4">Logged Hours</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-medium">
              {volunteers.map((v) => (
                <tr key={v.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold text-white">{v.name}</td>
                  <td className="p-4 text-white/50">{v.email}</td>
                  <td className="p-4 text-white/70">{v.skills.join(', ')}</td>
                  <td className="p-4 font-bold text-[#F27D26]">{v.hoursLogged} hrs</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/80 text-[10px] font-bold">
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {v.status === 'Pending' && (
                      <button
                        onClick={() => approveVolunteer(v.id)}
                        className="px-3 py-1 rounded-full bg-[#F27D26] text-black font-extrabold text-xs cursor-pointer hover:bg-[#e06c1b]"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: CMS */}
      {activeTab === 'cms' && (
        <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 shadow-sm space-y-4 max-w-2xl">
          <h2 className="font-bold text-lg text-white">CMS Static Page Content Editor</h2>

          <select
            value={selectedCmsSlug}
            onChange={(e) => {
              const slug = e.target.value;
              setSelectedCmsSlug(slug);
              const p = cmsPages.find((page) => page.slug === slug);
              if (p) {
                setCmsTitle(p.title);
                setCmsContent(p.content);
              }
            }}
            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F27D26]"
          >
            {cmsPages.map((p) => (
              <option key={p.slug} value={p.slug} className="bg-[#050505] text-white">
                Page: {p.title} ({p.slug})
              </option>
            ))}
          </select>

          <form onSubmit={handleSaveCms} className="space-y-3">
            <input
              type="text"
              placeholder="Page Title"
              value={cmsTitle}
              onChange={(e) => setCmsTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
              required
            />
            <textarea
              rows={6}
              placeholder="Page Body Content"
              value={cmsContent}
              onChange={(e) => setCmsContent(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
              required
            />
            <button type="submit" className="px-5 py-2.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs cursor-pointer">
              Save CMS Changes
            </button>
          </form>
        </div>
      )}

      {/* TAB: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white/[0.03] rounded-3xl border border-white/10 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-white/50 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Action Event</th>
                <th className="p-4">Performed By</th>
                <th className="p-4">Target / Entity</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-mono text-[11px]">
              {auditLogs.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-bold text-[#F27D26]">{a.action}</td>
                  <td className="p-4 text-white/80">{a.user}</td>
                  <td className="p-4 text-white/50">{a.details}</td>
                  <td className="p-4 text-white/40">{a.ipAddress}</td>
                  <td className="p-4 text-white/40">{new Date(a.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: RECORD CASH DONATIONS */}
      {activeTab === 'donations' && (
        <div className="space-y-6">
          <div className="bg-[#050505] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#F27D26]" />
              Record Physical Cash Inflows (Offline Supporter Ledger)
            </h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Register offline physical cash contributions received directly from supporters who do not wish to use the digital platform. This updates real-time impact indicators, projects progress, logs secure internal audits, and issues printable standard NGO receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* COLUMN 1: RECORD FORM */}
            <div className="lg:col-span-1 bg-[#050505] p-6 border border-white/10 rounded-3xl space-y-4 shadow-xl self-start">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-sm text-white">Record Cash Receipt</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold tracking-wider uppercase">
                  Physical Inflow
                </span>
              </div>

              <form onSubmit={handleCashDonationSubmit} className="space-y-4">
                {/* Designated Project */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                    Designated Initiative *
                  </label>
                  <select
                    value={cashProjectId}
                    onChange={(e) => setCashProjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F27D26]"
                  >
                    <option value="" className="bg-[#050505] text-white">General Foundation Fund</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#050505] text-white">
                        {p.title} (${p.raisedAmount.toLocaleString()} / ${p.targetAmount.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Donor Name */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                    Donor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marie-Louise Giraud"
                    value={cashDonorName}
                    disabled={cashIsAnonymous}
                    onChange={(e) => setCashDonorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-[#F27D26] disabled:opacity-40"
                  />
                </div>

                {/* Donor Email */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-white/50 flex justify-between">
                    <span>Donor Email (Optional)</span>
                    <span className="text-white/30 italic text-[9px] lowercase">No account will be created</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. offline-donor@vision79.org"
                    value={cashDonorEmail}
                    disabled={cashIsAnonymous}
                    onChange={(e) => setCashDonorEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-[#F27D26] disabled:opacity-40"
                  />
                </div>

                {/* Amount (EC$) & Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                      Amount (EC$) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 500"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-[#F27D26]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                      Date Received *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={cashDate}
                        onChange={(e) => setCashDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F27D26]"
                      />
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="pt-2 space-y-2 border-t border-white/5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={cashIsAnonymous}
                      onChange={(e) => {
                        setCashIsAnonymous(e.target.checked);
                        if (e.target.checked) {
                          setCashDonorName('Anonymous Supporter');
                          setCashDonorEmail('supporter@vision79.org');
                        } else {
                          setCashDonorName('');
                          setCashDonorEmail('');
                        }
                      }}
                      className="rounded border-white/20 bg-white/5 text-[#F27D26] focus:ring-[#F27D26]"
                    />
                    <span className="text-[11px] text-white/80">Keep Donor Anonymous Publicly</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={cashIsCorporate}
                      onChange={(e) => setCashIsCorporate(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-[#F27D26] focus:ring-[#F27D26]"
                    />
                    <span className="text-[11px] text-white/80">Corporate / Sponsor Contribution</span>
                  </label>
                </div>

                {/* Submitting Status details */}
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white/50 leading-relaxed">
                  ⚠️ By submitting, you certify that the cash has been physically secured by the NGO directorate and is subject to immediate accounting inspection.
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  disabled={isSubmittingCash}
                  className="w-full py-3 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmittingCash ? 'Recording...' : 'Certify & Record Inflow'}</span>
                </button>
              </form>
            </div>

            {/* COLUMN 2 & 3: GENERAL LEDGER */}
            <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Historical Transactions Ledger</h3>
                  <p className="text-[10px] text-white/40">Includes all registered online payments, corporate matches, and physical cash inflows.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search by Donor, Receipt #..."
                    value={cashLogSearch}
                    onChange={(e) => setCashLogSearch(e.target.value)}
                    className="w-full p-2 pl-9 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-[#F27D26]"
                  />
                </div>
              </div>

              {/* Transactions table */}
              <div className="overflow-x-auto max-h-[480px]">
                <table className="w-full text-left text-xs font-medium">
                  <thead className="bg-white/5 text-white/40 font-bold uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="p-3 text-[10px]">Receipt No</th>
                      <th className="p-3 text-[10px]">Date</th>
                      <th className="p-3 text-[10px]">Donor</th>
                      <th className="p-3 text-[10px]">Destination</th>
                      <th className="p-3 text-[10px]">Type</th>
                      <th className="p-3 text-[10px]">Amount</th>
                      <th className="p-3 text-[10px] text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(() => {
                      const searchLower = cashLogSearch.toLowerCase();
                      const filteredDonations = donations.filter((d) => {
                        if (!searchLower) return true;
                        return (
                          d.receiptNumber.toLowerCase().includes(searchLower) ||
                          d.donorName.toLowerCase().includes(searchLower) ||
                          d.donorEmail.toLowerCase().includes(searchLower) ||
                          (d.projectName && d.projectName.toLowerCase().includes(searchLower))
                        );
                      });

                      if (filteredDonations.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-white/30 text-xs font-normal">
                              No donations match your current search query.
                            </td>
                          </tr>
                        );
                      }

                      return filteredDonations.map((d) => {
                        const isCashType = d.type === 'Cash' || d.type === undefined;
                        return (
                          <tr key={d.id} className="hover:bg-white/[0.01]">
                            <td className="p-3 text-white/70 font-mono text-[11px]">{d.receiptNumber}</td>
                            <td className="p-3 text-white/40 text-[11px]">
                              {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-white text-[11px]">{d.donorName}</div>
                              {d.donorEmail && d.donorEmail !== 'supporter@vision79.org' && (
                                <div className="text-[10px] text-white/40 font-normal">{d.donorEmail}</div>
                              )}
                            </td>
                            <td className="p-3 text-white/70 max-w-[150px] truncate text-[11px]" title={d.projectName}>
                              {d.projectName || 'General Fund'}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                d.type === 'Corporate'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : isCashType
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                  : 'bg-green-500/10 text-green-400 border border-green-500/20'
                              }`}>
                                {d.type || 'Cash'}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-white text-[11px]">EC$ {d.amount.toLocaleString()}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setSelectedReceipt(d)}
                                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold border border-white/10 flex items-center gap-1.5 ml-auto cursor-pointer"
                              >
                                <Printer className="w-3 h-3 text-[#F27D26]" />
                                <span>Receipt</span>
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: FFPRO2 PLANNING SYNC INTEGRATION */}
      {activeTab === 'ffpro2' && (
        <div className="space-y-6">
          <div className="bg-[#050505] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#F27D26] animate-spin" style={{ animationDuration: '6s' }} />
              FFPRO2 Enterprise Planning Sync Hub
            </h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Programmatically synchronize Vision79 community initiatives, budget milestones, and field resource needs directly into the downstream <strong>FFPRO2 Project Planning Module</strong>. This integration leverages API token authentication, automatic retry policies, and granular auditable trail telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* COLUMN 1: API CONTROL PANEL & HANDSHAKE */}
            <div className="lg:col-span-1 bg-[#050505] p-6 border border-white/10 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-sm text-white">Integration Handshake</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold tracking-wider uppercase">
                  RESTful Active
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Remote Endpoint */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                    FFPRO2 Gateway Endpoint
                  </label>
                  <input
                    type="text"
                    disabled
                    value="https://api.ffpro2.com/v1"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 text-xs focus:outline-none"
                  />
                </div>

                {/* API Auth Token */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-white/50 flex justify-between">
                    <span>X-FFPRO2-API-KEY *</span>
                    <span className="text-[#F27D26] font-bold text-[9px]">Verified</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter integration API Key"
                    value={ffpro2ApiKey}
                    onChange={(e) => setFfpro2ApiKey(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono placeholder:text-white/30 text-xs focus:outline-none focus:border-[#F27D26]"
                  />
                  <span className="text-[9px] text-white/40 block leading-tight">
                    Primary API gateway token used for HMAC payload verification.
                  </span>
                </div>

                {/* Handshake Trigger */}
                <button
                  type="button"
                  onClick={handleTestHandshake}
                  disabled={ffpro2TestLoading}
                  className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Activity className="w-4 h-4 text-[#F27D26]" />
                  <span>{ffpro2TestLoading ? 'Executing Handshake...' : 'Verify API Handshake'}</span>
                </button>

                {/* Handshake Result Console */}
                {ffpro2TestResult && (
                  <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    ffpro2TestResult.success 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/5 border-red-500/20 text-red-400'
                  }`}>
                    <div className="flex items-center justify-between font-bold text-[10px] uppercase tracking-wider">
                      <span>Console Logs</span>
                      <span>{ffpro2TestResult.success ? 'HANDSHAKE OK' : 'HANDSHAKE ERROR'}</span>
                    </div>
                    <pre className="text-[10px] font-mono whitespace-pre-wrap bg-black/40 p-2.5 rounded-lg border border-white/5 leading-normal max-h-48 overflow-y-auto">
                      {JSON.stringify(ffpro2TestResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2 & 3: INITIATIVE SYNCHRONIZATION BOARD */}
            <div className="lg:col-span-2 bg-[#050505] p-6 border border-white/10 rounded-3xl space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Initiatives Synchronization Status</h3>
                  <p className="text-[10px] text-white/40">Synchronize budget goals, milestones, and resource planning definitions.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead className="bg-white/5 text-white/40 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3 text-[10px]">Initiative</th>
                      <th className="p-3 text-[10px] text-center">Tasks / Milestones</th>
                      <th className="p-3 text-[10px]">External Project Ref</th>
                      <th className="p-3 text-[10px]">Sync Status</th>
                      <th className="p-3 text-[10px] text-right">Synchronization Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map((p) => {
                      const record = ffpro2SyncRecords.find((r) => r.projectId === p.id);
                      const isSyncing = ffpro2SyncLoading[p.id];
                      const tasksCount = p.needs ? p.needs?.length || 0 : 4;
                      const milestonesCount = p.milestones ? p.milestones.length : 3;

                      return (
                        <tr key={p.id} className="hover:bg-white/[0.01]">
                          <td className="p-3">
                            <div className="font-bold text-white text-[11px]">{p.title}</div>
                            <div className="text-[10px] text-white/40">{p.category}</div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-white/80">
                              {tasksCount} Tasks / {milestonesCount} Milestones
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px]">
                            {record?.status === 'synced' ? (
                              <span className="text-emerald-400 font-bold">{record.externalProjectId}</span>
                            ) : (
                              <span className="text-white/20">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            {record ? (
                              record.status === 'synced' ? (
                                <div className="space-y-0.5">
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider">
                                    Synced
                                  </span>
                                  <div className="text-[8px] text-white/30 font-mono mt-1">
                                    {new Date(record.lastSyncedAt).toLocaleDateString()} {new Date(record.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-0.5">
                                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-bold uppercase tracking-wider">
                                    Failed
                                  </span>
                                  <div className="text-[8px] text-red-400 font-mono mt-1">
                                    {record.errorMessage}
                                  </div>
                                </div>
                              )
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/10 text-[9px] font-bold uppercase tracking-wider">
                                Never Synced
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleSyncProject(p.id, false)}
                                disabled={isSyncing}
                                className="px-3 py-1 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black text-[10px] font-extrabold cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-1"
                              >
                                {isSyncing ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-3 h-3" />
                                )}
                                <span>Sync Planner</span>
                              </button>
                              <button
                                onClick={() => handleSyncProject(p.id, true)}
                                disabled={isSyncing}
                                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 text-white/40 text-[10px] font-bold cursor-pointer transition-all disabled:opacity-50"
                                title="Simulate 503 target outage to verify network retry and failover audit logging logs"
                              >
                                Test Failover
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* DOCUMENTATION PANEL */}
          <div className="bg-[#050505] p-6 border border-white/10 rounded-3xl space-y-4 shadow-xl">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#F27D26]" />
              FFPRO2 API REST Integration Developer Documentation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-white/60">
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-white/80">API Gateway Handshake</h4>
                <p className="text-[11px] leading-relaxed">
                  Authenticates client tokens, logs security headers, and completes the connection validation with simulated automatic failover-recovery.
                </p>
                <div className="font-mono bg-black/60 p-4 rounded-xl border border-white/5 text-[10px] text-slate-300 leading-normal whitespace-pre-wrap">
                  {`curl -X POST https://vision79.org/api/ffpro2/test-connection \\
  -H "X-FFPRO2-API-KEY: ffpro2_secret_key_123" \\
  -H "Content-Type: application/json"`}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-white/80">Trigger Initiative Synchronization</h4>
                <p className="text-[11px] leading-relaxed">
                  Extracts active budget items, translates needs into scheduling tasks, aligns target milestones, and updates the external project ledger.
                </p>
                <div className="font-mono bg-black/60 p-4 rounded-xl border border-white/5 text-[10px] text-slate-300 leading-normal whitespace-pre-wrap">
                  {`curl -X POST https://vision79.org/api/ffpro2/sync \\
  -H "X-FFPRO2-API-KEY: ffpro2_secret_key_123" \\
  -H "Content-Type: application/json" \\
  -d '{"projectId": "water-kilifi", "email": "director@vision79.org"}'`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: HERO MEDIA MANAGER */}
      {activeTab === 'hero' && <HeroAdminManager />}

      {/* TAB: FOUNDATION IMPACT HUB & LIVE DASHBOARD */}
      {activeTab === 'impact_hub' && <ImpactAdminManager />}

      {/* TAB: FEASIBILITY & AI SETTINGS */}
      {activeTab === 'feasibility' && <FeasibilityAdminSettings />}

      {/* TAB: SECURITY HARDENING CENTER */}
      {activeTab === 'security' && <SecurityHardeningCenter />}
      {/* MODAL: FEASIBILITY SCORECARD */}
      {selectedProjectScorecard && (
        <FeasibilityScorecardModal
          project={selectedProjectScorecard}
          onClose={() => setSelectedProjectScorecard(null)}
        />
      )}

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0a0a0a] rounded-3xl p-6 max-w-lg w-full space-y-4 border border-white/10 shadow-2xl">
            <h3 className="font-bold text-lg text-white">Create New Community Project</h3>
            <form onSubmit={handleProjectSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F27D26]"
                >
                  {(projectCategories || ['Water & Sanitation', 'Education', 'Healthcare', 'Environment', 'Community Care']).map((c) => (
                    <option key={c} value={c} className="bg-[#050505] text-white">
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Target Goal ($)"
                  value={newProject.targetAmount}
                  onChange={(e) => setNewProject({ ...newProject, targetAmount: Number(e.target.value) })}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Summary Headline"
                value={newProject.summary}
                onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
                required
              />
              <textarea
                rows={3}
                placeholder="Full Project Description Narrative"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black text-xs font-extrabold cursor-pointer">
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEED MODAL */}
      {showNeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0a0a0a] rounded-3xl p-6 max-w-md w-full space-y-4 border border-white/10 shadow-2xl">
            <h3 className="font-bold text-lg text-white">Add Need Item Request</h3>
            <form onSubmit={handleNeedSubmit} className="space-y-3">
              <select
                value={newNeed.projectId}
                onChange={(e) => setNewNeed({ ...newNeed, projectId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F27D26]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#050505] text-white">
                    {p.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Requested Item Title (e.g. 10 Solar Pumps)"
                value={newNeed.title}
                onChange={(e) => setNewNeed({ ...newNeed, title: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Quantity Needed"
                  value={newNeed.quantityNeeded}
                  onChange={(e) => setNewNeed({ ...newNeed, quantityNeeded: Number(e.target.value) })}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
                  required
                />
                <input
                  type="number"
                  placeholder="Est. Cost / Unit ($)"
                  value={newNeed.estimatedCostPerUnit}
                  onChange={(e) => setNewNeed({ ...newNeed, estimatedCostPerUnit: Number(e.target.value) })}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNeedModal(false)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black text-xs font-extrabold cursor-pointer">
                  Save Need Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINT RECEIPT */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-black space-y-6 shadow-2xl relative overflow-hidden border-8 border-[#F27D26]/10">
            {/* Header / Watermark decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F27D26]/5 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <div className="flex justify-between items-start border-b-2 border-dashed border-gray-200 pb-4">
              <div>
                <div className="text-[11px] font-black text-[#F27D26] uppercase tracking-wider font-sans">Official Inflow Ledger Certificate</div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight font-sans">Vision79 Foundation Inc.</h3>
                <p className="text-[10px] text-gray-500 font-sans">Capital District, CARICOM NGO Secretariat</p>
              </div>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="space-y-4 text-xs font-sans">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500 uppercase tracking-wider font-bold">Receipt Reference</span>
                <span className="font-mono font-bold text-[#F27D26] bg-[#F27D26]/5 px-2 py-0.5 rounded">{selectedReceipt.receiptNumber}</span>
              </div>
              
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500 uppercase tracking-wider font-bold">Transaction Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(selectedReceipt.date).toLocaleString(undefined, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="grid grid-cols-3">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] col-span-1">Received From</span>
                  <span className="text-gray-900 font-black text-sm col-span-2">{selectedReceipt.donorName}</span>
                </div>
                {selectedReceipt.donorEmail && (
                  <div className="grid grid-cols-3">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] col-span-1">Donor Contact</span>
                    <span className="text-gray-600 font-medium col-span-2">{selectedReceipt.donorEmail}</span>
                  </div>
                )}
                <div className="grid grid-cols-3">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] col-span-1">Initiative</span>
                  <span className="text-gray-900 font-bold col-span-2">{selectedReceipt.projectName || 'General Foundation Fund'}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] col-span-1">Channel</span>
                  <span className="text-gray-700 font-bold col-span-2">
                    {selectedReceipt.type === 'Corporate' ? 'Offline Corporate Check/Draft' : 'Physical Cash Exchange (Non-App Supporter)'}
                  </span>
                </div>
              </div>

              {/* Huge Amount Counter */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center space-y-1 my-4">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Certified Cleared Value</span>
                <span className="text-3xl font-black text-gray-900 font-mono">EC$ {selectedReceipt.amount.toLocaleString()}.00</span>
                <span className="text-[9px] text-[#F27D26] font-extrabold tracking-wider bg-[#F27D26]/5 px-2.5 py-0.5 rounded-full uppercase">
                  Cash Certified & Audited
                </span>
              </div>
            </div>

            {/* NGO Signatures */}
            <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4 text-[10px] text-gray-500 font-sans">
              <div className="space-y-1">
                <div className="italic font-serif text-gray-900 border-b border-gray-200 pb-1 h-6 flex items-end">Vision79 Board</div>
                <span>Authorized Signatory</span>
              </div>
              <div className="space-y-1">
                <div className="italic font-serif text-gray-900 border-b border-gray-200 pb-1 h-6 flex items-end">Audited & Logged</div>
                <span>Audit Trail Registry</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-100 font-sans">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
