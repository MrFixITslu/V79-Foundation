import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle2, ShieldCheck, Award, ThumbsUp, Send } from 'lucide-react';
import { ProjectFeedback } from '../../types';
import { useAppData } from '../../context/AppDataContext';

interface ProjectFeedbackSectionProps {
  projectId: string;
  projectTitle: string;
  isCompleted?: boolean;
}

export const ProjectFeedbackSection: React.FC<ProjectFeedbackSectionProps> = ({
  projectId,
  projectTitle,
  isCompleted = true,
}) => {
  const { fetchProjectFeedback, submitProjectFeedback, currentUserReputation } = useAppData();
  const [feedbackData, setFeedbackData] = useState<{
    feedback: ProjectFeedback[];
    averageRating: number;
    reviewsCount: number;
    satisfactionScore: number;
  }>({
    feedback: [],
    averageRating: 0,
    reviewsCount: 0,
    satisfactionScore: 100,
  });

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form ratings
  const [impact, setImpact] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [transparency, setTransparency] = useState(5);
  const [execution, setExecution] = useState(5);
  const [communityBenefit, setCommunityBenefit] = useState(5);
  const [comment, setComment] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await fetchProjectFeedback(projectId);
    setFeedbackData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserReputation) return;

    setSubmitting(true);
    const ok = await submitProjectFeedback({
      projectId,
      projectTitle,
      userId: currentUserReputation.userId,
      userName: currentUserReputation.userName,
      userAvatar: currentUserReputation.avatar,
      userLevelTitle: currentUserReputation.levelTitle,
      ratings: {
        impact,
        communication,
        transparency,
        execution,
        communityBenefit,
      },
      comment,
    });

    setSubmitting(false);
    if (ok) {
      setShowForm(false);
      setComment('');
      loadData();
    }
  };

  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 ${
              s <= Math.round(score) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Post-Completion Verified Reviews
          </div>
          <h3 className="text-lg font-bold text-slate-900">Community Satisfaction & Feedback</h3>
        </div>

        {isCompleted && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
          >
            <Star className="w-4 h-4 fill-white/20" /> Write Community Review (+10 Pts)
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl font-black text-slate-900 flex items-center justify-center gap-1">
            {feedbackData.averageRating} <span className="text-sm font-normal text-slate-500">/ 5.0</span>
          </div>
          <div className="flex justify-center my-1">{renderStars(feedbackData.averageRating)}</div>
          <div className="text-xs text-slate-500 font-medium">{feedbackData.reviewsCount} Verified Reviews</div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl font-black text-emerald-700">{feedbackData.satisfactionScore}%</div>
          <div className="text-xs font-bold text-emerald-800 mt-1">Community Approval</div>
          <div className="text-[11px] text-slate-500">Positive Field Ratings</div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl font-black text-indigo-700">100%</div>
          <div className="text-xs font-bold text-indigo-800 mt-1">Trans-Audited</div>
          <div className="text-[11px] text-slate-500">Field Ledgers Open</div>
        </div>
      </div>

      {/* Review Submission Form Modal or Collapsible */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
            <h4 className="font-bold text-indigo-950 text-sm">Provide Verified Community Feedback</h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1">Project Impact</label>
              <select value={impact} onChange={(e) => setImpact(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-300 rounded-lg">
                <option value={5}>5 Stars - Outstanding Impact</option>
                <option value={4}>4 Stars - Good Impact</option>
                <option value={3}>3 Stars - Moderate Impact</option>
                <option value={2}>2 Stars - Limited Impact</option>
                <option value={1}>1 Star - Needs Improvement</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Communication & Updates</label>
              <select value={communication} onChange={(e) => setCommunication(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-300 rounded-lg">
                <option value={5}>5 Stars - Excellent Communication</option>
                <option value={4}>4 Stars - Clear Updates</option>
                <option value={3}>3 Stars - Average</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Financial & Ledger Transparency</label>
              <select value={transparency} onChange={(e) => setTransparency(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-300 rounded-lg">
                <option value={5}>5 Stars - Fully Transparent</option>
                <option value={4}>4 Stars - Good Visibility</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Execution Quality & Field Safety</label>
              <select value={execution} onChange={(e) => setExecution(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-300 rounded-lg">
                <option value={5}>5 Stars - Top Field Quality</option>
                <option value={4}>4 Stars - Well Executed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Community Benefit Summary & Feedback</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share how this completed project benefited the local community..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting...' : 'Submit Feedback & Earn +10 Points'}
            </button>
          </div>
        </form>
      )}

      {/* List of Reviews */}
      <div className="space-y-3">
        {feedbackData.feedback.map((fb) => (
          <div key={fb.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={fb.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={fb.userName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    {fb.userName}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                  </div>
                  <div className="text-[10px] text-indigo-600 font-semibold">{fb.userLevelTitle}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-xs text-slate-800">{fb.overallScore}</span>
                  {renderStars(fb.overallScore)}
                </div>
                <div className="text-[10px] text-slate-400">{fb.createdAt}</div>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-sans pt-1 border-t border-slate-100">
              "{fb.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
