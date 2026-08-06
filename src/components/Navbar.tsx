import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAppData } from '../context/AppDataContext.tsx';
import { Role } from '../types.js';
import {
  Heart,
  Sun,
  Moon,
  Bell,
  Search,
  User as UserIcon,
  Shield,
  Layers,
  Sparkles,
  Menu,
  X,
  PieChart,
  Grid,
  Users,
  Image as ImageIcon,
  Building2,
  FileText,
  HelpCircle,
  Trophy,
  Award,
} from 'lucide-react';
import { UserProfileModal } from './reputation/UserProfileModal.tsx';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openDonateModal: (projectId?: string) => void;
  openAiModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openDonateModal, openAiModal }) => {
  const { user, role, setRole, logout, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, projects, currentUserReputation } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const rolesList: { role: Role; label: string; desc: string; color: string }[] = [
    { role: 'admin', label: 'Admin Director', desc: 'Full platform management & audit logs', color: 'bg-purple-500' },
    { role: 'volunteer', label: 'Field Volunteer', desc: 'Hour logs, QR check-in & certificates', color: 'bg-emerald-500' },
    { role: 'sponsor', label: 'Corporate Partner', desc: 'Tax receipts & sponsor dashboard', color: 'bg-amber-500' },
    { role: 'donor', label: 'Individual Donor', desc: 'Donation history & pledge tracking', color: 'bg-blue-500' },
    { role: 'beneficiary', label: 'Community Member', desc: 'Project requests & local updates', color: 'bg-rose-500' },
  ];

  const navLinks = [
    { id: 'home', label: 'Home', icon: Layers },
    { id: 'projects', label: 'Projects', icon: Grid },
    { id: 'needs', label: 'Needs Board', icon: FileText },
    { id: 'transparency', label: 'Transparency', icon: PieChart },
    { id: 'reputation', label: 'Leaderboard', icon: Trophy },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'corporate', label: 'Sponsors', icon: Building2 },
    { id: 'about', label: 'About', icon: HelpCircle },
    { id: 'admin', label: 'Admin Hub', icon: Shield },
  ];

  const filteredProjects = searchQuery.trim()
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 text-left group shrink-0"
          >
            <div className="text-xl font-black tracking-tighter text-white">
              VISION<span className="text-[#F27D26]">79</span>
            </div>
          </button>

          {/* Search bar */}
          <div className="relative hidden lg:block max-w-xs w-full">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search projects, needs, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-white/[0.05] text-white placeholder-white/40 border border-white/10 focus:border-[#F27D26] focus:outline-none transition-all"
              />
            </div>

            {/* Quick search dropdown */}
            {filteredProjects.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] rounded-2xl shadow-2xl border border-white/10 p-2 z-50">
                <div className="text-[10px] font-semibold text-white/40 uppercase tracking-widest px-3 py-1">Matching Projects</div>
                {filteredProjects.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentTab('projects');
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-white/5 flex items-center justify-between"
                  >
                    <span className="font-medium text-white/90 truncate">{p.title}</span>
                    <span className="text-[10px] text-[#F27D26] font-bold shrink-0 ml-2">
                      {p.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-[#F27D26]/10 text-[#F27D26] border-b-2 border-[#F27D26]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            
            {/* Reputation Badge Pill */}
            {currentUserReputation && (
              <button
                onClick={() => setShowProfileModal(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold hover:border-amber-400 transition-all shadow-sm"
                title="View your Community Reputation Profile"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentUserReputation.score} pts</span>
                <span className="text-white/30">•</span>
                <span className="text-white/80 text-[11px] font-medium hidden lg:inline">{currentUserReputation.levelTitle}</span>
              </button>
            )}

            {/* AI Assistant */}
            <button
              onClick={openAiModal}
              title="Vision79 AI Assistant"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <Sparkles className="w-4 h-4 text-[#F27D26] animate-pulse" />
              <span className="hidden sm:inline">AI Helper</span>
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F27D26]" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F27D26] animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F27D26]" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] rounded-2xl shadow-2xl border border-white/10 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="font-bold text-sm text-white">Notifications</span>
                    <span className="text-xs text-white/40">{notifications.length} total</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto my-2 space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs"
                      >
                        <div className="font-semibold text-white/90">{n.title}</div>
                        <div className="text-white/60 mt-0.5">{n.message}</div>
                        <div className="text-[10px] text-white/40 mt-1">
                          {new Date(n.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/80 hover:bg-white/10 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#F27D26]" />
                <span className="capitalize">{role}</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0a0a0a] rounded-2xl shadow-2xl border border-white/10 p-2 z-50">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider px-3 py-1.5">
                    Switch Test View Role
                  </div>
                  {rolesList.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setRole(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                        role === r.role
                          ? 'bg-[#F27D26]/10 text-[#F27D26] font-bold'
                          : 'hover:bg-white/5 text-white/70'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                      <div>
                        <div className="text-xs font-semibold">{r.label}</div>
                        <div className="text-[10px] text-white/40">{r.desc}</div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-white/10 my-1 pt-1">
                    {user ? (
                      <button
                        onClick={() => {
                          logout();
                          setShowRoleMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-lg"
                      >
                        Sign Out ({user.name})
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          openAuthModal();
                          setShowRoleMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[#F27D26] hover:bg-[#F27D26]/10 rounded-lg"
                      >
                        Login / Register
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Donate Button - Sophisticated Dark primary CTA style */}
            <button
              onClick={() => openDonateModal()}
              className="px-5 py-2 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5 shrink-0 transition-all shadow-lg shadow-[#F27D26]/20 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-black text-black" />
              <span>Make a Donation</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-white/70 hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/10 bg-[#0a0a0a] px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-[#F27D26]/10 text-[#F27D26]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* User Profile Modal */}
      {currentUserReputation && (
        <UserProfileModal
          reputation={currentUserReputation}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          isCurrentUser={true}
        />
      )}
    </header>
  );
};
