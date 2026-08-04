import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext.tsx';
import { Heart, X, CheckCircle2, FileText, Lock, Building, Repeat, Gift } from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose, defaultProjectId }) => {
  const { projects, makeDonation } = useAppData();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(defaultProjectId || projects[0]?.id || '');
  const [donationType, setDonationType] = useState<'Cash' | 'In-Kind' | 'Corporate' | 'Recurring'>('Cash');
  const [amount, setAmount] = useState<string>('100');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [inKindDesc, setInKindDesc] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [recurringFreq, setRecurringFreq] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [submitting, setSubmitting] = useState(false);
  const [receiptResult, setReceiptResult] = useState<any>(null);

  if (!isOpen) return null;

  const quickAmounts = ['25', '50', '100', '250', '500'];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const finalAmount = amount === 'custom' ? Number(customAmount) : Number(amount);
    if (!finalAmount || finalAmount <= 0) {
      alert('Please enter a valid amount');
      setSubmitting(false);
      return;
    }

    const payload = {
      projectId: selectedProjectId,
      donorName: isAnonymous ? 'Anonymous Supporter' : donorName || 'Kind Supporter',
      donorEmail: donorEmail || 'donor@vision79.org',
      amount: finalAmount,
      type: donationType,
      inKindDescription: donationType === 'In-Kind' ? inKindDesc : undefined,
      isAnonymous,
      recurringFrequency: donationType === 'Recurring' ? recurringFreq : undefined,
    };

    const success = await makeDonation(payload);
    setSubmitting(false);

    if (success) {
      const receiptNumber = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const targetProj = projects.find((p) => p.id === selectedProjectId);
      setReceiptResult({
        receiptNumber,
        amount: finalAmount,
        donorName: payload.donorName,
        projectName: targetProj ? targetProj.title : 'General Foundation Fund',
        date: new Date().toLocaleDateString(),
        type: donationType,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative my-8">
        <button
          onClick={() => {
            setReceiptResult(null);
            onClose();
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {receiptResult ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Tax Receipt Generated</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Your contribution directly funds life-changing community projects.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Receipt Serial:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{receiptResult.receiptNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Amount:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">${receiptResult.amount}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Donor:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{receiptResult.donorName}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Target Cause:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{receiptResult.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Issued:</span>
                <span className="text-slate-700 dark:text-slate-300">{receiptResult.date}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Print / Save Tax PDF</span>
              </button>
              <button
                onClick={() => {
                  setReceiptResult(null);
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDonate} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Make an Impact Donation</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">100% of public gifts go directly to project costs</p>
              </div>
            </div>

            {/* Donation Type tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDonationType('Cash')}
                className={`py-2 rounded-lg transition-all ${donationType === 'Cash' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                One-Time
              </button>
              <button
                type="button"
                onClick={() => setDonationType('Recurring')}
                className={`py-2 rounded-lg transition-all ${donationType === 'Recurring' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Recurring
              </button>
              <button
                type="button"
                onClick={() => setDonationType('In-Kind')}
                className={`py-2 rounded-lg transition-all ${donationType === 'In-Kind' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                In-Kind
              </button>
              <button
                type="button"
                onClick={() => setDonationType('Corporate')}
                className={`py-2 rounded-lg transition-all ${donationType === 'Corporate' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Sponsor
              </button>
            </div>

            {/* Select Target Project */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Target Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Vision79 General Foundation Impact Fund</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (${p.raisedAmount.toLocaleString()} / ${p.targetAmount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Select Donation Amount ($)</label>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setAmount(q);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      amount === q
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    ${q}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Or enter custom amount ($)"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount('custom');
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* In-kind extra description */}
            {donationType === 'In-Kind' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Equipment / Materials Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g., 10 Refurbished Laptops or 20 Water Pumps"
                  value={inKindDesc}
                  onChange={(e) => setInKindDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Donor info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  disabled={isAnonymous}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email for Tax Receipt</label>
                <input
                  type="email"
                  placeholder="jane@example.org"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Anonymous checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonCheck"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="anonCheck" className="text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                Keep my donation anonymous on public leaderboards
              </label>
            </div>

            {/* Security note & submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{submitting ? 'Processing...' : 'Complete Contribution'}</span>
              </button>
              <div className="text-center text-[10px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted & Tax Receipt Auto-Generated
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
