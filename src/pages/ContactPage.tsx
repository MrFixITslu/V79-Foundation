import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Get in Touch with Vision79</h1>
        <p className="text-sm text-white/60 max-w-lg mx-auto">
          Have questions about a project, partnership, or field volunteering? Our foundation team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Contact Info */}
        <div className="md:col-span-5 bg-[#050505] text-white p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="font-extrabold text-xl text-white">Contact Information</h3>

          <div className="space-y-4 text-xs text-white/70">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#F27D26] shrink-0" />
              <div>
                <div className="font-bold text-white">Email Address</div>
                <div className="text-white/50">contact@vision79.org</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#F27D26] shrink-0" />
              <div>
                <div className="font-bold text-white">Telephone Support</div>
                <div className="text-white/50">+1 (800) 555-V790</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#F27D26] shrink-0" />
              <div>
                <div className="font-bold text-white">Headquarters Office</div>
                <div className="text-white/50">79 Innovation Way, Capital District, V79 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white/[0.03] p-8 rounded-3xl border border-white/10 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 flex items-center justify-center mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-white">Message Sent Successfully</h3>
              <p className="text-xs text-white/50">Thank you! A foundation representative will respond within 24 hours.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="jane@example.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F27D26]"
                >
                  <option value="General Inquiry" className="bg-[#050505] text-white">General Inquiry</option>
                  <option value="Sponsorship" className="bg-[#050505] text-white">Corporate Sponsorship / CSR</option>
                  <option value="Volunteering" className="bg-[#050505] text-white">Field Volunteering</option>
                  <option value="Media" className="bg-[#050505] text-white">Media & Press</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="How can we assist you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#F27D26]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs shadow-md cursor-pointer"
              >
                Submit Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
