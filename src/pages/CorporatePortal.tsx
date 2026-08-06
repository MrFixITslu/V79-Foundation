import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext.tsx';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  FileText, 
  CheckCircle2, 
  Heart, 
  Download, 
  Sparkles, 
  Briefcase, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  PlusCircle, 
  FileSpreadsheet, 
  Check, 
  DollarSign, 
  FileDown, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';
import { CorporateAccount, Project } from '../types.js';

export const CorporatePortal: React.FC = () => {
  const { 
    sponsors, 
    projects, 
    corporateAccounts, 
    sponsorshipPackages, 
    activeCorporateAccount, 
    setActiveCorporateAccountId, 
    registerCorporateAccount, 
    sponsorProjectAsCorporate, 
    fetchProjectMatches, 
    generateCorporateReport, 
    verifyCorporateAccount, 
    refreshCorporateData 
  } = useAppData();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'directory' | 'tiers' | 'register' | 'console'>('console');

  // Registration Form State
  const [companyName, setCompanyName] = useState('');
  const [businessReg, setBusinessReg] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Technology & Innovation');
  const [description, setDescription] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Education', 'Clean Water']);
  const [budgetMin, setBudgetMin] = useState(5000);
  const [budgetMax, setBudgetMax] = useState(25000);

  // Sponsorship State
  const [selectedProjectForSponsor, setSelectedProjectForSponsor] = useState('');
  const [sponsorAmount, setSponsorAmount] = useState(5000);
  const [sponsorNotes, setSponsorNotes] = useState('');
  const [isSponsoring, setIsSponsoring] = useState(false);

  // Smart Matching Recommendations State
  const [recommendedMatches, setRecommendedMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Report Generation Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<'Sponsorship Report' | 'Impact Report' | 'Contribution Report' | 'CSR Compliance Report'>('CSR Compliance Report');
  const [reportPeriod, setReportPeriod] = useState('2026 Q3');
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Download simulation dialogs
  const [downloadModal, setDownloadModal] = useState<{ isOpen: boolean; title: string; fileType: string; fileName: string; size: string } | null>(null);

  // Load matches when active account or console tab changes
  useEffect(() => {
    if (activeCorporateAccount && activeTab === 'console') {
      setLoadingMatches(true);
      fetchProjectMatches(activeCorporateAccount.id)
        .then(res => {
          setRecommendedMatches(res || []);
          setLoadingMatches(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingMatches(false);
        });
    }
  }, [activeCorporateAccount, activeTab, fetchProjectMatches]);

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const logoUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
    const data = {
      companyName,
      businessRegistrationNumber: businessReg,
      contactPerson,
      email,
      phone,
      address,
      website,
      industry,
      logo: logoUrl,
      companyDescription: description,
      corporateInterests: selectedInterests,
      budgetMin,
      budgetMax,
      tier: budgetMax >= 25000 ? 'Platinum Sponsor' : budgetMax >= 10000 ? 'Gold Sponsor' : 'Silver Sponsor'
    };

    const newAcc = await registerCorporateAccount(data);
    if (newAcc) {
      // Reset form
      setCompanyName('');
      setBusinessReg('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setAddress('');
      setWebsite('');
      setDescription('');
      // Swap to Console to view their new account
      setActiveTab('console');
    }
  };

  const handleDirectSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCorporateAccount) return;
    if (!selectedProjectForSponsor || sponsorAmount <= 0) {
      alert('Please select a project and enter a valid sponsorship amount.');
      return;
    }

    setIsSponsoring(true);
    const success = await sponsorProjectAsCorporate(
      activeCorporateAccount.id,
      selectedProjectForSponsor,
      sponsorAmount,
      sponsorNotes
    );
    setIsSponsoring(false);
    if (success) {
      setSelectedProjectForSponsor('');
      setSponsorNotes('');
    }
  };

  const handleOneClickSponsor = async (projectId: string, amount: number) => {
    if (!activeCorporateAccount) return;
    setIsSponsoring(true);
    const success = await sponsorProjectAsCorporate(
      activeCorporateAccount.id,
      projectId,
      amount,
      `Smart Recommended Match Contribution based on our CSR industry profile.`
    );
    setIsSponsoring(false);
  };

  const handleCreateReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCorporateAccount) return;
    setIsGeneratingReport(true);
    
    const title = reportTitle || `${activeCorporateAccount.companyName} - ${reportPeriod} ${reportType}`;
    const report = await generateCorporateReport(activeCorporateAccount.id, title, reportType, reportPeriod);
    if (report) {
      setGeneratedReport(report);
      setReportTitle('');
    }
    setIsGeneratingReport(false);
  };

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
      
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F27D26]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0ea5e9]/10 rounded-full blur-3xl"></div>
        
        <div className="relative space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26] uppercase tracking-widest">
            <Building2 className="w-4 h-4" />
            <span>B2B CSR Compliance & Corporate Sponsorships</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Corporate CSR Partner Portal</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Directly connect your corporate CSR budget with active, audited projects in St. Lucia & the Grenadines. 
            Claim your business profile, request tax exemptions, smart-match your industry focus, and generate compliance reports instantly.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'register' ? 'bg-[#F27D26] text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Enroll Business Account
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'console' ? 'bg-[#0ea5e9] text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Partner B2B Console
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('console')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'console'
              ? 'border-[#0ea5e9] text-[#0ea5e9]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Partner B2B Console</span>
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'directory'
              ? 'border-[#F27D26] text-[#F27D26]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Partners Wall & Directory</span>
        </button>
        <button
          onClick={() => setActiveTab('tiers')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'tiers'
              ? 'border-[#F27D26] text-[#F27D26]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Sponsorship Packages</span>
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'register'
              ? 'border-[#F27D26] text-[#F27D26]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Corporate Account</span>
        </button>
      </div>

      {/* Directory Tab */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Corporate Partners Wall & Directory</h2>
            <p className="text-xs text-slate-400">Public list of verified businesses contributing to local sustainable development goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {corporateAccounts.map((account) => (
              <div key={account.id} className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 space-y-4 hover:border-slate-700 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={account.logo} alt={account.companyName} className="w-12 h-12 rounded-xl object-cover bg-white" />
                    <div>
                      <h3 className="font-extrabold text-base text-white">{account.companyName}</h3>
                      <p className="text-[10px] text-[#0ea5e9] font-bold">{account.industry}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    account.verificationStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {account.verificationStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{account.companyDescription || 'No description provided.'}</p>

                <div className="space-y-1.5 pt-3 border-t border-white/5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Partnership Tier:</span>
                    <span className="font-bold text-white">{account.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Contribution:</span>
                    <span className="font-bold text-[#F27D26]">EC$ {account.totalContributed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interests Supported:</span>
                    <span className="font-bold text-slate-200">{account.corporateInterests.join(', ')}</span>
                  </div>
                </div>

                {account.verificationStatus === 'Pending Verification' && (
                  <div className="pt-2">
                    <button
                      onClick={async () => {
                        await verifyCorporateAccount(account.id, 'Verified');
                      }}
                      className="w-full py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black font-bold text-[10px] border border-emerald-500/30 transition-all cursor-pointer"
                    >
                      Verify as Foundation Admin
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sponsorship Packages Tab */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Sponsorship Tiers & Corporate Benefits Guide</h2>
            <p className="text-xs text-slate-400">Align with standardized giving tiers with specific marketing, operations, and reporting SLAs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsorshipPackages.map((pkg) => (
              <div key={pkg.id} className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 space-y-4 hover:border-[#F27D26]/40 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black tracking-widest uppercase text-[#F27D26]">{pkg.name}</span>
                    <div className="text-xl font-black text-white">EC$ {pkg.minContribution.toLocaleString()}+</div>
                  </div>
                  
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    Requirement: <span className="text-slate-400 font-normal">{pkg.contributionRequirements}</span>
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-bold text-white">Recognition & Marketing Benefits:</div>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {pkg.recognitionBenefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#0ea5e9] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                      {pkg.marketingBenefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-bold text-white">Operations & Compliance Disclosures:</div>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {pkg.projectAccess.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#F27D26] shrink-0 mt-0.5" />
                          <span>Project Access: {b}</span>
                        </li>
                      ))}
                      {pkg.reportingBenefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>Reporting: {b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('register');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs mt-6 transition-all cursor-pointer"
                >
                  Onboard Under This Package
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Register Tab */}
      {activeTab === 'register' && (
        <div className="bg-slate-900/20 rounded-3xl p-6 sm:p-8 border border-white/10 max-w-2xl mx-auto space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#F27D26]" />
              <span>Enroll Corporate CSR Partner Account</span>
            </h2>
            <p className="text-xs text-slate-400">Provide legal registration metrics to verify tax deduction certificates under CARICOM and US 501(c)(3) standards.</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Company legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Renewable Energy Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#F27D26]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Business Registration Number *</label>
                <input
                  type="text"
                  placeholder="e.g. SLU-CORP-10294"
                  value={businessReg}
                  onChange={(e) => setBusinessReg(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#F27D26]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sandra Jules"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#F27D26]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. sandra@apexenergy.lc"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#F27D26]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (758) 452-1234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#F27D26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Company Website</label>
                <input
                  type="url"
                  placeholder="e.g. https://apexenergy.lc"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#F27D26]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Business Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F27D26]"
                >
                  <option value="Technology & Innovation">Technology & Innovation</option>
                  <option value="Clean Energy & Infrastructure">Clean Energy & Infrastructure</option>
                  <option value="Tourism & Eco-Hospitality">Tourism & Eco-Hospitality</option>
                  <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                  <option value="Banking & Finance">Banking & Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Headquarters Location Address</label>
                <input
                  type="text"
                  placeholder="e.g. Castries, St. Lucia"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#F27D26]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company CSR Vision & Description</label>
              <textarea
                rows={3}
                placeholder="Brief description of your corporate responsibility parameters..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#F27D26]"
              />
            </div>

            {/* Target Interests Checklist */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">CSR Target Fields of Interest *</label>
              <div className="flex flex-wrap gap-2">
                {['Education', 'Clean Water', 'Renewable Energy', 'Healthcare', 'Youth Development'].map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                        active 
                          ? 'bg-[#F27D26]/20 text-[#F27D26] border-[#F27D26]/40' 
                          : 'bg-slate-950 text-slate-400 border-white/10 hover:border-slate-700'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Budget Allocation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Min CSR Annual Budget (EC$)</label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F27D26]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Max CSR Annual Budget (EC$)</label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F27D26]"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs transition-all cursor-pointer"
              >
                Submit Corporate Enrollment Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partner B2B Console Tab */}
      {activeTab === 'console' && (
        <div className="space-y-8">
          
          {/* Account Selector Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#0ea5e9]/10 text-[#0ea5e9]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Acting Corporate Identity</div>
                <div className="text-xs font-bold text-white">Select a simulated partner to explore dashboards</div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={activeCorporateAccount ? activeCorporateAccount.id : ''}
                onChange={(e) => setActiveCorporateAccountId(e.target.value)}
                className="p-2 px-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0ea5e9] w-full sm:w-56 cursor-pointer"
              >
                {corporateAccounts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.verificationStatus === 'Verified' ? 'Verified' : 'Pending'})
                  </option>
                ))}
              </select>
              
              <button
                onClick={async () => {
                  setLoadingMatches(true);
                  await refreshCorporateData();
                  setLoadingMatches(false);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer transition-all"
                title="Synchronize Database Ledger"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activeCorporateAccount ? (
            <div className="space-y-8">
              
              {/* Top Scorecard & Status Alert */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Status card */}
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Partner Verification Status</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        activeCorporateAccount.verificationStatus === 'Verified' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}></span>
                      <h4 className="font-extrabold text-base text-white">{activeCorporateAccount.verificationStatus}</h4>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {activeCorporateAccount.verificationStatus === 'Verified' 
                      ? 'Corporate account has been fully trans-audited and qualified for caricom tax deductions.' 
                      : 'Enrollment files are being analyzed by Vision79 Compliance Director.'}
                  </p>
                </div>

                {/* Contribution Metric */}
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Total CSR Funds Contributed</span>
                  <div className="text-2xl font-black text-[#F27D26]">EC$ {activeCorporateAccount.totalContributed.toLocaleString()}</div>
                  <p className="text-[10px] text-slate-400">100% of capital assigned direct in field with no administrative drag.</p>
                </div>

                {/* Projects Metric */}
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Sponsored Projects Backed</span>
                  <div className="text-2xl font-black text-white">{activeCorporateAccount.sponsoredProjects.length} Projects</div>
                  <p className="text-[10px] text-slate-400">Supporting renewable utilities and regional education literacy.</p>
                </div>

                {/* Perks Metric */}
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Membership Level & Tier</span>
                  <div className="text-lg font-black text-[#0ea5e9] truncate">{activeCorporateAccount.tier}</div>
                  <p className="text-[10px] text-slate-400">CSR compliance benefits and on-site sponsor branding active.</p>
                </div>

              </div>

              {/* Two-Column Midsection: Matching & Sponsorship */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* SMART PROJECT MATCHING ENGINE */}
                <div className="bg-slate-900/20 rounded-3xl p-6 border border-white/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#F27D26]" />
                        <span>Sponsor Project Smart Match Recommendation</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Tailored alignments computed via industry relevance, local feasibility indices, and CSR focus.</p>
                    </div>
                  </div>

                  {loadingMatches ? (
                    <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#F27D26]" />
                      <span>Computing recommendation scoring matrices...</span>
                    </div>
                  ) : recommendedMatches.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-slate-400 text-xs">
                      No matching recommendations found.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recommendedMatches.slice(0, 3).map((match, idx) => {
                        const proj: Project = match.project;
                        return (
                          <div key={proj.id} className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3 hover:border-[#0ea5e9]/55 transition-all">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] font-extrabold text-[#0ea5e9] uppercase tracking-wider">{proj.category}</span>
                                <h4 className="font-bold text-sm text-white mt-0.5">{proj.title}</h4>
                              </div>
                              <div className="px-2 py-1 rounded bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 font-black text-xs flex items-center gap-1">
                                <span>{match.matchScore}%</span>
                                <span className="text-[9px] font-normal">Match</span>
                              </div>
                            </div>

                            {/* Reasons bullet list */}
                            <ul className="space-y-1 text-[11px] text-slate-400">
                              {match.reasons.map((r: string, rIdx: number) => (
                                <li key={rIdx} className="flex items-start gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="flex items-center justify-between pt-1 text-[11px]">
                              <div>
                                <span className="text-slate-500">Fundraising Gap:</span>
                                <span className="font-bold text-white ml-1">EC$ {(proj.targetAmount - proj.raisedAmount).toLocaleString()}</span>
                              </div>
                              <button
                                onClick={() => handleOneClickSponsor(proj.id, match.suggestedSponsorshipAmount)}
                                disabled={isSponsoring}
                                className="px-3 py-1.5 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
                              >
                                <TrendingUp className="w-3 h-3" />
                                <span>Back Recommendation (${match.suggestedSponsorshipAmount.toLocaleString()})</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* DIRECT PROJECT SPONSORSHIP FORM */}
                <div className="bg-slate-900/20 rounded-3xl p-6 border border-white/10 space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-[#0ea5e9]" />
                      <span>Direct Corporate Sponsorship & Grants Form</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">Sponsor an active project, pledge direct capital, and request instant compliance certificates.</p>
                  </div>

                  <form onSubmit={handleDirectSponsorSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Select Target Project *</label>
                      <select
                        value={selectedProjectForSponsor}
                        onChange={(e) => setSelectedProjectForSponsor(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
                        required
                      >
                        <option value="">-- Choose active initiative --</option>
                        {projects.filter(p => p.status === 'Fundraising' || p.status === 'Active').map(p => (
                          <option key={p.id} value={p.id}>
                            {p.title} (Goal: EC${p.targetAmount.toLocaleString()} / Raised: EC${p.raisedAmount.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Sponsorship Grant Amount (EC$)*</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-slate-500" />
                        </div>
                        <input
                          type="number"
                          value={sponsorAmount}
                          onChange={(e) => setSponsorAmount(Number(e.target.value))}
                          className="w-full pl-8 p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0ea5e9]"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Contribution Memo & Impact Notes</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. CSR allocation targeting rural water filter field implementation."
                        value={sponsorNotes}
                        onChange={(e) => setSponsorNotes(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#0ea5e9]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSponsoring || !selectedProjectForSponsor}
                      className="w-full py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                    >
                      <Award className="w-4 h-4" />
                      <span>{isSponsoring ? 'Sponsoring in field...' : 'Execute Project Sponsorship Grant'}</span>
                    </button>
                  </form>
                </div>

              </div>

              {/* REPORT GENERATION & COMPLIANCE SYSTEM */}
              <div className="bg-slate-900/20 rounded-3xl p-6 border border-white/10 space-y-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <span>CSR Compliance & Impact Report Generator</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Generate instantly verifiable ESG and CSR reporting disclosures certified for corporate board filings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Setup report form */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-4">
                    <div className="text-xs font-bold text-white border-b border-white/10 pb-1.5">Configure Disclosure Parameters</div>
                    <form onSubmit={handleCreateReportSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">Custom Report Title</label>
                        <input
                          type="text"
                          placeholder="e.g. 2026 Sustainable Clean Water Impact Report"
                          value={reportTitle}
                          onChange={(e) => setReportTitle(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#0ea5e9]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">Report Framework Type</label>
                        <select
                          value={reportType}
                          onChange={(e) => setReportType(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
                        >
                          <option value="CSR Compliance Report">CSR Compliance (ESG) Report</option>
                          <option value="Impact Report">Beneficiary Impact Report</option>
                          <option value="Sponsorship Report">Financial Sponsor Summary</option>
                          <option value="Contribution Report">Donor Contribution Ledger</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">Reporting Period</label>
                        <input
                          type="text"
                          value={reportPeriod}
                          onChange={(e) => setReportPeriod(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-[#fff]/10 text-white text-xs focus:outline-none focus:border-[#0ea5e9]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isGeneratingReport}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all cursor-pointer disabled:opacity-40"
                      >
                        {isGeneratingReport ? 'Compiling CSR Disclosures...' : 'Generate Compliance Dossier'}
                      </button>
                    </form>
                  </div>

                  {/* Generated Report Output Screen */}
                  <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-4">
                    {generatedReport ? (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
                          <div>
                            <span className="text-[9px] font-black tracking-widest text-purple-400 uppercase">{generatedReport.reportType}</span>
                            <h4 className="font-black text-sm text-white">{generatedReport.title}</h4>
                            <p className="text-[10px] text-slate-500">Period: {generatedReport.period} &bull; Compiled: {generatedReport.generatedDate}</p>
                          </div>
                          
                          <div className="flex gap-1.5 self-start sm:self-center">
                            <button
                              onClick={() => triggerDownloadSimulation(generatedReport.title, 'PDF', `${generatedReport.reportType.replace(/ /g, '_')}_${generatedReport.period}.pdf`, '2.4 MB')}
                              className="p-2 rounded-lg bg-[#F27D26]/10 text-[#F27D26] hover:bg-[#F27D26] hover:text-black border border-[#F27D26]/20 transition-all flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                              title="Download ISO PDF Report"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              <span>PDF</span>
                            </button>
                            <button
                              onClick={() => triggerDownloadSimulation(generatedReport.title, 'Excel', `${generatedReport.reportType.replace(/ /g, '_')}_${generatedReport.period}.xlsx`, '780 KB')}
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/20 transition-all flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                              title="Download Excel Ledger"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                              <span>Excel</span>
                            </button>
                          </div>
                        </div>

                        {/* Summary Block */}
                        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-300 leading-relaxed font-semibold">
                          <span className="text-purple-400 font-extrabold mr-1">Auditor Statement:</span>
                          {generatedReport.summary}
                        </div>

                        {/* Metrics Table */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-xs text-slate-400 font-bold uppercase">Allocated</div>
                            <div className="text-sm font-black text-[#F27D26] mt-0.5">EC$ {generatedReport.totalContribution.toLocaleString()}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-xs text-slate-400 font-bold uppercase">Initiatives</div>
                            <div className="text-sm font-black text-white mt-0.5">{generatedReport.projectsCount}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-xs text-slate-400 font-bold uppercase">Beneficiaries</div>
                            <div className="text-sm font-black text-white mt-0.5">{generatedReport.beneficiariesReached.toLocaleString()}</div>
                          </div>
                        </div>

                        {/* Key Disclosures */}
                        <div className="space-y-1.5 pt-2">
                          <div className="text-[10px] font-extrabold text-slate-300 uppercase">Executive Compliance Disclosures:</div>
                          <ul className="space-y-1.5 text-xs text-slate-400">
                            {generatedReport.executiveKeyTakeaways?.map((takeaway: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                        <FileText className="w-8 h-8 text-slate-700" />
                        <div className="text-xs font-bold text-white">No active CSR Report generated</div>
                        <p className="text-[10px] text-slate-600 max-w-sm">Use the configuration manager on the left to pull real-time database ledger updates and generate an official CARICOM-ESG compliance dossier.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Two-Column Bottomsection: History & Files */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* SPONSORED PROJECT LOGS */}
                <div className="bg-slate-900/20 rounded-3xl p-6 border border-white/10 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-white">Initiative Giving History</h3>
                    <p className="text-[11px] text-slate-400">Real-time ledger entries of corporate contributions backed by verified receipts.</p>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {activeCorporateAccount.sponsoredProjects.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center text-slate-400 text-xs">
                        No giving logs recorded yet. Support an active initiative above.
                      </div>
                    ) : (
                      activeCorporateAccount.sponsoredProjects?.map((backed, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs hover:border-[#F27D26]/40 transition-all">
                          <div className="space-y-1">
                            <h4 className="font-bold text-white">{backed.projectName}</h4>
                            <p className="text-[10px] text-slate-400 leading-normal">{backed.impactMetricText}</p>
                            <span className="text-[9px] text-slate-500 font-semibold uppercase">{backed.date}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-black text-[#F27D26]">EC$ {backed.amountContributed.toLocaleString()}</div>
                            <span className="text-[9px] text-emerald-400 font-bold uppercase">{backed.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* DOCUMENTS & CO-BRANDING ASSETS */}
                <div className="bg-slate-900/20 rounded-3xl p-6 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-white">Documents & Certificates Vault</h3>
                      <p className="text-[11px] text-slate-400 font-normal">Pre-verified legal files, MoU drafts, and 501(c)(3) tax receipt documents.</p>
                    </div>
                    <button
                      onClick={() => triggerDownloadSimulation('Contribution History Export', 'CSV', 'CSR_Contributions_Ledger.csv', '22 KB')}
                      className="text-xs font-bold text-[#0ea5e9] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV Export</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeCorporateAccount.documents?.map((doc) => (
                      <div key={doc.id} className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs hover:border-slate-800 transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-[#F27D26]/10 text-[#F27D26]">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white line-clamp-1">{doc.title}</div>
                            <div className="text-[10px] text-slate-500">{doc.type} &bull; {doc.size}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => triggerDownloadSimulation(doc.title, 'PDF/Asset', doc.title.replace(/ /g, '_') + '.pdf', doc.size)}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Active Perks List */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-white">Verified Account CSR Perks Status:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                      {activeCorporateAccount.benefits?.map((benefit, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-start gap-1.5">
                          <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            benefit.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'
                          }`} />
                          <div>
                            <div className="font-bold text-white">{benefit.name}</div>
                            <div className="text-slate-500">{benefit.details}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs">
              Loading active corporate database profiles...
            </div>
          )}

        </div>
      )}

      {/* Download Confirmation Modal */}
      {downloadModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 border border-white/10 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <Check className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">ISO Secure Certified</span>
              <h3 className="font-bold text-lg text-white">Download Dispatched</h3>
              <p className="text-xs text-slate-400">Your secure CARICOM / 501(c)(3) tax receipt & audit document has been downloaded.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">File Name:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{downloadModal.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">File Type:</span>
                <span className="font-bold text-white">{downloadModal.fileType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">File Size:</span>
                <span className="font-bold text-white">{downloadModal.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Serial Key:</span>
                <span className="font-mono text-[#F27D26] text-[10px] font-bold">V79-CSR-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
              </div>
            </div>

            <button
              onClick={() => setDownloadModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs cursor-pointer transition-all"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
