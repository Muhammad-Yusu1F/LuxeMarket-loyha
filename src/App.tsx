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
import Auth from './components/Auth';

// Firebase imports
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, setDoc, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';


export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('HOME');
  const [selectedProductId, setSelectedProductId] = useState<string>('apex-ultra-wireless');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'mobile'>('responsive');

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('luxe_authenticated') === 'true';
  });

  // Dark mode state with persistence in localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('luxe_dark_mode');
    return saved === 'true';
  });

  // User email state with persistence in localStorage
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('luxe_user_email') || '';
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

  // Helper to sync from the centralized backend server
  const fetchOrdersFromServer = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        localStorage.setItem('luxe_orders', JSON.stringify(data));
      }
    } catch (e) {
      console.warn("Express backend orders sync silent fail (normal in preview):", e);
    }
  };

  // Real-time syncing with centralized backend
  useEffect(() => {
    fetchOrdersFromServer();
    const interval = setInterval(fetchOrdersFromServer, 4000); // poll every 4 seconds to sync orders instantly across all devices
    return () => clearInterval(interval);
  }, []);

  // Track state changes to preserve orders (for local redundancy)
  useEffect(() => {
    localStorage.setItem('luxe_orders', JSON.stringify(orders));
  }, [orders]);

  // Auth Success Handler
  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    localStorage.setItem('luxe_authenticated', 'true');
    localStorage.setItem('luxe_user_email', email);
    
    // Redirect Admin directly to the orders panel
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'ybegimqulov01@gmail.com' || cleanEmail === 'ybeginqulov01@gmail.com') {
      setCurrentScreen('ADMIN');
      triggerToast('Xush kelibsiz, Admin Begimqulov! Barcha buyurtmalar yuklanmoqda...');
    } else {
      setCurrentScreen('HOME');
      triggerToast('Siz tizimga muvaffaqiyatli kirdingiz!');
    }
  };

  // Auth Logout Handler
  const handleLogout = () => {
    setUserEmail('');
    setIsAuthenticated(false);
    localStorage.removeItem('luxe_authenticated');
    localStorage.removeItem('luxe_user_email');
    setCurrentScreen('HOME');
    triggerToast('Tizimdan chiqdingiz!');
  };

  // Handle order purchase submission from cart screen form
  const handleCheckoutComplete = async (customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    notes?: string;
  }) => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const estTax = subtotal * 0.08;
    const total = subtotal + estTax;
    const orderId = `LUXE-${Math.floor(Math.random() * 899999 + 100000)}`;

    const newOrder: Order = {
      id: orderId,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAddress: customer.address,
      items: [...cartItems],
      totalPrice: total,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      notes: customer.notes || ""
    };

    try {
      const resp = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      });
      if (resp.ok) {
        triggerToast('Premium buyurtma serverga muvaffaqiyatli jo‘natildi!');
        fetchOrdersFromServer();
        handleClearCart();
      } else {
        throw new Error("Server response error");
      }
    } catch (e) {
      console.warn("Express sync fail, falling back to local state:", e);
      setOrders(prev => [newOrder, ...prev]);
      triggerToast('Buyurtma saqlandi (Mahalliy)!');
      handleClearCart();
    }
  };

  // Status changer for merchant admin
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const resp = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (resp.ok) {
        triggerToast(`Buyurtma holati "${status}" ga yangilandi`);
        fetchOrdersFromServer();
      } else {
        throw new Error("Server status update failed");
      }
    } catch (e) {
      console.warn("Express status update fail, falling back to local state:", e);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      triggerToast(`Buyurtma holati "${status}" ga yangilandi`);
    }
  };

  // Reset database/clear history helper
  const handleResetDatabase = async () => {
    try {
      const resp = await fetch('/api/orders/reset', {
        method: 'POST'
      });
      if (resp.ok) {
        triggerToast('Barcha buyurtmalar o‘chirildi');
        fetchOrdersFromServer();
      } else {
        throw new Error("Reset failed");
      }
    } catch (e) {
      console.warn("Express reset fail, falling back to local state:", e);
      setOrders([]);
      triggerToast('All test orders cleared');
    }
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

  const isAdmin = userEmail.trim().toLowerCase() === 'ybegimqulov01@gmail.com' || userEmail.trim().toLowerCase() === 'ybeginqulov01@gmail.com';

  if (!isAuthenticated) {
    return (
      <div className={`w-full min-h-screen transition-colors duration-300 flex flex-col items-center justify-center ${
        darkMode ? 'bg-[#090d16] text-[#f1f5f9]' : 'bg-[#f8f9ff] text-[#121c2a]'
      }`}>
        <Auth onSuccess={handleAuthSuccess} darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 flex flex-col ${
      darkMode ? 'bg-[#090d16] text-[#f1f5f9]' : 'bg-[#f8f9ff] text-[#121c2a]'
    }`}>
      
      {/* Uzum-style Top Auxiliary Bar (Hidden on Mobile) */}
      <div className={`hidden md:block border-b text-xs transition-colors py-2 px-6 ${
        darkMode ? 'bg-[#05070c]/90 border-[#1e293b]/70 text-slate-400' : 'bg-[#eff4ff]/70 border-[#dee9fc]/70 text-[#5e6572]'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 select-none">
            <span className="flex items-center gap-1 cursor-pointer hover:text-[#2170e4] transition-colors">
              <span className="material-symbols-outlined text-base">pin_drop</span>
              <span>Shahar: Toshkent</span>
            </span>
            <span className="hover:text-[#2170e4] transition-colors cursor-pointer">Topshirish punktlari</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hover:text-[#2170e4] transition-colors cursor-pointer font-medium">Sotuvchi bo'lish</span>
            <span className="hover:text-[#2170e4] transition-colors cursor-pointer">Savol-javoblar</span>
            {isAdmin && (
              <span className="hover:text-[#2170e4] transition-colors cursor-pointer text-[#2170e4] font-medium" onClick={() => setCurrentScreen('ADMIN')}>
                🛡️ Buyurtmalarim (Admin)
              </span>
            )}
            <span className="text-[11px] bg-[#2170e4]/10 text-[#2170e4] px-2 py-0.5 rounded font-mono">
              {userEmail}
            </span>
            <button 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 transition-colors font-medium cursor-pointer"
            >
              Chiqish 🚪
            </button>
          </div>
        </div>
      </div>

      {/* Top Application Header */}
      <header className={`sticky top-0 w-full z-45 backdrop-blur-md border-b transition-colors ${
        darkMode 
          ? 'bg-[#090d16]/95 border-[#1e293b]' 
          : 'bg-white/95 border-[#dee9fc]/60 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 h-16 sm:h-20 gap-4">
          
          {/* Logo & Menu Trigger */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`text-[#2170e4] hover:opacity-85 active:scale-95 transition-all w-10 h-10 flex items-center justify-center rounded-full ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#eff4ff]'
              }`}
              title="Katalog menyusi"
            >
              <span className="material-symbols-outlined select-none text-2xl font-bold">menu</span>
            </button>
            <h1 
              onClick={() => setCurrentScreen('HOME')}
              className="font-extrabold text-2xl sm:text-3xl text-[#2170e4] tracking-wider hover:opacity-90 active:scale-95 transition-all select-none cursor-pointer"
            >
              LUXE
            </h1>
          </div>

          {/* Desktop Banner Search Input in Header (Uzum style) */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span className={`material-symbols-outlined ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>search</span>
            </div>
            <input 
              className={`block w-full pl-11 pr-12 py-2.5 rounded-xl outline-none border transition-all duration-300 font-medium text-sm ${
                darkMode 
                  ? 'bg-[#172036] border-[#1e293b] text-white focus:ring-1 focus:ring-[#2170e4]' 
                  : 'bg-[#f0f3fd] border-[#dee9fc] text-[#121c2a] focus:ring-1 focus:ring-[#2170e4] focus:bg-white'
              }`} 
              placeholder="Mahsulotlar va turkumlar bo'yicha izlash..." 
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                if (currentScreen !== 'CATALOG') {
                  setCurrentScreen('CATALOG');
                }
              }}
            />
            {searchKeyword && (
              <button 
                type="button" 
                onClick={() => setSearchKeyword('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#727785] hover:text-[#121c2a]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Quick search button for mobile view */}
            <button 
              onClick={() => {
                setCurrentScreen('CATALOG');
              }}
              className={`md:hidden text-[#2170e4] hover:opacity-85 active:scale-95 transition-all w-10 h-10 flex items-center justify-center rounded-full ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#eff4ff]'
              }`}
              title="Izlash"
            >
              <span className="material-symbols-outlined select-none text-2xl">search</span>
            </button>

            {/* Dark Mode switcher inside Header */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`text-[#2170e4] hover:opacity-85 active:scale-95 transition-all w-10 h-10 flex items-center justify-center rounded-full ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#eff4ff]'
              }`}
              title="Goralashtirish"
            >
              <span className="material-symbols-outlined select-none text-2xl">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Admin Panel button */}
            {isAdmin && (
              <button 
                onClick={() => setCurrentScreen('ADMIN')}
                className={`hidden sm:flex text-[#2170e4] hover:opacity-85 active:scale-95 transition-all w-10 h-10 items-center justify-center rounded-full ${
                  currentScreen === 'ADMIN' ? (darkMode ? 'bg-amber-500/15 text-amber-500' : 'bg-amber-50 text-amber-600') : (darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#eff4ff]')
                }`}
                title="Merchant Admin Panel"
              >
                <span className="material-symbols-outlined select-none text-2xl">admin_panel_settings</span>
              </button>
            )}

            {/* Profile Navigation */}
            <button 
              onClick={() => setCurrentScreen('PROFILE')}
              className={`text-[#2170e4] hover:opacity-85 active:scale-95 transition-all w-10 h-10 flex items-center justify-center rounded-full ${
                currentScreen === 'PROFILE' ? 'bg-[#2170e4]/10' : (darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#eff4ff]')
              }`}
              title="Luxe Profil"
            >
              <span className="material-symbols-outlined select-none text-2xl" style={{ fontVariationSettings: currentScreen === 'PROFILE' ? "'FILL' 1" : "'FILL' 0" }}>
                person
              </span>
            </button>

            {/* Shopping Bag Checkout cart */}
            <button 
              onClick={() => setCurrentScreen('CART')}
              className={`relative text-[#2170e4] hover:opacity-85 active:scale-95 transition-all w-10 h-10 flex items-center justify-center rounded-full ${
                currentScreen === 'CART' ? 'bg-[#2170e4]/10' : (darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#eff4ff]')
              }`}
              title="View shopping bag"
            >
              <span className="material-symbols-outlined select-none text-2xl">shopping_cart</span>
              {cartBadgeCount > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-600 text-white text-[10px] uppercase font-bold flex items-center justify-center rounded-full animate-pulse border ${
                  darkMode ? 'border-[#090d16]' : 'border-white'
                }`}>
                  {cartBadgeCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area - Full-width Grid Wrapper */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 pt-3 pb-24">
        {currentScreen === 'HOME' && (
          <Home 
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigate={setCurrentScreen}
            setSearchKeywordFilter={setSearchKeyword}
            isMobileLayout={false}
            darkMode={darkMode}
          />
        )}

        {currentScreen === 'CATALOG' && (
          <Catalog 
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            keywordFilter={searchKeyword}
            setKeywordFilter={setSearchKeyword}
            isMobileLayout={false}
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
            isMobileLayout={false}
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
            isMobileLayout={false}
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
        className={`fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 bg-[#27313f] text-[#eaf1ff] px-5 py-3 rounded-full text-xs font-semibold shadow-2xl z-[100] transition-all duration-300 flex items-center gap-2 max-w-xs whitespace-nowrap pointer-events-none ${
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

      {/* Responsive Bottom Navigation Indicator Bar (Visible on Mobile only!) */}
      <nav className={`fixed bottom-0 left-0 w-full z-45 border-t shadow-2xl flex justify-center py-2 px-4 h-16 transition-colors md:hidden ${
        darkMode ? 'bg-[#090d16]/95 border-[#1e293b]' : 'bg-white/95 border-[#dee9fc]'
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
            <span className="text-[10px] mt-0.5 tracking-wide font-medium">Asosiy</span>
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
            <span className="text-[10px] mt-0.5 tracking-wide font-medium">Katalog</span>
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
            <span className="text-[10px] mt-0.5 tracking-wide font-medium">Savat</span>
            {cartBadgeCount > 0 && (
              <span className="absolute -top-1.5 right-1 w-4.5 h-4.5 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
                {cartBadgeCount}
              </span>
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
            <span className="text-[10px] mt-0.5 tracking-wide font-medium">Profil</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
