import React from 'react';
import { ShieldCheck, Award, Zap, Heart, Crown, CheckCircle2, Medal } from 'lucide-react';
import { UserReputation } from '../../types';

interface TrustBadgeProps {
  userReputation?: Partial<UserReputation>;
  userName?: string;
  userLevelTitle?: string;
  userScore?: number;
  verified?: boolean;
  trustIndicators?: string[];
  size?: 'sm' | 'md' | 'lg';
  showIndicators?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  userReputation,
  userName = 'Community Member',
  userLevelTitle,
  userScore,
  verified = true,
  trustIndicators = ['Verified Member'],
  size = 'md',
  showIndicators = true,
}) => {
  const name = userReputation?.userName || userName;
  const levelTitle = userReputation?.levelTitle || userLevelTitle || 'Community Member';
  const score = userReputation?.score ?? userScore ?? 0;
  const isVerified = userReputation?.verified ?? verified;
  const indicators = userReputation?.trustIndicators || trustIndicators;

  const getLevelColor = (title: string) => {
    if (title.includes('Ambassador')) return 'from-emerald-500 to-teal-600 text-emerald-700 bg-emerald-50 border-emerald-200';
    if (title.includes('Builder')) return 'from-amber-500 to-orange-600 text-amber-700 bg-amber-50 border-amber-200';
    if (title.includes('Champion')) return 'from-purple-500 to-indigo-600 text-purple-700 bg-purple-50 border-purple-200';
    if (title.includes('Supporter')) return 'from-sky-500 to-blue-600 text-sky-700 bg-sky-50 border-sky-200';
    return 'from-slate-400 to-slate-600 text-slate-700 bg-slate-50 border-slate-200';
  };

  const getLevelIcon = (title: string) => {
    if (title.includes('Ambassador')) return <Crown className="w-3.5 h-3.5 text-emerald-600" />;
    if (title.includes('Builder')) return <Zap className="w-3.5 h-3.5 text-amber-600" />;
    if (title.includes('Champion')) return <Award className="w-3.5 h-3.5 text-purple-600" />;
    if (title.includes('Supporter')) return <Heart className="w-3.5 h-3.5 text-sky-600" />;
    return <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />;
  };

  const badgeStyle = getLevelColor(levelTitle);

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-1.5 flex-wrap text-xs">
        {isVerified && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200" title="Verified Member">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        )}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${badgeStyle}`}>
          {getLevelIcon(levelTitle)}
          {levelTitle}
        </span>
        <span className="text-slate-500 font-mono text-[11px]">({score} pts)</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-slate-900 text-sm flex items-center gap-1">
          {name}
          {isVerified && (
            <span title="Verified Member">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            </span>
          )}
        </span>

        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}>
          {getLevelIcon(levelTitle)}
          {levelTitle}
        </span>

        <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md font-mono font-medium">
          {score} Points
        </span>
      </div>

      {showIndicators && indicators.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-600">
          {indicators.map((ind, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
              <Medal className="w-3 h-3 text-amber-500" />
              {ind}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
