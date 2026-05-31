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
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedInstallment, setSelectedInstallment] = useState<number>(12);
  const [timer, setTimer] = useState({ h: 22, m: 18, s: 42 });

  // Reset indices on product change
  useEffect(() => {
    setActiveImageIdx(0);
    setIsFavorited(false);
  }, [product]);

  // Handle countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 23, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const images = product.additionalImages || [
    product.image,
    product.image,
    product.image
  ];

  // Map category to name for breadcrumbs
  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'electronics': return 'Elektronika';
      case 'fashion': return 'Kiyim va Aksessuarlar';
      case 'home': return 'Uy va Ro‘zg‘or';
      case 'beauty': return 'Go‘zallik va Parvarish';
      case 'sports': return 'Sport va Hordiq';
      default: return 'Barcha toifalar';
    }
  };

  // Generate sizes / choice options list based on product category
  let sizeLabel = '';
  let sizesList: string[] = [];
  if (product.category === 'electronics') {
    sizeLabel = 'Kafolat xizmati:';
    sizesList = ['1 oy (magazin)', '3 oy (servis)', '12 oy (rasmiy kafolat)', '24 oy (Luxe VIP)'];
  } else if (product.category === 'fashion') {
    sizeLabel = 'Rang va uslub:';
    sizesList = ['Klassik Qora', 'Premium Platina', 'Oltin Rangli'];
  } else if (product.category === 'sports') {
    sizeLabel = "O'lchami (RU):";
    sizesList = ['39', '40', '41', '42', '43', '44'];
  } else {
    sizeLabel = 'Uslub / Hajm:';
    sizesList = ['Hajmi: 50ml', 'Hajmi: 100ml (Premium)', 'Dual-Lite Versiyasi'];
  }

  // Set default selected size/option
  useEffect(() => {
    if (sizesList.length > 0) {
      setSelectedSize(sizesList[0]);
    }
  }, [product]);

  // Calculate installment payment
  const calculateInstallment = (months: number) => {
    const interest = months === 24 ? 0.20 : months === 12 ? 0.10 : months === 6 ? 0.05 : 0;
    const totalWithInterest = product.price * (1 + interest);
    return Math.round(totalWithInterest / months);
  };

  const formattedOldPrice = Math.floor(product.price * 1.35).toLocaleString('uz-UZ');
  const formattedPrice = product.price.toLocaleString('uz-UZ');
  const monthlyInstCost = calculateInstallment(selectedInstallment).toLocaleString('uz-UZ');

  return (
    <div className={`pb-32 px-1 relative min-h-screen text-sans ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>
      
      {/* Top Navbar */}
      <div className={`flex justify-between items-center py-4 sticky top-0 z-15 backdrop-blur-md px-1 transition-colors ${
        darkMode ? 'bg-[#090d16]/85 text-white' : 'bg-[#f8f9ff]/80 text-[#121c2a]'
      }`}>
        <button 
          onClick={onBack}
          className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-transform shadow-sm ${
            darkMode 
              ? 'bg-slate-800 hover:bg-slate-750 text-slate-100' 
              : 'bg-[#e6eeff] hover:bg-[#dee9fc] text-[#0058be]'
          }`}
          title="Orqaga"
        >
          <span className="material-symbols-outlined font-bold">arrow_back</span>
        </button>
        <span className={`font-extrabold text-xs tracking-widest uppercase ${darkMode ? 'text-blue-400' : 'text-[#0058be]'}`}>
          MAHSULOT TAFSILOTI
        </span>
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-transform shadow-sm text-red-500 ${
            darkMode ? 'bg-slate-800 hover:bg-slate-755' : 'bg-[#e6eeff] hover:bg-[#dee9fc]'
          }`}
          title={isFavorited ? "Saralangan" : "Saralash"}
        >
          <span 
            className="material-symbols-outlined transition-colors duration-200" 
            style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Breadcrumbs Navigation */}
      <div className="py-2 text-[11px] leading-relaxed flex flex-wrap gap-1 text-slate-400 font-medium">
        <span>Bosh sahifa</span>
        <span>&gt;</span>
        <span>Katalog</span>
        <span>&gt;</span>
        <span>{getCategoryName(product.category)}</span>
        <span>&gt;</span>
        <span className="text-[#2170e4] font-semibold">{product.brand}</span>
        <span>&gt;</span>
        <span className="truncate max-w-[150px]">{product.name}</span>
      </div>

      {/* Responsive Grid layout perfectly matching request screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* Left Column (spans 7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Title Section */}
          <div className="space-y-1">
            <h1 className={`font-bold text-lg md:text-2xl tracking-tight leading-snug ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {product.name}
            </h1>

            {/* Sub-header stats */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 pt-1">
              <div className="flex items-center text-amber-500">
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="ml-1 font-bold">{product.rating}</span>
              </div>
              <span>({product.reviewsCount} sharh)</span>
              <span>•</span>
              <span className="hover:text-[#2170e4] cursor-pointer">150+ fotosurat</span>
              <span>•</span>
              <span className="bg-slate-100 text-[#121c2a] dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded font-semibold">3000+ buyurtma</span>
            </div>

            {/* Badges bar */}
            <div className="flex flex-wrap gap-2 pt-2 text-[10px] font-bold">
              <span className="border border-emerald-500 text-emerald-600 px-2 py-0.5 rounded-md flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20">
                <span className="material-symbols-outlined text-[11px]">verified</span> ORIGINAL
              </span>
              <span className="border border-blue-500 text-blue-600 px-2 py-0.5 rounded-md flex items-center gap-1 bg-blue-50 dark:bg-blue-950/20">
                <span className="material-symbols-outlined text-[11px]">verified_user</span> KAFOLAT 1 YIL
              </span>
              <span className="border border-amber-500 text-amber-600 px-2 py-0.5 rounded-md flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20">
                <span className="material-symbols-outlined text-[11px]">flash_on</span> SOTISH XITI
              </span>
            </div>
          </div>

          {/* Picture Gallery Container (Uzum standard split with vertical thumbs) */}
          <div className="grid grid-cols-12 gap-3">
            
            {/* Left thumbnail tray on desktop view */}
            <div className="hidden sm:flex col-span-2 flex-col gap-2 max-h-[380px] overflow-y-auto no-scrollbar">
              {images.map((img, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveImageIdx(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all active:scale-95 ${
                    activeImageIdx === index 
                      ? 'border-[#2170e4] shadow-md scale-102' 
                      : 'border-slate-200 hover:border-slate-350 opacity-80'
                  }`}
                >
                  <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Huge focused main view image */}
            <div className={`col-span-12 sm:col-span-10 relative aspect-[4/5] rounded-2.5xl overflow-hidden border shadow-xs select-none transition-all ${
              darkMode ? 'bg-[#111726]/80 border-[#1e293b]' : 'bg-white border-[#e6eeff]'
            }`}>
              <img 
                src={images[activeImageIdx]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-300 transform scale-100 hover:scale-102"
              />

              {/* Slider fallback keys */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIdx(activeImageIdx === 0 ? images.length - 1 : activeImageIdx - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-[#121c2a] w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  </button>
                  <button 
                    onClick={() => setActiveImageIdx((activeImageIdx + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-[#121c2a] w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </>
              )}

              {/* Dot Indicators for mobile swipe fallback */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/10 backdrop-blur-[1px] px-2.5 py-1 rounded-full z-10 sm:hidden">
                  {images.map((_, index) => (
                    <div 
                      key={index}
                      onClick={() => setActiveImageIdx(index)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                        index === activeImageIdx ? 'bg-[#2170e4] w-3.5' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Under-gallery short rating detail */}
          <div className={`p-4 rounded-xl border flex items-center justify-between text-xs transition-all ${
            darkMode ? 'bg-[#172036]/50 border-[#1e293b]' : 'bg-slate-50 border-slate-150'
          }`}>
            <span className="font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-amber-500 text-sm">stars</span>
              Mijozlarimiz fikri: {product.rating} ball / 5.0
            </span>
            <span className="text-[#2170e4] font-medium cursor-pointer hover:underline">
              Barcha sharhlarni o'qish ({product.reviewsCount})
            </span>
          </div>

          {/* Description Section */}
          <div className="space-y-2 pt-2">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
              Mahsulot haqida ma'lumot
            </h3>
            <p className={`text-sm leading-relaxed text-justify md:text-left ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {product.description}
            </p>
          </div>

          {/* Technical specifications specs table */}
          <div className={`border p-5 rounded-xl space-y-3 shadow-xs text-sm transition-colors ${
            darkMode ? 'bg-[#1e293b]/30 border-[#1e293b]/60 text-white' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-bold text-sm tracking-wide border-b pb-2">
              Batafsil texnik parametrlari
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-2">
              <li className="flex justify-between text-xs py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-slate-400">Ishlash vaqti (quvvat)</span>
                <span className="font-bold">{product.specs.battery || 'Mavjud emas'}</span>
              </li>
              <li className="flex justify-between text-xs py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-slate-400">Tizim / Izolyatsiya</span>
                <span className="font-bold">{product.specs.isolation || 'Mavjud emas'}</span>
              </li>
              <li className="flex justify-between text-xs py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-slate-400">Radius / Ulanish</span>
                <span className="font-bold">{product.specs.range || 'Mavjud emas'}</span>
              </li>
              <li className="flex justify-between text-xs py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-slate-400">Og'irligi</span>
                <span className="font-bold">{product.specs.weight || 'Mavjud emas'}</span>
              </li>
              <li className="flex justify-between text-xs py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-slate-400">Dinamik diametri</span>
                <span className="font-bold">{product.specs.driverDiameter || 'Mavjud emas'}</span>
              </li>
              <li className="flex justify-between text-xs py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-slate-400">Zaryadlash turi</span>
                <span className="font-bold">{product.specs.charging || 'Mavjud emas'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column (spans 5 cols on desktop, acts as Purchase Control block) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Sizing elements option selection block */}
          {sizesList.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="uppercase tracking-wider">{sizeLabel}</span>
                <span className="text-[#2170e4]">{selectedSize || 'Tanlanmagan'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizesList.map((sz, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedSize(sz)}
                    className={`text-xs px-3.5 py-2.5 rounded-lg border font-medium transition-all duration-200 active:scale-95 ${
                      selectedSize === sz
                        ? 'border-[#2170e4] bg-[#2170e4]/5 text-[#2170e4] font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-350 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-850'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#2170e4] block cursor-pointer hover:underline font-semibold mt-1">
                O'lchamlar va turlari haqida batafsil ma'lumot
              </span>
            </div>
          )}

          {/* UZUM-like checkout card block */}
          <div className={`rounded-2xl border overflow-hidden shadow-md transition-all ${
            darkMode 
              ? 'bg-[#172036]/40 border-[#1e293b]/60' 
              : 'bg-[#fafbfe] border-slate-200/90'
          }`}>
            
            {/* Promo Header Banner */}
            <div className="bg-[#2170e4] text-white px-4 py-3 flex justify-between items-center text-xs font-bold leading-none">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] animate-pulse">flash_on</span>
                <span>Yozgi chegirmalar aksiyasi</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className="bg-white/20 px-1 py-0.5 rounded">{timer.h.toString().padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/20 px-1 py-0.5 rounded">{timer.m.toString().padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/20 px-1 py-0.5 rounded">{timer.s.toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Mahsulot narxi</span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {formattedPrice} so'm
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {formattedOldPrice} so'm
                  </span>
                </div>
                
                {/* Secondary price badge (Uzum karta like) */}
                <span className="inline-block mt-2 text-[10px] font-bold py-1 px-2.5 bg-indigo-50 text-[#0058be] dark:bg-blue-950/20 dark:text-blue-400 rounded-md">
                   Sodiqlik kartasi bilan yana-da arzonroq narxda
                </span>
              </div>

              {/* Installment Calculator Block */}
              <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 space-y-3">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Muddatli to'lov (Rassrochka)</span>
                
                {/* Installment option tabs */}
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-extrabold text-center">
                  {[3, 6, 12, 24].map((m) => (
                    <div 
                      key={m}
                      onClick={() => setSelectedInstallment(m)}
                      className={`py-1.5 rounded-lg cursor-pointer transition-all ${
                        selectedInstallment === m 
                          ? 'bg-white dark:bg-slate-700 text-[#2170e4] font-extrabold shadow-xs' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {m} oy
                    </div>
                  ))}
                </div>

                {/* Installment Result yellow highlighted box */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 p-3.5 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">Haftalik / Oylik to'lov:</span>
                    <p className="text-sm font-extrabold text-amber-800 dark:text-amber-300">
                      {monthlyInstCost} so'm <span className="text-xs font-medium">/ oyiga</span>
                    </p>
                  </div>
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {selectedInstallment} oyga
                  </span>
                </div>
              </div>

              {/* Interactive buttons rows */}
              <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 space-y-3">
                
                {/* Secondary side-by-side row */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert(`Tezkor buyurtma faollashtirildi! ${product.name} mahsuloti siz uchun band qilindi.`)}
                    className={`flex-1 h-12 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                      darkMode 
                        ? 'border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700' 
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    1 klikda xarid qilish
                  </button>

                  <button 
                    onClick={() => {
                      setIsFavorited(!isFavorited);
                      alert(isFavorited ? "Saralanganlardan muvaffaqiyatli o'chirildi!" : "Saralanganlarga qo'shildi!");
                    }}
                    className={`w-12 h-12 border rounded-xl flex items-center justify-center active:scale-90 transition-all ${
                      isFavorited ? 'text-red-500 border-red-200 bg-red-50' : 'text-slate-400 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20 relative] pointer-events-none" style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}>
                      favorite
                    </span>
                  </button>
                </div>

                {/* Big Primary royal-purple button exactly mapping Uzum Market */}
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    alert("Ajoyib! Mahsulot muvaffaqiyatli savatga qo'shildi.");
                  }}
                  className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-2xl p-4 font-bold flex flex-col items-center justify-center gap-0.5 active:scale-98 transition-all shadow-md hover:shadow-lg shrink-0"
                >
                  <span className="text-base font-extrabold tracking-wide flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                    Savatga qo‘shish
                  </span>
                  <span className="text-[10px] text-violet-200 font-medium">
                    Do'konda mavjud • Ertagayoq yetkazib beramiz
                  </span>
                </button>
              </div>

              {/* Status and notification alerts help blocks */}
              <div className="space-y-2 pt-2 text-[11px] font-medium">
                <div className="flex items-center gap-2 text-emerald-600 container bg-emerald-50/50 dark:bg-emerald-950/10 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/10">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Omborda yetarli miqdorda bor (7 dona xarid qilish mumkin)</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-600 container bg-indigo-50/50 dark:bg-indigo-950/10 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/10">
                  <span className="material-symbols-outlined text-base font-bold">local_fire_department</span>
                  <span>Ushbu mahsulotni shu haftada 38 kishi xarid qildi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
