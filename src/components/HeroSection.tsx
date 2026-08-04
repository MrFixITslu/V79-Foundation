import React, { useState, useEffect, useRef } from 'react';
import { HeroConfig, HeroSlide } from '../types.js';
import {
  Heart,
  FileCheck,
  Users,
  Sparkles,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Share2,
  Clock,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Eye,
  CheckCircle2,
  X,
  Layers,
  Award,
} from 'lucide-react';

interface HeroSectionProps {
  heroConfig: HeroConfig | null;
  setCurrentTab: (tab: string) => void;
  openDonateModal: (projectId?: string) => void;
  onNavigateToNext?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroConfig,
  setCurrentTab,
  openDonateModal,
  onNavigateToNext,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [userReducedMotion, setUserReducedMotion] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [countdownText, setCountdownText] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Filter active & enabled slides
  const slides: HeroSlide[] = heroConfig?.slides?.filter((s) => s.enabled) || [];
  const currentSlide: HeroSlide | undefined = slides[activeSlideIndex] || slides[0];

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setUserReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setUserReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle Video AutoPlay & Mute controls
  useEffect(() => {
    if (videoRef.current) {
      if (userReducedMotion) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Fallback if browser blocks unmuted autoplay
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, userReducedMotion, activeSlideIndex]);

  // Handle Auto-rotation if enabled in config
  useEffect(() => {
    if (!heroConfig?.autoRotate || slides.length <= 1 || userReducedMotion || !isPlaying) return;

    const intervalMs = (heroConfig.rotateIntervalSeconds || 8) * 1000;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [heroConfig, slides.length, userReducedMotion, isPlaying]);

  // Countdown timer calculation if current slide has eventCountdownDate
  useEffect(() => {
    if (!currentSlide?.eventCountdownDate) {
      setCountdownText(null);
      return;
    }

    const updateCountdown = () => {
      const target = new Date(currentSlide.eventCountdownDate!).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdownText('Event Live Now');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdownText(`${days}d ${hours}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentSlide?.eventCountdownDate]);

  if (!currentSlide) return null;

  // CTA Button Click Router
  const handleCtaClick = (action: string) => {
    switch (action) {
      case 'donate':
        openDonateModal();
        break;
      case 'projects':
        setCurrentTab('projects');
        break;
      case 'volunteer':
        setCurrentTab('volunteers');
        break;
      case 'transparency':
        setCurrentTab('transparency');
        break;
      case 'suggest':
        setCurrentTab('projects');
        break;
      default:
        openDonateModal();
    }
  };

  // Scroll down smoothly to next section
  const scrollToNextSection = () => {
    if (onNavigateToNext) {
      onNavigateToNext();
    } else {
      const nextElem = document.getElementById('next-landing-section');
      if (nextElem) {
        nextElem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    }
  };

  // Gradient style class builder
  const getGradientClass = (gradientType: string, opacity: number) => {
    const alpha = opacity / 100;
    switch (gradientType) {
      case 'brand':
        return `bg-gradient-to-t from-black via-black/${Math.round(alpha * 100)} to-black/40`;
      case 'radial':
        return `bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/20 via-black/${Math.round(alpha * 100)} to-black`;
      case 'minimal':
        return `bg-black/${Math.round(alpha * 100)}`;
      case 'dark':
      default:
        return `bg-gradient-to-r from-black via-black/${Math.round(alpha * 100)} to-black/80`;
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] min-h-[650px] max-h-[1080px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 text-white bg-black select-none group">
      
      {/* 1. BACKGROUND MEDIA LAYER */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {currentSlide.mediaType === 'video' && currentSlide.videoUrl && !userReducedMotion ? (
          <video
            ref={videoRef}
            key={currentSlide.videoUrl}
            src={currentSlide.videoUrl}
            poster={currentSlide.posterImage || currentSlide.imageUrl}
            autoPlay={isPlaying && !userReducedMotion}
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="w-full h-full object-cover transition-opacity duration-1000 scale-105"
          />
        ) : (
          <img
            src={currentSlide.imageUrl || currentSlide.posterImage || currentSlide.fallbackImage}
            alt={currentSlide.headline}
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
          />
        )}
      </div>

      {/* 2. CONFIGURABLE OVERLAY LAYER */}
      <div
        className={`absolute inset-0 z-10 transition-all duration-700 pointer-events-none ${getGradientClass(
          currentSlide.overlayGradient,
          currentSlide.overlayOpacity
        )}`}
        style={{ opacity: currentSlide.overlayOpacity / 100 }}
      />

      {/* 3. HERO CONTENT CONTAINER */}
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 sm:px-12 py-10 flex flex-col justify-between">
        
        {/* Top Campaign Badge & Accessibility Bar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          
          <div className="flex flex-wrap items-center gap-2">
            {currentSlide.campaignType === 'emergency' && (
              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-[11px] uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>EMERGENCY APPEAL</span>
              </span>
            )}

            {currentSlide.campaignType === 'seasonal' && (
              <span className="px-3 py-1 rounded-full bg-[#F27D26]/20 border border-[#F27D26]/40 text-[#F27D26] font-black text-[11px] uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SEASONAL CAMPAIGN</span>
              </span>
            )}

            {currentSlide.campaignType === 'standard' && (
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 font-extrabold text-[11px] uppercase tracking-widest">
                DIRECT ACTION FOUNDATION
              </span>
            )}

            {countdownText && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Countdown: {countdownText}</span>
              </span>
            )}
          </div>

          {/* Video & Reduced Motion Controls */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/15">
            {currentSlide.mediaType === 'video' && (
              <>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'Pause Video' : 'Play Video'}
                  className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </>
            )}

            <button
              onClick={() => setUserReducedMotion(!userReducedMotion)}
              title={userReducedMotion ? 'Enable Full Motion' : 'Reduce Motion'}
              className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                userReducedMotion ? 'bg-[#F27D26] text-black' : 'hover:bg-white/10 text-white/70'
              }`}
            >
              {userReducedMotion ? 'Motion Off' : 'Motion On'}
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              title="SEO & Social Share Preview"
              className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Center Text Area */}
        <div className="my-auto max-w-3xl space-y-6">
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-lg">
            {currentSlide.headline}
          </h1>

          <p className="text-sm sm:text-lg text-white/90 font-medium leading-relaxed max-w-2xl drop-shadow-md">
            {currentSlide.subheading}
          </p>

          {currentSlide.missionStatement && (
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-2xl text-xs sm:text-sm text-white/80 flex items-start gap-3">
              <Award className="w-5 h-5 text-[#F27D26] shrink-0 mt-0.5" />
              <span>{currentSlide.missionStatement}</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => handleCtaClick(currentSlide.primaryCtaAction)}
              className="px-8 py-4 rounded-full bg-[#F27D26] hover:bg-[#e06c1b] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl shadow-[#F27D26]/25 cursor-pointer transform hover:scale-105"
            >
              <Heart className="w-4 h-4 fill-black text-black" />
              <span>{currentSlide.primaryCtaText}</span>
            </button>

            <button
              onClick={() => handleCtaClick(currentSlide.secondaryCtaAction)}
              className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-[#F27D26]" />
              <span>{currentSlide.secondaryCtaText}</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar: Animated Stats & Carousel Controls */}
        <div className="space-y-6">
          
          {/* Stats Bar */}
          {currentSlide.stats && currentSlide.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15">
              {currentSlide.stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-xl sm:text-3xl font-black text-[#F27D26] tracking-tight">
                    {stat.prefix || ''}
                    {stat.value.toLocaleString()}
                    {stat.suffix || ''}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slide Rotator / Pagination controls & Scroll Down Indicator */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            
            {/* Slide Rotator Navigation */}
            {slides.length > 1 ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === activeSlideIndex ? 'w-8 bg-[#F27D26]' : 'w-2.5 bg-white/30 hover:bg-white/60'
                      }`}
                      title={s.title}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev + 1) % slides.length)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-xs font-bold text-white/40">Vision79 Foundation Official Portal</div>
            )}

            {/* Scroll Down Indicator */}
            <button
              onClick={scrollToNextSection}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-extrabold text-white cursor-pointer transition-all animate-bounce"
            >
              <span>Explore Missions</span>
              <ChevronDown className="w-4 h-4 text-[#F27D26]" />
            </button>

          </div>

        </div>

      </div>

      {/* SEO & Social Share Preview Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#F27D26]" />
                <h3 className="font-extrabold text-base text-white">SEO & Social Sharing Preview</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Card */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden space-y-3 p-4">
              <img
                src={currentSlide.socialShareImage || currentSlide.imageUrl || currentSlide.posterImage}
                alt="Social Card"
                className="w-full h-40 object-cover rounded-xl border border-white/10"
              />
              <div>
                <span className="text-[10px] font-bold text-[#F27D26] uppercase">vision79.org</span>
                <h4 className="font-extrabold text-sm text-white">{currentSlide.seoHeading || currentSlide.headline}</h4>
                <p className="text-xs text-white/60 mt-1 line-clamp-2">{currentSlide.seoMetaDescription || currentSlide.subheading}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#F27D26] text-black font-extrabold text-xs uppercase cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
