import { CartItem } from '../types';
import { useState, FormEvent } from 'react';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckoutComplete: (customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    notes?: string;
  }) => void;
  isMobileLayout?: boolean;
  darkMode?: boolean;
}

export default function Cart({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onCheckoutComplete,
  isMobileLayout = false,
  darkMode = false
}: CartProps) {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  // Form states
  const [name, setName] = useState('Alex Morgan');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [email, setEmail] = useState('ybegimqulov01@gmail.com');
  const [address, setAddress] = useState('Tashkent, Amir Temur Avenue 45');
  const [notes, setNotes] = useState('');

  // Subtotal Calculation
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const taxRate = 0.08; // 8% Est Tax
  const estTax = subtotal * taxRate;
  const total = subtotal + estTax;

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !address) {
      alert('Please fill out all required fields');
      return;
    }
    
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckedOut(true);
      onCheckoutComplete({
        name,
        phone,
        email,
        address,
        notes
      });
    }, 1500);
  };

  const handleResetCart = () => {
    setCheckedOut(false);
    setShowCheckoutForm(false);
    onClearCart();
  };

  if (checkedOut) {
    return (
      <div className="pt-8 pb-16 text-center space-y-6 max-w-md mx-auto" id="checkout-success-container">
        <div className="w-20 h-20 bg-emerald-100 text-[#2170e4] rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
          <span className="material-symbols-outlined text-4xl text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#121c2a]">Order Completed!</h2>
          <p className="text-sm text-[#424754] px-4">
            Congratulations <strong>{name}</strong>! Your purchase of <strong className="text-[#0058be]">${total.toFixed(2)}</strong> was placed.
          </p>
          <p className="text-xs text-[#727785] px-2">
            A notification with item details has been securely dispatched to the store manager. Check the <strong>Admin Panel</strong> in the menu to verify or fulfill the order!
          </p>
        </div>
        <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#c2c6d6]/60 text-xs text-left text-[#5e6572] space-y-2">
          <p><strong>Customer:</strong> {name} ({phone})</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Status:</strong> Pending Merchant Approval</p>
          <p><strong>Delivery:</strong> Express Courier 24H</p>
        </div>
        <button 
          id="btn-continue-checkout"
          onClick={handleResetCart}
          className="w-full bg-[#2170e4] hover:bg-[#0058be] text-white py-3 rounded-full font-semibold text-sm shadow-sm transition-colors"
        >
          Continue Premium Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-12" id="cart-workspace">
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className={`text-22px font-semibold ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>Your Shopping Bag</h2>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-[#424754]'}`}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} currently in your cart
          </p>
        </div>
        {cartItems.length > 0 && !showCheckoutForm && (
          <button 
            id="clear-bag-btn"
            onClick={onClearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">remove_shopping_cart</span>
            Clear Bag
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className={`text-center p-12 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-[#111726]/80 border-[#1e293b] text-white' : 'bg-[#f8f9ff] border-[#e6eeff] text-[#121c2a]'
        }`} id="empty-cart-view">
          <div className="w-16 h-16 bg-[#dee9fc] text-[#0058be] rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">shopping_cart_off</span>
          </div>
          <p className="font-semibold text-base">Your bag is empty</p>
          <span className={`text-xs block max-w-xs mx-auto ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>
            Explore our signature collection of luxury devices and add them to your shopping cart.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6" id="cart-checkout-grid">
          {/* Left panel */}
          <div className="lg:col-span-6 space-y-4">
            {showCheckoutForm ? (
              /* High-End Order Checkout Form */
              <div className={`rounded-2xl p-6 border shadow-sm space-y-6 ${
                darkMode ? 'bg-[#111726]/85 border-[#1e293b] text-white' : 'bg-white border-[#dee9fc] text-[#121c2a]'
              }`} id="checkout-form-container">
                <div className={`flex items-center gap-2 border-b pb-4 ${darkMode ? 'border-[#1e293b]' : 'border-[#f1f5f9]'}`}>
                  <button 
                    id="btn-back-to-cart-details"
                    type="button" 
                    onClick={() => setShowCheckoutForm(false)} 
                    className="text-[#2170e4] hover:bg-[#eff4ff]/10 w-8 h-8 rounded-full flex items-center justify-center"
                    title="Back to items list"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <div>
                    <h3 className="font-bold text-lg">Delivery & Contact</h3>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>Provide details to finalize your luxury purchase</p>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-xs text-slate-400">person</span>
                      <input 
                        required
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#f8f9ff] border-[#dee9fc] text-[#121c2a]'
                        }`}
                        placeholder="e.g. Alex Morgan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Phone Number *
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-xs text-slate-400">phone</span>
                        <input 
                          required
                          type="tel" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#f8f9ff] border-[#dee9fc] text-[#121c2a]'
                          }`}
                          placeholder="e.g. +998 90 123 4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Email Address *
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-xs text-slate-400">mail</span>
                        <input 
                          required
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#f8f9ff] border-[#dee9fc] text-[#121c2a]'
                          }`}
                          placeholder="e.g. alex@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Shipping Address *
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-xs text-slate-400">pin_drop</span>
                      <input 
                        required
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#2170e4] border ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#f8f9ff] border-[#dee9fc] text-[#121c2a]'
                        }`}
                        placeholder="e.g. Tashkent, Amir Temur Avenue 45"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Delivery Notes / Requests (Optional)
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-xs text-slate-400">edit_note</span>
                      <textarea 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#2170e4] h-20 resize-none border ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#f8f9ff] border-[#dee9fc] text-[#121c2a]'
                        }`}
                        placeholder="e.g. Call before delivery, ring second apartment doorbell..."
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-blue-800">
                    <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                    <span>This simulation logs the detailed purchase to the real-time store admin view for immediate merchant handling.</span>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button 
                      id="btn-cancel-form"
                      type="button"
                      onClick={() => setShowCheckoutForm(false)}
                      className="w-1/3 py-3 border border-[#dee9fc] text-slate-700 font-semibold rounded-full text-xs hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      id="btn-confirm-checkout"
                      type="submit"
                      disabled={isCheckingOut}
                      className="w-2/3 py-3 bg-[#2170e4] hover:bg-[#0058be] text-white font-semibold rounded-full text-xs shadow-md transition flex items-center justify-center gap-1"
                    >
                      {isCheckingOut ? (
                        <>
                          <span className="animate-spin text-sm mr-1">⌛</span> Processing Secure Pay
                        </>
                      ) : (
                        <>
                          Confirm Purchase of ${total.toFixed(2)}
                          <span className="material-symbols-outlined text-[16px]">verified_user</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Items Listing */
              <div className="space-y-4" id="cart-items-listings">
                {cartItems.map((item) => {
                  const itemTotal = item.product.price * item.quantity;
                  
                  // Custom variant descriptions
                  let variantSubtitle = 'Default Polish / OS';
                  if (item.product.id === 'velocity-pro-runner') {
                    variantSubtitle = 'Electric Blue / Size 42';
                  } else if (item.product.id === 'luxe-chrono-white') {
                    variantSubtitle = 'Silver Polish / OS';
                  } else if (item.product.id === 'acoustics-ultra-x') {
                    variantSubtitle = 'Matte Black / OS';
                  } else if (item.product.id === 'apex-ultra-wireless') {
                    variantSubtitle = 'Standard Black / OS';
                  } else if (item.product.id === 'aurora-skin-regenerator') {
                    variantSubtitle = 'Active Titanium Glow Edition';
                  } else if (item.product.id === 'luna-gold-necklace') {
                    variantSubtitle = '24K Solstice Solid link';
                  }

                  return (
                    <div 
                      key={item.product.id}
                      className="bg-white rounded-xl p-4 flex gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#e6eeff] transition-transform hover:scale-[1.01] duration-300"
                    >
                      <div className="w-24 h-28 md:w-28 md:h-32 flex-shrink-0 bg-[#f8f9ff] rounded-lg overflow-hidden border border-[#e6eeff]">
                        <img 
                          alt={item.product.name} 
                          className="w-full h-full object-cover" 
                          src={item.product.image}
                        />
                      </div>

                      <div className="flex-grow flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#2170e4] tracking-wider block">{item.product.brand}</span>
                            <h3 className="font-semibold text-sm text-[#121c2a] line-clamp-1">{item.product.name}</h3>
                            <p className="text-[11px] text-[#727785] mt-0.5">{variantSubtitle}</p>
                          </div>
                          <button 
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-[#727785] hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete item"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>

                        <div className="flex justify-between items-end gap-2 pt-2">
                          {/* Quantity Selector controls */}
                          <div className="flex items-center gap-1 bg-[#eff4ff] rounded-full px-1.5 py-1 border border-[#c2c6d6]">
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#d9e3f6] text-[#121c2a] transition-all active:scale-90"
                              title="Reduce quantity"
                              disabled={item.quantity <= 1}
                            >
                              <span className="material-symbols-outlined text-[16px]">remove</span>
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-[#121c2a]">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#d9e3f6] text-[#121c2a] transition-all active:scale-90"
                              title="Increase quantity"
                            >
                              <span className="material-symbols-outlined text-[16px]">add</span>
                            </button>
                          </div>
                          <span className="font-bold text-base text-[#2170e4]">${itemTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right panel summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`backdrop-blur-sm rounded-xl p-5 border shadow-sm space-y-4 transition-colors ${
              darkMode ? 'bg-[#111726]/90 border-[#1e293b]' : 'bg-[#dee9fc]/70 border-[#c2c6d6]/40'
            }`}>
              <h3 className="font-semibold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2170e4]">payments</span>
                Purchase Receipt
              </h3>
              
              <div className={`space-y-2 border-b pb-4 text-xs ${darkMode ? 'border-[#1e293b]/50 text-slate-350' : 'border-[#c2c6d6]/40 text-[#424754]'}`}>
                <div className="flex justify-between">
                  <span>Items total ({cartItems.reduce((acc, current) => acc + current.quantity, 0)})</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-wider">Free Express</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-[#121c2a]'}`}>${estTax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total Amount</span>
                <span className="text-lg text-[#0058be]">${total.toFixed(2)}</span>
              </div>

              {!showCheckoutForm && (
                <button 
                  id="checkout-trigger-btn"
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full bg-[#2170e4] hover:bg-[#0058be] text-white h-12 rounded-full font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md duration-200"
                >
                  Proceed to Secure Checkout
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              )}

              <div className="mt-2 flex items-center justify-center gap-1 text-[#5e6572] text-[10px] font-medium text-center">
                <span className="material-symbols-outlined text-[11px] text-emerald-600">verified</span>
                Encrypted End-To-End Security
              </div>
            </div>

            {/* Free shipping banner */}
            <div className={`border rounded-xl p-4 flex items-center gap-3 transition-colors ${
              darkMode ? 'bg-[#172036]/60 border-[#1e293b]' : 'bg-[#f8f9ff] border-[#dee9fc]'
            }`}>
              <span className="material-symbols-outlined text-[#2170e4] text-xl">workspace_premium</span>
              <div>
                <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-[#424754]'}`}>
                  Luxury Assurance Guaranteed
                </p>
                <span className={`text-[10px] block mt-0.5 ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>Every order is carefully inspected, validated, and shipped in bespoke hard cases with white-globe delivery service.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
