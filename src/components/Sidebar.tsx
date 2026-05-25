import { ScreenState } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenState) => void;
  currentScreen: ScreenState;
  userEmail: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  onNavigate, 
  currentScreen, 
  userEmail, 
  darkMode, 
  onToggleDarkMode 
}: SidebarProps) {
  const isAdmin = userEmail.trim().toLowerCase() === 'ybegimqulov01@gmail.com';

  return (
    <div 
      className={`absolute inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className={`flex flex-col h-full w-80 rounded-r-2xl shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          darkMode ? 'bg-[#0f172a] text-[#f1f5f9]' : 'bg-white text-[#121c2a]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Info Header */}
        <div className={`p-6 flex items-center gap-4 rounded-tr-2xl border-b ${
          darkMode ? 'bg-[#1e293b]/70 border-[#1e293b]/60' : 'bg-[#f8f9ff] border-[#e6eeff]'
        }`}>
          <div className="w-14 h-14 rounded-full bg-[#2170e4] overflow-hidden border-2 border-[#2170e4]/20 shadow-sm flex-shrink-0">
            <img 
              alt="Alex Morgan" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8wJxhKjVUVbbRdfGKJSZ2mLpMgj5VQXcu7mycIfxyvbgntKROM-JANN7JcWVSCPrD4ObFx2WeUlCrzNv9CLtD9UY7iGrgIljBclDVfTRctGywv570dqZN-3EjL1iuGk7EuXU6iBDaWeog155zPJFkCoik9O20FQD4I7TMs2gFMvRAA3Oqnlih_rk9sw6f8rArF1GKqhB_omthqMQDNjxYk2fBisDzFgl_430yEwqwJXKazWKKDQMRCAF_lb9cIDUy71YYzs9CKI9H"
            />
          </div>
          <div className="flex-grow min-w-0">
            <p className={`font-semibold text-base truncate ${darkMode ? 'text-white' : 'text-[#0058be]'}`}>Alex Morgan</p>
            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full mt-0.5 ${
              isAdmin 
                ? 'bg-amber-100/20 text-amber-500 border border-amber-500/30' 
                : 'bg-[#dee9fc] text-[#0058be]'
            }`}>
              {isAdmin ? '🛡️ Store Admin' : '💎 Premium Member'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => { onNavigate('HOME'); onClose(); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              currentScreen === 'HOME' 
                ? 'bg-[#2170e4] text-white shadow-md' 
                : darkMode
                  ? 'text-slate-200 hover:bg-[#1e293b]/70'
                  : 'text-[#424754] hover:bg-[#eff4ff] hover:text-[#0058be]'
            }`}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="font-medium text-[15px]">Home Marketplace</span>
          </button>

          <button 
            onClick={() => { onNavigate('CATALOG'); onClose(); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              currentScreen === 'CATALOG' 
                ? 'bg-[#2170e4] text-white shadow-md' 
                : darkMode
                  ? 'text-slate-200 hover:bg-[#1e293b]/70'
                  : 'text-[#424754] hover:bg-[#eff4ff] hover:text-[#0058be]'
            }`}
          >
            <span className="material-symbols-outlined">category</span>
            <span className="font-medium text-[15px]">Premium Catalog</span>
          </button>

          <button 
            onClick={() => { onNavigate('CART'); onClose(); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              currentScreen === 'CART' 
                ? 'bg-[#2170e4] text-white shadow-md' 
                : darkMode
                  ? 'text-slate-200 hover:bg-[#1e293b]/70'
                  : 'text-[#424754] hover:bg-[#eff4ff] hover:text-[#0058be]'
            }`}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="font-medium text-[15px]">My Shopping Bag</span>
          </button>

          <button 
            onClick={() => { onNavigate('PROFILE'); onClose(); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              currentScreen === 'PROFILE' 
                ? 'bg-[#2170e4] text-white shadow-md' 
                : darkMode
                  ? 'text-slate-200 hover:bg-[#1e293b]/70'
                  : 'text-[#424754] hover:bg-[#eff4ff] hover:text-[#0058be]'
            }`}
          >
            <span className="material-symbols-outlined">person</span>
            <span className="font-medium text-[15px]">Luxe Membership</span>
          </button>

          {/* Secure Admin Gate Verification (Only show when ybegimqulov01@gmail.com is set) */}
          {isAdmin && (
            <button 
              onClick={() => { onNavigate('ADMIN'); onClose(); }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                currentScreen === 'ADMIN' 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : darkMode
                    ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100/60'
              }`}
            >
              <span className="material-symbols-outlined text-amber-500">admin_panel_settings</span>
              <span className="font-semibold text-[15px]">Merchant Admin Panel</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          )}

          {/* Live System Theme Mode Toggle */}
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-[#1e293b]' : 'border-[#e6eeff]'}`}>
            <p className={`px-4 text-[10px] font-bold uppercase tracking-wider mb-2 ${
              darkMode ? 'text-slate-400' : 'text-[#727785]'
            }`}>
              Appearance Theme
            </p>
            <button 
              onClick={onToggleDarkMode}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-slate-800 text-yellow-400' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined">
                  {darkMode ? 'light_mode' : 'dark_mode'}
                </span>
                <span className="font-medium text-[15px]">
                  {darkMode ? 'Light Theme' : 'Goralashtirish (Dark Mode)'}
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-black/15 px-2 py-0.5 rounded">
                {darkMode ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          <div className="pt-4 mt-2">
            <p className={`px-4 text-[10px] font-bold uppercase tracking-wider mb-2 ${
              darkMode ? 'text-slate-400' : 'text-[#727785]'
            }`}>
              Filters Quick Links
            </p>
            <button 
              onClick={() => { onNavigate('CATALOG'); onClose(); }}
              className={`w-full text-left flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all text-[14px] ${
                darkMode ? 'text-slate-300 hover:bg-[#1e293b]/40' : 'text-[#5e6572] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>New Arrivals</span>
            </button>
            <button 
              onClick={() => { onNavigate('CATALOG'); onClose(); }}
              className={`w-full text-left flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all text-[14px] ${
                darkMode ? 'text-slate-300 hover:bg-[#1e293b]/40' : 'text-[#5e6572] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>Exclusive Offers</span>
            </button>
          </div>
        </nav>

        {/* Footer info */}
        <div className={`p-6 border-t text-center rounded-br-2xl text-[11px] flex flex-col gap-1 ${
          darkMode ? 'bg-[#1e293b]/30 border-[#1e293b]/60 text-slate-400' : 'bg-[#f8f9ff] border-[#e6eeff] text-[#727785]'
        }`}>
          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>Secure Checkout Powered by LUXE</p>
          <p>© 2026 LUXE International, Inc.</p>
        </div>
      </div>
    </div>
  );
}
