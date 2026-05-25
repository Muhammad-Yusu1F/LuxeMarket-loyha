import { useState, useEffect } from 'react';

interface ProfileProps {
  userEmail: string;
  onChangeEmail: (email: string) => void;
  darkMode: boolean;
}

export default function Profile({ userEmail, onChangeEmail, darkMode }: ProfileProps) {
  const [points, setPoints] = useState(4850);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [emailInput, setEmailInput] = useState(userEmail);

  useEffect(() => {
    setEmailInput(userEmail);
  }, [userEmail]);

  const isAdmin = userEmail.trim().toLowerCase() === 'ybegimqulov01@gmail.com';

  const handleSaveEmail = () => {
    if (!emailInput.trim() || !emailInput.includes('@')) {
      alert('Iltimos to’g’ri email manzilini kiriting!');
      return;
    }
    onChangeEmail(emailInput.trim());
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pt-4 pb-12 max-w-xl mx-auto" id="profile-container">
      {/* Profile Header */}
      <div className={`rounded-2xl p-6 border transition-colors flex flex-col items-center text-center space-y-4 ${
        darkMode 
          ? 'bg-[#111726]/80 border-[#1e293b] shadow-xl text-white' 
          : 'bg-white border-[#e6eeff] shadow-sm text-[#121c2a]'
      }`}>
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#2170e4] overflow-hidden border-4 border-[#dee9fc] shadow-md">
            <img 
              alt="Alex Morgan" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8wJxhKjVUVbbRdfGKJSZ2mLpMgj5VQXcu7mycIfxyvbgntKROM-JANN7JcWVSCPrD4ObFx2WeUlCrzNv9CLtD9UY7iGrgIljBclDVfTRctGywv570dqZN-3EjL1iuGk7EuXU6iBDaWeog155zPJFkCoik9O20FQD4I7TMs2gFMvRAA3Oqnlih_rk9sw6f8rArF1GKqhB_omthqMQDNjxYk2fBisDzFgl_430yEwqwJXKazWKKDQMRCAF_lb9cIDUy71YYzs9CKI9H"
            />
          </div>
          <span className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white animate-pulse" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold">Alex Morgan</h2>
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
            isAdmin ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-[#2170e4]/10 text-[#2170e4]'
          }`}>
            {isAdmin ? '🛡️ STORE ADMIN & OWNER' : '💎 PLATINUM MEMBER'}
          </span>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} font-mono`}>
            Premium ID: LUXE-849-GOLD
          </p>
        </div>

        {/* Loyalty Points display */}
        <div className={`border rounded-xl px-5 py-3.5 w-full grid grid-cols-2 divide-x transition-colors ${
          darkMode 
            ? 'bg-[#172036] border-[#1e293b]/80 divide-[#1e293b]/70' 
            : 'bg-[#eff4ff] border-[#dee9fc] divide-[#c2c6d6]/45'
        }`}>
          <div>
            <span className={`text-[10px] font-semibold uppercase block ${
              darkMode ? 'text-slate-400' : 'text-[#727785]'
            }`}>
              Loyalty Points
            </span>
            <span className="text-lg font-bold text-[#2170e4]">{points} pts</span>
          </div>
          <div>
            <span className={`text-[10px] font-semibold uppercase block ${
              darkMode ? 'text-slate-400' : 'text-[#727785]'
            }`}>
              Active tier
            </span>
            <span className="text-lg font-bold text-amber-500">Platinum Plus</span>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className={`rounded-2xl p-5 border transition-colors space-y-4 ${
        darkMode 
          ? 'bg-[#111726]/85 border-[#1e293b] text-white' 
          : 'bg-white border-[#e6eeff] text-[#121c2a]'
      }`}>
        <h3 className={`font-bold text-base border-b pb-2 ${
          darkMode ? 'border-[#1e293b]' : 'border-[#e6eeff]'
        }`}>
          Membership Options
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2170e4]">notifications_active</span>
              <div>
                <p className="font-semibold">Interactive Notifications</p>
                <span className={`text-[11px] block ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>
                  Order tracking & stock changes
                </span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={() => setNotifications(!notifications)}
              className="rounded text-[#2170e4] focus:ring-[#2170e4] h-4 w-4 border-[#c2c6d6]"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2170e4]">fingerprint</span>
              <div>
                <p className="font-semibold">Biometric Verification</p>
                <span className={`text-[11px] block ${darkMode ? 'text-slate-400' : 'text-[#727785]'}`}>
                  Secure checkout using face scan or TouchID
                </span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={biometric} 
              onChange={() => setBiometric(!biometric)}
              className="rounded text-[#2170e4] focus:ring-[#2170e4] h-4 w-4 border-[#c2c6d6]"
            />
          </div>

          {/* Interactive Role Switching email setting */}
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-[#172036]/50 border-[#1e293b]' : 'bg-[#f8f9ff] border-slate-200/60'
          }`}>
            <div className="flex justify-between items-start text-sm">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#2170e4] mt-1">mail</span>
                <div className="space-y-1">
                  <p className="font-semibold">User Verification Email</p>
                  <p className={`text-[11px] leading-relaxed block ${darkMode ? 'text-slate-300' : 'text-[#424754]'}`}>
                    Changing email lets you toggle user permissions. Use <strong className="text-amber-500 font-mono">ybegimqulov01@gmail.com</strong> for Admin access!
                  </p>
                  
                  {!isEditing ? (
                    <div className="inline-flex items-center gap-1.5 mt-2 bg-[#2170e4]/10 text-[#2170e4] text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                      <span>{userEmail}</span>
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <input 
                        type="email" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className={`text-xs px-3 py-1.5 rounded-lg border focus:ring-1 focus:ring-[#2170e4] focus:outline-none focus:border-transparent ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                        }`}
                        placeholder="test@example.com"
                      />
                      <button 
                        onClick={handleSaveEmail}
                        className="bg-[#2170e4] text-white text-xs px-3 py-1 rounded-lg font-bold hover:bg-[#0058be]"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => { setIsEditing(false); setEmailInput(userEmail); }}
                        className="bg-slate-400/20 text-xs px-3 py-1 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-[#0058be] font-semibold hover:underline bg-[#2170e4]/10 text-[#0058be] px-3 py-1 rounded-full text-[11px]"
                >
                  Change Email
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Perks claims */}
      <div className={`p-5 rounded-2xl flex gap-4 items-start shadow-sm border ${
        darkMode 
          ? 'bg-amber-500/5 border-amber-500/30 text-amber-300' 
          : 'bg-amber-500/10 border-amber-500/30 text-amber-900'
      }`}>
        <span className="material-symbols-outlined text-amber-500 text-2xl">workspace_premium</span>
        <div className="space-y-1 text-sm">
          <p className={`font-bold ${darkMode ? 'text-amber-400' : 'text-amber-900'}`}>Exciting Platinum Rewards</p>
          <p className={`text-xs leading-relaxed ${darkMode ? 'text-amber-300/80' : 'text-amber-800'}`}>
            You qualify for a free <strong className={`${darkMode ? 'text-amber-400' : 'text-amber-900'}`}>Nordic Mist Fragrance</strong>! Claim using 3,000 points.
          </p>
          <button 
            onClick={() => {
              if (points >= 3000) {
                setPoints(points - 3000);
                alert('Success! Your free Nordic Mist sample reward was added to your next order!');
              } else {
                alert('Insufficient loyalty points!');
              }
            }}
            className="mt-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full px-4 py-1.5 text-xs font-semibold shadow-xs hover:shadow-sm transition-transform active:scale-95"
          >
            Claim sample with 3,000 pts
          </button>
        </div>
      </div>
    </div>
  );
}
