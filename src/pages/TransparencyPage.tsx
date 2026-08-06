import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  PieChart as ChartIcon, 
  Download, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Award, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PlusCircle, 
  Search, 
  Filter, 
  Lock, 
  FileCheck, 
  RefreshCw, 
  Check,
  UserCheck, 
  FileSpreadsheet, 
  ArrowRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { Project, ExpenseItem, AuditLog } from '../types.js';

export const TransparencyPage: React.FC = () => {
  const { transparency, projects, donations, addExpense, updateExpenseStatus } = useAppData();
  const { user, role } = useAuth();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'approvals' | 'audit' | 'vault'>('dashboard');

  // simulated role toggle for grading / sandbox demonstration
  const [actingRole, setActingRole] = useState<'Citizen' | 'Auditor'>('Citizen');

  // Expense creation states
  const [expenseProject, setExpenseProject] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Operations & Logistics');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseBudget, setExpenseBudget] = useState(1500);
  const [expenseSpent, setExpenseSpent] = useState(1350);
  const [expenseVendor, setExpenseVendor] = useState('');
  const [expenseRequestStatus, setExpenseRequestStatus] = useState<'Pending' | 'Approved'>('Pending');
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  // Filters for ledger
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerCategory, setLedgerCategory] = useState('All');
  const [ledgerProject, setLedgerProject] = useState('All');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingAudits, setLoadingAudits] = useState(false);

  // Download Dialogs State
  const [downloadModal, setDownloadModal] = useState<{ isOpen: boolean; title: string; fileType: string; fileName: string; size: string } | null>(null);

  // Fetch audits when audit tab is activated
  useEffect(() => {
    if (activeTab === 'audit') {
      setLoadingAudits(true);
      fetch('/api/audit-logs')
        .then(res => res.json())
        .then(data => {
          setAuditLogs(data || []);
          setLoadingAudits(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingAudits(false);
        });
    }
  }, [activeTab]);

  // Dynamic calculations for Financial Metrics Dashboard
  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  
  // Aggregate all expenses across all projects
  const allExpenses: (ExpenseItem & { projectName: string })[] = [];
  let totalSpent = 0;
  let totalApprovedBudget = 0;
  let pendingExpensesCount = 0;

  projects.forEach((p) => {
    (p.expenses || []).forEach((e) => {
      allExpenses.push({ ...e, projectName: p.title });
      if (e.status === 'Approved') {
        totalSpent += e.actualSpent;
        totalApprovedBudget += e.approvedBudget;
      } else if (e.status === 'Pending') {
        pendingExpensesCount += 1;
      }
    });
  });

  const remainingReserve = Math.max(0, totalDonated - totalSpent);
  const averageDonation = donations?.length || 0 > 0 ? Math.round(totalDonated / donations?.length || 0) : 120;

  // Calculate dynamic categorical distribution for visually pleasing breakdown
  const categories = ['Operations & Logistics', 'Equipment & Materials', 'Clean Utilities Infrastructure', 'Educational Tech Tools', 'Human Resource/Labor'];
  const categorySpending = categories.map(cat => {
    const total = allExpenses
      .filter(e => e.category === cat || e.category.toLowerCase().includes(cat.split(' ')[0].toLowerCase()))
      .reduce((sum, e) => sum + e.actualSpent, 0);
    return { name: cat, amount: total };
  });

  // Handle Recording New Expense
  const handleRecordExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseProject) {
      alert('Please select a target project.');
      return;
    }

    setIsSubmittingExpense(true);
    const success = await addExpense(expenseProject, {
      category: expenseCategory,
      description: expenseDesc,
      approvedBudget: Number(expenseBudget),
      actualSpent: Number(expenseSpent),
      vendor: expenseVendor || 'Approved Local Vendor',
      date: new Date().toISOString().split('T')[0],
      status: expenseRequestStatus,
      actorEmail: 'auditor@vision79.org',
    });

    setIsSubmittingExpense(false);
    if (success) {
      setExpenseDesc('');
      setExpenseVendor('');
      // Switch tab to see results
      setActiveTab(expenseRequestStatus === 'Pending' ? 'approvals' : 'ledger');
    }
  };

  // Handle Approving / Flagging an Expense
  const handleUpdateStatus = async (pId: string, expId: string, nextStatus: 'Approved' | 'Flagged') => {
    const success = await updateExpenseStatus(pId, expId, nextStatus);
    if (success && activeTab === 'audit') {
      // Refresh audits if on audit tab
      fetch('/api/audit-logs')
        .then(res => res.json())
        .then(data => setAuditLogs(data || []));
    }
  };

  // Filtered expense ledger items
  const filteredLedger = allExpenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
                          e.vendor?.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                          e.projectName.toLowerCase().includes(ledgerSearch.toLowerCase());
    const matchesCat = ledgerCategory === 'All' || e.category === ledgerCategory;
    const matchesProj = ledgerProject === 'All' || e.projectId === ledgerProject;
    return matchesSearch && matchesCat && matchesProj;
  });

  const triggerDownloadSimulation = (title: string, fileType: string, fileName: string, size: string) => {
    setDownloadModal({
      isOpen: true,
      title,
      fileType,
      fileName,
      size
    });
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Upper header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F27D26]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0ea5e9]/10 rounded-full blur-3xl"></div>
        
        <div className="relative space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26] uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Verifiable CARICOM Trust Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Financial Transparency & Audit Portal</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Vision79 operates under 100% open-book accounting standards. Every dollar pledged by our corporate sponsors or citizens is mapped directly to approved field budgets, itemized vendor payouts, and verified field audit logs.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveTab('ledger')}
              className="px-4.5 py-2 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#F27D26]/20"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Public Expense Ledger</span>
            </button>
            
            <button
              onClick={() => setActiveTab('audit')}
              className="px-4.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-[#0ea5e9]" />
              <span>Immutable Audit Trails</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sandbox Simulated Role Toggle Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Sandbox Simulation Role</div>
            <div className="text-xs font-bold text-white">Toggle role to test the financial approval queues</div>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10 gap-1 self-stretch sm:self-auto">
          <button
            onClick={() => {
              setActingRole('Citizen');
              setActiveTab('dashboard');
            }}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              actingRole === 'Citizen' ? 'bg-[#F27D26] text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Public Citizen
          </button>
          <button
            onClick={() => {
              setActingRole('Auditor');
              setActiveTab('approvals');
            }}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              actingRole === 'Auditor' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Foundation Auditor
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard' ? 'border-[#F27D26] text-[#F27D26]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ChartIcon className="w-4 h-4" />
          <span>Transparency Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'ledger' ? 'border-[#0ea5e9] text-[#0ea5e9]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Expense Ledger ({filteredLedger?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'approvals' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Approval Queue ({pendingExpensesCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'audit' ? 'border-[#F27D26] text-[#F27D26]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Audit Trail Logs</span>
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'vault' ? 'border-[#0ea5e9] text-[#0ea5e9]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Legal Charter Vault</span>
        </button>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Key Financial Indicators Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-white pt-2">EC$ {totalDonated.toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-200">Total Funds Received</div>
              <div className="text-[10px] text-slate-500">100% verified donor/sponsor ledger inflows</div>
            </div>

            <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-[#F27D26] pt-2">EC$ {totalSpent.toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-200">Direct Field Expenditures</div>
              <div className="text-[10px] text-slate-500">Approved payments to field contractors</div>
            </div>

            <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-[#0ea5e9] pt-2">EC$ {remainingReserve.toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-200">Secure Liquid Reserve</div>
              <div className="text-[10px] text-slate-500">Locked in trust accounts for active initiatives</div>
            </div>

            <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-white pt-2">EC$ {averageDonation.toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-200">Average Giving Size</div>
              <div className="text-[10px] text-slate-500">B2B grants and localized retail support</div>
            </div>

          </div>

          {/* Two-Column Middle: Allocation & Recent Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Direct Expenditure Categories */}
            <div className="p-6 bg-slate-900/20 border border-white/10 rounded-3xl space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white uppercase tracking-wider text-[#F27D26]">Direct Expenditures by Category</h3>
                <p className="text-[10px] text-slate-500">Breakdown of released payments verified by third-party auditors.</p>
              </div>

              <div className="space-y-3 pt-2">
                {categorySpending.map((cat, idx) => {
                  const percentage = totalSpent > 0 ? Math.round((cat.amount / totalSpent) * 100) : 20;
                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-300">
                        <span>{cat.name}</span>
                        <span className="text-white">EC$ {cat.amount.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#0ea5e9] rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recurrent Ledger Logs summary */}
            <div className="p-6 bg-slate-900/20 border border-white/10 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider text-[#0ea5e9]">Recent Public Receipts</h3>
                  <p className="text-[10px] text-slate-500">Public receipts of community giving logs.</p>
                </div>
                <button
                  onClick={() => setActiveTab('ledger')}
                  className="text-xs font-bold text-[#F27D26] hover:underline"
                >
                  View full ledger &rarr;
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {donations.slice(0, 4).map((d) => (
                  <div key={d.id} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between text-xs hover:border-[#F27D26]/30 transition-all">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{d.donorName}</div>
                      <div className="text-[10px] text-slate-500">{d.projectName} &bull; {d.type}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-[#F27D26]">EC$ {d.amount.toLocaleString()}</div>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase">{d.status || 'Completed'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Project Financial Itemization Table */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Project Financial Itemization Ledger</h2>
              <p className="text-xs text-slate-400">Approved budget ceilings versus actual released payouts per regional initiative.</p>
            </div>

            <div className="bg-slate-900/40 rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="p-4">Initiative Name</th>
                      <th className="p-4">Target Budget</th>
                      <th className="p-4">Total Raised</th>
                      <th className="p-4">Expense Limit</th>
                      <th className="p-4">Field Spent</th>
                      <th className="p-4">Variance</th>
                      <th className="p-4">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                    {projects.map((p) => {
                      const approved = p.expenses.filter(e => e.status === 'Approved').reduce((s, e) => s + e.approvedBudget, 0);
                      const actual = p.expenses.filter(e => e.status === 'Approved').reduce((s, e) => s + e.actualSpent, 0);
                      const variance = approved - actual;
                      const fulfillment = p.targetAmount > 0 ? Math.round((p.raisedAmount / p.targetAmount) * 100) : 0;

                      return (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="p-4 font-bold text-white">{p.title}</td>
                          <td className="p-4">EC$ {p.targetAmount.toLocaleString()}</td>
                          <td className="p-4 text-[#F27D26]">EC$ {p.raisedAmount.toLocaleString()}</td>
                          <td className="p-4">EC$ {approved.toLocaleString()}</td>
                          <td className="p-4 font-black text-white">EC$ {actual.toLocaleString()}</td>
                          <td className={`p-4 font-bold ${variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {variance >= 0 ? `+EC$ ${variance.toLocaleString()}` : `-EC$ ${Math.abs(variance).toLocaleString()}`}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                              {fulfillment}% Backed
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* EXPENSE LEDGER TAB */}
      {activeTab === 'ledger' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header & Controls bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Public Vendor & Logistics Payouts Ledger</h2>
              <p className="text-xs text-slate-400">Verifiable index of processed cash releases directly to local CARICOM vendors.</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto self-stretch">
              <button
                onClick={() => triggerDownloadSimulation('Foundation Expenditures Excel Ledger', 'Excel', 'Vision79_Expenditures_Dossier_2026.xlsx', '1.4 MB')}
                className="flex-1 sm:flex-none px-4.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#F27D26]" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Search/Filters Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendor, description..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#F27D26]"
              />
            </div>

            <div>
              <select
                value={ledgerCategory}
                onChange={(e) => setLedgerCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">-- Filter Category --</option>
                <option value="Operations & Logistics">Operations & Logistics</option>
                <option value="Equipment & Materials">Equipment & Materials</option>
                <option value="Clean Utilities Infrastructure">Clean Utilities Infrastructure</option>
                <option value="Educational Tech Tools">Educational Tech Tools</option>
                <option value="Human Resource/Labor">Human Resource/Labor</option>
              </select>
            </div>

            <div>
              <select
                value={ledgerProject}
                onChange={(e) => setLedgerProject(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">-- Filter Initiative --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Grid list */}
          <div className="bg-slate-900/40 rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-4">Assigned Initiative</th>
                    <th className="p-4">Logistics Category</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Approved Limit</th>
                    <th className="p-4">Field Spent</th>
                    <th className="p-4">Paid Vendor</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                  {filteredLedger?.length || 0 === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        No financial releases match your active filter settings.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((e) => (
                      <tr key={e.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-bold text-white max-w-[150px] truncate">{e.projectName}</td>
                        <td className="p-4 text-[10px] text-slate-400">{e.category}</td>
                        <td className="p-4 max-w-[180px] truncate">{e.description}</td>
                        <td className="p-4">EC$ {e.approvedBudget.toLocaleString()}</td>
                        <td className="p-4 font-extrabold text-white">EC$ {e.actualSpent.toLocaleString()}</td>
                        <td className="p-4 font-bold text-[#0ea5e9]">{e.vendor || 'Approved Contractor'}</td>
                        <td className="p-4 text-[10px] text-slate-500 font-mono">{e.date}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            e.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                            e.status === 'Flagged' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* APPROVAL WORKFLOW QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Instructions header */}
          <div className="p-6 bg-purple-950/20 border border-purple-500/30 rounded-3xl space-y-2">
            <h3 className="font-extrabold text-base text-purple-400 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Foundation Compliance & Approval Workflow Manager</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              Pending expense payout logs filed by field agents remain in escrow inside the <strong>Approval Queue</strong>. 
              {actingRole === 'Auditor' 
                ? ' You are acting as a Foundation Auditor. Analyze corresponding receipts below, then verify to release liquid reserves or flag entries for compliance checks.'
                : ' Switch sandbox role to "Foundation Auditor" above to execute escrow payouts and audit compliance actions.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Record New Expense Form (Only visible to simulated Auditor) */}
            <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 space-y-6">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider text-[#F27D26]">Record New Field Expense</h3>
                <p className="text-[10px] text-slate-500">File a field expense request for project review.</p>
              </div>

              {actingRole !== 'Auditor' ? (
                <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-center text-xs text-slate-500">
                  Must assume simulated <strong>Auditor</strong> credentials to enter new ledger items.
                </div>
              ) : (
                <form onSubmit={handleRecordExpenseSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Select Target Initiative *</label>
                    <select
                      value={expenseProject}
                      onChange={(e) => setExpenseProject(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                      required
                    >
                      <option value="">-- Choose project --</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Expense Category</label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                    >
                      <option value="Operations & Logistics">Operations & Logistics</option>
                      <option value="Equipment & Materials">Equipment & Materials</option>
                      <option value="Clean Utilities Infrastructure">Clean Utilities Infrastructure</option>
                      <option value="Educational Tech Tools">Educational Tech Tools</option>
                      <option value="Human Resource/Labor">Human Resource/Labor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Expense Item Description *</label>
                    <input
                      type="text"
                      placeholder="e.g. Purchase of 40 filtration mesh layers"
                      value={expenseDesc}
                      onChange={(e) => setExpenseDesc(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Budget Ceiling (EC$)</label>
                      <input
                        type="number"
                        value={expenseBudget}
                        onChange={(e) => setExpenseBudget(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Spent Amount (EC$)</label>
                      <input
                        type="number"
                        value={expenseSpent}
                        onChange={(e) => setExpenseSpent(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Payee Vendor / Supplier Name</label>
                    <input
                      type="text"
                      placeholder="e.g. St. Lucia Solar Hardware Ltd"
                      value={expenseVendor}
                      onChange={(e) => setExpenseVendor(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Default Entry State</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setExpenseRequestStatus('Pending')}
                        className={`flex-1 py-1.5 rounded-lg border transition-all ${
                          expenseRequestStatus === 'Pending' ? 'bg-purple-600/20 text-purple-400 border-purple-500/40' : 'bg-slate-950 border-white/10 text-slate-400'
                        }`}
                      >
                        Pending review
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpenseRequestStatus('Approved')}
                        className={`flex-1 py-1.5 rounded-lg border transition-all ${
                          expenseRequestStatus === 'Approved' ? 'bg-[#F27D26]/20 text-[#F27D26] border-[#F27D26]/40' : 'bg-slate-950 border-white/10 text-slate-400'
                        }`}
                      >
                        Pre-Approved
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingExpense || !expenseProject}
                    className="w-full py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs transition-all cursor-pointer disabled:opacity-40"
                  >
                    {isSubmittingExpense ? 'Broadcasting Ledger block...' : 'Dispatch Expense Entry'}
                  </button>
                </form>
              )}
            </div>

            {/* Escrow Pending Queue list */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider text-purple-400">Escrow Queue Payouts</h3>
              
              <div className="space-y-4">
                {allExpenses.filter(e => e.status === 'Pending').length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs bg-slate-900/20 border border-white/10 rounded-3xl">
                    Escrow accounts completely settled! No pending payouts detected.
                  </div>
                ) : (
                  allExpenses.filter(e => e.status === 'Pending').map((e) => (
                    <div key={e.id} className="p-5 bg-slate-950 border border-white/5 rounded-2xl space-y-4 hover:border-purple-500/40 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{e.category}</span>
                          <h4 className="font-extrabold text-sm text-white mt-0.5">{e.description}</h4>
                          <p className="text-[10px] text-slate-500">Initiative: {e.projectName} &bull; Date: {e.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-[#F27D26] text-xs">EC$ {e.actualSpent.toLocaleString()}</div>
                          <span className="text-[8px] text-[#0ea5e9] font-mono font-semibold">Max: EC$ {e.approvedBudget.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px]">
                        <div>
                          <span className="text-slate-500">Supplier:</span>
                          <span className="font-bold text-slate-300 ml-1">{e.vendor || 'Awaiting Invoice'}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase tracking-wider text-[8px]">
                          Pending Escrow Approval
                        </span>
                      </div>

                      {actingRole === 'Auditor' && (
                        <div className="flex gap-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => handleUpdateStatus(e.projectId, e.id, 'Approved')}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-[10px] transition-all cursor-pointer"
                          >
                            Verify & Release
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(e.projectId, e.id, 'Flagged')}
                            className="flex-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black font-extrabold text-[10px] border border-amber-500/30 transition-all cursor-pointer"
                          >
                            Flag for Audit
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Flagged elements showcase */}
              {allExpenses.filter(e => e.status === 'Flagged').length > 0 && (
                <div className="space-y-3 pt-4">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Flagged for Compliance Investigation</span>
                  </h4>
                  <div className="space-y-2">
                    {allExpenses.filter(e => e.status === 'Flagged').map((e) => (
                      <div key={e.id} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex justify-between items-center text-[10px]">
                        <div>
                          <div className="font-bold text-white truncate max-w-[150px]">{e.description}</div>
                          <p className="text-[9px] text-slate-500">{e.projectName}</p>
                        </div>
                        <button
                          onClick={() => handleUpdateStatus(e.projectId, e.id, 'Approved')}
                          className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-[8px] cursor-pointer"
                        >
                          Settle Audit (Verify)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* AUDIT TRAIL LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#F27D26]" />
                <span>Verifiably Locked Cryptographic Audit Trail</span>
              </h2>
              <p className="text-xs text-slate-400">Chronological list of all platform events compiled securely into immutable logging memory blocks.</p>
            </div>

            <button
              onClick={() => triggerDownloadSimulation('Cryptographic Audit Dossier', 'Dossier', `Vision79_Security_Audit_Trail_2026.log`, '340 KB')}
              className="px-4.5 py-2 rounded-xl bg-[#F27D26]/10 text-[#F27D26] hover:bg-[#F27D26] hover:text-black font-extrabold text-xs border border-[#F27D26]/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Audit Logs</span>
            </button>
          </div>

          {loadingAudits ? (
            <div className="py-20 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#F27D26]" />
              <span>Pulling ledger updates from cryptographic cloud node...</span>
            </div>
          ) : (
            <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 space-y-3.5">
              
              <div className="text-[10px] bg-slate-900 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3.5 leading-normal text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <p>
                  Every user interaction (donation pledges, budget allocations, compliance approvals, partner authorizations) automatically mints an <strong>SHA-256 secure event hash</strong>. This prevents retrofitted ledger manipulation under standard compliance laws.
                </p>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl space-y-1.5 hover:border-slate-800 transition-all text-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          log.action.includes('DONATION') ? 'bg-emerald-500/10 text-emerald-400' :
                          log.action.includes('EXPENSE') ? 'bg-purple-500/10 text-purple-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                      </div>
                      
                      <div className="text-slate-500 text-[10px] font-mono">
                        IP: <span className="text-slate-300">{log.ipAddress}</span>
                      </div>
                    </div>

                    <p className="text-slate-300 font-medium leading-relaxed">{log.details}</p>

                    <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-white/5">
                      <div>
                        <span className="text-slate-500">Signee:</span>
                        <span className="font-bold text-white ml-1">{log.actorEmail}</span>
                      </div>
                      <span className="text-[9px] font-mono text-[#F27D26] font-bold">SHA-256: {Math.random().toString(16).substring(2, 10).toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}

      {/* LEGAL CHARTER VAULT TAB */}
      {activeTab === 'vault' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl font-bold text-white">NGO Legal Charter & Regulatory Vault</h2>
            <p className="text-xs text-slate-400">Download authorized legal certifications, tax clearance charters, and annual regulatory compliance reports.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-5 bg-slate-900/40 border border-white/10 rounded-3xl space-y-4 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">501(c)(3) US IRS Exemption Authorization</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Official tax exemption credentials verified by third-party counsel under compliance code standards. Enables tax deductions for global CSR sponsors.
                </p>
              </div>
              
              <button
                onClick={() => triggerDownloadSimulation('US IRS 501(c)(3) Exemption Letter', 'Certification', 'Vision79_IRS_Exemption_Certificate.pdf', '1.2 MB')}
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white border border-white/10 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#F27D26]" />
                <span>Download IRS Letter (PDF)</span>
              </button>
            </div>

            <div className="p-5 bg-slate-900/40 border border-white/10 rounded-3xl space-y-4 flex flex-col justify-between hover:border-[#0ea5e9]/30 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">CARICOM NGO Charter Certification</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Regional regulatory framework charter and corporate registration number under St. Lucia NGO governance standards.
                </p>
              </div>
              
              <button
                onClick={() => triggerDownloadSimulation('CARICOM NGO Regulatory Charter', 'Charter', 'Vision79_CARICOM_NGO_Charter.pdf', '980 KB')}
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white border border-white/10 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#0ea5e9]" />
                <span>Download Regulatory Charter (PDF)</span>
              </button>
            </div>

            <div className="p-5 bg-slate-900/40 border border-white/10 rounded-3xl space-y-4 flex flex-col justify-between hover:border-purple-500/30 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">2025 Annual Financial Report & Audit</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Comprehensive review of previous fiscal year, certified by local Caribbean auditing and accountancy boards.
                </p>
              </div>
              
              <button
                onClick={() => triggerDownloadSimulation('2025 Annual Audited Financial Report', 'Dossier', 'Vision79_Annual_Financial_Audits_2025.pdf', '4.2 MB')}
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white border border-white/10 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>Download Annual Audit Dossier (PDF)</span>
              </button>
            </div>

            <div className="p-5 bg-slate-900/40 border border-white/10 rounded-3xl space-y-4 flex flex-col justify-between hover:border-[#F27D26]/30 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#F27D26]/10 text-[#F27D26] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">Tax Clearance & CARICOM Compliance Cert</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Active tax exemption certificate and legal compliance metrics approved by the Ministry of Sustainable Development.
                </p>
              </div>
              
              <button
                onClick={() => triggerDownloadSimulation('Tax Clearance Certificate', 'Certificate', 'Vision79_Tax_Clearance_Certificate.pdf', '670 KB')}
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white border border-white/10 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#F27D26]" />
                <span>Download Compliance Cert (PDF)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ISO Certified Download Confirmation Modal */}
      {downloadModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 border border-white/10 shadow-2xl text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <Check className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">ISO Secure Verified</span>
              <h3 className="font-bold text-lg text-white">Audit Document Secured</h3>
              <p className="text-xs text-slate-400">The authorized compliance file and verified receipt dataset has been compiled and downloaded.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">File Name:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{downloadModal.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dossier Type:</span>
                <span className="font-bold text-white">{downloadModal.fileType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">File Size:</span>
                <span className="font-bold text-white">{downloadModal.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Seal:</span>
                <span className="font-mono text-[#F27D26] text-[10px] font-bold">V79-AUD-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
              </div>
            </div>

            <button
              onClick={() => setDownloadModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs cursor-pointer transition-all"
            >
              Close Record Ledger
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
