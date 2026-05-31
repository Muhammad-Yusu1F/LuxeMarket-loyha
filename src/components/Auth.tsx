import React, { useState } from 'react';

interface AuthProps {
  onSuccess: (email: string) => void;
  darkMode: boolean;
}

export default function Auth({ onSuccess, darkMode }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.trim() || !email.includes('@')) {
      setError('Iltimos, to’g’ri email manzilini kiriting!');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo‘lishi kerak!');
      setLoading(false);
      return;
    }

    // Check credentials (any password of >= 6 chars is accepted per user request)
    const cleanEmail = email.trim().toLowerCase();
    
    setTimeout(() => {
      setLoading(false);
      onSuccess(cleanEmail);
    }, 800);
  };

  return (
    <div className={`fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-md ${
      darkMode ? 'bg-slate-950/80' : 'bg-slate-900/40'
    }`} id="auth-portal">
      <div className={`w-full max-w-md rounded-3xl border p-6 md:p-8 shadow-2xl transition-all duration-300 transform scale-100 ${
        darkMode 
          ? 'bg-[#111726] border-[#1e293b] text-white shadow-slate-900/50' 
          : 'bg-white border-slate-200 text-[#121c2a] shadow-slate-500/20'
      }`}>
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-3xl font-extrabold text-[#2170e4] tracking-wider font-sans">LUXE</h2>
          <p className={`text-xs uppercase tracking-widest font-semibold ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Exclusive Premium Store
          </p>
          <div className="h-0.5 w-12 bg-[#2170e4] mx-auto rounded-full mt-2" />
        </div>

        {/* Informational Message */}
        <div className={`p-3 rounded-xl border text-center text-xs mb-4 ${
          darkMode ? 'bg-blue-950/20 border-blue-900/30 text-blue-300' : 'bg-blue-50 border-blue-100 text-[#0058be]'
        }`}>
          <span>Davom etish va buyurtma berish uchun tizimga kiring!</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-xs font-semibold text-center">
              ⚠ {error}
            </div>
          )}

          {isSignUp && (
            <div className="space-y-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                To‘liq Ismingiz
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masalan: Jamshid Yusupov"
                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition focus:ring-1 focus:ring-[#2170e4] ${
                  darkMode 
                    ? 'bg-[#172036] border-[#1e293b]/80 text-white placeholder-slate-500 focus:border-[#2170e4]' 
                    : 'bg-[#f8f9ff] border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#2170e4]'
                }`}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Email manzilingiz
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition focus:ring-1 focus:ring-[#2170e4] ${
                darkMode 
                  ? 'bg-[#172036] border-[#1e293b]/80 text-white placeholder-slate-500 focus:border-[#2170e4]' 
                  : 'bg-[#f8f9ff] border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#2170e4]'
              }`}
            />
          </div>

          <div className="space-y-1">
            <label className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Maxfiy Parol
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition focus:ring-1 focus:ring-[#2170e4] ${
                darkMode 
                  ? 'bg-[#172036] border-[#1e293b]/80 text-white placeholder-slate-500 focus:border-[#2170e4]' 
                  : 'bg-[#f8f9ff] border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#2170e4]'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2170e4] hover:bg-[#0058be] text-white py-3.5 rounded-xl text-sm font-bold transition duration-300 shadow-md flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              isSignUp ? 'Ro‘yxatdan o‘tish' : 'Tizimga kirish'
            )}
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className={`text-xs font-semibold hover:underline outline-none ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#2170e4] hover:text-[#0058be]'
            }`}
          >
            {isSignUp ? "Allaqachon hisobingiz bormi? Kirish" : "Hisobingiz yo‘qmi? Ro‘yxatdan o‘tish"}
          </button>
        </div>
      </div>
    </div>
  );
}
