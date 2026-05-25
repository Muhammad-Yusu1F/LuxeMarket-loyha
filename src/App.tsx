import { useState, useEffect } from 'react';
import { ScreenState, Product, CartItem, Order } from './types';
import { PRODUCTS } from './data';

// Import split components
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Profile from './components/Profile';
import Admin from './components/Admin';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('HOME');
  const [selectedProductId, setSelectedProductId] = useState<string>('apex-ultra-wireless');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'mobile'>('responsive');

  // Dark mode state with persistence in localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('luxe_dark_mode');
    return saved === 'true';
  });

  // User email state with persistence in localStorage
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('luxe_user_email') || 'alex.morgan@luxe.com';
  });

  // Update document state on theme change
  useEffect(() => {
    localStorage.setItem('luxe_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist email changes
  useEffect(() => {
    localStorage.setItem('luxe_user_email', userEmail);
  }, [userEmail]);

  // Prepopulate cart with elements matching Image 4
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Real-time Order list with state persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('luxe_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    // Prepopulated mock orders to keep the admin panel interactive on first load
    return [
      {
        id: 'LUXE-748923',
        customerName: 'Kamil Gulyamov',
        customerPhone: '+998 90 999 44 22',
        customerEmail: 'kamil@uzbekistan.com',
        customerAddress: 'Tashkent, Oybek Business Center Apt 12',
        items: [
          { product: PRODUCTS[0], quantity: 1 },
          { product: PRODUCTS[2], quantity: 2 }
        ],
        totalPrice: PRODUCTS[0].price + (PRODUCTS[2].price * 2) * 1.08, // match calculation
        status: 'SHIPPED' as const,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        notes: 'Deliver to reception desk, please'
      },
      {
        id: 'LUXE-142857',
        customerName: 'Yusupov Jamshid',
        customerPhone: '+998 94 456 78 90',
        customerEmail: 'jamshid@mail.ru',
        customerAddress: 'Samarkand, Registan Square 1',
        items: [
          { product: PRODUCTS[1], quantity: 1 }
        ],
        totalPrice: PRODUCTS[1].price * 1.08,
        status: 'PENDING' as const,
        createdAt: new Date().toISOString(),
        notes: 'Urgent premium birthday present!'
      }
    ];
  });

  // Track state changes to preserve orders
  useEffect(() => {
    localStorage.setItem('luxe_orders', JSON.stringify(orders));
  }, [orders]);

  // Handle order purchase submission from cart screen form
  const handleCheckoutComplete = (customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    notes?: string;
  }) => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const estTax = subtotal * 0.08;
    const total = subtotal + estTax;

    const newOrder: Order = {
      id: `LUXE-${Math.floor(Math.random() * 899999 + 100000)}`,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAddress: customer.address,
      items: [...cartItems],
      totalPrice: total,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      notes: customer.notes
    };

    setOrders(prev => [newOrder, ...prev]);
    triggerToast('Luxury order notification sent to merchant!');
  };

  // Status changer for merchant admin
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    triggerToast(`Order status updated to ${status}`);
  };

  // Reset database/clear history helper
  const handleResetDatabase = () => {
    setOrders([]);
    triggerToast('All test orders cleared');
  };

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load standard mockup items into cart on startup so that it matching Image 4
  useEffect(() => {
    const defaultRunner = PRODUCTS.find(p => p.id === 'velocity-pro-runner');
    const defaultWatch = PRODUCTS.find(p => p.id === 'luxe-chrono-white');
    const defaultHeadphones = PRODUCTS.find(p => p.id === 'acoustics-ultra-x');

    const defaultCart: CartItem[] = [];
    if (defaultRunner) defaultCart.push({ product: defaultRunner, quantity: 1 });
    if (defaultWatch) defaultCart.push({ product: defaultWatch, quantity: 1 });
    if (defaultHeadphones) defaultCart.push({ product: defaultHeadphones, quantity: 1 });

    setCartItems(defaultCart);
  }, []);

  // Display a brief premium toast alert
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Add to Cart Logic
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        triggerToast(`Added another ${product.name} to bag`);
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        triggerToast(`Added ${product.name} to luxury bag`);
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Update Quantity Logic
  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQty } 
        : item
    ));
  };

  // Remove Item Logic
  const handleRemoveItem = (productId: string) => {
    const item = cartItems.find(i => i.product.id === productId);
    if (item) {
      triggerToast(`Removed ${item.product.name} from bag`);
    }
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Select product to view details
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentScreen('PRODUCT_DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Share handle
  const handleShareProduct = (productName: string) => {
    triggerToast(`Copied secure premium sharing link for ${productName}!`);
  };

  // Get total quantity of items in the cart
  const cartBadgeCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Active product details helper
  const activeProduct = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];

  return (
    <div className="w-full min-h-screen bg-[#0f172a] bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#334155] md:p-6 lg:p-12 flex flex-col items-center justify-center transition-all duration-300 relative overflow-x-hidden">
      
      {/* Dynamic Device Switcher Panel on Desktop Screen */}
      <div className="hidden md:flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl fixed top-4 z-50 gap-4 mb-4 select-none animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest font-sans">LUXE Preview</span>
        </div>
        <div className="h-4 w-[1px] bg-white/20" />
        <div className="flex bg-black/40 rounded-full p-0.5 border border-white/5">
          <button 
            type="button"
            onClick={() => setDeviceMode('responsive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold select-none transition-all duration-200 ${
              deviceMode === 'responsive' 
                ? 'bg-[#2170e4] text-white shadow-md scale-105' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">devices</span>
            Wide Web (PC)
          </button>
          <button 
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold select-none transition-all duration-200 ${
              deviceMode === 'mobile' 
                ? 'bg-[#2170e4] text-white shadow-md scale-105' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            Mobile App
          </button>
        </div>
      </div>

      {/* Main Container Wrapper */}
      <div 
        style={deviceMode === 'mobile' ? { transform: 'translate(0)' } : undefined}
        className={`font-sans flex flex-col relative transition-all duration-500 w-full ${
          darkMode 
            ? 'bg-[#090d16] text-[#f1f5f9]' 
            : 'bg-[#f8f9ff] text-[#121c2a]'
        } ${
          deviceMode === 'mobile'
            ? 'h-[844px] max-w-[390px] rounded-[48px] border-[12px] border-slate-900 shadow-2xl overflow-hidden'
            : 'min-h-screen md:min-h-[850px] max-w-lg md:max-w-5xl lg:max-w-6xl md:rounded-3xl md:shadow-2xl md:border md:border-[#dee9fc]/65 overflow-hidden'
        }`}
      >
        {/* Notch / Status Bar simulator for mobile frame view on desktop */}
        {deviceMode === 'mobile' && (
          <div className={`px-6 pt-3 pb-1 flex justify-between items-center text-[10px] uppercase tracking-wider font-bold select-none border-b z-50 shrink-0 ${
            darkMode 
              ? 'bg-[#090d16] text-slate-300 border-[#1e293b]' 
              : 'bg-white text-slate-700 border-slate-100'
          }`}>
            <span>12:00</span>
            <div className="w-24 h-4.5 bg-black rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0" />
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px]">signal_cellular_4_bar</span>
              <span className="material-symbols-outlined text-[11px]">wifi</span>
              <span className="material-symbols-outlined text-[13px]">battery_full</span>
            </div>
          </div>
        )}

        {/* Top Application Header (Suppressed on PRODUCT_DETAIL as shown in Mockup 3) */}
        {currentScreen !== 'PRODUCT_DETAIL' && (
          <header className={`sticky top-0 w-full z-45 backdrop-blur-md flex justify-between items-center px-4 h-16 border-b shrink-0 transition-colors ${
            darkMode 
              ? 'bg-[#090d16]/95 border-[#1e293b]' 
              : 'bg-white/95 border-[#dee9fc]/60'
          }`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className={`text-[#2170e4] hover:opacity-85 active:scale-95 transition-all w-10 h-10 flex items-center justify-center rounded-full ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#eff4ff]'
                }`}
                title="Open menu"
              >
                <span className="material-symbols-outlined select-none text-2xl">menu</span>
              </button>
              <h1 
                onClick={() => setCurrentScreen('HOME')}
                className="font-bold text-2xl text-[#2170e4] tracking-tight hover:opacity-90 active:scale-95 transition-all select-none cursor-pointer"
              >
                LUXE
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentScreen('CART')}
                className={`relative text-[#2170e4] hover:opacity-85 active:scale-95 transition-all w-10 h-10 flex items-center justify-center rounded-full ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#eff4ff]'
                }`}
                title="View shopping bag"
              >
                <span className="material-symbols-outlined select-none text-2xl">shopping_bag</span>
                {cartBadgeCount > 0 && (
                  <span className={`absolute -top-1 -right-1 w-5 h-5 bg-[#2170e4] text-white text-[10px] uppercase font-bold flex items-center justify-center rounded-full animate-pulse border ${
                    darkMode ? 'border-[#090d16]' : 'border-white'
                  }`}>
                    {cartBadgeCount}
                  </span>
                )}
              </button>
            </div>
          </header>
        )}

        {/* Main Content Pane (Adds scroll inside forced phone enclosure) */}
        <main className={`flex-grow px-4 ${currentScreen === 'PRODUCT_DETAIL' ? 'pt-0' : 'pt-2'} pb-28 ${
          deviceMode === 'mobile' ? 'overflow-y-auto no-scrollbar' : ''
        }`}>
          {currentScreen === 'HOME' && (
            <Home 
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
              onNavigate={setCurrentScreen}
              setSearchKeywordFilter={setSearchKeyword}
              isMobileLayout={deviceMode === 'mobile'}
              darkMode={darkMode}
            />
          )}

          {currentScreen === 'CATALOG' && (
            <Catalog 
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
              keywordFilter={searchKeyword}
              setKeywordFilter={setSearchKeyword}
              isMobileLayout={deviceMode === 'mobile'}
              darkMode={darkMode}
            />
          )}

          {currentScreen === 'PRODUCT_DETAIL' && (
            <ProductDetail 
              product={activeProduct}
              onBack={() => {
                setCurrentScreen('CATALOG');
              }}
              onAddToCart={handleAddToCart}
              onShare={handleShareProduct}
              isMobileLayout={deviceMode === 'mobile'}
              darkMode={darkMode}
            />
          )}

          {currentScreen === 'CART' && (
            <Cart 
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onCheckoutComplete={handleCheckoutComplete}
              isMobileLayout={deviceMode === 'mobile'}
              darkMode={darkMode}
            />
          )}

          {currentScreen === 'PROFILE' && (
            <Profile 
              userEmail={userEmail}
              onChangeEmail={setUserEmail}
              darkMode={darkMode}
            />
          )}

          {currentScreen === 'ADMIN' && (
            <Admin 
              orders={orders} 
              onUpdateOrderStatus={handleUpdateOrderStatus} 
              products={PRODUCTS} 
              onResetDatabase={handleResetDatabase}
              darkMode={darkMode}
            />
          )}
        </main>

        {/* Floating System Toast Alerts */}
        <div 
          className={`absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-[#27313f] text-[#eaf1ff] px-5 py-3 rounded-full text-xs font-semibold shadow-2xl z-[100] transition-all duration-300 flex items-center gap-2 max-w-xs whitespace-nowrap pointer-events-none ${
            toastMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-emerald-400 text-sm">offline_pin</span>
          <span>{toastMessage}</span>
        </div>

        {/* Premium Drawer Side Menu */}
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={setCurrentScreen}
          currentScreen={currentScreen}
          userEmail={userEmail}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Bottom Nav indicators */}
        <nav className={`absolute bottom-0 left-0 w-full z-45 border-t shadow-lg flex justify-center py-2 px-4 h-16 transition-colors ${
          darkMode ? 'bg-[#090d16] border-[#1e293b]' : 'bg-white border-[#dee9fc]'
        } ${
          deviceMode === 'responsive'
            ? `md:fixed md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:rounded-full md:border md:shadow-2xl ${
                darkMode ? 'md:bg-[#090d16]/95 md:border-[#1e293b]' : 'md:bg-white/95 md:border-[#dee9fc]/60'
              }`
            : ''
        }`}>
          <div className="flex justify-around items-center w-full max-w-lg relative">
            <button 
              onClick={() => setCurrentScreen('HOME')}
              className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-90 ${
                currentScreen === 'HOME' 
                  ? 'text-[#2170e4] font-semibold scale-105' 
                  : (darkMode ? 'text-slate-400 hover:text-white' : 'text-[#5e6572] hover:text-[#2170e4]')
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: currentScreen === 'HOME' ? "'FILL' 1" : "'FILL' 0" }}>
                home
              </span>
              <span className="text-[10px] mt-0.5 tracking-wide">Home</span>
              {currentScreen === 'HOME' && (
                <span className="w-1 h-1 bg-[#2170e4] rounded-full mt-0.5 absolute bottom-0.5" />
              )}
            </button>

            <button 
              onClick={() => setCurrentScreen('CATALOG')}
              className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-90 ${
                currentScreen === 'CATALOG' 
                  ? 'text-[#2170e4] font-semibold scale-105' 
                  : (darkMode ? 'text-slate-400 hover:text-white' : 'text-[#5e6572] hover:text-[#2170e4]')
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: currentScreen === 'CATALOG' ? "'FILL' 1" : "'FILL' 0" }}>
                search
              </span>
              <span className="text-[10px] mt-0.5 tracking-wide">Search</span>
              {currentScreen === 'CATALOG' && (
                <span className="w-1 h-1 bg-[#2170e4] rounded-full mt-0.5 absolute bottom-0.5" />
              )}
            </button>

            <button 
              onClick={() => setCurrentScreen('CART')}
              className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-90 relative ${
                currentScreen === 'CART' 
                  ? 'text-[#2170e4] font-semibold scale-105' 
                  : (darkMode ? 'text-slate-400 hover:text-white' : 'text-[#5e6572] hover:text-[#2170e4]')
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: currentScreen === 'CART' ? "'FILL' 1" : "'FILL' 0" }}>
                shopping_cart
              </span>
              <span className="text-[10px] mt-0.5 tracking-wide">Bag</span>
              {cartBadgeCount > 0 && (
                <span className="absolute -top-1.5 right-1 w-4 h-4 bg-[#2170e4] text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
                  {cartBadgeCount}
                </span>
              )}
              {currentScreen === 'CART' && (
                <span className="w-1 h-1 bg-[#2170e4] rounded-full mt-0.5 absolute bottom-0.5" />
              )}
            </button>

            <button 
              onClick={() => setCurrentScreen('PROFILE')}
              className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-90 ${
                currentScreen === 'PROFILE' 
                  ? 'text-[#2170e4] font-semibold scale-105' 
                  : (darkMode ? 'text-slate-400 hover:text-white' : 'text-[#5e6572] hover:text-[#2170e4]')
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: currentScreen === 'PROFILE' ? "'FILL' 1" : "'FILL' 0" }}>
                person
              </span>
              <span className="text-[10px] mt-0.5 tracking-wide">Profile</span>
              {currentScreen === 'PROFILE' && (
                <span className="w-1 h-1 bg-[#2170e4] rounded-full mt-0.5 absolute bottom-0.5" />
              )}
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
