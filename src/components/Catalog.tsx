import { Product } from '../types';
import { PRODUCTS } from '../data';
import { useState, useEffect } from 'react';

interface CatalogProps {
  onSelectProduct: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  keywordFilter: string;
  setKeywordFilter: (keyword: string) => void;
  isMobileLayout?: boolean;
  darkMode?: boolean;
}

export default function Catalog({ 
  onSelectProduct, 
  onAddToCart, 
  keywordFilter, 
  setKeywordFilter,
  isMobileLayout = false,
  darkMode = false
}: CatalogProps) {
  const [searchWord, setSearchWord] = useState(keywordFilter);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Filters state
  const [filterTechOnly, setFilterTechOnly] = useState(false);
  const [filterHighRating, setFilterHighRating] = useState(false);
  const [sortByPriceDesc, setSortByPriceDesc] = useState<boolean | null>(null); // null: normal, true: desc, false: asc

  // Keep search keyword filter synced
  useEffect(() => {
    setSearchWord(keywordFilter);
  }, [keywordFilter]);

  // Handle setting keyword filter
  const handleKeywordChange = (value: string) => {
    setSearchWord(value);
    setKeywordFilter(value);
  };

  // Toggle Favorite in local state
  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  // Apply filters and sorting
  let filteredList = PRODUCTS.filter(p => {
    // 1. Search keyword matching
    const matchesSearch = 
      p.name.toLowerCase().includes(searchWord.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchWord.toLowerCase()) ||
      p.description.toLowerCase().includes(searchWord.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Tech / Category filter
    if (filterTechOnly && p.category !== 'electronics') return false;

    // 3. Rating filter
    if (filterHighRating && p.rating < 4.5) return false;

    return true;
  });

  // 4. Handle Sorting
  if (sortByPriceDesc !== null) {
    filteredList = [...filteredList].sort((a, b) => {
      return sortByPriceDesc ? b.price - a.price : a.price - b.price;
    });
  }

  return (
    <div className="space-y-6 pt-4 pb-12" id="catalog-main-content">
      {/* Search Header */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className={`material-symbols-outlined ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>search</span>
        </div>
        <input 
          className={`block w-full pl-10 pr-3 py-3 rounded-xl focus:ring-1 focus:ring-[#2170e4] focus:border-transparent outline-none transition-all duration-300 font-medium text-sm border ${
            darkMode 
              ? 'bg-[#172036] border-[#1e293b] text-white placeholder:text-slate-500' 
              : 'bg-[#eff4ff] border-[#c2c6d6] text-[#121c2a] placeholder:text-[#5e6572]'
          }`} 
          placeholder="Search premium catalog..." 
          type="text"
          value={searchWord}
          onChange={(e) => handleKeywordChange(e.target.value)}
        />
        {searchWord && (
          <button 
            type="button" 
            onClick={() => handleKeywordChange('')}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${darkMode ? 'text-slate-400 hover:text-white' : 'text-[#727785] hover:text-[#121c2a]'}`}
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Horizontal Filter Chips */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {/* Reset / Status Count info Button */}
        <button 
          onClick={() => {
            setFilterTechOnly(false);
            setFilterHighRating(false);
            setSortByPriceDesc(null);
            handleKeywordChange('');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap shadow-sm transition-all active:scale-95 ${
            !filterTechOnly && !filterHighRating && sortByPriceDesc === null && !searchWord
              ? 'bg-[#2170e4] text-white'
              : darkMode 
                ? 'bg-[#1e293b] text-blue-400 hover:bg-[#2c3a54]' 
                : 'bg-[#dee9fc] text-[#0058be] hover:bg-[#c2d6ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          Reset Filters
        </button>

        {/* Price sort button */}
        <button 
          onClick={() => {
            if (sortByPriceDesc === null) setSortByPriceDesc(true);
            else if (sortByPriceDesc === true) setSortByPriceDesc(false);
            else setSortByPriceDesc(null);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors duration-200 ${
            sortByPriceDesc !== null
              ? 'bg-[#2170e4] text-white'
              : darkMode 
                ? 'bg-[#1e293b] text-slate-300 border border-[#1e293b]/50 hover:bg-slate-800' 
                : 'bg-[#dce2f3] text-[#5e6572] hover:bg-[#c0c7d6]'
          }`}
        >
          Sort: {sortByPriceDesc === null ? 'Standard' : sortByPriceDesc ? 'Price: High-Low' : 'Price: Low-High'}
          <span className="material-symbols-outlined text-[14px]">
            {sortByPriceDesc === null ? 'swap_vert' : sortByPriceDesc ? 'arrow_downward' : 'arrow_upward'}
          </span>
        </button>

        {/* Tech only button */}
        <button 
          onClick={() => setFilterTechOnly(!filterTechOnly)}
          className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors duration-200 ${
            filterTechOnly 
              ? 'bg-[#2170e4] text-white' 
              : darkMode 
                ? 'bg-[#1e293b] text-slate-300 border border-[#1e293b]/50 hover:bg-slate-800' 
                : 'bg-[#dce2f3] text-[#5e6572] hover:bg-[#c0c7d6]'
          }`}
        >
          Category: Tech
        </button>

        {/* Rating button */}
        <button 
          onClick={() => setFilterHighRating(!filterHighRating)}
          className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors duration-200 ${
            filterHighRating 
              ? 'bg-[#2170e4] text-white' 
              : darkMode 
                ? 'bg-[#1e293b] text-slate-300 border border-[#1e293b]/50 hover:bg-slate-800' 
                : 'bg-[#dce2f3] text-[#5e6572] hover:bg-[#c0c7d6]'
          }`}
        >
          Rating: 4.5+ ★
        </button>
      </div>

      {/* Catalog Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>
            Displaying {filteredList.length} Luxe Products
          </p>
          {(filterTechOnly || filterHighRating || sortByPriceDesc !== null || searchWord) && (
            <button 
              onClick={() => {
                setFilterTechOnly(false);
                setFilterHighRating(false);
                setSortByPriceDesc(null);
                handleKeywordChange('');
              }}
              className="text-xs text-[#2170e4] hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {filteredList.length === 0 ? (
          <div className={`rounded-2xl p-10 text-center border space-y-3 shadow-sm ${
            darkMode ? 'bg-[#111726]/80 text-white border-[#1e293b]' : 'bg-white border-[#e6eeff] text-[#121c2a]'
          }`}>
            <span className="material-symbols-outlined text-4xl text-[#727785]">search_off</span>
            <p className="font-semibold text-[#121c2a]">No Match Found</p>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-[#424754]'}`}>
              We can't find anything matching your filters. Try search keywords, reset filters, or view all items.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredList.map((p) => {
              const hasFave = favorites.includes(p.id);
              return (
                <div 
                  key={p.id} 
                  className="flex flex-col gap-1.5 group cursor-pointer"
                  onClick={() => onSelectProduct(p.id)}
                >
                  <div className={`relative aspect-[3/4] overflow-hidden rounded-xl border shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors ${
                    darkMode ? 'bg-[#111726]/70 border-[#1e293b]' : 'bg-white border-[#e6eeff]'
                  }`}>
                    <img 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 select-none"
                      src={p.image}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(p.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 bg-white/80 select-none backdrop-blur-md rounded-full text-[#424754] shadow-sm hover:scale-105 active:scale-90 transition-transform"
                      title={hasFave ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <span 
                        className={`material-symbols-outlined text-[18px] transition-colors ${
                          hasFave ? 'text-red-500 scale-110' : 'text-[#727785]'
                        }`}
                        style={{ fontVariationSettings: hasFave ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="mt-1 px-1 flex-1 flex flex-col justify-between">
                    <div>
                      <span className={`text-[10px] font-bold tracking-widest uppercase block ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>
                        {p.brand}
                      </span>
                      <h3 className={`font-semibold text-sm group-hover:text-[#2170e4] transition-colors truncate ${
                        darkMode ? 'text-white' : 'text-[#121c2a]'
                      }`}>
                        {p.name}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`font-bold text-sm ${darkMode ? 'text-blue-400' : 'text-[#0058be]'}`}>
                        ${p.price.toFixed(2)}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(p);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-sm ${
                          darkMode 
                            ? 'bg-slate-800 text-blue-400 hover:bg-[#2170e4] hover:text-white' 
                            : 'bg-[#dee9fc] text-[#0058be] hover:bg-[#2170e4] hover:text-white'
                        }`}
                        title="Quick add"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
