import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext.tsx';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Battery, 
  Bell, 
  Grid, 
  Users, 
  Shield, 
  QrCode, 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Heart, 
  Trophy, 
  Download, 
  Info, 
  Send, 
  TrendingUp, 
  Smartphone as PhoneIcon, 
  CreditCard, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { Project } from '../types.js';

export const MobilePage: React.FC = () => {
  const { projects, applyVolunteer, makeDonation, addComment, addUpdate } = useAppData();

  // PWA / Simulator Control State
  const [isOffline, setIsOffline] = useState(false);
  const [hasNotification, setHasNotification] = useState<string | null>(null);
  const [hasGPS, setHasGPS] = useState(false);
  const [mockLocation, setMockLocation] = useState<string | null>(null);

  // Active Screen within simulated Mobile App
  const [mobileTab, setMobileTab] = useState<'discover' | 'volunteer' | 'admin' | 'pwa-info'>('discover');

  // Mobile App Details overlay
  const [selectedMobileProj, setSelectedMobileProj] = useState<Project | null>(null);

  // Mobile Forms states
  const [donateAmount, setDonateAmount] = useState(25);
  const [volunteerSelectedProj, setVolunteerSelectedProj] = useState('');
  const [volunteerHours, setVolunteerHours] = useState(4);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [hoursTracked, setHoursTracked] = useState<number[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=300&q=80'
  ]);

  // Mobile Admin States
  const [adminNotificationText, setAdminNotificationText] = useState('');
  const [adminProjectTitle, setAdminProjectTitle] = useState('');

  // Clock state for Simulated Phone
  const [phoneTime, setPhoneTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 12 instead of 0
      setPhoneTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulator push notification helper
  const triggerNotification = (text: string) => {
    setHasNotification(text);
    // Auto clear after 4 seconds
    setTimeout(() => {
      setHasNotification(null);
    }, 4000);
  };

  // Simulated GPS activation
  const activateGPS = () => {
    setHasGPS(true);
    setMockLocation('Lat: 13.9094° N, Long: 60.9789° W (Castries, St. Lucia)');
    triggerNotification('GPS acquired successfully. Safe check-in enabled.');
  };

  // Simulated Check-In Action
  const handleMobileCheckIn = () => {
    if (!hasGPS) {
      triggerNotification('Error: GPS service must be active to scan QR Check-In.');
      return;
    }
    setIsCheckedIn(true);
    setHoursTracked([volunteerHours, ...hoursTracked]);
    triggerNotification(`Checked in! Logged ${volunteerHours} hours for Vision79 field program.`);
  };

  // Mock Camera photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setUploadedPhotos([fileUrl, ...uploadedPhotos]);
      triggerNotification('Camera image uploaded and indexed in project database.');
    }
  };

  // Mobile Donation Submit
  const handleMobileDonateSubmit = async (pId: string) => {
    const success = await makeDonation({
      projectId: pId,
      projectName: projects.find(p => p.id === pId)?.title || 'Vision79 General',
      donorName: 'Mobile App User',
      donorEmail: 'mobile@user.com',
      donorRole: 'donor',
      amount: donateAmount,
      type: 'One-time',
      isAnonymous: false,
    });
    if (success) {
      triggerNotification(`Donated EC$${donateAmount} successfully! Receipt cached offline.`);
      setSelectedMobileProj(null);
    }
  };

  // Mobile admin send update
  const handleMobileAdminPost = async () => {
    if (!adminProjectTitle) return;
    const success = await addUpdate(projects[0].id, {
      title: adminProjectTitle,
      content: 'Live mobile updates dispatch directly from field agents in Castries.',
      authorName: 'Field Director (Mobile)',
      authorRole: 'admin',
    });
    if (success) {
      triggerNotification('Live Field update posted directly to Web & App!');
      setAdminProjectTitle('');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Upper info card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F27D26]/10 rounded-full blur-3xl"></div>
        <div className="relative space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26] uppercase tracking-widest">
            <Smartphone className="w-4 h-4" />
            <span>Progressive Web App & Native Integrations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Mobile PWA Simulation Workspace</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Vision79 utilizes Progressive Web App (PWA) standards to ensure 100% offline access to field manuals,
            secured donation logs, GPS-validated volunteer check-ins, and camera-based receipt uploads. 
            Use the simulator below to experience our mobile applications on any modern smartphone.
          </p>
        </div>
      </div>

      {/* Simulator Interface Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PWA & Network Control Panel (Left column) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Controls Box */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 space-y-6">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">Simulator Command Center</h3>
              <p className="text-[11px] text-slate-400">Interact with these toggles to test hardware-level integration on the smartphone simulation.</p>
            </div>

            {/* Offline Toggle */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Network Connection State</span>
                <button
                  onClick={() => {
                    setIsOffline(!isOffline);
                    triggerNotification(isOffline ? 'Network connection restored. Caches synced.' : 'Offline mode active. Using client-side storage cache.');
                  }}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                    isOffline 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {isOffline ? 'Disconnect' : 'Connected'}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                When <strong>Offline</strong>, the app activates the <code>Service Worker Cache</code>. All donation entries and volunteer hours are cached locally in IndexedDB and sync automatically when connectivity is restored.
              </p>
            </div>

            {/* GPS Toggle */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">GPS Hardware Integration</span>
                <button
                  onClick={activateGPS}
                  disabled={hasGPS}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                    hasGPS 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 cursor-default' 
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                  }`}
                >
                  {hasGPS ? 'GPS Active' : 'Acquire GPS'}
                </button>
              </div>
              {mockLocation && (
                <div className="text-[10px] bg-emerald-950/20 text-emerald-400 font-semibold p-2 rounded-xl flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F27D26]" />
                  <span className="truncate">{mockLocation}</span>
                </div>
              )}
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Volunteers use the built-in GPS location services to verify check-ins within active community project boundaries.
              </p>
            </div>

            {/* Push Notifications simulation */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
              <span className="text-xs font-bold text-white block">Push Notification Broker</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type simulated push notification..."
                  value={adminNotificationText}
                  onChange={(e) => setAdminNotificationText(e.target.value)}
                  className="flex-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 text-[10px] focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (adminNotificationText.trim()) {
                      triggerNotification(adminNotificationText);
                      setAdminNotificationText('');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-bold text-[10px] cursor-pointer"
                >
                  Push
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Keep partners and community volunteers updated with automated push notifications for critical emergencies or goal completions.
              </p>
            </div>

          </div>

          {/* Performance stats */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 space-y-3">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider text-[#0ea5e9]">PWA Performance Audits</h3>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>First Contentful Paint (PWA Cached):</span>
                <span className="font-bold text-emerald-400">0.2 seconds</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Offline Availability:</span>
                <span className="font-bold text-emerald-400">100% (No Net Depend)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Local Caching Sandbox:</span>
                <span className="font-bold text-white">IndexedDB (Indexed SQL)</span>
              </div>
              <div className="flex justify-between">
                <span>Installation Overhead:</span>
                <span className="font-bold text-white">&lt; 1.2 Megabytes</span>
              </div>
            </div>
          </div>

        </div>

        {/* SMARTPHONE FRAME (Center & Right columns) */}
        <div className="lg:col-span-8 flex justify-center">
          
          {/* Simulated Smartphone Container */}
          <div className="relative mx-auto w-[330px] h-[670px] bg-slate-950 rounded-[48px] border-[12px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden select-none">
            
            {/* Phone Notch/Speaker */}
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 flex justify-center items-center z-50">
              <div className="w-24 h-4 bg-black rounded-b-xl flex items-center justify-around px-2">
                <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
                <span className="w-8 h-1 bg-slate-800 rounded-full"></span>
                <span className="w-2 h-2 bg-blue-900/40 rounded-full"></span>
              </div>
            </div>

            {/* StatusBar */}
            <div className="h-10 bg-slate-950 text-white px-6 pt-5 flex justify-between items-center text-[10px] font-bold z-40 shrink-0">
              <span>{phoneTime}</span>
              <div className="flex items-center gap-1.5">
                {isOffline ? (
                  <WifiOff className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>LTE</span>
                <Battery className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* PUSH NOTIFICATION SIMULATION POPUP */}
            {hasNotification && (
              <div className="absolute top-12 inset-x-3 z-50 bg-[#0a0a0a]/95 border border-[#F27D26]/40 p-3 rounded-2xl shadow-xl flex items-start gap-2.5 animate-bounce">
                <Bell className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                <div className="text-[10px] leading-snug">
                  <div className="font-bold text-white">Vision79 Broadcast</div>
                  <div className="text-slate-300 font-medium">{hasNotification}</div>
                </div>
              </div>
            )}

            {/* Simulated App Screen (Scrollable Body) */}
            <div className="flex-1 bg-black overflow-y-auto relative p-4 pb-16">
              
              {/* App Internal Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[#F27D26]/20 flex items-center justify-center font-black text-[10px] text-[#F27D26]">V</div>
                  <div className="text-xs font-black tracking-tight text-white">VISION79 <span className="text-[#0ea5e9]">APP</span></div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    isOffline ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {isOffline ? 'Offline' : 'Online'}
                  </span>
                </div>
              </div>

              {/* Discover Screen */}
              {mobileTab === 'discover' && (
                <div className="space-y-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-white">Caribbean Giving Portal</h4>
                    <p className="text-[9px] text-slate-500">Tap an active initiative to allocate CSR resources.</p>
                  </div>

                  {/* Mobile Projects Feed */}
                  <div className="space-y-3">
                    {projects.slice(0, 3).map((p) => (
                      <div 
                        key={p.id} 
                        onClick={() => setSelectedMobileProj(p)}
                        className="bg-slate-900/50 p-3 rounded-2xl border border-white/5 text-xs space-y-2 hover:border-[#F27D26]/40 cursor-pointer transition-all"
                      >
                        <div className="flex justify-between">
                          <span className="text-[8px] font-black text-[#F27D26] uppercase">{p.category}</span>
                          <span className="text-[8px] font-bold text-slate-500">Goal: ${p.targetAmount.toLocaleString()}</span>
                        </div>
                        <h5 className="font-bold text-white leading-snug">{p.title}</h5>
                        <p className="text-[10px] text-slate-400 line-clamp-2">{p.summary}</p>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${Math.min(100, (p.raisedAmount / p.targetAmount) * 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-500">
                            <span>EC$ {p.raisedAmount.toLocaleString()} Raised</span>
                            <span className="font-bold text-white">{Math.round((p.raisedAmount / p.targetAmount) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Photo Stream Section (Simulates Camera Roll upload) */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white">Live App Photo stream</h4>
                      <label className="text-[9px] font-bold text-[#0ea5e9] flex items-center gap-1 cursor-pointer hover:underline">
                        <Camera className="w-3 h-3" />
                        <span>Upload photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {uploadedPhotos.map((photo, idx) => (
                        <div key={idx} className="h-20 rounded-xl overflow-hidden border border-white/5 relative bg-slate-950">
                          <img src={photo} alt="simulated-upload" className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 right-1 bg-black/60 p-0.5 rounded text-[7px] text-white font-mono font-bold uppercase">Cached</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Project Details Screen overlay */}
              {selectedMobileProj && (
                <div className="absolute inset-0 bg-black z-50 p-4 space-y-4">
                  <button 
                    onClick={() => setSelectedMobileProj(null)}
                    className="text-[10px] text-slate-400 font-bold hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    &larr; Back to App Feed
                  </button>

                  <div className="space-y-2">
                    <span className="text-[8px] font-black text-[#F27D26] uppercase">{selectedMobileProj.category}</span>
                    <h4 className="font-extrabold text-sm text-white leading-snug">{selectedMobileProj.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{selectedMobileProj.summary}</p>
                  </div>

                  {/* Donation selector */}
                  <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-white/10 space-y-3">
                    <div className="text-[10px] font-bold text-white">Simulate Mobile Donation:</div>
                    <div className="flex gap-1.5 justify-between">
                      {[10, 25, 50, 100].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setDonateAmount(amt)}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            donateAmount === amt ? 'bg-[#F27D26] text-black' : 'bg-white/5 text-white'
                          }`}
                        >
                          EC$ {amt}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleMobileDonateSubmit(selectedMobileProj.id)}
                      className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-black" />
                      <span>Donate via Apple Pay / Card</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 text-[10px] text-slate-500 leading-normal">
                    <div className="flex items-center gap-1.5 text-white font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Secure CARICOM Tax Receipt Deductible</span>
                    </div>
                    <p className="pl-5">Tax deductible certificates generated instantly in client storage vault.</p>
                  </div>
                </div>
              )}

              {/* Volunteering Screen */}
              {mobileTab === 'volunteer' && (
                <div className="space-y-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-white">Volunteer Field Center</h4>
                    <p className="text-[9px] text-slate-500">Scan code on site and log labor hours into transparency records.</p>
                  </div>

                  {/* Hour log setup */}
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 space-y-3 text-xs">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-300 mb-1">Select Field Initiative</label>
                      <select
                        value={volunteerSelectedProj}
                        onChange={(e) => setVolunteerSelectedProj(e.target.value)}
                        className="w-full p-2 rounded-xl bg-black border border-white/10 text-white text-[10px]"
                      >
                        <option value="">-- Pick active project --</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-300 mb-1">Hours Volunteered on Site</label>
                      <input
                        type="number"
                        value={volunteerHours}
                        onChange={(e) => setVolunteerHours(Number(e.target.value))}
                        className="w-full p-2 rounded-xl bg-black border border-white/10 text-white text-[10px]"
                        min="1"
                      />
                    </div>

                    {/* QR Check-In Scanner simulation */}
                    <div className="pt-2">
                      {isCheckedIn ? (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1.5">
                          <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                          <div className="text-[10px] font-bold text-emerald-400">Scan Approved & Verified</div>
                          <p className="text-[9px] text-slate-400">Logged {volunteerHours} hours into Foundation public Ledger.</p>
                        </div>
                      ) : (
                        <button
                          onClick={handleMobileCheckIn}
                          className="w-full py-2 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Simulated QR Code Check-In</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hourly Ledger entries */}
                  <div className="space-y-2 text-xs">
                    <h5 className="font-bold text-white">Your Logged Hours History</h5>
                    {hoursTracked.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-900/20 border border-white/5 text-center text-[10px] text-slate-600">
                        Scan QR Check-In above to log local community hours.
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {hoursTracked.map((hr, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex justify-between items-center text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="font-bold text-slate-200">Vision79 Field Operation</span>
                            </div>
                            <span className="font-bold text-white">{hr} Hours Verified</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Screen */}
              {mobileTab === 'admin' && (
                <div className="space-y-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-white">Field Coordinator Hub</h4>
                    <p className="text-[9px] text-slate-500">Post update notifications directly from regional field lines.</p>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 space-y-3 text-xs">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-300 mb-1">Post Live Milestone Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. Solar panel hardware arrived safely"
                        value={adminProjectTitle}
                        onChange={(e) => setAdminProjectTitle(e.target.value)}
                        className="w-full p-2 rounded-xl bg-black border border-white/10 text-white text-[10px]"
                      />
                    </div>

                    <button
                      onClick={handleMobileAdminPost}
                      disabled={!adminProjectTitle}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Field Update</span>
                    </button>
                  </div>

                  {/* Micro dashboard spark metrics */}
                  <div className="space-y-2 pt-1 text-xs">
                    <h5 className="font-bold text-white">Daily Field Analytics</h5>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                        <div className="text-slate-500 font-bold uppercase text-[8px]">Daily Inflow</div>
                        <div className="text-white font-black mt-0.5">EC$ 12,400</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                        <div className="text-slate-500 font-bold uppercase text-[8px]">Verified Labors</div>
                        <div className="text-white font-black mt-0.5">8 Field Agents</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PWA Info Screen */}
              {mobileTab === 'pwa-info' && (
                <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-white">PWA Technologies</h4>
                    <p className="text-[9px] text-slate-500">How Progressive Web Apps deliver native speed.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/30 border border-white/5 space-y-1.5 text-[10px]">
                    <div className="font-bold text-white flex items-center gap-1">
                      <PhoneIcon className="w-3.5 h-3.5 text-[#F27D26]" />
                      <span>Service Worker Cache</span>
                    </div>
                    <p className="text-slate-400">Stores CSS, bundles, and assets locally. Allows near-zero loading times on low network areas.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/30 border border-white/5 space-y-1.5 text-[10px]">
                    <div className="font-bold text-white flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-[#0ea5e9]" />
                      <span>Mobile Wallet Sandbox</span>
                    </div>
                    <p className="text-slate-400">Integrated with Apple Pay, Google Pay, and localized bank transfer tokens directly through modern secure HTTPS context.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/30 border border-white/5 space-y-1.5 text-[10px]">
                    <div className="font-bold text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>App Manifest Standards</span>
                    </div>
                    <p className="text-slate-400">Declares home-screen shortcut icons, viewport splash screens, and default standalone orientations.</p>
                  </div>
                </div>
              )}

            </div>

            {/* Simulated Phone Navigation Tabbar */}
            <div className="absolute bottom-0 inset-x-0 h-14 bg-slate-950 border-t border-white/5 px-3 pb-3 flex justify-around items-center text-white z-40">
              <button 
                onClick={() => { setMobileTab('discover'); setSelectedMobileProj(null); }}
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileTab === 'discover' ? 'text-[#F27D26]' : 'text-slate-500'}`}
              >
                <Grid className="w-4 h-4" />
                <span className="text-[8px] font-bold">Discover</span>
              </button>
              <button 
                onClick={() => { setMobileTab('volunteer'); setSelectedMobileProj(null); }}
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileTab === 'volunteer' ? 'text-[#F27D26]' : 'text-slate-500'}`}
              >
                <Users className="w-4 h-4" />
                <span className="text-[8px] font-bold">Volunteer</span>
              </button>
              <button 
                onClick={() => { setMobileTab('admin'); setSelectedMobileProj(null); }}
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileTab === 'admin' ? 'text-[#F27D26]' : 'text-slate-500'}`}
              >
                <Shield className="w-4 h-4" />
                <span className="text-[8px] font-bold">Coordin</span>
              </button>
              <button 
                onClick={() => { setMobileTab('pwa-info'); setSelectedMobileProj(null); }}
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileTab === 'pwa-info' ? 'text-[#F27D26]' : 'text-slate-500'}`}
              >
                <Info className="w-4 h-4" />
                <span className="text-[8px] font-bold">Specs</span>
              </button>
            </div>

            {/* Simulated Home Indicator bar */}
            <div className="absolute bottom-1 inset-x-0 flex justify-center z-40">
              <div className="w-24 h-1 bg-white/30 rounded-full"></div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
