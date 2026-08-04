import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Users, Award, Clock, QrCode, CheckCircle2, ShieldCheck, FileCheck, Send, Plus } from 'lucide-react';

export const VolunteersPage: React.FC = () => {
  const { volunteers, applyVolunteer, logVolunteerHours, approveVolunteer } = useAppData();
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'roster' | 'apply' | 'checkin' | 'certificates'>('roster');

  // Application form
  const [applicantName, setApplicantName] = useState(user?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(user?.email || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState('Weekends (5-10 hrs/wk)');

  // Hours logging form
  const [selectedVolId, setSelectedVolId] = useState(volunteers[0]?.id || '');
  const [hoursToAdd, setHoursToAdd] = useState('4');
  const [activityDesc, setActivityDesc] = useState('');

  // QR Checkin state
  const [qrScanning, setQrScanning] = useState(false);
  const [qrSuccess, setQrSuccess] = useState(false);

  const availableSkills = ['Clean Water Systems', 'Solar Engineering', 'Digital Literacy', 'Pediatric Nursing', 'Mobile Health', 'Community Liaison', 'Photography'];

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      alert('Please fill out all required fields.');
      return;
    }
    await applyVolunteer({
      name: applicantName,
      email: applicantEmail,
      skills: selectedSkills.length > 0 ? selectedSkills : ['Community Liaison'],
      availability,
    });
    alert('Volunteer application submitted successfully! Pending approval.');
    setActiveTab('roster');
  };

  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    const hrs = Number(hoursToAdd);
    if (!hrs || hrs <= 0) return;
    await logVolunteerHours(selectedVolId, hrs, activityDesc || 'Field project assistance');
    alert(`Successfully logged ${hrs} volunteer hours!`);
    setActivityDesc('');
  };

  const handleSimulateQR = () => {
    setQrScanning(true);
    setQrSuccess(false);
    setTimeout(() => {
      setQrScanning(false);
      setQrSuccess(true);
      if (volunteers[0]) {
        logVolunteerHours(volunteers[0].id, 3, 'QR Verified On-Site Check-In');
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#050505] text-white border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26] uppercase tracking-widest">
          <Users className="w-4 h-4" />
          <span>Field Volunteer Force</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Volunteer Management & Check-In Portal</h1>
        <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
          Join field teams on the front lines. Log verified hours, check in at project sites via QR code, and receive official certified service credentials.
        </p>

        {/* Sub Navigation */}
        <div className="flex overflow-x-auto gap-2 pt-2">
          {[
            { id: 'roster', label: `Volunteer Roster (${volunteers.length})` },
            { id: 'apply', label: 'Apply to Volunteer' },
            { id: 'checkin', label: 'QR Field Check-In' },
            { id: 'certificates', label: 'Certificates & Credentials' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#F27D26] text-black shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: ROSTER */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Active & Approved Field Volunteers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers.map((vol) => (
              <div
                key={vol.id}
                className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={vol.avatar} alt={vol.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#F27D26]/30" />
                    <div>
                      <h3 className="font-bold text-base text-white">{vol.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20">
                        {vol.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {vol.skills.map((s, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs pt-3">
                  <div className="flex items-center gap-1.5 text-white/60 font-bold">
                    <Clock className="w-4 h-4 text-[#F27D26]" />
                    <span>Logged Hours:</span>
                  </div>
                  <span className="font-black text-[#F27D26] text-sm">{vol.hoursLogged} hrs</span>
                </div>

                {role === 'admin' && vol.status === 'Pending' && (
                  <button
                    onClick={() => approveVolunteer(vol.id)}
                    className="w-full py-2 rounded-xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs cursor-pointer"
                  >
                    Approve Application
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: APPLY */}
      {activeTab === 'apply' && (
        <div className="max-w-2xl mx-auto bg-white/[0.03] p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Field Volunteer Application</h2>
            <p className="text-xs text-white/50">Share your skillsets to get matched with active projects in your region.</p>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Full Name</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#F27D26]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Email Address</label>
              <input
                type="email"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                placeholder="jane@example.org"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#F27D26]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">Select Primary Skills</label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((sk) => {
                  const isSel = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => {
                        if (isSel) setSelectedSkills(selectedSkills.filter((s) => s !== sk));
                        else setSelectedSkills([...selectedSkills, sk]);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#F27D26] text-black border-[#F27D26]'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Weekly Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#F27D26]"
              >
                <option value="Weekends (5-10 hrs/wk)" className="bg-[#050505] text-white">Weekends (5-10 hrs/wk)</option>
                <option value="Full-Time Field Deployment (30+ hrs/wk)" className="bg-[#050505] text-white">Full-Time Field Deployment (30+ hrs/wk)</option>
                <option value="Remote / Technical Support (2-5 hrs/wk)" className="bg-[#050505] text-white">Remote / Technical Support (2-5 hrs/wk)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-sm shadow-lg shadow-[#F27D26]/20 transition-all cursor-pointer"
            >
              Submit Volunteer Application
            </button>
          </form>
        </div>
      )}

      {/* TAB: QR CHECK-IN */}
      {activeTab === 'checkin' && (
        <div className="max-w-md mx-auto bg-white/[0.03] p-8 rounded-3xl border border-white/10 text-center space-y-6">
          <QrCode className="w-16 h-16 text-[#F27D26] mx-auto" />
          <div>
            <h2 className="text-xl font-bold text-white">Field Site QR Attendance Scanner</h2>
            <p className="text-xs text-white/50 mt-1">Simulate scanning project site QR poster to automatically register attendance and log hours.</p>
          </div>

          <button
            onClick={handleSimulateQR}
            disabled={qrScanning}
            className="w-full py-3.5 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-sm shadow-md cursor-pointer disabled:opacity-50"
          >
            {qrScanning ? 'Scanning QR Marker...' : 'Simulate Site QR Check-In'}
          </button>

          {qrSuccess && (
            <div className="p-4 rounded-2xl bg-[#F27D26]/10 border border-[#F27D26]/30 text-[#F27D26] text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#F27D26]" />
              <span>Check-In Verified! 3 Field Hours Logged.</span>
            </div>
          )}
        </div>
      )}

      {/* TAB: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="max-w-2xl mx-auto bg-[#050505] text-white p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-center">
          <Award className="w-16 h-16 text-[#F27D26] mx-auto" />
          <h2 className="text-2xl font-black text-white">Official Certificate of Volunteer Service</h2>
          <p className="text-xs text-white/50">Issued by Vision79 Foundation Board of Governors</p>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/50">Awarded To:</span>
              <span className="font-bold text-white">{volunteers[0]?.name || 'Elena Rostova'}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/50">Total Verified Hours:</span>
              <span className="font-extrabold text-[#F27D26]">{volunteers[0]?.hoursLogged || 84} Field Hours</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/50">Specialization:</span>
              <span className="font-bold text-white/80">{volunteers[0]?.skills.join(', ') || 'Clean Water Systems'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Credential Serial:</span>
              <span className="font-mono text-[#F27D26]">V79-CERT-2026-88219</span>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-6 py-3 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-black text-xs shadow-lg cursor-pointer"
          >
            Print / Export Official Certificate
          </button>
        </div>
      )}

    </div>
  );
};
