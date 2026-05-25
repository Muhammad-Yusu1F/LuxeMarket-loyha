import { Order, Product } from '../types';
import { useState } from 'react';

interface AdminProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, newStatus: Order['status']) => void;
  products: Product[];
  onResetDatabase?: () => void;
  darkMode?: boolean;
}

export default function Admin({ 
  orders, 
  onUpdateOrderStatus, 
  products, 
  onResetDatabase,
  darkMode = false
}: AdminProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'analytics'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
            Merchant Security Control
          </div>
          <h2 className={`text-22px font-bold tracking-tight ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>LUXE Admin Dashboard</h2>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#5e6572]'}`}>Manage customer purchase requests, notifications, and shipping logs</p>
        </div>
        <div className="flex items-center gap-2">
          {onResetDatabase && (
            <button 
              id="admin-reset-system"
              onClick={onResetDatabase}
              className="px-3 py-1.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-full text-[11px] font-semibold transition flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">restart_alt</span>
              Clear Order History
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
          Orders Received ({orders.length})
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
          Exclusive Inventory ({products.length})
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
          Live Metrics
        </button>
      </div>

      {/* Analytics Overview Screen */}
      {activeTab === 'analytics' && (
        <div className="space-y-6" id="admin-analytics-view">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border shadow-xs ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Processed revenue</span>
              <p className={`text-xl md:text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>${totalRevenue.toFixed(2)}</p>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                <span className="material-symbols-outlined text-[10px]">trending_up</span>
                Verified payments
              </span>
            </div>

            <div className={`p-4 rounded-xl border shadow-xs ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Pending Income</span>
              <p className="text-xl md:text-2xl font-bold text-[#2170e4] mt-1">${pendingRevenue.toFixed(2)}</p>
              <span className={`text-[10px] flex items-center gap-0.5 mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="material-symbols-outlined text-[10px]">hourglass_empty</span>
                {pendingCount} waiting approvals
              </span>
            </div>

            <div className={`p-4 rounded-xl border shadow-xs ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Conversion</span>
              <p className={`text-xl md:text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {orders.length > 0 ? ((orders.filter(o => o.status === 'DELIVERED').length / orders.length) * 100).toFixed(0) : '0'}%
              </p>
              <span className="text-[10px] text-emerald-600 font-medium block mt-1">Satisfied delivery cycles</span>
            </div>

            <div className={`p-4 rounded-xl border shadow-xs ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In-Demand Brand</span>
              <p className={`text-lg md:text-xl font-bold mt-1 truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>SONUS & HORIZON</p>
              <span className={`text-[10px] block mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Highest user ratings</span>
            </div>
          </div>

          {/* Quick graph visualization card */}
          <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-bold text-sm uppercase tracking-wide ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>Fulfillment Status Flow</h3>
            <div className={`flex gap-2 h-8 rounded-lg overflow-hidden border w-full text-[10px] font-bold text-white text-center ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              {pendingCount > 0 && (
                <div 
                  style={{ width: `${(pendingCount / orders.length) * 100}%` }} 
                  className="bg-amber-500 flex items-center justify-center transition-all h-full"
                >
                  Pending ({pendingCount})
                </div>
              )}
              {confirmedCount > 0 && (
                <div 
                  style={{ width: `${(confirmedCount / orders.length) * 100}%` }} 
                  className="bg-blue-500 flex items-center justify-center transition-all h-full"
                >
                  Confirmed ({confirmedCount})
                </div>
              )}
              {shippedCount > 0 && (
                <div 
                  style={{ width: `${(shippedCount / orders.length) * 100}%` }} 
                  className="bg-indigo-505 bg-[#2170e4] flex items-center justify-center transition-all h-full"
                >
                  Shipped ({shippedCount})
                </div>
              )}
              {deliveredCount > 0 && (
                <div 
                  style={{ width: `${(deliveredCount / orders.length) * 100}%` }} 
                  className="bg-emerald-600 flex items-center justify-center transition-all h-full"
                >
                  Delivered ({deliveredCount})
                </div>
              )}
              {orders.length === 0 && (
                <div className="bg-slate-300 w-full text-slate-600 flex items-center justify-center">
                  No registered checkout events yet
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>Pending Client Forms ({pendingCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span>Confirmed Orders ({confirmedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2170e4] shrink-0" />
                <span>Active Transit Shipped ({shippedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Delivered & Closed ({deliveredCount})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exclusive Inventory View */}
      {activeTab === 'inventory' && (
        <div className={`rounded-2xl border overflow-hidden shadow-xs ${
          darkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-white border-slate-200'
        }`} id="admin-inventory-view">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-bold uppercase tracking-widest border-b ${
                darkMode ? 'bg-slate-800/80 text-slate-300 border-slate-700' : 'bg-[#f8f9ff] text-slate-600 border-slate-200'
              }`}>
                <th className="p-4">Item Detail</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Premium Value</th>
                <th className="p-4">Global Specs Detail</th>
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
                  <td className="p-4 capitalize">{p.category}</td>
                  <td className="p-4 text-right font-bold text-[#2170e4]">${p.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`text-[10px] truncate block max-w-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Battery: {p.specs.battery || 'N/A'} | Weight: {p.specs.weight || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>No Purchase Notifications</h3>
              <p className={`text-xs max-w-xs mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-505'}`}>
                When a user places a luxury order via the Shopping Bag checkout, their details, phone number, and items will instantly stream here live!
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
                    placeholder="Filter by customer name, email or ID..."
                    className={`w-full text-xs py-2 rounded-xl pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                      darkMode 
                        ? 'bg-[#172036] border-[#1e293b] text-white placeholder:text-slate-500' 
                        : 'bg-white border-slate-200 text-[#121c2a]'
                    }`}
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
                  {filteredOrders.map(o => {
                    const isPick = selectedOrder && selectedOrder.id === o.id;
                    let badgeColor = 'bg-amber-100 text-amber-800';
                    if (o.status === 'CONFIRMED') badgeColor = 'bg-blue-100 text-blue-800';
                    if (o.status === 'SHIPPED') badgeColor = 'bg-[#2170e4] text-white';
                    if (o.status === 'DELIVERED') badgeColor = 'bg-emerald-100 text-emerald-800';

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
                            {o.status}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] pt-1">
                          <span className={darkMode ? 'text-slate-400' : 'text-[#5e6572]'}>Items: {o.items.reduce((acc, c) => acc + c.quantity, 0)}</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>${o.totalPrice.toFixed(2)}</span>
                        </div>

                        <p className={`text-[10px] mt-2 flex items-center gap-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          <span className="material-symbols-outlined text-[10px]">schedule</span>
                          Placed at: {new Date(o.createdAt).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <p className={`text-center text-xs py-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No matching orders found.</p>
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
                        <h3 className={`font-bold text-base mt-1 ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>Customer Form Log</h3>
                        <p className="text-[10px] text-slate-400">Received of live checkout event</p>
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
                      <h4 className="font-bold text-[10px] uppercase text-[#2170e4] tracking-widest">Client Contact Card</h4>
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl border ${
                        darkMode ? 'bg-slate-800/30 border-slate-700/60' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <div>
                          <p className="text-slate-400 text-[10px]">Full Name</p>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.customerName}</span>
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px]">Phone Number</p>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.customerPhone}</span>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-slate-400 text-[10px]">Email Address</p>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.customerEmail}</span>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-slate-400 text-[10px]">Shipping Destination</p>
                          <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{selectedOrder.customerAddress}</span>
                        </div>
                        {selectedOrder.notes && (
                          <div className={`md:col-span-2 border-t pt-2 mt-1 ${darkMode ? 'border-slate-700/60' : 'border-slate-200/60'}`}>
                            <p className="text-slate-400 text-[10px]">Client Order Notes</p>
                            <span className={`italic font-mono ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>"{selectedOrder.notes}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items requested list */}
                    <div className="space-y-2 text-xs">
                      <h4 className="font-bold text-[10px] uppercase text-[#2170e4] tracking-widest">Cart Ingredients Included</h4>
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
                                <span className="text-[10px] text-slate-400">{item.product.brand} | Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className={`flex justify-between font-bold pt-1 text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <span>Paid Total Received</span>
                        <span className="text-[#2170e4]">${selectedOrder.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Order Action Controls */}
                    <div className={`space-y-2 text-xs border-t pt-4 ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
                      <h4 className={`font-bold text-[10px] uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Update Shipping Status</h4>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => onUpdateOrderStatus(selectedOrder.id, 'CONFIRMED')}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${
                            selectedOrder.status === 'CONFIRMED' 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : `hover:bg-slate-200 ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700'}`
                          }`}
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => onUpdateOrderStatus(selectedOrder.id, 'SHIPPED')}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${
                            selectedOrder.status === 'SHIPPED' 
                              ? 'bg-[#2170e4] text-white shadow-sm' 
                              : `hover:bg-slate-200 ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700'}`
                          }`}
                        >
                          Dispatch / Ship
                        </button>
                        <button 
                          onClick={() => onUpdateOrderStatus(selectedOrder.id, 'DELIVERED')}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${
                            selectedOrder.status === 'DELIVERED' 
                              ? 'bg-emerald-600 text-white shadow-sm' 
                              : `hover:bg-slate-200 ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700'}`
                          }`}
                        >
                          Deliver & Close
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center min-h-[300px]" id="no-order-focus-selection">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">back_hand</span>
                    <p className="font-bold">Select an Order Card</p>
                    <p className="text-[11px] max-w-[200px] mx-auto mt-1">Tap any received customer notice on the left list to edit details & flag dispatcher cycles</p>
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
