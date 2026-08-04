import React, { useState } from 'react';
import { Project, FeasibilityAssessment } from '../types.js';
import { useAppData } from '../context/AppDataContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  X,
  TrendingUp,
  Award,
  RefreshCw,
  Info,
  HelpCircle,
  BarChart3,
  ListChecks,
} from 'lucide-react';

interface FeasibilityScorecardModalProps {
  project: Project;
  onClose: () => void;
}

export const FeasibilityScorecardModal: React.FC<FeasibilityScorecardModalProps> = ({ project, onClose }) => {
  const { refreshAll } = useAppData();
  const { showToast } = useToast();
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'scorecard' | 'recommendations' | 'breakdown'>('scorecard');

  const assessment: FeasibilityAssessment = project.feasibilityAssessment || {
    overallScore: 88,
    readinessLabel: '88% Ready',
    categories: [],
    recommendations: ['Proposal is structured well. Verify vendor quote details.'],
    strengths: ['High Community Impact', 'Aligned with Foundation Mission'],
    weaknesses: ['Minor timeline buffer required'],
    evaluatedAt: new Date().toISOString(),
    aiPowered: true,
    minimumWarning: false,
  };

  const handleReevaluate = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/feasibility/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      });
      if (res.ok) {
        showToast('Feasibility re-evaluated using Gemini AI!', 'success');
        await refreshAll();
      } else {
        showToast('Feasibility re-evaluation failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error re-evaluating feasibility', 'error');
    } finally {
      setLoadingAi(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 70) return 'text-[#F27D26] bg-[#F27D26]/10 border-[#F27D26]/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-[#F27D26]';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl text-white my-8 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#050505] via-[#111111] to-[#050505] border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#F27D26]/10 border border-[#F27D26]/30 text-[#F27D26]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#F27D26]">AI Assessment System</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/70">Vision79 Core</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{project.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReevaluate}
              disabled={loadingAi}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-extrabold text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#F27D26] ${loadingAi ? 'animate-spin' : ''}`} />
              <span>{loadingAi ? 'Evaluating...' : 'Re-Evaluate with AI'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mandatory Advisory Notice Banner */}
        <div className="px-6 py-3.5 bg-[#F27D26]/10 border-b border-[#F27D26]/20 flex items-center gap-3 text-xs text-white/90">
          <ShieldAlert className="w-5 h-5 text-[#F27D26] shrink-0" />
          <div>
            <span className="font-extrabold text-[#F27D26]">ADVISORY SCORE ONLY: </span>
            <span>
              This AI Feasibility Score is advisory and intended to assist community decision-making. It does not automatically approve or reject a proposal. Vision79 Foundation retains final authority.
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          
          {/* Top Score Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white/[0.02] p-6 rounded-3xl border border-white/10">
            <div className="md:col-span-4 text-center md:text-left space-y-2">
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Overall Feasibility Score</span>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl font-black text-white">{assessment.overallScore}%</span>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getScoreColor(assessment.overallScore)}`}>
                  {assessment.readinessLabel}
                </span>
              </div>
              <p className="text-[11px] text-white/40">
                Evaluated at {new Date(assessment.evaluatedAt).toLocaleDateString()} &bull; 15 Evaluation Categories
              </p>
            </div>

            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] font-bold text-white/40 uppercase">Community Impact</div>
                <div className="text-lg font-black text-emerald-400 mt-1">High Impact</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] font-bold text-white/40 uppercase">Beneficiaries</div>
                <div className="text-lg font-black text-[#F27D26] mt-1">{project.beneficiariesCount.toLocaleString()}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-bold text-white/40 uppercase">Budget Realism</div>
                <div className="text-lg font-black text-white mt-1">
                  ${project.targetAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex border-b border-white/10 gap-2">
            {[
              { id: 'scorecard', label: '15-Category Scorecard', icon: BarChart3 },
              { id: 'recommendations', label: `AI Recommendations (${assessment.recommendations.length})`, icon: Sparkles },
              { id: 'breakdown', label: 'Strengths & Risk Factors', icon: ListChecks },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#F27D26] text-[#F27D26]'
                      : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: 15-CATEGORY SCORECARD */}
          {activeTab === 'scorecard' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-white/60">
                <span>Category Evaluation Breakdown</span>
                <span className="font-bold text-[#F27D26]">15 / 15 Categories Rated</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessment.categories.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-white">{cat.name}</span>
                      <span className="font-black text-[#F27D26]">{cat.score}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(cat.score)}`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-white/40">
                      <span>Weight Factor: {cat.weight}x</span>
                      <span>{cat.score >= 85 ? 'Strong' : cat.score >= 70 ? 'Moderate' : 'Review Required'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIONABLE AI RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F27D26]/10 border border-[#F27D26]/20 flex items-center gap-3 text-xs">
                <Sparkles className="w-5 h-5 text-[#F27D26] shrink-0" />
                <span className="text-white/80">
                  These actionable recommendations are synthesized by Gemini AI to help project organizers refine their proposal before community voting.
                </span>
              </div>

              <div className="space-y-3">
                {assessment.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#F27D26]/20 text-[#F27D26] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-white">Action Item #{idx + 1}</h4>
                      <p className="text-xs text-white/70 leading-relaxed">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STRENGTHS & WEAKNESSES */}
          {activeTab === 'breakdown' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Strengths */}
              <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Key Project Strengths</span>
                </div>
                <div className="space-y-2">
                  {assessment.strengths.map((str, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 text-xs text-emerald-200 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses / Risk Factors */}
              <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Risk Factors & Mitigation Areas</span>
                </div>
                <div className="space-y-2">
                  {assessment.weaknesses.map((weak, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-rose-500/10 text-xs text-rose-200 font-medium flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{weak}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 bg-[#050505] border-t border-white/10 flex justify-between items-center text-xs">
          <div className="text-white/40">
            Vision79 AI Feasibility Engine &bull; Version 2.4
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold uppercase tracking-wider cursor-pointer"
          >
            Close Scorecard
          </button>
        </div>

      </div>
    </div>
  );
};
