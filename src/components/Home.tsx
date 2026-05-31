import { Product } from '../types';
import { CATEGORIES } from '../data';
import { useState, FormEvent } from 'react';

interface HomeProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (screen: 'HOME' | 'CATALOG' | 'PRODUCT_DETAIL' | 'CART' | 'PROFILE') => void;
  setSearchKeywordFilter: (keyword: string) => void;
  isMobileLayout?: boolean;
  darkMode?: boolean;
}

export default function Home({ 
  products,
  onSelectProduct, 
  onAddToCart, 
  onNavigate, 
  setSearchKeywordFilter,
  isMobileLayout = false,
  darkMode = false
}: HomeProps) {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState('');

  // Handle local search submit
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchKeywordFilter(localSearch.trim());
    onNavigate('CATALOG');
  };

  // Filter featured products based on selected tab cat or show default set (Studio Pro X1, Luna Chrono, Opal Desk Light, Velocity Runner)
  const featuredProducts = products.filter(p => {
    const isDefaultFeatured = ['studio-pro-x1', 'luna-chrono', 'opal-desk-light', 'velocity-runner'].includes(p.id);
    if (selectedCat === 'all') {
      return isDefaultFeatured;
    }
    return p.category === selectedCat;
  });

  return (
    <div className="space-y-6 pt-4 pb-12" id="home-view-container">
      {/* Greeting Section */}
      <div>
        <h2 className={`text-22px font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>Xush kelibsiz!</h2>
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-[#424754]'}`}>Bugungi yangi mahsulotlarni kashf eting.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className={`flex items-center rounded-xl px-4 py-3 gap-3 transition-all border ${
          darkMode 
            ? 'bg-[#172036] border-[#1e293b] focus-within:border-[#2170e4] focus-within:ring-1 focus-within:ring-[#2170e4]' 
            : 'bg-[#eff4ff] border-[#c2c6d6] focus-within:border-[#0058be] focus-within:ring-1 focus-within:ring-[#0058be]'
        }`}>
          <span className={`material-symbols-outlined ${darkMode ? 'text-slate-400' : 'text-[#424754]'}`}>search</span>
          <input 
            className={`bg-transparent border-none focus:outline-none w-full text-sm p-0 outline-none ${
              darkMode ? 'placeholder:text-slate-500 text-white' : 'placeholder:text-[#727785] text-[#121c2a]'
            }`} 
            placeholder="Mahsulotlarni qidirish..." 
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <button type="button" className={`${darkMode ? 'text-slate-400' : 'text-[#424754]'} hover:text-[#2170e4] active:scale-95 transition-transform`}>
            <span className="material-symbols-outlined">mic</span>
          </button>
        </div>
      </form>

      {/* Categories Scroller */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>Kategoriyalar</h3>
          <button 
            onClick={() => { setSelectedCat('all'); onNavigate('CATALOG'); }} 
            className="text-[#2170e4] text-[12px] font-medium hover:underline"
          >
            Barchasini ko‘rish
          </button>
        </div>
        
        <div className="flex flex-row overflow-x-auto no-scrollbar gap-3 md:gap-8 justify-start md:justify-center py-2 px-1.5 scroll-smooth">
          {/* General 'All' Category */}
          <div 
            onClick={() => setSelectedCat('all')}
            className="flex flex-col items-center gap-1.5 cursor-pointer group text-center flex-shrink-0 w-20 md:w-24 animate-fade-in"
          >
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 active:scale-90 ${
              selectedCat === 'all' 
                ? 'bg-[#2170e4] text-white' 
                : darkMode 
                  ? 'bg-[#1e293b] text-slate-300 hover:bg-[#2e3b55]' 
                  : 'bg-[#dee9fc] text-[#0058be] group-hover:bg-[#c2d6ff]'
            }`}>
              <span className="material-symbols-outlined text-[20px] md:text-[24px]">grid_view</span>
            </div>
            <span className={`text-[10px] md:text-xs font-semibold leading-tight text-center h-8 flex items-center justify-center transition-colors px-0.5 ${
              selectedCat === 'all' ? 'text-[#2170e4] font-bold' : (darkMode ? 'text-slate-300' : 'text-[#424754]')
            }`}>Barchasi</span>
          </div>

          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group text-center flex-shrink-0 w-20 md:w-24"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 active:scale-90 ${
                selectedCat === cat.id 
                  ? 'bg-[#2170e4] text-white' 
                  : darkMode 
                    ? 'bg-[#1e293b] text-slate-300 hover:bg-[#2e3b55]' 
                    : 'bg-[#dee9fc] text-[#0058be] group-hover:bg-[#c2d6ff]'
              }`}>
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">{cat.icon}</span>
              </div>
              <span className={`text-[10px] md:text-xs font-semibold leading-tight text-center h-8 flex items-center justify-center transition-colors px-0.5 line-clamp-2 ${
                selectedCat === cat.id ? 'text-[#2170e4] font-bold' : (darkMode ? 'text-slate-300' : 'text-[#424754]')
              }`}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <section className="relative h-40 md:h-56 rounded-xl overflow-hidden shadow-sm active:opacity-95 cursor-pointer transition-opacity" onClick={() => onNavigate('CATALOG')}>
        <img 
          alt="Promotional Banner" 
          className="w-full h-full object-cover select-none" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvGsb3yzRmnR4Oc6_8-ns9t6KWAkdxS3jd_KMrXZcgJX3FDt5KqJzZB32JeTE3oNrRBzHQ8qwVM1RU7ojdhU44h5yesKAcqabFuNUMlAOGfUKAxr6p19OiV4eiwEGEKFTVUF6UHzuFREmcSi8DLUvboGzrp4AfXhYy2UAAGDS0-J7G6L0luyN3uuUUzWVNifs3kVxsAPNN-zniDILSDirO7I9zQH5eJZ07sUUPGEcWEoljnYMgumMFwTlkfe0cv9dRJzMdWWESKXW2"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center px-6 space-y-1">
          <span className="text-white/80 font-medium text-xs tracking-wider uppercase">Maxsus Taklif</span>
          <h4 className="text-white font-bold text-lg md:text-xl">Yozgi Katta Chegirma -40%</h4>
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate('CATALOG'); }}
            className="bg-[#2170e4] hover:bg-[#0058be] text-white px-4 py-1.5 rounded-full w-max text-xs font-semibold active:scale-95 transition-transform mt-1 shadow-sm"
          >
            Sotib olish
          </button>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>
            {selectedCat === 'all' ? 'Tavsiya etilgan mahsulotlar' : `${CATEGORIES.find(c => c.id === selectedCat)?.name} bo‘limi`}
          </h3>
          <button onClick={() => onNavigate('CATALOG')} className="text-[#2170e4] text-[12px] font-medium hover:underline">
            Hammasini ko‘rish
          </button>
        </div>

        {featuredProducts.length === 0 ? (
          <div className={`text-center p-8 rounded-xl border ${
            darkMode ? 'bg-[#172036] border-[#1e293b]/50 text-slate-300' : 'bg-[#eff4ff] border-[#c2c6d6] text-[#424754]'
          }`}>
            <p className="text-sm font-medium">Ushbu turkumda hozircha mahsulot yo‘q.</p>
            <p className="text-xs text-slate-500 mt-1">Boshqa turkumlarni ko‘rib ko‘ring!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {featuredProducts.map((p) => (
              <div 
                key={p.id} 
                className="space-y-2 group cursor-pointer"
                onClick={() => onSelectProduct(p.id)}
              >
                <div className={`aspect-[3/4] rounded-xl overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] border transition-colors ${
                  darkMode ? 'bg-[#111726]/80 border-[#1e293b]' : 'bg-white border-[#e6eeff]'
                }`}>
                  <img 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={p.image}
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(p);
                    }}
                    className="absolute bottom-2.5 right-2.5 w-9 h-9 bg-[#2170e4] hover:bg-[#0058be] text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
                    title="Savatga qo‘shish"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="space-y-0.5 px-1">
                  <p className={`text-[10px] uppercase tracking-wider font-extrabold ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>
                    {p.brand}
                  </p>
                  <p className={`font-semibold text-sm group-hover:text-[#2170e4] transition-colors truncate ${
                    darkMode ? 'text-white' : 'text-[#121c2a]'
                  }`}>
                    {p.name}
                  </p>
                  <p className={`font-bold text-base ${darkMode ? 'text-blue-400' : 'text-[#121c2a]'}`}>
                    {p.price.toLocaleString('uz-UZ')} so'm
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
