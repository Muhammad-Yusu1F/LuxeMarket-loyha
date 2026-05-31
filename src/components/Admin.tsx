import { Order, Product } from '../types';
import { useState, FormEvent } from 'react';

interface AdminProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, newStatus: Order['status']) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetDatabase?: () => void;
  darkMode?: boolean;
}

export default function Admin({ 
  orders, 
  onUpdateOrderStatus, 
  products, 
  onAddProduct,
  onDeleteProduct,
  onResetDatabase,
  darkMode = false
}: AdminProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'analytics'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for adding product
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('electronics');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [battery, setBattery] = useState('');
  const [weight, setWeight] = useState('');

  const handleFormSubmitProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim() || !price.trim()) {
      alert('Iltimos, barcha majburiy maydonlarni to‘ldiring!');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Narxi haqiqiy musbat son bo‘lishi lozim!');
      return;
    }

    // Generate a friendly URL if image is empty
    const defaultImages: Record<string, string> = {
      electronics: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      fashion: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      home: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80',
      beauty: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=600&q=80',
      sports: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
    };
    const finalImage = image.trim() || defaultImages[category] || defaultImages.electronics;

    const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.round(Math.random() * 8999 + 1000);

    const newProduct: Product = {
      id,
      name: name.trim(),
      brand: brand.trim(),
      price: parsedPrice,
      rating: 5.0,
      reviewsCount: 1,
      category,
      image: finalImage,
      description: description.trim() || 'Premium klassga mansub sertifikatlangan kafolatlangan yangi mahsulot.',
      specs: {
        battery: battery.trim() || undefined,
        weight: weight.trim() || undefined
      }
    };

    onAddProduct(newProduct);
    
    // Clear form state
    setName('');
    setBrand('');
    setPrice('');
    setCategory('electronics');
    setImage('');
    setDescription('');
    setBattery('');
    setWeight('');
    setShowAddForm(false);
  };

  // Computations
  const totalRevenue = orders.reduce((acc, current) => {
    return current.status !== 'PENDING' ? acc + current.totalPrice : acc;
  }, 0);

  const pendingRevenue = orders.reduce((acc, current) => {
    return current.status === 'PENDING' ? acc + current.totalPrice : acc;
  }, 0);

  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const confirmedCount = orders.filter(o => o.status === 'CONFIRMED').length;
  const shippedCount = orders.filter(o => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

  // Filter orders
  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`pt-4 pb-16 ${darkMode ? 'text-slate-200' : 'text-[#121c2a]'}`} id="merchant-admin-panel">
      {/* Dashboard Top Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4 ${
        darkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-1 text-xs text-[#2170e4] font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-[14px]">shield_person</span>
            Xavfsiz Savdo Boshqaruvi
          </div>
          <h2 className={`text-22px font-bold tracking-tight ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>LUXE Admin Boshqaruv Paneli</h2>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#5e6572]'}`}>Mijozlar buyurtmalari, bildirishnomalari va jo‘natish parametrlarini boshqarish</p>
        </div>
        <div className="flex items-center gap-2">
          {onResetDatabase && (
            <button 
              id="admin-reset-system"
              onClick={onResetDatabase}
              className="px-3 py-1.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-full text-[11px] font-semibold transition flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">restart_alt</span>
              Buyurtmalar tarixini tozalash
            </button>
          )}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className={`flex border-b mb-6 gap-2 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`} id="admin-tabs">
        <button 
          id="tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 font-semibold text-xs transition duration-150 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'orders' 
              ? 'border-[#2170e4] text-[#2170e4]' 
              : `border-transparent ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`
          }`}
        >
          <span className="material-symbols-outlined text-sm">assignment_late</span>
          Kelib tushgan buyurtmalar ({orders.length})
        </button>
        <button 
          id="tab-products"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 font-semibold text-xs transition duration-150 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'inventory' 
              ? 'border-[#2170e4] text-[#2170e4]' 
              : `border-transparent ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`
          }`}
        >
          <span className="material-symbols-outlined text-sm">inventory_2</span>
          Maxsus ombor ({products.length})
        </button>
        <button 
          id="tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 font-semibold text-xs transition duration-150 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'analytics' 
              ? 'border-[#2170e4] text-[#2170e4]' 
              : `border-transparent ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`
          }`}
        >
          <span className="material-symbols-outlined text-sm">leaderboard</span>
          Jonli tahlillar
        </button>
      </div>

      {/* Analytics Overview Screen */}
      {activeTab === 'analytics' && (
        <div className="space-y-6" id="admin-analytics-view">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border shadow-xs ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-slate-400' : 'text-slate-450'}`}>Tasdiqlangan tushum</span>
              <p className={`text-sm md:text-lg font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{totalRevenue.toLocaleString('uz-UZ')} so'm</p>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                <span className="material-symbols-outlined text-[10px]">trending_up</span>
                Tasdiqlangan to'lovlar
              </span>
            </div>

            <div className={`p-4 rounded-xl border shadow-xs ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kutilayotgan tushum</span>
              <p className="text-sm md:text-lg font-bold text-[#2170e4] mt-1">{pendingRevenue.toLocaleString('uz-UZ')} so'm</p>
              <span className={`text-[10px] flex items-center gap-0.5 mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="material-symbols-outlined text-[10px]">hourglass_empty</span>
                {pendingCount} ta tasdiq kutilmoqda
              </span>
            </div>

            <div className={`p-4 rounded-xl border shadow-xs ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Muvaffaqiyatli yetkazish</span>
              <p className={`text-xl md:text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {orders.length > 0 ? ((orders.filter(o => o.status === 'DELIVERED').length / orders.length) * 100).toFixed(0) : '0'}%
              </p>
              <span className="text-[10px] text-emerald-600 font-medium block mt-1">Mijozlar to'liq rozi</span>
            </div>

            <div className={`p-4 rounded-xl border shadow-xs ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Eng xaridorgir brend</span>
              <p className={`text-lg md:text-xl font-bold mt-1 truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>SONUS & HORIZON</p>
              <span className={`text-[10px] block mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Eng yuqori sharhlar</span>
            </div>
          </div>

          {/* Quick graph visualization card */}
          <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-bold text-sm uppercase tracking-wide ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>Buyurtmalar bajarilish holati</h3>
            <div className={`flex gap-2 h-8 rounded-lg overflow-hidden border w-full text-[10px] font-bold text-white text-center ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              {pendingCount > 0 && (
                <div 
                  style={{ width: `${(pendingCount / orders.length) * 100}%` }} 
                  className="bg-amber-500 flex items-center justify-center transition-all h-full text-xs"
                >
                  Kutilmoqda ({pendingCount})
                </div>
              )}
              {confirmedCount > 0 && (
                <div 
                  style={{ width: `${(confirmedCount / orders.length) * 100}%` }} 
                  className="bg-blue-500 flex items-center justify-center transition-all h-full text-xs"
                >
                  Tasdiqlandi ({confirmedCount})
                </div>
              )}
              {shippedCount > 0 && (
                <div 
                  style={{ width: `${(shippedCount / orders.length) * 100}%` }} 
                  className="bg-[#2170e4] flex items-center justify-center transition-all h-full text-xs"
                >
                  Jo'natildi ({shippedCount})
                </div>
              )}
              {deliveredCount > 0 && (
                <div 
                  style={{ width: `${(deliveredCount / orders.length) * 100}%` }} 
                  className="bg-emerald-600 flex items-center justify-center transition-all h-full text-xs"
                >
                  Yetkazildi ({deliveredCount})
                </div>
              )}
              {orders.length === 0 && (
                <div className="bg-slate-300 w-full text-slate-600 flex items-center justify-center">
                  Sotuvlar tarixi bo'sh
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>Kutilayotgan buyurtmalar ({pendingCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span>Tasdiqlangan buyurtmalar ({confirmedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2170e4] shrink-0" />
                <span>Yo‘lda bo‘lgan buyurtmalar ({shippedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Yetkazib tugatilganlar ({deliveredCount})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exclusive Inventory View with Product Add/Delete Controls */}
      {activeTab === 'inventory' && (
        <div className="space-y-6" id="admin-product-management">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div>
              <h3 className={`font-bold text-base flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>
                <span className="material-symbols-outlined text-[#2170e4]">inventory</span>
                Mahsulotlar Ombori ({products.length} ta hammasi)
              </h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tizimda yangi tovarlar qo‘shish yoki mavjudlarini o‘chirish nazorati</p>
            </div>
            <button 
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                showAddForm
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-[#2170e4] text-white hover:bg-[#0058be]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{showAddForm ? 'close' : 'add_circle'}</span>
              {showAddForm ? 'Formani yopish' : 'Yangi mahsulot qo‘shish'}
            </button>
          </div>

          {/* Add Product Collapsible Form */}
          {showAddForm && (
            <div className={`p-6 rounded-2xl border shadow-md animate-fade-in space-y-4 ${
              darkMode ? 'bg-slate-800/85 border-slate-700' : 'bg-white border-[#dee9fc]'
            }`} id="add-product-form-container">
              <div className="border-b pb-3 border-slate-200 dark:border-slate-700">
                <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>Yangi mahsulot tafsilotlari</h4>
                <p className="text-[10px] text-slate-400">Bizning milliy bozorda sotiladigan yangi premium elementni kiriting</p>
              </div>

              <form onSubmit={handleFormSubmitProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Name field */}
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-350' : 'text-slate-600'}`}>
                      Mahsulot nomi *
                    </label>
                    <input 
                      required
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-[#dee9fc] text-[#121c2a]'
                      }`}
                      placeholder="Masalan, Horizon Super Zoom"
                    />
                  </div>

                  {/* Brand field */}
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-350' : 'text-slate-600'}`}>
                      Kompaniya / Brend *
                    </label>
                    <input 
                      required
                      type="text" 
                      value={brand} 
                      onChange={(e) => setBrand(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-[#dee9fc] text-[#121c2a]'
                      }`}
                      placeholder="Masalan, SONUS, APEX, LUXE"
                    />
                  </div>

                  {/* Price field */}
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-350' : 'text-slate-600'}`}>
                      Narxi (so'm) *
                    </label>
                    <input 
                      required
                      type="number" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-[#dee9fc] text-[#121c2a]'
                      }`}
                      placeholder="Masalan, 850000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Selection */}
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-350' : 'text-slate-600'}`}>
                      Kategoriya *
                    </label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-white text-slate-300' : 'bg-slate-50 border-[#dee9fc] text-[#121c2a]'
                      }`}
                    >
                      <option value="electronics">Elektronika</option>
                      <option value="fashion">Kiyim va Aksessuarlar</option>
                      <option value="home">Uy va Ro‘zg‘or</option>
                      <option value="beauty">Go‘zallik va Parvarish</option>
                      <option value="sports">Sport va Hordiq</option>
                    </select>
                  </div>

                  {/* Image URL with helper */}
                  <div className="md:col-span-2">
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-350' : 'text-slate-600'}`}>
                      Rasm manzili (URL) (Bo'sh qolsa standart rasm yuklanadi)
                    </label>
                    <input 
                      type="text" 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-[#dee9fc] text-[#121c2a]'
                      }`}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Specs: Battery */}
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-350' : 'text-slate-600'}`}>
                      Akkumulyator yoki vaqt parametri (Ixtiyoriy)
                    </label>
                    <input 
                      type="text" 
                      value={battery} 
                      onChange={(e) => setBattery(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-[#dee9fc] text-[#121c2a]'
                      }`}
                      placeholder="Masalan, 30 soatgacha"
                    />
                  </div>

                  {/* Specs: Weight */}
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-350' : 'text-slate-600'}`}>
                      Og'irligi yoki o'lcham parametri (Ixtiyoriy)
                    </label>
                    <input 
                      type="text" 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                        darkMode ? 'bg-slate-905 border-slate-700 text-white' : 'bg-slate-50 border-[#dee9fc] text-[#121c2a]'
                      }`}
                      placeholder="Masalan, 250 gramm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-350' : 'text-slate-600'}`}>
                    Mahsulot haqida ma’lumot (Tavsifi)
                  </label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2170e4] h-16 resize-none border ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-[#dee9fc] text-[#121c2a]'
                    }`}
                    placeholder="Mahsulot haqida batafsil ma’lumotlar yozing..."
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-[#2170e4] hover:bg-[#0058be] text-white text-xs font-semibold rounded-full shadow-xs transition"
                  >
                    Mahsulotni qo‘shish
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table list */}
          <div className={`rounded-2xl border overflow-hidden shadow-xs ${
            darkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-white border-slate-200'
          }`} id="admin-inventory-view">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className={`text-[10px] font-bold uppercase tracking-widest border-b ${
                    darkMode ? 'bg-slate-800/80 text-slate-300 border-slate-700' : 'bg-[#f8f9ff] text-slate-600 border-slate-200'
                  }`}>
                    <th className="p-4">Mahsulot nomi</th>
                    <th className="p-4">Kategoriya</th>
                    <th className="p-4 text-right">Narxi</th>
                    <th className="p-4">Xususiyatlari</th>
                    <th className="p-4 text-center">Harakatlar</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${
                  darkMode ? 'divide-slate-700/60 text-slate-300' : 'divide-slate-100 text-slate-700'
                }`}>
                  {products.map(p => (
                    <tr key={p.id} className={`transition ${darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="p-4 flex items-center gap-3">
                        <img alt={p.name} src={p.image} className={`w-10 h-10 object-cover rounded-lg border shrink-0 ${
                          darkMode ? 'border-slate-700' : 'border-slate-100'
                        }`} />
                        <div>
                          <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>{p.name}</p>
                          <span className={`text-[10px] font-mono uppercase px-1 py-0.5 rounded ${
                            darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                          }`}>{p.brand}</span>
                        </div>
                      </td>
                      <td className="p-4 capitalize">{p.category === 'electronics' ? 'Elektronika' : p.category === 'fashion' ? 'Kiyim va Aksessuarlar' : p.category === 'home' ? 'Uy va Ro‘zg‘or' : p.category === 'beauty' ? 'Go‘zallik' : p.category === 'sports' ? 'Sport' : p.category}</td>
                      <td className="p-4 text-right font-bold text-[#2170e4] whitespace-nowrap">{p.price.toLocaleString('uz-UZ')} so'm</td>
                      <td className="p-4">
                        <span className={`text-[10px] truncate block max-w-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {p.specs.battery ? `Akkumulyator: ${p.specs.battery}` : ''} {p.specs.weight ? `| Og'irligi: ${p.specs.weight}` : ''} {!p.specs.battery && !p.specs.weight ? 'Standart mahsulot' : ''}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Haqiqatdan ham "${p.name}" mahsulotini o‘chirib tashlamoqchimisiz?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/15 dark:hover:bg-rose-900/30 text-rose-600 hover:text-rose-750 font-semibold rounded-full inline-flex items-center gap-1 transition shadow-xs"
                          title="Mahsulotni o'chirish"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                          <span>O‘chirish</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">Omborda hech qanday mahsulot mavjud emas. Yangi mahsulot qo‘shishingiz mumkin.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Received Orders Live Registry */}
      {activeTab === 'orders' && (
        <div id="admin-orders-live-view">
          {orders.length === 0 ? (
            <div className={`text-center p-12 rounded-2xl border space-y-4 shadow-xs ${
              darkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-white border-slate-200'
            }`}>
              <div className="w-16 h-16 bg-blue-50 text-[#2170e4] rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">mail_lock</span>
              </div>
              <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>Hozircha buyurtmalar yo‘q</h3>
              <p className={`text-xs max-w-xs mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-505'}`}>
                Mijozlar savat orqali buyurtma berishganida, ularning barcha ma’lumotlari va buyurtma tafsilotlari shu yerda jonli ravishda aks etadi!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Order Lists Panel */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative mb-3">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-2.5 text-xs">search</span>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Mijoz ismi, email yoki buyurtma ID orqali qidirish..."
                    className={`w-full text-xs py-2 rounded-xl pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                      darkMode 
                        ? 'bg-[#172036] border-[#1e293b] text-white placeholder:text-slate-550' 
                        : 'bg-white border-slate-200 text-[#121c2a]'
                    }`}
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
                  {filteredOrders.map(o => {
                    const isPick = selectedOrder && selectedOrder.id === o.id;
                    let badgeColor = 'bg-amber-100 text-amber-800';
                    let uzStatus = 'KUTILMOQDA';
                    if (o.status === 'CONFIRMED') {
                      badgeColor = 'bg-blue-100 text-blue-800';
                      uzStatus = 'TASDIQLANDI';
                    }
                    if (o.status === 'SHIPPED') {
                      badgeColor = 'bg-[#2170e4] text-white';
                      uzStatus = 'JO‘NATILDI';
                    }
                    if (o.status === 'DELIVERED') {
                      badgeColor = 'bg-emerald-100 text-emerald-800';
                      uzStatus = 'YETKAZILDI';
                    }

                    return (
                      <div 
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer text-xs ${
                          darkMode 
                            ? 'bg-slate-800/40 border-slate-700/80 hover:border-slate-655' 
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        } ${
                          isPick 
                            ? (darkMode ? 'border-[#2170e4] ring-1 ring-[#2170e4] bg-[#2170e4]/10' : 'border-[#2170e4] ring-1 ring-[#2170e4] shadow-md bg-[#eff4ff]/20') 
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                           <div>
                            <span className="font-mono text-[10px] uppercase font-bold text-[#2170e4]">{o.id}</span>
                            <h4 className={`font-bold mt-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{o.customerName}</h4>
                          </div>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${badgeColor}`}>
                            {uzStatus}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] pt-1">
                          <span className={darkMode ? 'text-slate-400' : 'text-[#5e6572]'}>Mahsulotlar: {o.items.reduce((acc, c) => acc + c.quantity, 0)} dona</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>{o.totalPrice.toLocaleString('uz-UZ')} so'm</span>
                        </div>

                        <p className={`text-[10px] mt-2 flex items-center gap-1 ${darkMode ? 'text-slate-500' : 'text-slate-450'}`}>
                          <span className="material-symbols-outlined text-[10px]">schedule</span>
                          Yaratilgan vaqt: {new Date(o.createdAt).toLocaleString('uz-UZ')}
                        </p>
                      </div>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <p className={`text-center text-xs py-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Mos keladigan buyurtmalar topilmadi.</p>
                  )}
                </div>
              </div>

              {/* Order Detail View Drawer / Card */}
              <div className="lg:col-span-6">
                {selectedOrder ? (
                  <div className={`rounded-2xl p-5 space-y-6 shadow-sm sticky top-2 border ${
                    darkMode ? 'bg-[#111726]/90 border-slate-700/80' : 'bg-white border-slate-200'
                  }`} id="order-details-focus-pane">
                    
                    {/* Header */}
                    <div className={`flex justify-between items-start border-b pb-4 ${darkMode ? 'border-slate-750' : 'border-slate-100'}`}>
                      <div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-505'
                        }`}>{selectedOrder.id}</span>
                        <h3 className={`font-bold text-base mt-1 ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>Foydalanuvchi buyurtma ma'lumoti</h3>
                        <p className="text-[10px] text-slate-455">Kelib tushgan buyurtma varaqasi</p>
                      </div>
                      <div>
                        <button 
                          id="btn-close-focus-order"
                          onClick={() => setSelectedOrder(null)}
                          className={`text-slate-400 p-1 rounded-full text-xs ${
                            darkMode ? 'hover:text-slate-200 hover:bg-slate-800' : 'hover:text-slate-600 bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Customer Personal Details */}
                    <div className="space-y-2 text-xs">
                      <h4 className="font-bold text-[10px] uppercase text-[#2170e4] tracking-widest">Mijoz kontakt ma'lumoti</h4>
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl border ${
                        darkMode ? 'bg-slate-800/30 border-slate-700/60' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <div>
                          <p className="text-slate-400 text-[10px]">Foydalanuvchi ismi</p>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.customerName}</span>
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px]">Telefon raqami</p>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.customerPhone}</span>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-slate-400 text-[10px]">Elektron pochta (Email)</p>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-905'}`}>{selectedOrder.customerEmail}</span>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-slate-400 text-[10px]">Yetkazib berish manzili</p>
                          <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{selectedOrder.customerAddress}</span>
                        </div>
                        {selectedOrder.notes && (
                          <div className={`md:col-span-2 border-t pt-2 mt-1 ${darkMode ? 'border-slate-700/60' : 'border-slate-200/60'}`}>
                            <p className="text-slate-400 text-[10px]">Buyurtma bo'yicha maxsus istaklar</p>
                            <span className={`italic font-mono ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>"{selectedOrder.notes}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items requested list */}
                    <div className="space-y-2 text-xs">
                      <h4 className="font-bold text-[10px] uppercase text-[#2170e4] tracking-widest">Buyurtma qilingan mahsulotlar</h4>
                      <div className="space-y-2">
                        {selectedOrder.items.map(item => (
                          <div key={item.product.id} className={`flex gap-3 justify-between items-center border-b pb-2 ${
                            darkMode ? 'border-slate-700/60' : 'border-slate-100'
                          }`}>
                            <div className="flex items-center gap-2">
                              <img src={item.product.image} alt={item.product.name} className={`w-8 h-8 rounded object-cover border ${
                                darkMode ? 'border-slate-705' : 'border-slate-100'
                              }`} />
                              <div>
                                <p className={`font-bold line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.product.name}</p>
                                <span className="text-[10px] text-slate-400">{item.product.brand} | Soni: {item.quantity} dona</span>
                              </div>
                            </div>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{(item.product.price * item.quantity).toLocaleString('uz-UZ')} so'm</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className={`flex justify-between font-bold pt-1 text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <span>Jami to'langan summa (QQS bilan)</span>
                        <span className="text-[#2170e4]">{selectedOrder.totalPrice.toLocaleString('uz-UZ')} so'm</span>
                      </div>
                    </div>

                    {/* Order Action Controls */}
                    <div className={`space-y-2 text-xs border-t pt-4 ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
                      <h4 className={`font-bold text-[10px] uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Buyurtma holatini yangilash</h4>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => onUpdateOrderStatus(selectedOrder.id, 'CONFIRMED')}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${
                            selectedOrder.status === 'CONFIRMED' 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : `hover:bg-slate-200 ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700'}`
                          }`}
                        >
                          Tasdiqlash
                        </button>
                        <button 
                          onClick={() => onUpdateOrderStatus(selectedOrder.id, 'SHIPPED')}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${
                            selectedOrder.status === 'SHIPPED' 
                              ? 'bg-[#2170e4] text-white shadow-sm' 
                              : `hover:bg-slate-200 ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700'}`
                          }`}
                        >
                          Jo‘natish (Yo‘lda)
                        </button>
                        <button 
                          onClick={() => onUpdateOrderStatus(selectedOrder.id, 'DELIVERED')}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${
                            selectedOrder.status === 'DELIVERED' 
                              ? 'bg-emerald-600 text-white shadow-sm' 
                              : `hover:bg-slate-200 ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700'}`
                          }`}
                        >
                          Yetkazib berish (Yakunlash)
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center min-h-[300px]" id="no-order-focus-selection">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">back_hand</span>
                    <p className="font-bold">Buyurtmalardan birini tanlang</p>
                    <p className="text-[11px] max-w-[200px] mx-auto mt-1">Mijozning kontaktlari, mahsulot tafsilotlari va statusini sozlash uchun chap ro'yxatdan birini tanlang</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
