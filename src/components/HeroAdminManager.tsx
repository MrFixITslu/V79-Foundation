import React, { useState, useEffect } from 'react';
import { HeroConfig, HeroSlide, HeroStat } from '../types.js';
import { useToast } from '../context/ToastContext.tsx';
import {
  Sliders,
  Plus,
  Trash,
  Save,
  RotateCcw,
  Video,
  Image,
  Eye,
  Play,
  Pause,
  Clock,
  Sparkles,
  ShieldAlert,
  Share2,
  CheckCircle2,
  Layers,
  Heart,
  FileCheck,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export const HeroAdminManager: React.FC = () => {
  const { showToast } = useToast();
  const [heroConfig, setHeroConfig] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSlideId, setSelectedSlideId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'overlay' | 'stats' | 'seo'>('content');

  useEffect(() => {
    fetchHeroConfig();
  }, []);

  const fetchHeroConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hero');
      if (res.ok) {
        const data: HeroConfig = await res.json();
        setHeroConfig(data);
        if (data.slides && data.slides.length > 0) {
          setSelectedSlideId(data.activeSlideId || data.slides[0].id);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading Hero configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!heroConfig) return;
    setSaving(true);
    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroConfig),
      });
      if (res.ok) {
        const savedData = await res.json();
        setHeroConfig(savedData);
        showToast('Hero section & video settings saved successfully!', 'success');
      } else {
        showToast('Failed to save Hero configuration', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving Hero settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const activeSlide = heroConfig?.slides.find((s) => s.id === selectedSlideId);

  const updateActiveSlide = (fields: Partial<HeroSlide>) => {
    if (!heroConfig || !activeSlide) return;
    const updatedSlides = heroConfig.slides.map((s) =>
      s.id === selectedSlideId ? { ...s, ...fields } : s
    );
    setHeroConfig({ ...heroConfig, slides: updatedSlides });
  };

  const handleAddSlide = () => {
    if (!heroConfig) return;
    const newSlide: HeroSlide = {
      id: `hero-slide-${Date.now()}`,
      title: `New Campaign Slide ${heroConfig.slides.length + 1}`,
      headline: 'Inspiring Change Across Our Community.',
      subheading: 'Vision79 Foundation delivers direct community impact and transparent project execution.',
      missionStatement: 'Deploying direct relief, solar infrastructure, and youth grants.',
      mediaType: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80',
      posterImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80',
      primaryCtaText: 'Make a Donation',
      primaryCtaAction: 'donate',
      secondaryCtaText: 'Learn More',
      secondaryCtaAction: 'projects',
      overlayOpacity: 70,
      overlayGradient: 'brand',
      stats: [
        { label: 'Beneficiaries', value: 1200 },
        { label: 'Community Hours', value: 350 },
      ],
      enabled: true,
      campaignType: 'standard',
    };

    setHeroConfig({
      ...heroConfig,
      slides: [...heroConfig.slides, newSlide],
    });
    setSelectedSlideId(newSlide.id);
    showToast('Created new campaign hero slide!', 'info');
  };

  const handleDeleteSlide = (slideId: string) => {
    if (!heroConfig || heroConfig.slides.length <= 1) {
      showToast('At least one hero slide must remain active', 'error');
      return;
    }
    const updatedSlides = heroConfig.slides.filter((s) => s.id !== slideId);
    setHeroConfig({
      ...heroConfig,
      slides: updatedSlides,
      activeSlideId: updatedSlides[0].id,
    });
    setSelectedSlideId(updatedSlides[0].id);
    showToast('Deleted hero slide', 'info');
  };

  if (loading) {
    return <div className="p-12 text-center text-white/50 animate-pulse text-xs">Loading Full-Screen Hero Controls...</div>;
  }

  if (!heroConfig || !activeSlide) {
    return <div className="p-12 text-center text-white/50 text-xs">No Hero Configuration Found</div>;
  }

  return (
    <div className="space-y-8 text-white">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.03] p-6 rounded-3xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#F27D26]">CMS Hero Management</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/70">100vh Full-Screen</span>
          </div>
          <h2 className="text-2xl font-black text-white">Full-Screen Hero Video & Campaign Manager</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddSlide}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-white/10"
          >
            <Plus className="w-4 h-4 text-[#F27D26]" />
            <span>Add Slide</span>
          </button>

          <button
            onClick={handleSaveConfig}
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F27D26]/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Slide Selection Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {heroConfig.slides.map((slide, idx) => (
          <div
            key={slide.id}
            onClick={() => setSelectedSlideId(slide.id)}
            className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-3 shrink-0 ${
              slide.id === selectedSlideId
                ? 'bg-[#F27D26]/20 border-[#F27D26] text-white shadow-md'
                : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 text-white text-[10px] flex items-center justify-center font-extrabold">
                {idx + 1}
              </span>
              <span>{slide.title}</span>
            </div>

            {slide.campaignType === 'emergency' && (
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                Emergency
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSlide(slide.id);
              }}
              title="Delete Slide"
              className="p-1 rounded hover:bg-rose-500/20 text-white/40 hover:text-rose-400"
            >
              <Trash className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Slide Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Config Tabs & Controls */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Sub-Tabs Nav */}
          <div className="flex border-b border-white/10 gap-2">
            {[
              { id: 'content', label: 'Text & CTAs', icon: Sliders },
              { id: 'media', label: 'Video & Media', icon: Video },
              { id: 'overlay', label: 'Overlay & Styling', icon: Layers },
              { id: 'stats', label: 'Animated Stats', icon: Sparkles },
              { id: 'seo', label: 'SEO & Social Cards', icon: Share2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#F27D26] text-[#F27D26]'
                      : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: TEXT & CTAs */}
          {activeTab === 'content' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">Slide Internal Name / Title</label>
                <input
                  type="text"
                  value={activeSlide.title}
                  onChange={(e) => updateActiveSlide({ title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#F27D26]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">Headline (Main Title)</label>
                <textarea
                  rows={2}
                  value={activeSlide.headline}
                  onChange={(e) => updateActiveSlide({ headline: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-[#F27D26]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">Sub-heading</label>
                <textarea
                  rows={2}
                  value={activeSlide.subheading}
                  onChange={(e) => updateActiveSlide({ subheading: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-[#F27D26]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">Mission Statement Banner</label>
                <input
                  type="text"
                  value={activeSlide.missionStatement}
                  onChange={(e) => updateActiveSlide({ missionStatement: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-[#F27D26]"
                />
              </div>

              {/* CTAs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-3">
                  <span className="text-xs font-extrabold text-[#F27D26] uppercase">Primary CTA Button</span>
                  <input
                    type="text"
                    placeholder="Button Text"
                    value={activeSlide.primaryCtaText}
                    onChange={(e) => updateActiveSlide({ primaryCtaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                  <select
                    value={activeSlide.primaryCtaAction}
                    onChange={(e) => updateActiveSlide({ primaryCtaAction: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111] border border-white/10 text-xs text-white"
                  >
                    <option value="donate">Action: Make a Donation</option>
                    <option value="projects">Action: Support a Project</option>
                    <option value="volunteer">Action: Become a Volunteer</option>
                    <option value="transparency">Action: View Audit Ledger</option>
                    <option value="suggest">Action: Suggest a Project</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-extrabold text-white uppercase">Secondary CTA Button</span>
                  <input
                    type="text"
                    placeholder="Button Text"
                    value={activeSlide.secondaryCtaText}
                    onChange={(e) => updateActiveSlide({ secondaryCtaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                  <select
                    value={activeSlide.secondaryCtaAction}
                    onChange={(e) => updateActiveSlide({ secondaryCtaAction: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111] border border-white/10 text-xs text-white"
                  >
                    <option value="donate">Action: Make a Donation</option>
                    <option value="projects">Action: Support a Project</option>
                    <option value="volunteer">Action: Become a Volunteer</option>
                    <option value="transparency">Action: View Audit Ledger</option>
                    <option value="suggest">Action: Suggest a Project</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: VIDEO & MEDIA */}
          {activeTab === 'media' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">Background Media Type</label>
                <div className="flex gap-4">
                  {[
                    { type: 'video', label: 'MP4 / WebM Video', icon: Video },
                    { type: 'image', label: 'High-Res Image', icon: Image },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.type}
                        onClick={() => updateActiveSlide({ mediaType: m.type as any })}
                        className={`flex-1 p-4 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          activeSlide.mediaType === m.type
                            ? 'bg-[#F27D26]/20 border-[#F27D26] text-[#F27D26]'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeSlide.mediaType === 'video' && (
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-white">Video Source URL (.mp4 / .webm)</label>
                  <input
                    type="url"
                    value={activeSlide.videoUrl || ''}
                    onChange={(e) => updateActiveSlide({ videoUrl: e.target.value })}
                    placeholder="https://example.com/hero-video.mp4"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#F27D26]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">Image URL / Fallback Asset</label>
                <input
                  type="url"
                  value={activeSlide.imageUrl || ''}
                  onChange={(e) => updateActiveSlide({ imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#F27D26]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">Poster Image (Used before video loads or when Motion is disabled)</label>
                <input
                  type="url"
                  value={activeSlide.posterImage || ''}
                  onChange={(e) => updateActiveSlide({ posterImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#F27D26]"
                />
              </div>

            </div>
          )}

          {/* TAB 3: OVERLAY & STYLING */}
          {activeTab === 'overlay' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
              
              {/* Opacity Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-white">Dark Gradient Overlay Opacity</label>
                  <span className="text-sm font-black text-[#F27D26]">{activeSlide.overlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeSlide.overlayOpacity}
                  onChange={(e) => updateActiveSlide({ overlayOpacity: Number(e.target.value) })}
                  className="w-full accent-[#F27D26]"
                />
                <p className="text-[11px] text-white/50">
                  Higher opacity improves readability over bright background video footage.
                </p>
              </div>

              {/* Gradient Style */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">Gradient Style Preset</label>
                <select
                  value={activeSlide.overlayGradient}
                  onChange={(e) => updateActiveSlide({ overlayGradient: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#111] border border-white/10 text-xs text-white"
                >
                  <option value="brand">Brand Bottom Fade (Recommended)</option>
                  <option value="dark">Dark Side Radial</option>
                  <option value="radial">Center Vignette</option>
                  <option value="minimal">Solid Dark Tint</option>
                </select>
              </div>

              {/* Campaign Type Selector */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <label className="text-xs font-extrabold text-white">Campaign Classification Badge</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { type: 'standard', label: 'Standard' },
                    { type: 'emergency', label: 'Emergency Appeal' },
                    { type: 'seasonal', label: 'Seasonal' },
                    { type: 'event', label: 'Event Countdown' },
                  ].map((c) => (
                    <button
                      key={c.type}
                      onClick={() => updateActiveSlide({ campaignType: c.type as any })}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        activeSlide.campaignType === c.type
                          ? 'bg-[#F27D26]/20 border-[#F27D26] text-[#F27D26]'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeSlide.campaignType === 'event' && (
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-white">Event Countdown End Date</label>
                  <input
                    type="datetime-local"
                    value={activeSlide.eventCountdownDate ? new Date(activeSlide.eventCountdownDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => updateActiveSlide({ eventCountdownDate: new Date(e.target.value).toISOString() })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
              )}

            </div>
          )}

          {/* TAB 4: ANIMATED STATS */}
          {activeTab === 'stats' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
                  Animated Viewport Counters ({activeSlide.stats?.length || 0})
                </h3>
                <button
                  onClick={() => {
                    const currentStats = activeSlide.stats || [];
                    updateActiveSlide({
                      stats: [...currentStats, { label: 'New Metric', value: 100 }],
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>Add Metric</span>
                </button>
              </div>

              <div className="space-y-3">
                {activeSlide.stats?.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Label (e.g. Funds Raised)"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...activeSlide.stats];
                          updated[idx].label = e.target.value;
                          updateActiveSlide({ stats: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <input
                        type="number"
                        placeholder="Numeric Value"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...activeSlide.stats];
                          updated[idx].value = Number(e.target.value);
                          updateActiveSlide({ stats: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Prefix (EC$)"
                        value={stat.prefix || ''}
                        onChange={(e) => {
                          const updated = [...activeSlide.stats];
                          updated[idx].prefix = e.target.value;
                          updateActiveSlide({ stats: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Suffix (+)"
                        value={stat.suffix || ''}
                        onChange={(e) => {
                          const updated = [...activeSlide.stats];
                          updated[idx].suffix = e.target.value;
                          updateActiveSlide({ stats: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-1 text-right">
                      <button
                        onClick={() => {
                          const updated = activeSlide.stats.filter((_, i) => i !== idx);
                          updateActiveSlide({ stats: updated });
                        }}
                        className="p-2 rounded-xl hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: SEO & SOCIAL SHARE */}
          {activeTab === 'seo' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">SEO Title / Heading Override</label>
                <input
                  type="text"
                  value={activeSlide.seoHeading || ''}
                  onChange={(e) => updateActiveSlide({ seoHeading: e.target.value })}
                  placeholder="Vision79 Foundation | Direct Action in Saint Lucia"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">Meta Description (150-160 characters)</label>
                <textarea
                  rows={2}
                  value={activeSlide.seoMetaDescription || ''}
                  onChange={(e) => updateActiveSlide({ seoMetaDescription: e.target.value })}
                  placeholder="Vision79 Foundation bridges clean water, youth education, and disaster relief with radical transparency..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white">Open Graph / Social Sharing Image URL</label>
                <input
                  type="url"
                  value={activeSlide.socialShareImage || ''}
                  onChange={(e) => updateActiveSlide({ socialShareImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#F27D26] uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>Live Slide Preview</span>
              </span>
              <span className="text-[10px] text-white/50">{activeSlide.mediaType.toUpperCase()}</span>
            </div>

            {/* Preview Box */}
            <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10 bg-black flex flex-col justify-between p-4">
              <img
                src={activeSlide.posterImage || activeSlide.imageUrl}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: activeSlide.overlayOpacity / 100 }}
              />

              <div className="relative z-10 flex justify-between items-center text-[10px]">
                <span className="px-2 py-0.5 rounded bg-white/20 text-white font-bold uppercase">
                  {activeSlide.campaignType || 'Standard'}
                </span>
                <span className="text-white/60">Hero Viewport</span>
              </div>

              <div className="relative z-10 space-y-1">
                <h4 className="font-extrabold text-sm text-white line-clamp-2">{activeSlide.headline}</h4>
                <p className="text-[10px] text-white/70 line-clamp-2">{activeSlide.subheading}</p>
                
                <div className="flex items-center gap-2 pt-2">
                  <span className="px-3 py-1 rounded-full bg-[#F27D26] text-black text-[9px] font-black uppercase">
                    {activeSlide.primaryCtaText}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[9px] font-bold uppercase border border-white/20">
                    {activeSlide.secondaryCtaText}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/60 space-y-1">
              <div className="font-bold text-white">Full-Screen Standard</div>
              <p>Renders at 100vh with automated responsive media delivery for Desktop, Tablet, and Mobile devices.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
