import { Product } from '../types';
import { useState, useEffect } from 'react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onShare: (productName: string) => void;
  isMobileLayout?: boolean;
  darkMode?: boolean;
}

export default function ProductDetail({ 
  product, 
  onBack, 
  onAddToCart, 
  onShare,
  isMobileLayout = false,
  darkMode = false
}: ProductDetailProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Reset indices on product change
  useEffect(() => {
    setActiveImageIdx(0);
    setIsFavorited(false);
  }, [product]);

  const images = product.additionalImages || [product.image];

  return (
    <div className="pb-32 relative min-h-screen">
      {/* Detached Top Nav (Dynamic with transactional focus) */}
      <div className={`flex justify-between items-center py-4 backdrop-blur-md sticky top-0 z-10 -mx-container-padding px-container-padding transition-colors ${
        darkMode ? 'bg-[#090d16]/85 text-white' : 'bg-[#f8f9ff]/80 text-[#121c2a]'
      }`}>
        <button 
          onClick={onBack}
          className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-transform shadow-sm ${
            darkMode 
              ? 'bg-slate-800 hover:bg-slate-750 text-slate-100' 
              : 'bg-[#e6eeff] hover:bg-[#dee9fc] text-[#0058be]'
          }`}
          title="Go back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className={`font-bold text-sm tracking-widest uppercase ${darkMode ? 'text-blue-400' : 'text-[#0058be]'}`}>LUXE DETAILS</span>
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-transform shadow-sm text-red-500 ${
            darkMode ? 'bg-slate-800 hover:bg-slate-755' : 'bg-[#e6eeff] hover:bg-[#dee9fc]'
          }`}
          title={isFavorited ? "Favored" : "Favorite"}
        >
          <span 
            className="material-symbols-outlined transition-colors duration-200" 
            style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Hero Image slider gallery */}
      <div className={`relative w-full aspect-[4/5] rounded-2xl overflow-hidden mt-2 border shadow-sm select-none transition-colors ${
        darkMode ? 'bg-[#111726]/80 border-[#1e293b]' : 'bg-white border-[#e6eeff]'
      }`}>
        <div 
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeImageIdx * 100}%)` }}
        >
          {images.map((img, index) => (
            <img 
              key={index}
              alt={`${product.name} Gallery ${index}`} 
              className="w-full h-full object-cover flex-shrink-0" 
              src={img}
            />
          ))}
        </div>

        {/* Swipe Control Overlay Left/Right arrows if multiple images */}
        {images.length > 1 && (
          <>
            <button 
              onClick={() => {
                setActiveImageIdx(activeImageIdx === 0 ? images.length - 1 : activeImageIdx - 1);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-[#121c2a] w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button 
              onClick={() => {
                setActiveImageIdx((activeImageIdx + 1) % images.length);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-[#121c2a] w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </>
        )}

        {/* Gallery Slider Circle Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/10 backdrop-blur-[2px] px-3 py-1.5 rounded-full z-10">
            {images.map((_, index) => (
              <div 
                key={index}
                onClick={() => setActiveImageIdx(index)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                  index === activeImageIdx 
                    ? 'bg-[#2170e4] scale-110 w-4' 
                    : 'bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="mt-6 space-y-6">
        {/* Title Identity Block */}
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-3">
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>
                {product.brand}
              </span>
              <h1 className={`font-bold text-xl md:text-2xl tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>
                {product.name}
              </h1>
            </div>
            <span className={`font-bold text-xl md:text-2xl whitespace-nowrap ${darkMode ? 'text-blue-400' : 'text-[#0058be]'}`}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <span 
                  key={i} 
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: i < Math.floor(product.rating) ? "'FILL' 1" : "'FILL' 0" }}
                >
                  star
                </span>
              ))}
            </div>
            <span className={`text-[12px] font-bold ${darkMode ? 'text-blue-400' : 'text-[#0058be]'}`}>{product.rating}</span>
            <span className={`text-[12px] ${darkMode ? 'text-slate-400' : 'text-[#424754]'}`}>({product.reviewsCount} Reviews)</span>
          </div>
        </div>

        {/* Details Experience Section */}
        <div className="space-y-2">
          <h3 className={`text-[11px] font-extrabold tracking-widest uppercase ${darkMode ? 'text-slate-300' : 'text-[#121c2a]'}`}>
            The Experience
          </h3>
          <p className={`text-sm leading-relaxed text-justify md:text-left ${darkMode ? 'text-slate-300' : 'text-[#424754]'}`}>
            {product.description}
          </p>
        </div>

        {/* Specifications Bento Grid */}
        <div className={`grid gap-3 ${
          isMobileLayout ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'
        }`}>
          <div className={`p-4 rounded-xl flex flex-col gap-1 shadow-sm border ${
            darkMode ? 'bg-[#172036] border-[#1e293b] text-white' : 'bg-[#eff4ff] border-[#dee9fc] text-[#121c2a]'
          }`}>
            <span className="material-symbols-outlined text-[#2170e4] text-xl">battery_charging_full</span>
            <span className={`text-[9px] font-bold uppercase mt-1 ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>Battery</span>
            <span className="font-bold text-xs truncate">{product.specs.battery || 'N/A'}</span>
          </div>

          <div className={`p-4 rounded-xl flex flex-col gap-1 shadow-sm border ${
            darkMode ? 'bg-[#172036] border-[#1e293b] text-white' : 'bg-[#eff4ff] border-[#dee9fc] text-[#121c2a]'
          }`}>
            <span className="material-symbols-outlined text-[#2170e4] text-xl">noise_control_on</span>
            <span className={`text-[9px] font-bold uppercase mt-1 ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>Isolation</span>
            <span className="font-bold text-xs truncate">{product.specs.isolation || 'N/A'}</span>
          </div>

          <div className={`p-4 rounded-xl flex flex-col gap-1 shadow-sm border ${
            darkMode ? 'bg-[#172036] border-[#1e293b] text-white' : 'bg-[#eff4ff] border-[#dee9fc] text-[#121c2a]'
          }`}>
            <span className="material-symbols-outlined text-[#2170e4] text-xl">bluetooth</span>
            <span className={`text-[9px] font-bold uppercase mt-1 ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>Connectivity</span>
            <span className="font-bold text-xs truncate">{product.specs.range || 'N/A'}</span>
          </div>

          <div className={`p-4 rounded-xl flex flex-col gap-1 shadow-sm border ${
            darkMode ? 'bg-[#172036] border-[#1e293b] text-white' : 'bg-[#eff4ff] border-[#dee9fc] text-[#121c2a]'
          }`}>
            <span className="material-symbols-outlined text-[#2170e4] text-xl">speed</span>
            <span className={`text-[9px] font-bold uppercase mt-1 ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>Latency</span>
            <span className="font-bold text-xs truncate">{product.specs.latency || 'N/A'}</span>
          </div>
        </div>

        {/* Technical Data specifications list */}
        <div className={`border p-5 rounded-xl space-y-3 shadow-sm text-sm transition-colors ${
          darkMode ? 'bg-[#1e293b]/30 border-[#1e293b]/60 text-white' : 'bg-[#d9e3f6]/40 border-[#c2c6d6]/60 text-[#121c2a]'
        }`}>
          <h3 className={`font-bold text-base tracking-tight border-b pb-2 ${darkMode ? 'border-[#1e293b]' : 'border-[#c2c6d6]/40'}`}>
            Technical Specifications
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between text-xs py-0.5 border-b border-transparent">
              <span className={darkMode ? 'text-slate-300' : 'text-[#424754]'}>Frequency Response</span>
              <span className="font-semibold">{product.specs.frequencyResponse || 'N/A'}</span>
            </li>
            <li className="flex justify-between text-xs py-0.5 border-b border-transparent">
              <span className={darkMode ? 'text-slate-300' : 'text-[#424754]'}>Driver Diameter</span>
              <span className="font-semibold">{product.specs.driverDiameter || 'N/A'}</span>
            </li>
            <li className="flex justify-between text-xs py-0.5 border-b border-transparent">
              <span className={darkMode ? 'text-slate-300' : 'text-[#424754]'}>Weight</span>
              <span className="font-semibold">{product.specs.weight || 'N/A'}</span>
            </li>
            <li className="flex justify-between text-xs py-0.5 border-b border-transparent">
              <span className={darkMode ? 'text-slate-300' : 'text-[#424754]'}>Charging System</span>
              <span className="font-semibold">{product.specs.charging || 'N/A'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Sticky Bottom Transactional Footer (CTA) */}
      <footer className={`absolute bottom-0 left-0 right-0 w-full z-45 px-6 py-4 border-t flex justify-center transition-colors ${
        darkMode ? 'bg-[#090d16]/95 border-[#1e293b]' : 'bg-white/95 border-[#c2c6d6]'
      }`}>
        <div className="flex items-center gap-4 w-full max-w-screen-md">
          <div className="hidden md:flex flex-col">
            <span className={`text-[10px] uppercase font-bold ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>Total Price</span>
            <span className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>${product.price.toFixed(2)}</span>
          </div>

          <button 
            onClick={() => onAddToCart(product)}
            className="flex-1 h-14 bg-[#2170e4] hover:bg-[#0058be] text-white rounded-full font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:shadow-xl shrink-0"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Add to luxury Bag
          </button>

          <button 
            onClick={() => onShare(product.name)}
            className={`w-14 h-14 border rounded-full flex items-center justify-center active:scale-90 transition-all shadow-sm ${
              darkMode 
                ? 'border-[#1e293b] text-slate-200 bg-slate-800 hover:bg-slate-700' 
                : 'border-[#c2c6d6] text-[#121c2a] hover:bg-[#eff4ff] active:bg-[#dce2f3]'
            }`}
            title="Share this product"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
