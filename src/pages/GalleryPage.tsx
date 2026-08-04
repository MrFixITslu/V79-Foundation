import React, { useState } from 'react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider.tsx';
import { Image as ImageIcon, Sparkles, Filter, X } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const beforeAfterPairs = [
    {
      id: 'ba-1',
      title: 'Water Well Solar Pump Site Transformation',
      location: 'Kilifi Community, Kenya',
      before: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&q=80&w=800',
      after: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=800',
      tag: 'Water',
    },
    {
      id: 'ba-2',
      title: 'Rural Primary School Solar Digital Lab',
      location: 'San Mateo, Guatemala',
      before: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
      after: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800',
      tag: 'Education',
    },
  ];

  const galleryItems = [
    { id: 1, title: 'Solar Well Installation Team', tag: 'Water', url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'Digital Literacy Classroom in Action', tag: 'Education', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'Mobile Healthcare Clinic On-Site', tag: 'Healthcare', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800' },
    { id: 4, title: 'Community Water Testing Lab', tag: 'Water', url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800' },
    { id: 5, title: 'Youth Coding Workshop', tag: 'Education', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' },
    { id: 6, title: 'Reforestation Tree Planting', tag: 'Environment', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800' },
  ];

  const tags = ['All', 'Water', 'Education', 'Healthcare', 'Environment'];

  const filteredGallery = selectedTag === 'All' ? galleryItems : galleryItems.filter((g) => g.tag === selectedTag);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#050505] text-white border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26] uppercase tracking-widest">
          <ImageIcon className="w-4 h-4" />
          <span>Visual Impact Evidence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Advanced Media & Transformation Gallery</h1>
        <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
          Drag the interactive before/after sliders to see real infrastructure transformations accomplished through community donor support.
        </p>
      </div>

      {/* Before / After Interactive Section */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#F27D26] uppercase tracking-widest">
            Interactive Field Transformations
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Before & After Impact Comparisons</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {beforeAfterPairs.map((pair) => (
            <div key={pair.id} className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-base text-white">{pair.title}</h3>
                  <p className="text-xs text-white/50 font-medium">{pair.location}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20">
                  {pair.tag}
                </span>
              </div>

              <BeforeAfterSlider beforeUrl={pair.before} afterUrl={pair.after} />
            </div>
          ))}
        </div>
      </div>

      {/* Standard Gallery Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-black text-white">Field Photo Library</h2>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedTag === t
                    ? 'bg-[#F27D26] text-black shadow-sm'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item.url)}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all border border-white/10"
            >
              <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F27D26] text-black uppercase tracking-wider">
                  {item.tag}
                </span>
                <h4 className="font-extrabold text-sm text-white line-clamp-1">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] p-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#F27D26] p-2 cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <img src={lightboxImage} alt="Enlarged media" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10" />
          </div>
        </div>
      )}

    </div>
  );
};
