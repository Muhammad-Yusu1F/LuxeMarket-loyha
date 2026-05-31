import { useState, useEffect, FormEvent } from 'react';

const AVATAR_PRESETS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB8wJxhKjVUVbbRdfGKJSZ2mLpMgj5VQXcu7mycIfxyvbgntKROM-JANN7JcWVSCPrD4ObFx2WeUlCrzNv9CLtD9UY7iGrgIljBclDVfTRctGywv570dqZN-3EjL1iuGk7EuXU6iBDaWeog155zPJFkCoik9O20FQD4I7TMs2gFMvRAA3Oqnlih_rk9sw6f8rArF1GKqhB_omthqMQDNjxYk2fBisDzFgl_430yEwqwJXKazWKKDQMRCAF_lb9cIDUy71YYzs9CKI9H', // Original elegant Google avatar
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80', // Elegant woman
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', // Businessman
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', // Active lady
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', // Modern man
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=150&h=150&q=80', // Luxe Quartz Gold
];

interface ProfileProps {
  userEmail: string;
  onChangeEmail: (email: string) => void;
  userName: string;
  onChangeName: (name: string) => void;
  userAvatar: string;
  onChangeAvatar: (avatar: string) => void;
  darkMode: boolean;
}

export default function Profile({ 
  userEmail, 
  onChangeEmail, 
  userName, 
  onChangeName, 
  userAvatar, 
  onChangeAvatar, 
  darkMode 
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [emailInput, setEmailInput] = useState(userEmail);
  const [nameInput, setNameInput] = useState(userName);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  useEffect(() => {
    setEmailInput(userEmail);
  }, [userEmail]);

  useEffect(() => {
    setNameInput(userName);
  }, [userName]);

  const isAdmin = userEmail.trim().toLowerCase() === 'ybegimqulov01@gmail.com' || userEmail.trim().toLowerCase() === 'ybeginqulov01@gmail.com';

  const handleSaveProfile = () => {
    if (!nameInput.trim()) {
      alert('Iltimos, ismingizni kiriting!');
      return;
    }
    if (!emailInput.trim() || !emailInput.includes('@')) {
      alert('Iltimos to’g’ri email manzilini kiriting!');
      return;
    }
    onChangeName(nameInput.trim());
    onChangeEmail(emailInput.trim());
    setIsEditing(false);
  };

  const handleCustomAvatarSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customAvatarUrl.trim()) return;
    if (!customAvatarUrl.startsWith('http://') && !customAvatarUrl.startsWith('https://')) {
      alert('Iltimos, to‘g‘ri rasm havolasini (http/https bilan boshlanadigan URL) kiriting!');
      return;
    }
    onChangeAvatar(customAvatarUrl.trim());
    setCustomAvatarUrl('');
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
              alt="User Avatar" 
              className="w-full h-full object-cover" 
              src={userAvatar}
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white animate-pulse" />
        </div>

        <div className="space-y-1 w-full">
          <h2 className="text-xl font-bold">{userName || "Luxe Foydalanuvchisi"}</h2>
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
            isAdmin ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-[#2170e4]/10 text-[#2170e4]'
          }`}>
            {isAdmin ? '🛡️ STORE ADMIN & OWNER' : '💎 PLATINUM MEMBER'}
          </span>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} font-mono`}>
            Premium ID: LUXE-849-GOLD
          </p>
        </div>
      </div>

      {/* Profile Avatar Selection Menu */}
      <div className={`rounded-2xl p-5 border transition-colors space-y-4 ${
        darkMode 
          ? 'bg-[#111726]/85 border-[#1e293b] text-white' 
          : 'bg-white border-[#e6eeff] text-[#121c2a]'
      }`} id="profile-avatar-menu">
        <div className="border-b pb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2170e4]">add_photo_alternate</span>
          <h3 className="font-bold text-base">Profil rasmini tanlash</h3>
        </div>

        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Tizimdagi tayyor premium rasmlardan birini tanlang yoki o‘z rasmingiz havolasini kiriting:
        </p>

        {/* Preset grid layout */}
        <div className="grid grid-cols-6 gap-2 pt-1.5 justify-items-center">
          {AVATAR_PRESETS.map((preset, index) => {
            const isSelected = userAvatar === preset;
            return (
              <button
                key={index}
                type="button"
                onClick={() => onChangeAvatar(preset)}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-200 cursor-pointer active:scale-90 hover:opacity-90 ${
                  isSelected 
                    ? 'border-[#2170e4] scale-105 shadow-md ring-2 ring-[#2170e4]/20' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-[#2170e4]/45'
                }`}
                title={`Premium rasm ${index + 1}`}
              >
                <img 
                  alt={`Preset ${index + 1}`} 
                  src={preset} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            );
          })}
        </div>

        {/* Custom URL Field */}
        <form onSubmit={handleCustomAvatarSubmit} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-750/30">
          <label className={`block text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            O'zingizning rasm manzilingiz (URL)
          </label>
          <div className="flex gap-2">
            <input 
              type="text"
              value={customAvatarUrl}
              onChange={(e) => setCustomAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className={`flex-grow text-xs px-3 py-2 rounded-xl border focus:ring-1 focus:ring-[#2170e4] focus:outline-none focus:border-transparent ${
                darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-250 text-slate-800'
              }`}
            />
            <button
              type="submit"
              className="bg-[#2170e4] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#0058be] transition active:scale-95 whitespace-nowrap"
            >
              O‘rnatish
            </button>
          </div>
        </form>
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
          Profil sozlamalari
        </h3>

        <div className="space-y-4">
          {/* Edit Information Block */}
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-[#172036]/50 border-[#1e293b]' : 'bg-[#f8f9ff] border-slate-200/60'
          }`}>
            <div className="flex justify-between items-start text-sm">
              <div className="flex items-start gap-4 flex-grow">
                <span className="material-symbols-outlined text-[#2170e4] mt-1">account_circle</span>
                <div className="space-y-3 flex-grow">
                  <p className="font-bold">Mening Ma'lumotlarim</p>
                  
                  {!isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <span className={`text-[10px] uppercase font-bold block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>To'liq ism</span>
                        <p className="font-medium">{userName || "Luxe Foydalanuvchisi"}</p>
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email manzili</span>
                        <span className="inline-flex items-center gap-1.5 bg-[#2170e4]/15 text-[#2170e4] text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                          {userEmail}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed block ${darkMode ? 'text-slate-350' : 'text-[#424754]'}`}>
                        Ism-familiyangiz va email manzilingizni istalgan vaqtda yuqoridagi "Tahrirlash" tugmasi orqali o'zgartira olasiz.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className={`text-[10px] font-bold uppercase ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Ismingizni o'zgartiring
                        </label>
                        <input 
                          type="text" 
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className={`text-xs px-3 py-2 rounded-lg border w-full focus:ring-1 focus:ring-[#2170e4] focus:outline-none focus:border-transparent ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                          placeholder="Foydalanuvchi ismi"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] font-bold uppercase ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Email manzilingiz
                        </label>
                        <input 
                          type="email" 
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className={`text-xs px-3 py-2 rounded-lg border w-full focus:ring-1 focus:ring-[#2170e4] focus:outline-none focus:border-transparent ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                          placeholder="example@mail.com"
                        />
                      </div>

                      <div className="flex gap-2 pt-1 font-semibold">
                        <button 
                          onClick={handleSaveProfile}
                          className="bg-[#2170e4] text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-[#0058be]"
                        >
                          Saqlash
                        </button>
                        <button 
                          onClick={() => { 
                          setIsEditing(false); 
                          setEmailInput(userEmail); 
                          setNameInput(userName); 
                          }}
                          className="bg-slate-400/20 text-xs px-4 py-2 rounded-lg"
                        >
                          Bekor qilish
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-[#0058be] font-bold hover:underline bg-[#2170e4]/10 text-[#0058be] px-3 py-1 rounded-full text-[11px] whitespace-nowrap animate-fade-in"
                >
                  Tahrirlash
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
