import React, { useState } from 'react';
import { Project } from '../types.js';
import { useAppData } from '../context/AppDataContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { FeasibilityScorecardModal } from './FeasibilityScorecardModal.tsx';
import {
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Award,
  Users,
  Clock,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  BarChart2,
} from 'lucide-react';

interface CommunityConfidenceMeterProps {
  project: Project;
}

export const CommunityConfidenceMeter: React.FC<CommunityConfidenceMeterProps> = ({ project }) => {
  const { refreshAll } = useAppData();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [showScorecard, setShowScorecard] = useState(false);
  const [voting, setVoting] = useState(false);

  const votes = project.communityVotes || { upvotes: 120, downvotes: 5 };
  const totalVotes = votes.upvotes + votes.downvotes;
  const upvotePercent = totalVotes > 0 ? Math.round((votes.upvotes / totalVotes) * 100) : 100;

  const assessment = project.feasibilityAssessment || {
    overallScore: 88,
    readinessLabel: '88% Ready',
  };

  const handleVote = async (type: 'up' | 'down') => {
    setVoting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: type, userEmail: user?.email }),
      });
      if (res.ok) {
        showToast(type === 'up' ? 'Voted in favor of proposal!' : 'Downvote recorded', 'info');
        await refreshAll();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to record vote', 'error');
    } finally {
      setVoting(false);
    }
  };

  return (
    <>
      <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 space-y-6 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Community Confidence Meter</h3>
              <p className="text-[11px] text-white/50">Community consensus & AI feasibility score</p>
            </div>
          </div>

          <button
            onClick={() => setShowScorecard(true)}
            className="px-3.5 py-1.5 rounded-full bg-[#F27D26]/10 hover:bg-[#F27D26]/20 border border-[#F27D26]/30 text-[#F27D26] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scorecard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Voting & Score Pill Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Feasibility Score Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-white/40 uppercase">AI Feasibility Score</span>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-black text-[#F27D26]">{assessment.overallScore}%</span>
              <span className="text-[10px] font-bold text-emerald-400">{assessment.readinessLabel}</span>
            </div>
          </div>

          {/* Upvote Ratio Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-white/40 uppercase">Community Approval</span>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-black text-emerald-400">{upvotePercent}%</span>
              <span className="text-[10px] font-bold text-white/50">({totalVotes} votes)</span>
            </div>
          </div>

        </div>

        {/* Key Indicators Grid */}
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
              <Award className="w-4 h-4 text-[#F27D26]" />
              <span>Estimated Impact Rating:</span>
            </div>
            <span className="font-extrabold text-white">{project.estimatedImpactRating || 'High Transformation'}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
              <Users className="w-4 h-4 text-[#F27D26]" />
              <span>Direct Beneficiaries:</span>
            </div>
            <span className="font-extrabold text-white">{project.beneficiariesCount.toLocaleString()} people</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="w-4 h-4 text-[#F27D26]" />
              <span>Est. Volunteer Field Hours:</span>
            </div>
            <span className="font-extrabold text-white">{project.estimatedVolunteerHours || 120} hrs</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
              <TrendingUp className="w-4 h-4 text-[#F27D26]" />
              <span>Funding Confidence Rating:</span>
            </div>
            <span className="font-extrabold text-emerald-400">{project.fundingConfidenceRating || 88}% High Confidence</span>
          </div>
        </div>

        {/* Community Interactive Voting Bar */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white/70">Cast Your Community Vote</span>
            <span className="text-[10px] text-white/40">Advisory voting for Foundation review</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleVote('up')}
              disabled={voting}
              className="flex-1 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Upvote ({votes.upvotes})</span>
            </button>

            <button
              onClick={() => handleVote('down')}
              disabled={voting}
              className="flex-1 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>Downvote ({votes.downvotes})</span>
            </button>
          </div>
        </div>

      </div>

      {/* Scorecard Modal */}
      {showScorecard && (
        <FeasibilityScorecardModal project={project} onClose={() => setShowScorecard(false)} />
      )}
    </>
  );
};
