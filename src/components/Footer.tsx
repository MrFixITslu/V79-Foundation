import React from 'react';
import { Heart, Globe, Mail, Phone, MapPin, ShieldCheck, FileCheck } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openDonateModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openDonateModal }) => {
  return (
    <footer className="bg-[#050505] text-white/70 border-t border-white/10 transition-colors pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F27D26] flex items-center justify-center text-black font-extrabold text-lg shadow-md shadow-[#F27D26]/20">
                V79
              </div>
              <div>
                <span className="font-bold text-xl text-white block leading-tight">Vision79</span>
                <span className="text-xs font-semibold text-[#F27D26] tracking-widest uppercase block">Foundation</span>
              </div>
            </div>

            <p className="text-sm text-white/60 max-w-sm leading-relaxed">
              Empowering communities through clean water infrastructure, digital learning labs, accessible mobile healthcare, and 100% transparent grassroots impact.
            </p>

            <div className="flex items-center gap-4 text-xs text-white/50 pt-2">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#F27D26]" />
                <span>Tax Exempt 501(c)(3)</span>
              </div>
              <div className="flex items-center gap-1">
                <FileCheck className="w-4 h-4 text-[#F27D26]" />
                <span>Audited Transparency</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <button onClick={() => setCurrentTab('projects')} className="hover:text-[#F27D26] transition-colors cursor-pointer">
                  Explore Projects
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('needs')} className="hover:text-[#F27D26] transition-colors cursor-pointer">
                  Needs Board
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('transparency')} className="hover:text-[#F27D26] transition-colors cursor-pointer">
                  Transparency Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('volunteers')} className="hover:text-[#F27D26] transition-colors cursor-pointer">
                  Volunteer Portal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('gallery')} className="hover:text-[#F27D26] transition-colors cursor-pointer">
                  Media Library
                </button>
              </li>
            </ul>
          </div>

          {/* Sponsors & Governance */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Governance</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <button onClick={() => setCurrentTab('corporate')} className="hover:text-[#F27D26] transition-colors cursor-pointer">
                  Corporate Sponsors
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-[#F27D26] transition-colors cursor-pointer">
                  About & Mission
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('contact')} className="hover:text-[#F27D26] transition-colors cursor-pointer">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('admin')} className="hover:text-[#F27D26] transition-colors cursor-pointer">
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-2.5 text-xs text-white/60">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F27D26] shrink-0" />
                <span>contact@vision79.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F27D26] shrink-0" />
                <span>+1 (800) 555-V790</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                <span>79 Innovation Way, Capital District, V79 2026</span>
              </li>
            </ul>

            <button
              onClick={openDonateModal}
              className="mt-4 w-full py-2.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#F27D26]/20 transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-black" />
              <span>Make an Impact Donation</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Vision79 Foundation Inc. All rights reserved. Built with WCAG AA accessibility standards.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Annual Reports</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
