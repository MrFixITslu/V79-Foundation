import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext.tsx';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Heart, Users, Globe, Target } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { cmsPages } = useAppData();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const aboutCms = cmsPages.find((p) => p.slug === 'about') || {
    title: 'About Vision79 Foundation',
    content: `Vision79 Foundation was established with a singular mission: to eliminate structural poverty through direct, transparent community projects. 

    We operate under a strict 100% public efficiency rule—every dollar donated directly to field initiatives goes straight to material equipment, vendor contracts, and verified beneficiary outcomes.`,
  };

  const faqs = [
    {
      q: 'How does Vision79 Foundation ensure 100% financial transparency?',
      a: 'We publish itemized vendor invoices, approved budget vs actual spending ledgers, and downloadable CSV audits for every active project on our Transparency Dashboard.',
    },
    {
      q: 'Are donations tax-deductible?',
      a: 'Yes! Vision79 Foundation is a registered 501(c)(3) non-profit organization. Every donation instantly generates an official tax receipt with a unique serial number.',
    },
    {
      q: 'How can I volunteer in the field?',
      a: 'Visit our Volunteer Portal to submit your skill set. Once approved, you can check in on-site using our mobile QR code scanner to log certified hours.',
    },
    {
      q: 'Can companies partner for corporate social responsibility (CSR)?',
      a: 'Absolutely. We offer customized corporate sponsorship tiers with co-branded field equipment, executive reporting, and employee volunteer field days.',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#050505] text-white border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26] uppercase tracking-widest">
          <Globe className="w-4 h-4" />
          <span>Our Vision & Values</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">{aboutCms.title}</h1>
        <p className="text-sm text-white/60 max-w-3xl leading-relaxed whitespace-pre-line">
          {aboutCms.content}
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 space-y-3 hover:border-[#F27D26]/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-white">Audited Openness</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            No hidden overhead. Every single expense receipt is logged and open to public inspection.
          </p>
        </div>

        <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 space-y-3 hover:border-[#F27D26]/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-white">Targeted Need Boards</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            We break down projects into specific physical supplies—allowing donors to pledge exact equipment.
          </p>
        </div>

        <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 space-y-3 hover:border-[#F27D26]/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-white">Community Driven</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            All initiatives originate from direct local village council requests and community leaders.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-white/50">Everything you need to know about our operations and governance.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#F27D26]" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-white/70 leading-relaxed border-t border-white/10 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
