import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, Copy, Check } from 'lucide-react';
import { useAppData } from '../context/AppDataContext.tsx';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { projects } = useAppData();
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState('Campaign Narrative');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Draft Campaign Story', task: 'Campaign Narrative', text: 'Draft an inspiring 200-word campaign narrative emphasizing clean water and community health.' },
    { label: 'Summarize Impact', task: 'Impact Report', text: 'Generate a structured impact summary highlighting key metrics, beneficiaries, and ROI.' },
    { label: 'Donor FAQ Answer', task: 'Donor FAQ', text: 'Explain how Vision79 Foundation ensures 100% financial transparency and receipt verification.' },
  ];

  const handleGenerate = async (overridePrompt?: string, overrideTask?: string) => {
    const finalPrompt = overridePrompt || prompt;
    const finalTask = overrideTask || taskType;
    if (!finalPrompt.trim()) return;

    setLoading(true);
    setResponse('');

    const targetProject = projects.find((p) => p.id === selectedProjectId);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          taskType: finalTask,
          contextData: targetProject
            ? { title: targetProject.title, category: targetProject.category, target: targetProject.targetAmount, raised: targetProject.raisedAmount, beneficiaries: targetProject.beneficiariesCount }
            : {},
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.result);
      }
    } catch (err) {
      console.error(err);
      setResponse('Unable to connect to AI server. Please check environment configuration.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Vision79 AI Assistant</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                Powered by Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Generate project descriptions, impact reports, and donor communications.</p>
          </div>
        </div>

        {/* Context Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Context Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Generation Task</label>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Campaign Narrative">Campaign Narrative & Storytelling</option>
              <option value="Impact Report">Impact Summary & Metrics</option>
              <option value="Donor FAQ">Donor Communication & Q&A</option>
              <option value="Volunteer Orientation">Volunteer Briefing Notes</option>
            </select>
          </div>
        </div>

        {/* Quick prompt badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(qp.text);
                setTaskType(qp.task);
                handleGenerate(qp.text, qp.task);
              }}
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="relative mb-6">
          <textarea
            rows={3}
            placeholder="Describe what you would like Gemini AI to draft or analyze..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none pr-12"
          />
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !prompt.trim()}
            className="absolute right-3 bottom-3 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Response Box */}
        {(loading || response) && (
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Output Result
              </span>
              {response && (
                <button
                  onClick={copyToClipboard}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Generating response with Gemini 3.6 Flash...</p>
              </div>
            ) : (
              <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                {response}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
