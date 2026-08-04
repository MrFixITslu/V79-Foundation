import React from 'react';
import { ShieldCheck, Award, Zap, CheckCircle2, FileText, FolderCheck, Clock, Users } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

interface ProposalTrustSummaryProps {
  proposerName: string;
  proposerUserId?: string;
}

export const ProposalTrustSummary: React.FC<ProposalTrustSummaryProps> = ({
  proposerName,
  proposerUserId,
}) => {
  const { userReputations } = useAppData();
  const rep = userReputations.find(
    (r) => r.userId === proposerUserId || r.userName.toLowerCase() === proposerName.toLowerCase()
  );

  if (!rep) {
    return (
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
        <span className="text-slate-600 font-medium">Proposer: {proposerName}</span>
        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Verified Community Proposer
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50/80 via-slate-50 to-emerald-50/80 p-4 rounded-2xl border border-indigo-100 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={rep.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={rep.userName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
          />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              {rep.userName}
              {rep.verified && (
                <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              )}
            </div>
            <div className="text-xs text-indigo-700 font-semibold">{rep.levelTitle}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono font-black text-slate-900 text-sm">{rep.score} Points</div>
          <div className="text-[10px] text-slate-500 font-medium">Trust Score Verified</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1 border-t border-slate-200/60">
        <div className="bg-white/80 p-1.5 rounded-lg border border-slate-200/80">
          <div className="font-bold text-slate-800">{rep.projectsSupportedCount}</div>
          <div className="text-slate-500 text-[10px]">Projects Done</div>
        </div>
        <div className="bg-white/80 p-1.5 rounded-lg border border-slate-200/80">
          <div className="font-bold text-slate-800">{rep.volunteerHours} hrs</div>
          <div className="text-slate-500 text-[10px]">Volunteer Time</div>
        </div>
        <div className="bg-white/80 p-1.5 rounded-lg border border-slate-200/80">
          <div className="font-bold text-slate-800">{rep.badges.length}</div>
          <div className="text-slate-500 text-[10px]">Badges Unlocked</div>
        </div>
      </div>
    </div>
  );
};
