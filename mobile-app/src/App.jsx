import React, { useEffect, useState, useCallback } from 'react';
import PremiumCanvas from './components/Game/PremiumCanvas';
import { useGame } from './hooks/useGame';
import { soundManager } from './logic/SoundManager';
import {
  Trophy, Zap, Sparkles, RefreshCw,
  Gamepad2, AlignLeft, Settings, Volume2, VolumeX,
  Target, MoveHorizontal, MoveVertical, X,
  ChevronRight, Play, CheckCircle2, Award, History,
  LayoutGrid, RotateCcw, Coins, Calendar, Box,
  ListTodo, Gift, ShoppingBag, BarChart3, Share2,
  User, LogOut, Mail, Lock, UserPlus, LogIn, Clock, Home,
  Bomb, Radiation, Star, MapPin, Camera
} from 'lucide-react';
import { LETTER_POINTS, TIME_BATTLE_OPTIONS } from './logic/Constants';
import { AuthService } from './logic/AuthService';
import { SupabaseService } from './logic/SupabaseService';
import DailySpin from './components/DailySpin';
import DailyMissions from './components/DailyMissions';


const DictionaryLoader = ({ language, t }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
    <div className="relative flex flex-col items-center max-w-xs w-full">
      {/* Outer Glow / Pulse */}
      <div className="absolute inset-0 bg-sky-500/10 blur-[120px] animate-pulse-slow" />

      {/* Animated Icon Container */}
      <div className="relative mb-12 group">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-purple-600 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-100 transition-opacity animate-pulse" />
        <div className="relative w-28 h-28 bg-slate-900 border-2 border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl animate-float">
          <RefreshCw size={56} className="text-sky-400 animate-spin-slow" />
        </div>

        {/* Floating Particles/Dots */}
        <div className="absolute -top-6 -right-6 w-10 h-10 bg-purple-500/30 rounded-full blur-md animate-bounce delay-100" />
        <div className="absolute -bottom-4 -left-8 w-14 h-14 bg-sky-500/30 rounded-full blur-xl animate-bounce delay-300" />
      </div>

      {/* Text Info */}
      <div className="text-center relative z-10 space-y-3">
        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
          {language === 'tr' ? 'Sözlük Hazırlanıyor' : 'Preparing Dictionary'}
        </h3>
        <div className="flex flex-col gap-1">
          <p className="text-sky-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
            {language === 'tr' ? 'Yükleme Devam Ediyor...' : 'Loading in progress...'}
          </p>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-relaxed px-4">
            {language === 'tr' ? 'Kelime listesi ilk açılışta biraz zaman alabilir.' : 'Word list may take a moment on first load.'}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const AuthModal = ({ isOpen, onClose, onAuthSuccess, t = (s) => s }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let result;
    if (isLogin) {
      result = await AuthService.signIn(email, password);
    } else {
      result = await AuthService.signUp(email, password, username);
    }

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onAuthSuccess();
      onClose();
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await AuthService.signInWithGoogle();
      if (result.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 landscape:p-2 md:p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl landscape:rounded-xl md:rounded-[2.5rem] p-5 landscape:p-3 md:p-10 shadow-2xl relative overflow-y-auto max-h-[95vh] landscape:max-h-[92vh] no-scrollbar">
        <button onClick={onClose} className="absolute top-3 landscape:top-2 md:top-6 right-3 landscape:right-2 md:right-6 text-slate-500 hover:text-white transition-colors z-10">
          <X size={20} className="md:w-6 md:h-6" />
        </button>

        <div className="text-center mb-4 landscape:mb-2 md:mb-8">
          <div className="w-12 h-12 landscape:w-10 landscape:h-10 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl landscape:rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 landscape:mb-1.5 md:mb-4 shadow-xl shadow-orange-500/20">
            {isLogin ? <LogIn className="text-white" size={24} /> : <UserPlus className="text-white" size={24} />}
          </div>
          <h2 className="text-2xl landscape:text-xl md:text-3xl font-black text-white italic tracking-tighter uppercase">
            {isLogin ? t('login') : t('signup')}
          </h2>
          <p className="text-slate-500 text-[9px] landscape:text-[8px] md:text-xs font-bold uppercase tracking-widest mt-1 landscape:mt-0.5 md:mt-2">
            {t('join_world')}
          </p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 landscape:py-2 md:py-4 bg-white hover:bg-gray-100 text-slate-800 font-bold rounded-xl landscape:rounded-lg md:rounded-2xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 landscape:gap-1.5 md:gap-3 mb-3 landscape:mb-2 md:mb-6 text-sm landscape:text-xs md:text-base"
        >
          <svg className="w-5 h-5 landscape:w-4 landscape:h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google {isLogin ? t('signin_button') : t('signup_button')}
        </button>

        <div className="flex items-center gap-3 landscape:gap-2 mb-3 landscape:mb-2 md:mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">{t('or') || 'VEYA'}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 landscape:space-y-1.5 md:space-y-4">
          {!isLogin && (
            <div className="space-y-1 landscape:space-y-0.5">
              <label className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{t('username') || 'Kullanıcı Adı'}</label>
              <div className="relative">
                <User className="absolute left-3 landscape:left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text" required value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl landscape:rounded-lg md:rounded-2xl py-3 landscape:py-2 md:py-4 pl-10 landscape:pl-8 md:pl-12 pr-4 text-white text-sm landscape:text-xs md:text-base focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none font-bold"
                  placeholder="oyuncu_adi"
                />
              </div>
            </div>
          )}

          <div className="space-y-1 landscape:space-y-0.5">
            <label className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">E-Posta</label>
            <div className="relative">
              <Mail className="absolute left-3 landscape:left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-xl landscape:rounded-lg md:rounded-2xl py-3 landscape:py-2 md:py-4 pl-10 landscape:pl-8 md:pl-12 pr-4 text-white text-sm landscape:text-xs md:text-base focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none font-bold"
                placeholder="ornek@mail.com"
              />
            </div>
          </div>

          <div className="space-y-1 landscape:space-y-0.5">
            <label className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{t('password') || 'Şifre'}</label>
            <div className="relative">
              <Lock className="absolute left-3 landscape:left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-xl landscape:rounded-lg md:rounded-2xl py-3 landscape:py-2 md:py-4 pl-10 landscape:pl-8 md:pl-12 pr-4 text-white text-sm landscape:text-xs md:text-base focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg landscape:rounded-md md:rounded-xl p-2 landscape:p-1.5 md:p-3 text-red-400 text-[9px] landscape:text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 landscape:py-2 md:py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-slate-950 font-black rounded-xl landscape:rounded-lg md:rounded-2xl transition-all active:scale-95 shadow-xl shadow-orange-500/20 tracking-[0.2em] uppercase italic text-base landscape:text-sm md:text-lg mt-2 landscape:mt-1 md:mt-4"
          >
            {loading ? t('processing') : (isLogin ? t('signin_button') : t('signup_button'))}
          </button>
        </form>

        <div className="mt-4 landscape:mt-2 md:mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-500 hover:text-white text-[9px] landscape:text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            {isLogin ? t('no_account') : t('have_account')}
          </button>
        </div>
      </div>
    </div>
  );
};


const Dashboard = ({
  dailyMissions, claimMissionReward, updateMissionProgress,
  onSelectTimeBattle, onSelectArcade, onSelectZen, currentLevel, coins, tools, streakCount,
  levels = [], isLoading, user, profile, fetchProfile, onOpenAuth, language, setLanguage, t = (s) => s,
  isMuted, toggleMute, difficulty, changeDifficulty, dailyReward, claimGift, STREAK_REWARDS = [],
  showDailyGift, energy, nextEnergyIn, buyTool, addCoins, addTool, soundManager,
  totalScore, wordsFoundCount, gamesPlayed, highScore, avatarId, setAvatarId, completedLevels,
  activeEvents = [], activeEvent, setSelectedEventId, setView,
  xp, level, masteryPoints, sessionXP, getNextLevelXp,
  isPro, isEnergyUnlimited, isMobile
}) => {
  const [dashboardView, setDashboardView] = React.useState('modes');
  const [selectedEventIdLocal, setSelectedEventIdLocal] = React.useState(null);
  const [selectedLevelIdx, setSelectedLevelIdx] = React.useState(null);
  const [selectedBoosters, setSelectedBoosters] = React.useState({ bomb: false, row: false, col: false });
  const [arcadeSubMode, setArcadeSubMode] = React.useState('moves'); // 'moves' | 'time'
  const [arcadeValue, setArcadeValue] = React.useState(15);
  const [tbDuration, setTbDuration] = React.useState(TIME_BATTLE_OPTIONS[1]); // default 3dk
  const [showMemberOnlyModal, setShowMemberOnlyModal] = React.useState(false);
  const [showMissionLock, setShowMissionLock] = React.useState(false);
  const [lockReason, setLockReason] = React.useState('auth'); // 'auth' | 'energy'
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [editData, setEditData] = React.useState({});
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);

  console.log('--- DASHBOARD RENDER ---');
  console.log('Current View:', dashboardView);
  console.log('User:', user?.email);
  console.log('Coins:', coins);

  // Falling letters background logic
  const [fallingLetters, setFallingLetters] = React.useState([]);

  React.useEffect(() => {
    const trLetters = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
    const enLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letters = language === 'tr' ? trLetters : enLetters;
    const newLetters = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      char: letters[Math.floor(Math.random() * letters.length)],
      left: Math.random() * 100,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * -20,
      size: 14 + Math.random() * 30
    }));
    setFallingLetters(newLetters);
  }, [language]);

  const renderView = () => {
    console.log('--- DASHBOARD RENDERVIEW CALLED ---', dashboardView);
    switch (dashboardView) {
      case 'eventsList':
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-4xl mx-auto h-full overflow-y-auto no-scrollbar pb-20 landscape:pb-16 px-4 landscape:px-3">
            <div className="flex items-center gap-4 mb-4 landscape:mb-3 md:mb-8">
              <button onClick={() => setDashboardView('modes')} className="p-2 landscape:p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl">
                <X size={20} className="md:w-6 md:h-6" />
              </button>
              <h2 className="text-xl landscape:text-lg md:text-3xl font-black text-white italic tracking-tighter uppercase">{t('active_events') || (language === 'tr' ? 'AKTİF ETKİNLİKLER' : 'ACTIVE EVENTS')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...(activeEvents || [])].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0)).map((event) => (
                <button
                  key={event.id}
                  onClick={() => { setSelectedEventId?.(event.id); setView?.('event'); }}
                  className={`group relative overflow-hidden rounded-[2rem] border p-6 text-left transition-all duration-300 active:scale-[0.98] bg-slate-900/40 backdrop-blur-md ${event.isActive ? 'border-white/8 hover:border-amber-500/30' : 'border-white/5 opacity-80 hover:border-blue-500/30'}`}
                >
                  {!event.isActive && (
                    <div className="absolute top-4 right-6 bg-blue-500/20 text-blue-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-blue-500/30 animate-pulse">
                      {t('coming_soon') || 'COMING SOON'}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 ${event.isActive ? 'bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 group-hover:border-amber-500/40' : 'bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/40'}`}>
                      <Trophy size={28} className={event.isActive ? 'text-amber-400' : 'text-blue-400'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${event.isActive ? 'text-amber-500' : 'text-blue-500'}`}>
                        {event.type === 'manual' ? t('special_event') : (language === 'tr' ? 'HER HAFTA' : 'WEEKLY')}
                      </div>
                      <h3 className="text-lg font-black text-white italic truncate tracking-tight uppercase">
                        {event.title?.[language] || event.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-500">
                          <Target size={12} className="text-sky-400" />
                          <span>{event.target_score?.toLocaleString()}</span>
                        </div>
                        <div className="w-px h-2.5 bg-white/10" />
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase">
                          <Clock size={12} className={event.isActive ? 'text-rose-400' : 'text-blue-400'} />
                          <span>
                            {event.isActive ? (() => {
                              const end = new Date(event.end_at);
                              const now = new Date();
                              const diff = end - now;

                              if (diff <= 0) return language === 'tr' ? 'BİTTİ' : 'ENDED';

                              const hours = Math.floor(diff / (1000 * 60 * 60));
                              const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                              const days = Math.floor(hours / 24);

                              if (days > 0) return `${days}${language === 'tr' ? ' gün ' : 'd '}${hours % 24}${language === 'tr' ? ' sa' : 'h'}`;
                              if (hours > 0) return `${hours}${language === 'tr' ? ' sa ' : 'h '}${mins}${language === 'tr' ? ' dk' : 'm'}`;
                              return `${mins}${language === 'tr' ? ' dk' : 'm'}`;
                            })() : (
                              `${t('starts_at') || (language === 'tr' ? 'BAŞLAR' : 'STARTS AT')}: ${new Date(event.start_at).toLocaleDateString()}`
                            )}
                          </span>
                        </div>
                        <div className="w-px h-2.5 bg-white/10" />
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase">
                          <User size={12} className="text-sky-400" />
                          <span>{event.participant_count || 0}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className={`text-slate-700 transition-all shrink-0 ${event.isActive ? 'group-hover:text-amber-500' : 'group-hover:text-blue-500'} group-hover:translate-x-1`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'timeBattlePregame': {
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-2xl mx-auto flex flex-col h-full max-h-screen">
            <div className="flex items-center justify-between gap-2 md:gap-4 mb-2 landscape:mb-1 md:mb-6 shrink-0 pt-2 md:pt-0">
              <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <button onClick={() => setDashboardView('modes')} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition-all shadow-xl shrink-0">
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
                <h2 className="text-xl landscape:text-lg md:text-3xl font-black text-white italic tracking-tighter uppercase truncate">{t('time_battle')}</h2>
              </div>
              <p className="hidden landscape:block text-[7px] md:text-[9px] font-black text-slate-500 italic tracking-wider uppercase text-right max-w-[200px] leading-tight shrink-0">
                {t('time_battle_desc')}
              </p>
            </div>

            <div className="bg-slate-900/60 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-3 landscape:p-2.5 md:p-8 backdrop-blur-md space-y-3 landscape:space-y-2 md:space-y-8 flex-1 overflow-y-auto no-scrollbar">
              {/* Duration selection */}
              <div className="space-y-2 landscape:space-y-1 md:space-y-4">
                <div className="text-[8px] landscape:text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 font-inter">{t('time_battle_select_duration')}</div>
                <div className="grid grid-cols-3 gap-2 landscape:gap-1.5 md:gap-3">
                  {TIME_BATTLE_OPTIONS.map(sec => {
                    const label = sec === 60 ? t('time_battle_1min') : sec === 180 ? t('time_battle_3min') : t('time_battle_5min');
                    return (
                      <button
                        key={sec}
                        onClick={() => setTbDuration(sec)}
                        className={`py-4 landscape:py-2.5 md:py-5 rounded-xl landscape:rounded-lg md:rounded-2xl border transition-all flex flex-col items-center gap-1.5 landscape:gap-1 md:gap-2 ${tbDuration === sec ? 'bg-rose-500/20 border-rose-400 text-rose-400 shadow-xl shadow-rose-500/10 scale-[1.02]' : 'bg-slate-800/40 border-white/5 text-slate-500 hover:bg-slate-800'}`}
                      >
                        <Clock size={20} className="landscape:w-4 landscape:h-4" />
                        <span className="text-[10px] landscape:text-[9px] md:text-xs font-black uppercase tracking-widest">{label}</span>
                        <span className="text-[8px] landscape:text-[7px] md:text-[9px] font-bold text-slate-600">{sec}{t('seconds')?.toLowerCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Booster selection */}
              <div className="space-y-1.5 landscape:space-y-1 md:space-y-4 shrink-0">
                <div className="text-[8px] landscape:text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 md:ml-2 font-inter">{t('select_boosters')}</div>
                <div className="grid grid-cols-3 gap-1.5 landscape:gap-1 md:gap-4">
                  {['bomb', 'row', 'col'].map(type => {
                    const count = tools?.[type] || 0;
                    const isSelected = selectedBoosters[type];
                    const Icon = type === 'bomb' ? Zap : type === 'row' ? MoveHorizontal : MoveVertical;
                    return (
                      <button key={type} disabled={count === 0} onClick={() => setSelectedBoosters(prev => ({ ...prev, [type]: !prev[type] }))}
                        className={`relative p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border transition-all flex flex-col items-center gap-1.5 landscape:gap-1 md:gap-2 group ${isSelected ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-xl shadow-amber-500/10' : count > 0 ? 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800' : 'bg-slate-900/20 border-white/5 opacity-40 grayscale'}`}>
                        <Icon className={`w-5 h-5 landscape:w-4 landscape:h-4 md:w-6 md:h-6 ${isSelected ? 'animate-bounce' : ''}`} />
                        <span className="text-[8px] landscape:text-[7px] md:text-[10px] font-black uppercase tracking-widest leading-none">{t(type)}</span>
                        <span className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-white text-slate-950 text-[9px] landscape:text-[8px] md:text-[10px] font-black w-5 h-5 landscape:w-4 landscape:h-4 md:w-6 md:h-6 rounded-full border-2 border-slate-950 flex items-center justify-center">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start button */}
              <div className="pt-1 landscape:pt-0 md:pt-4 shrink-0 mt-auto pb-2 landscape:pb-1 md:pb-0">
                <button
                  onClick={() => {
                    if (energy > 0) {
                      onSelectTimeBattle(tbDuration, selectedBoosters);
                      setSelectedBoosters({ bomb: false, row: false, col: false });
                    }
                  }}
                  disabled={energy <= 0}
                  className={`w-full py-3 landscape:py-2 md:py-6 rounded-xl md:rounded-2xl font-black text-base landscape:text-sm md:text-xl italic tracking-[0.2em] uppercase transition-all active:scale-95 shadow-xl md:shadow-2xl flex items-center justify-center gap-2 md:gap-3 ${energy > 0 ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-400 hover:to-red-500 shadow-rose-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                >
                  <Play size={18} className="landscape:w-4 landscape:h-4 md:w-6 md:h-6" fill="currentColor" />
                  {t('time_battle_start')} (-1 ⚡)
                </button>
                {energy <= 0 && (
                  <p className="text-center text-rose-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-2 md:mt-4 animate-pulse">
                    {language === 'tr' ? 'Enerji bitti!' : 'No energy!'} {language === 'tr' ? 'Bekle:' : 'Wait:'} {Math.floor(nextEnergyIn / 60)}:{(nextEnergyIn % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'pregame': {
        const isArcade = selectedLevelIdx === null;
        const selectedLevel = isArcade ? { id: t('arcade'), title: t('arcade_desc'), goals: [] } : levels[selectedLevelIdx];
        if (!selectedLevel) return null;
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-2xl mx-auto flex flex-col h-full max-h-screen">
            <div className="flex items-center justify-between gap-2 md:gap-4 mb-2 landscape:mb-1 md:mb-6 shrink-0 pt-2 md:pt-0">
              <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <button onClick={() => setDashboardView(isArcade ? 'modes' : 'levels')} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition-all shadow-xl shrink-0">
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
                <h2 className="text-xl landscape:text-lg md:text-3xl font-black text-white italic tracking-tighter uppercase truncate">{isArcade ? t('arcade') : `${t('level')} ${selectedLevelIdx + 1}`}</h2>
              </div>
              {/* Description in header - landscape only */}
              <p className="hidden landscape:block text-[7px] md:text-[9px] font-black text-slate-500 italic tracking-wider uppercase text-right max-w-[200px] leading-tight shrink-0">
                {typeof selectedLevel.title === 'object' ? (selectedLevel.title[language] || selectedLevel.title['tr']) : selectedLevel.title}
              </p>
            </div>

            {/* Member Only Warning Toast/Modal */}
            {showMemberOnlyModal && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[600] w-[90%] max-w-sm animate-in zoom-in-95 fade-in duration-300">
                <div className="bg-amber-500 border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <User size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-none mb-1">{t('member_required_title')}</div>
                    <div className="text-xs font-bold text-amber-950 leading-tight">{t('member_required_desc')}</div>
                  </div>
                  <button onClick={() => setShowMemberOnlyModal(false)} className="text-amber-950 font-black">OK</button>
                </div>
              </div>
            )}

            <div className="bg-slate-900/60 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-3 landscape:p-2.5 md:p-8 backdrop-blur-md space-y-3 landscape:space-y-2 md:space-y-8 flex-1 overflow-y-auto no-scrollbar">
              {/* Description inside card - portrait only */}
              <div className="text-center shrink-0 landscape:hidden">
                <h3 className="text-base md:text-xl font-black text-white italic tracking-tighter uppercase mb-1 md:mb-2">
                  {typeof selectedLevel.title === 'object' ? (selectedLevel.title[language] || selectedLevel.title['tr']) : selectedLevel.title}
                </h3>
                {!isArcade && (
                  <div className="flex justify-center flex-wrap gap-1.5 md:gap-2">
                    {selectedLevel.goals.map((g, i) => (
                      <div key={i} className="bg-slate-950/50 px-2.5 py-1 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black text-sky-400 border border-sky-400/20 uppercase tracking-widest">
                        {typeof g.text === 'object' ? (g.text[language] || g.text['tr']) : g.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Goals - landscape (shown separately without title) */}
              {!isArcade && (
                <div className="hidden landscape:flex justify-center flex-wrap gap-1 shrink-0">
                  {selectedLevel.goals.map((g, i) => (
                    <div key={i} className="bg-slate-950/50 px-2 py-0.5 rounded-md text-[8px] font-black text-sky-400 border border-sky-400/20 uppercase tracking-widest">
                      {typeof g.text === 'object' ? (g.text[language] || g.text['tr']) : g.text}
                    </div>
                  ))}
                </div>
              )}

              {isArcade && (
                <div className="space-y-3 landscape:space-y-2 md:space-y-6">
                  {/* Sub-mode Selection */}
                  <div className="grid grid-cols-2 gap-2 landscape:gap-1.5 md:gap-3">
                    <button
                      onClick={() => { setArcadeSubMode('time'); setArcadeValue(30); }}
                      className={`py-3 landscape:py-2 md:py-4 rounded-xl landscape:rounded-lg md:rounded-2xl border transition-all flex flex-col items-center gap-1.5 landscape:gap-1 md:gap-2 ${arcadeSubMode === 'time' ? 'bg-sky-500/20 border-sky-400 text-sky-400 shadow-xl shadow-sky-500/10 scale-[1.02]' : 'bg-slate-800/40 border-white/5 text-slate-500 hover:bg-slate-800'}`}
                    >
                      <Clock size={18} className="landscape:w-4 landscape:h-4" />
                      <span className="text-[9px] landscape:text-[8px] md:text-[10px] font-black uppercase tracking-widest">{t('time_trial')}</span>
                    </button>
                    <button
                      onClick={() => { setArcadeSubMode('moves'); setArcadeValue(15); }}
                      className={`py-3 landscape:py-2 md:py-4 rounded-xl landscape:rounded-lg md:rounded-2xl border transition-all flex flex-col items-center gap-1.5 landscape:gap-1 md:gap-2 ${arcadeSubMode === 'moves' ? 'bg-indigo-500/20 border-indigo-400 text-indigo-400 shadow-xl shadow-indigo-500/10 scale-[1.02]' : 'bg-slate-800/40 border-white/5 text-slate-500 hover:bg-slate-800'}`}
                    >
                      <Gamepad2 size={18} className="landscape:w-4 landscape:h-4" />
                      <span className="text-[9px] landscape:text-[8px] md:text-[10px] font-black uppercase tracking-widest">{t('move_limited')}</span>
                    </button>
                  </div>

                  {/* Value Selection */}
                  <div className="space-y-2 landscape:space-y-1 md:space-y-3">
                    <div className="text-[8px] landscape:text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 font-inter">
                      {arcadeSubMode === 'time' ? t('seconds')?.toUpperCase() : t('moves_unit')?.toUpperCase()}
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 landscape:gap-1 md:gap-2">
                      {arcadeSubMode === 'time' ? (
                        [30, 45, 60].map(val => {
                          const isLocked = !user && val > 30;
                          return (
                            <button
                              key={val}
                              onClick={() => {
                                if (isLocked) setShowMemberOnlyModal(true);
                                else setArcadeValue(val);
                              }}
                              className={`relative py-2.5 landscape:py-1.5 md:py-3 rounded-lg landscape:rounded-md md:rounded-xl border font-black text-sm landscape:text-xs transition-all ${arcadeValue === val ? 'bg-white text-slate-950 border-white shadow-lg' : 'bg-slate-800/60 border-white/5 text-slate-400 hover:bg-slate-800'}`}
                            >
                              {val}
                              {isLocked && <Lock size={10} className="absolute top-1 right-1 text-amber-500" />}
                            </button>
                          );
                        })
                      ) : (
                        [15, 30, 45].map(val => {
                          const isLocked = !user && val > 15;
                          return (
                            <button
                              key={val}
                              onClick={() => {
                                if (isLocked) setShowMemberOnlyModal(true);
                                else setArcadeValue(val);
                              }}
                              className={`relative py-2.5 landscape:py-1.5 md:py-3 rounded-lg landscape:rounded-md md:rounded-xl border font-black text-sm landscape:text-xs transition-all ${arcadeValue === val ? 'bg-white text-slate-950 border-white shadow-lg' : 'bg-slate-800/60 border-white/5 text-slate-400 hover:bg-slate-800'}`}
                            >
                              {val}
                              {isLocked && <Lock size={10} className="absolute top-1 right-1 text-amber-500" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 landscape:space-y-1 md:space-y-4 shrink-0">
                <div className="text-[8px] landscape:text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 md:ml-2 font-inter">{t('select_boosters')}</div>
                <div className="grid grid-cols-3 gap-1.5 landscape:gap-1 md:gap-4">
                  {['bomb', 'row', 'col'].map(type => {
                    const count = tools?.[type] || 0;
                    const isSelected = selectedBoosters[type];
                    const Icon = type === 'bomb' ? Zap : type === 'row' ? MoveHorizontal : MoveVertical;
                    return (
                      <button
                        key={type}
                        disabled={count === 0}
                        onClick={() => setSelectedBoosters(prev => ({ ...prev, [type]: !prev[type] }))}
                        className={`
                          relative p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border transition-all flex flex-col items-center gap-1.5 landscape:gap-1 md:gap-2 group
                          ${isSelected ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-xl shadow-amber-500/10' :
                            count > 0 ? 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800' : 'bg-slate-900/20 border-white/5 opacity-40 grayscale'}
                        `}
                      >
                        <Icon className={`w-5 h-5 landscape:w-4 landscape:h-4 md:w-6 md:h-6 ${isSelected ? 'animate-bounce' : ''}`} />
                        <span className="text-[8px] landscape:text-[7px] md:text-[10px] font-black uppercase tracking-widest leading-none">{t(type)}</span>
                        <span className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-white text-slate-950 text-[9px] landscape:text-[8px] md:text-[10px] font-black w-5 h-5 landscape:w-4 landscape:h-4 md:w-6 md:h-6 rounded-full border-2 border-slate-950 flex items-center justify-center">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-1 landscape:pt-0 md:pt-4 shrink-0 mt-auto pb-2 landscape:pb-1 md:pb-0">
                <button
                  onClick={() => {
                    if (energy > 0) {
                      onSelectArcade(selectedBoosters, arcadeSubMode, arcadeValue);
                      // Reset local states for next time
                      setSelectedLevelIdx(null);
                      setSelectedBoosters({ bomb: false, row: false, col: false });
                    }
                  }}
                  disabled={energy <= 0}
                  className={`
                    w-full py-3 landscape:py-2 md:py-6 rounded-xl md:rounded-2xl font-black text-base landscape:text-sm md:text-xl italic tracking-[0.2em] uppercase transition-all active:scale-95 shadow-xl md:shadow-2xl flex items-center justify-center gap-2 md:gap-3
                    ${energy > 0 ? 'bg-gradient-to-r from-orange-500 to-red-600 text-slate-950 hover:from-orange-400 hover:to-red-500 shadow-orange-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                  `}
                >
                  <Play size={18} className="landscape:w-4 landscape:h-4 md:w-6 md:h-6" fill="currentColor" />
                  {t('start_game')} (-1 ⚡)
                </button>
                {energy <= 0 && (
                  <p className="text-center text-rose-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-2 md:mt-4 animate-pulse">
                    {language === 'tr' ? 'Enerji bitti!' : 'No energy!'} {language === 'tr' ? 'Bekle:' : 'Wait:'} {Math.floor(nextEnergyIn / 60)}:{(nextEnergyIn % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'inventory':
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-2xl mx-auto flex flex-col h-full overflow-y-auto no-scrollbar pb-6 landscape:pb-20">
            <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-8 shrink-0">
              <button
                onClick={() => setDashboardView('modes')}
                className="p-1.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition-all shadow-xl"
              >
                <X size={18} className="md:w-6 md:h-6" />
              </button>
              <h2 className="text-base md:text-2xl font-black text-white italic tracking-tighter uppercase leading-none mr-auto">{t('inventory')}</h2>

              <button
                onClick={() => setDashboardView('shop')}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg group"
              >
                <ShoppingBag size={14} className="md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] md:text-xs font-black uppercase tracking-tight">{t('market') || 'Market'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 landscape:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4 shrink-0">
              <div className="landscape:col-span-1 lg:col-span-1 bg-slate-900/60 border border-white/5 rounded-2xl md:rounded-3xl p-3 md:p-8 backdrop-blur-md flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-amber-500/20 rounded-xl md:rounded-2xl flex items-center justify-center text-amber-500 mb-1 md:mb-4">
                  <Coins size={20} className="md:w-8 md:h-8" />
                </div>
                <div className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{t('coins')}</div>
                <div className="text-xl md:text-3xl font-black text-white italic tracking-tighter leading-none">{coins}</div>
              </div>
              <div className="landscape:col-span-3 lg:col-span-3 bg-slate-900/40 border border-white/5 rounded-2xl md:rounded-3xl p-2 md:p-6 backdrop-blur-md grid grid-cols-2 landscape:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-3">
                {Object.entries(tools || {}).map(([key, count]) => {
                  const Icon = key === 'bomb' ? Zap : key === 'swap' ? AlignLeft : key === 'row' ? MoveHorizontal : key === 'col' ? MoveVertical : key === 'xbomb' ? Bomb : key === 'nuclear' ? Radiation : Target;
                  const colorCls = key === 'bomb' ? 'text-orange-400' : key === 'swap' ? 'text-blue-400' : key === 'row' ? 'text-purple-400' : key === 'col' ? 'text-green-400' : key === 'xbomb' ? 'text-amber-500' : key === 'nuclear' ? 'text-rose-500' : 'text-red-400';
                  return (
                    <div key={key} className="bg-slate-950/30 border border-white/5 p-1.5 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-4 group hover:border-white/10 transition-all">
                      <div className={`w-7 h-7 md:w-10 md:h-10 bg-white/5 rounded-lg md:rounded-xl flex items-center justify-center ${colorCls} border border-white/5 group-hover:scale-110 transition-transform`}>
                        <Icon size={12} className="md:w-[18px] md:h-[18px]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[6px] md:text-[8px] font-black text-slate-500 uppercase leading-none mb-0.5 truncate">{key}</div>
                        <div className="text-xs md:text-lg font-black text-white italic leading-none">{count}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>
        );

      case 'leaderboard':
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-4xl mx-auto h-full flex flex-col p-2 md:p-0">
            <div className="flex items-center gap-4 mb-2 md:mb-6 shrink-0">
              <button
                onClick={() => setDashboardView('modes')}
                className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition-all shadow-xl"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
              <h2 className="text-lg md:text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{t('global_rank')}</h2>
            </div>
            <div className="flex-1 min-h-0">
              <LeaderboardView t={t} profile={profile} />
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-4 landscape:mb-3 md:mb-8">
              <button
                onClick={() => setDashboardView('modes')}
                className="p-2 landscape:p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
              <h2 className="text-xl landscape:text-lg md:text-3xl font-black text-white italic tracking-tighter uppercase">{t('settings')}</h2>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl landscape:rounded-xl md:rounded-[2.5rem] p-4 landscape:p-3 md:p-8 backdrop-blur-md space-y-4 landscape:space-y-3 md:space-y-8 shadow-2xl">
              <div className="space-y-2 landscape:space-y-1.5 md:space-y-4">
                <div className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-inter">{t('sound_music') || (language === 'tr' ? 'SES VE MÜZİK' : 'SOUND & MUSIC')}</div>
                <button
                  onClick={toggleMute}
                  className="w-full flex items-center justify-between p-3 landscape:p-2.5 md:p-6 bg-slate-800/50 rounded-xl landscape:rounded-lg md:rounded-2xl border border-white/5 hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-3 landscape:gap-2 md:gap-4">
                    <div className={`p-2 landscape:p-1.5 md:p-3 rounded-lg landscape:rounded-md md:rounded-xl ${isMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-sky-500/20 text-sky-400'} group-hover:scale-110 transition-transform`}>
                      {isMuted ? <VolumeX size={18} className="landscape:w-4 landscape:h-4 md:w-6 md:h-6" /> : <Volume2 size={18} className="landscape:w-4 landscape:h-4 md:w-6 md:h-6" />}
                    </div>
                    <span className="text-sm landscape:text-xs md:text-lg font-bold text-white">{isMuted ? (language === 'tr' ? 'Sesler Kapalı' : 'Sounds Off') : (language === 'tr' ? 'Sesler Açık' : 'Sounds On')}</span>
                  </div>
                  <div className={`w-11 h-6 landscape:w-9 landscape:h-5 md:w-14 md:h-7 rounded-full relative transition-colors ${isMuted ? 'bg-slate-700' : 'bg-sky-500'}`}>
                    <div className={`absolute top-0.5 landscape:top-0.5 md:top-1 w-5 h-5 landscape:w-4 landscape:h-4 md:w-5 md:h-5 rounded-full bg-white transition-all ${isMuted ? 'left-0.5' : 'left-5 landscape:left-4 md:left-8'}`} />
                  </div>
                </button>
              </div>

              <div className="space-y-2 landscape:space-y-1.5 md:space-y-4">
                <div className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-inter">{t('difficulty_level') || (language === 'tr' ? 'ZORLUK SEVİYESİ' : 'DIFFICULTY LEVEL')}</div>
                <div className="grid grid-cols-3 gap-2 landscape:gap-1.5 md:gap-3">
                  {['easy', 'normal', 'pro'].map(d => (
                    <button
                      key={d}
                      onClick={() => changeDifficulty(d)}
                      className={`
                        py-3 landscape:py-2 md:py-5 rounded-xl landscape:rounded-lg md:rounded-2xl text-[10px] landscape:text-[9px] md:text-xs font-black uppercase transition-all border
                        ${difficulty === d
                          ? 'bg-orange-500 border-orange-400 text-white shadow-xl shadow-orange-500/20'
                          : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'}
                      `}
                    >
                      {d === 'easy' ? (language === 'tr' ? 'Kolay' : 'Easy') : d === 'normal' ? 'Normal' : (language === 'tr' ? 'Profesör' : 'Pro')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'shop':
        console.log('--- RENDERING SHOP VIEW ---');
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-4xl mx-auto flex flex-col h-full max-h-[85vh]">
            <div className="flex items-center justify-between mb-4 md:mb-6 shrink-0 pt-2 md:pt-0">
              <div className="flex items-center gap-4 min-w-0">
                <button onClick={() => setDashboardView('modes')} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition-all shadow-xl shrink-0">
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
                <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent italic tracking-tighter uppercase leading-none pr-2">{t('market')}</h2>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5 md:px-4 md:py-2 shadow-inner">
                <Coins className="text-amber-500" size={14} />
                <div className="text-sm md:text-lg font-black text-white tracking-tight leading-none">{coins}</div>
                <span className="text-[7px] md:text-[9px] text-amber-500 font-black uppercase">{t('gold')}</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-4 md:p-6 backdrop-blur-md flex-1 overflow-y-auto no-scrollbar flex flex-col landscape:pb-20">
              <ShopView t={t} coins={coins} tools={tools} buyTool={buyTool} language={language} user={user} profile={profile} onOpenAuth={onOpenAuth} />
            </div>
          </div>
        );

      case 'daily': {
        return (
          <DailySpin
            onClose={() => setDashboardView('modes')}
            user={user}
            profile={profile}
            updateProfile={async (updates) => {
              const success = await SupabaseService.updateProfile(user.id, updates);
              if (success) {
                await fetchProfile(user.id);
              }
              return success;
            }}
            addCoins={addCoins}
            addTool={addTool}
            t={t}
            soundManager={soundManager}
          />
        );
      }

      case 'missions': {
        return (
          <DailyMissions
            onClose={() => setDashboardView('modes')}
            dailyMissions={dailyMissions}
            claimMissionReward={claimMissionReward}
            language={language}
            t={t}
            profile={profile}
            soundManager={soundManager}
          />
        );
      }

      case 'event': {
        // Bu blok renderAppView içindeki global modal yapısıyla değiştirildi.
        // Gereksiz kod kalabalığını ve çakışmaları önlemek için dashboardView içinden kaldırıldı.
        return null;
      }
      case 'profile':
        console.log('--- RENDERING PROFILE VIEW ---');
        const handleSaveProfile = async () => {
          if (!user) return;
          setIsSavingProfile(true);

          let updatedData = { ...editData };

          // Eğer yeni bir fotoğraf seçildiyse önce onu yükle
          if (updatedData.avatarFile) {
            console.log('Fotoğraf yüklemesi (File Object ile) başlıyor...', updatedData.avatarFile.name);
            const publicUrl = await SupabaseService.uploadAvatar(user.id, updatedData.avatarFile);
            console.log('Supabase yanıt Url:', publicUrl);

            if (publicUrl) {
              updatedData.avatar_url = publicUrl;
            } else {
              console.error('Fotoğraf yüklenemediği için profil resmi boş geçiliyor.');
            }
            // Backend'e gönderilmemesi için geçici alanları sil
            delete updatedData.avatarFile;
            delete updatedData.avatarPreview;
          }

          const success = await SupabaseService.updateProfile(user.id, updatedData);
          if (success) {
            setIsEditingProfile(false);
            if (fetchProfile) await fetchProfile(user.id); // Arayüzü güncelle
          }
          setIsSavingProfile(false);
        };

        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-4xl mx-auto h-full overflow-y-auto no-scrollbar pb-24 px-4 landscape:px-3">
            <div className="flex items-center justify-between mb-4 md:mb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setDashboardView('modes')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl">
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
                <h2 className="text-xl md:text-3xl font-black text-white italic tracking-tighter uppercase">{t('profile')}</h2>
              </div>
              {user && !isEditingProfile && (
                <button
                  onClick={() => {
                    setEditData({
                      age: profile?.age || '',
                      location: profile?.location || '',
                      gender: profile?.gender || 'not_specified',
                      bio: profile?.bio || '',
                      avatar_url: profile?.avatar_url || ''
                    });
                    setIsEditingProfile(true);
                  }}
                  className="px-4 py-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sky-500/20 transition-all"
                >
                  {t('edit') || 'Düzenle'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Sol Sütun: Profil Özeti */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-md flex flex-col items-center text-center">
                  <div className="relative mb-4 group">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-sky-500 to-purple-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl overflow-hidden relative">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="md:w-16 md:h-16" />
                      )}
                    </div>
                    {isEditingProfile && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-500 rounded-full border-4 border-slate-950 flex items-center justify-center text-slate-950">
                        <Camera size={14} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-1">{profile?.username || user?.email?.split('@')[0] || t('player')}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] font-black bg-white/5 px-2 py-1 rounded-lg text-slate-400 uppercase tracking-widest border border-white/5">
                      {t('level_abbr')}{profile?.current_level_index + 1}
                    </span>
                    {profile?.is_pro && (
                      <span className="text-[9px] font-black bg-sky-500 text-white px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg flex items-center gap-1 animate-pulse">
                        <Star size={10} fill="currentColor" /> PRO
                      </span>
                    )}
                    {profile?.location && (
                      <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-1">
                        <MapPin size={10} /> {profile.location}
                      </span>
                    )}
                  </div>

                  {profile?.bio && !isEditingProfile && (
                    <p className="text-slate-400 text-xs italic mb-4 line-clamp-3">"{profile.bio}"</p>
                  )}

                  {!user && (
                    <button onClick={onOpenAuth} className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-2xl transition-all uppercase tracking-widest italic text-sm">
                      {t('signin_button')}
                    </button>
                  )}
                  {user && !isEditingProfile && (
                    <button onClick={() => AuthService.signOut()} className="w-full py-3 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 border border-white/5 rounded-2xl text-xs font-black text-slate-400 hover:text-red-400 transition-all uppercase tracking-widest italic">
                      {t('logout')}
                    </button>
                  )}
                </div>

                {/* Düzenleme Modu Formu */}
                {isEditingProfile && (
                  <div className="bg-slate-900/60 border border-amber-500/20 rounded-[2.5rem] p-6 backdrop-blur-md space-y-4 animate-in slide-in-from-bottom duration-300">
                    <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <User size={12} /> {t('edit_profile') || 'Profilini Düzenle'}
                    </div>

                    <div className="space-y-4">
                      {/* Avatar Upload UI */}
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase ml-2 mb-2 block">{t('avatar') || 'PROFİL FOTOĞRAFI'}</label>
                        <div className="flex items-center gap-4 bg-slate-950/50 p-3 rounded-2xl border border-white/5">
                          <label className="relative group cursor-pointer shrink-0">
                            <div className="w-16 h-16 bg-slate-900 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center overflow-hidden transition-all group-hover:border-amber-500/50">
                              {editData.avatarPreview || editData.avatar_url ? (
                                <img src={editData.avatarPreview || editData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <Camera size={24} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
                              )}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                                <span className="text-[8px] font-bold text-white uppercase tracking-widest mt-1">Seç</span>
                              </div>
                            </div>
                            <input
                              type="file"
                              accept="image/jpeg, image/png, image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                // MIME kontrolü
                                const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
                                if (!allowedTypes.includes(file.type)) {
                                  alert(t('invalid_file_type') || 'Sadece JPG, PNG veya WEBP formatında dosyalar yükleyebilirsiniz.');
                                  return;
                                }

                                // Önizleme için FileReader kullan
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  setEditData(prev => ({
                                    ...prev,
                                    avatarPreview: e.target.result,
                                    avatarFile: file
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                              {t('avatar_upload_hint') || 'Cihazından bir fotoğraf seç. (JPG, PNG - Max 2MB)'}
                            </p>
                            {(editData.avatarFile || editData.avatarPreview) && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setEditData(prev => ({ ...prev, avatarPreview: null, avatarFile: null, avatar_url: '' }));
                                }}
                                className="mt-2 text-[9px] font-black text-rose-500 uppercase hover:text-rose-400 transition-colors"
                              >
                                {t('remove') || 'Kaldır'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-black text-slate-500 uppercase ml-2 mb-1 block">{t('age') || 'YAŞ'}</label>
                          <input
                            type="number" value={editData.age || ''}
                            onChange={e => setEditData({ ...editData, age: e.target.value })}
                            placeholder="25"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-amber-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-500 uppercase ml-2 mb-1 block">{t('location') || 'KONUM'}</label>
                          <input
                            type="text" value={editData.location || ''}
                            onChange={e => setEditData({ ...editData, location: e.target.value })}
                            placeholder="İstanbul"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-amber-500/50"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase ml-2 mb-1 block">{t('gender') || 'CİNSİYET'}</label>
                        <select
                          value={editData.gender || 'not_specified'}
                          onChange={e => setEditData({ ...editData, gender: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-amber-500/50 appearance-none"
                        >
                          <option value="not_specified">{language === 'tr' ? 'Belirtmek İstemiyorum' : 'Not Specified'}</option>
                          <option value="male">{language === 'tr' ? 'Erkek' : 'Male'}</option>
                          <option value="female">{language === 'tr' ? 'Kadın' : 'Female'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase ml-2 mb-1 block">{t('bio') || 'BİYO'}</label>
                        <textarea
                          value={editData.bio || ''}
                          onChange={e => setEditData({ ...editData, bio: e.target.value })}
                          placeholder="Kelime avcısı..."
                          rows={2}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-amber-500/50 resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 py-3 bg-white/5 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all"
                      >
                        {t('cancel') || 'İptal'}
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="flex-2 px-6 py-3 bg-amber-500 text-slate-900 rounded-xl text-[10px] font-black uppercase hover:bg-amber-400 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {isSavingProfile ? t('saving') : (t('save') || 'Kaydet')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sağ Sütun: İstatistikler ve Başarılar */}
              <div className="md:col-span-2 space-y-4 md:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { label: t('total_score'), value: totalScore, icon: <Trophy size={16} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: t('high_score'), value: highScore, icon: <Zap size={16} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { label: t('words_found'), value: wordsFoundCount, icon: <AlignLeft size={16} />, color: 'text-sky-500', bg: 'bg-sky-500/10' },
                    { label: t('games_played'), value: gamesPlayed, icon: <Gamepad2 size={16} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/60 border border-white/5 rounded-[2rem] p-4 flex flex-col items-center justify-center text-center group hover:border-white/20 transition-all">
                      <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        {stat.icon}
                      </div>
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{stat.label}</div>
                      <div className="text-xl md:text-2xl font-black text-white italic tracking-tighter leading-none">{stat.value?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                {/* Rank & Mastery: Gelişim Kartı (v8.0.0) */}
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-[60px] pointer-events-none" />

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-400 to-rose-600 rounded-[2rem] flex items-center justify-center text-white border-2 border-white/20 shadow-[0_0_30px_rgba(245,158,11,0.2)] shrink-0">
                      <span className="text-3xl md:text-4xl font-black italic">Lvl {level}</span>
                    </div>

                    <div className="flex-1 w-full text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-end gap-2 mb-3">
                        <h3 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                          {(() => {
                            if (level <= 10) return language === 'tr' ? 'Kelime Çaylağı' : 'Word Rookie';
                            if (level <= 25) return language === 'tr' ? 'Hece Ustası' : 'Syllable Master';
                            if (level <= 50) return language === 'tr' ? 'Sözlük Gurusu' : 'Dictionary Guru';
                            if (level <= 75) return language === 'tr' ? 'Efsanevi Yazar' : 'Legendary Author';
                            return language === 'tr' ? 'Kelime Tanrısı' : 'Word Deity';
                          })()}
                        </h3>
                        <span className="text-[9px] font-black text-sky-400 uppercase tracking-[0.3em] opacity-80 mb-0.5">Kariyer Kademesi</span>
                      </div>

                      {/* Detailed XP Bar */}
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              {xp?.toLocaleString()} XP
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">
                              SEVİYE {level + 1} HEDEFİ: {getNextLevelXp(level)?.toLocaleString()} XP
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-3 mb-1 text-xs flex rounded-full bg-slate-800/50 border border-white/5 p-0.5">
                          <div
                            style={{ width: `${Math.min(100, (xp / getNextLevelXp(level)) * 100)}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-1000 animate-shimmer"
                          ></div>
                        </div>
                        <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest text-center mt-1">
                          Bir sonraki seviyeye {Math.max(0, getNextLevelXp(level) - xp)?.toLocaleString()} XP kaldı
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] font-inter">{t('personal_stats') || 'BİREYSEL VERİLER'}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                      <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Cinsiyet</div>
                      <div className="text-sm font-bold text-white uppercase italic">{profile?.gender === 'male' ? 'Erkek' : profile?.gender === 'female' ? 'Kadın' : 'Belirtilmedi'}</div>
                    </div>
                    <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                      <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Yaş</div>
                      <div className="text-sm font-bold text-white italic">{profile?.age || '-'}</div>
                    </div>
                    <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                      <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Kayıt Tarihi</div>
                      <div className="text-sm font-bold text-white italic">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-md">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 font-inter">{t('achievements')}</div>
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className="w-12 h-12 md:w-16 md:h-16 bg-slate-950/50 border border-white/5 rounded-2xl flex items-center justify-center text-slate-700 opacity-40 grayscale group hover:opacity-100 transition-all">
                        <Award size={24} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default: // 'modes'
        console.log('--- RENDERING MODES (MAIN) VIEW ---');
        return (
          <div className="w-full h-full flex flex-col lg:flex-row gap-0 lg:gap-6 max-w-7xl mx-auto px-1 lg:px-6 animate-in fade-in duration-500 overflow-hidden">
            {/* Active Event Banner */}
            {activeEvent && (
              <button
                onClick={() => {
                  if (activeEvents.length > 1) {
                    setDashboardView('eventsList');
                  } else {
                    setSelectedEventId?.(activeEvent?.id);
                    setView?.('event');
                  }
                }}
                className="w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between group hover:border-amber-500/50 transition-all mb-4 shrink-0 lg:hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 animate-pulse">
                    <Trophy size={20} />
                  </div>
                  <div className="text-left">
                    <div className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${activeEvent?.isActive ? 'text-amber-500' : 'text-blue-500'}`}>
                      {activeEvent?.isActive ? (language === 'tr' ? 'AKTİF ETKİNLİK' : 'ACTIVE EVENT') : (language === 'tr' ? 'YAKINDA' : 'COMING SOON')}
                    </div>
                    <div className="text-sm font-black text-white italic truncate max-w-[150px]">
                      {activeEvent?.title?.[language] || activeEvent?.title}
                      {activeEvents.length > 1 && ` + ${activeEvents.length - 1} ${language === 'tr' ? 'DAHA' : 'MORE'}`}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* ── MOBILE MODES VIEW (Horizontal Carousel) ── */}
            <div className="lg:hidden flex-1 overflow-x-auto no-scrollbar px-6 flex flex-row gap-4 lg:gap-6 snap-x snap-mandatory items-center min-h-0 landscape:pb-16">
              {/* Arcade Mode Card */}
              <button
                onClick={() => {
                  if (energy > 0) { setSelectedLevelIdx(null); setDashboardView('pregame'); }
                  else { setLockReason('energy'); setShowMissionLock(true); }
                }}
                className="relative w-[85vw] max-w-[280px] landscape:max-w-[240px] h-[65vh] landscape:h-auto lg:h-[55vh] max-h-[320px] landscape:max-h-[180px] shrink-0 rounded-[2rem] landscape:rounded-xl border border-white/10 overflow-hidden transition-all active:scale-95 group shadow-2xl snap-center flex flex-col items-center justify-center p-4 landscape:p-2.5 text-center gap-2 landscape:gap-1.5"
                style={{ background: 'linear-gradient(225deg, #0f172a 0%, #020617 100%)' }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sky-500/20 to-transparent pointer-events-none" />

                <div className="relative z-10 w-10 h-10 landscape:w-8 landscape:h-8 bg-sky-500/10 rounded-xl border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
                  <History className="w-5 h-5 landscape:w-4 landscape:h-4" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  <h3 className="text-lg landscape:text-base lg:text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight">{t('arcade')}</h3>
                  <p className="text-sky-400/80 text-[9px] landscape:text-[8px] lg:text-xs font-black uppercase tracking-[0.1em] leading-tight max-w-[160px] opacity-90">{t('arcade_desc')}</p>
                </div>

                <div className="relative z-10 bg-sky-500 text-slate-950 px-4 landscape:px-3 py-1.5 landscape:py-1 rounded-full font-black text-[9px] landscape:text-[8px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_8px_20px_rgba(14,165,233,0.3)] shrink-0">
                  <Play size={9} fill="currentColor" /> {t('play')}
                </div>
              </button>

              {/* Time Battle Mode Card */}
              <button
                onClick={() => {
                  if (energy > 0) setDashboardView('timeBattlePregame');
                  else { setLockReason('energy'); setShowMissionLock(true); }
                }}
                className="relative w-[85vw] max-w-[280px] landscape:max-w-[240px] h-[65vh] landscape:h-auto lg:h-[55vh] max-h-[320px] landscape:max-h-[180px] shrink-0 rounded-[2rem] landscape:rounded-xl border border-white/10 overflow-hidden transition-all active:scale-95 group shadow-2xl snap-center flex flex-col items-center justify-center p-4 landscape:p-2.5 text-center gap-2 landscape:gap-1.5"
                style={{ background: 'linear-gradient(225deg, #1e0508 0%, #0c0205 100%)' }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-rose-500/20 to-transparent pointer-events-none" />

                <div className="relative z-10 w-10 h-10 landscape:w-8 landscape:h-8 bg-rose-500/10 rounded-xl border border-rose-400/20 flex items-center justify-center text-rose-400 shrink-0">
                  <Clock className="w-5 h-5 landscape:w-4 landscape:h-4" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  <h3 className="text-lg landscape:text-base lg:text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight">{t('time_battle')}</h3>
                  <p className="text-rose-400/80 text-[9px] landscape:text-[8px] lg:text-xs font-black uppercase tracking-[0.1em] leading-tight max-w-[180px] opacity-90">{t('time_battle_desc')}</p>
                </div>

                <div className="relative z-10 bg-rose-500 text-slate-950 px-4 landscape:px-3 py-1.5 landscape:py-1 rounded-full font-black text-[9px] landscape:text-[8px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_8px_20px_rgba(244,63,94,0.3)] shrink-0">
                  <Play size={9} fill="currentColor" /> {t('play')}
                </div>
              </button>

              {/* Zen Mode Card */}
              <button
                onClick={() => {
                  if (!user) { setLockReason('auth'); setShowMissionLock(true); }
                  else if (energy <= 0) { setLockReason('energy'); setShowMissionLock(true); }
                  else onSelectZen();
                }}
                className="relative w-[85vw] max-w-[280px] landscape:max-w-[240px] h-[65vh] landscape:h-auto lg:h-[55vh] max-h-[320px] landscape:max-h-[180px] shrink-0 rounded-[2rem] landscape:rounded-xl border border-white/10 overflow-hidden transition-all active:scale-95 group shadow-2xl snap-center flex flex-col items-center justify-center p-4 landscape:p-2.5 text-center gap-2 landscape:gap-1.5"
                style={{ background: 'linear-gradient(225deg, #061c12 0%, #020806 100%)' }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none" />

                <div className="relative z-10 w-10 h-10 landscape:w-8 landscape:h-8 bg-emerald-500/10 rounded-xl border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-5 h-5 landscape:w-4 landscape:h-4" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  <h3 className="text-lg landscape:text-base lg:text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight">{t('zen_mode')}</h3>
                  <p className="text-emerald-400/80 text-[10px] landscape:text-[8px] lg:text-xs font-black uppercase tracking-[0.1em] leading-tight max-w-[180px] opacity-90">{t('zen_desc')}</p>
                </div>

                <div className="relative z-10 bg-emerald-500 text-slate-950 px-4 landscape:px-3 py-1.5 landscape:py-1 rounded-full font-black text-[9px] landscape:text-[8px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_8px_20px_rgba(16,185,129,0.3)] shrink-0">
                  {user ? <Play size={9} fill="currentColor" /> : <Lock size={9} />} {user ? (language === 'tr' ? 'RAHATLA' : 'RELAX') : t('login')}
                </div>
              </button>
            </div>

            {/* ── DESKTOP MODES VIEW (Hidden on mobile/tablet landscape) ── */}
            <div className="hidden lg:flex flex-1 flex-row gap-6 min-h-0 overflow-hidden">
              <div className="flex-1 flex flex-col gap-0 min-h-0 overflow-hidden">
                <button
                  onClick={() => {
                    if (energy > 0) { setSelectedLevelIdx(null); setDashboardView('pregame'); }
                    else { setLockReason('energy'); setShowMissionLock(true); }
                  }}
                  className="group relative flex-1 overflow-hidden rounded-t-[2rem] border border-white/8 transition-all duration-500 active:scale-[0.99]"
                  style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1526 50%, #0a1020 100%)' }}
                >
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] transition-all duration-700 group-hover:bg-sky-500/20 group-hover:scale-110" />
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '128px' }} />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 gap-4">
                    <div className="w-20 h-20 bg-sky-500/15 border border-sky-500/25 rounded-3xl flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:bg-sky-500/25 group-hover:border-sky-500/50 transition-all duration-500 shadow-[0_0_30px_rgba(14,165,233,0.15)]">
                      <History size={40} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-5xl font-black text-white tracking-[-0.04em] uppercase leading-none font-outfit group-hover:text-sky-100 transition-colors">{t('arcade')}</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 group-hover:text-slate-400 transition-colors max-w-[240px] mx-auto">{t('arcade_desc')}</p>
                    </div>
                  </div>
                </button>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <button
                  onClick={() => {
                    if (energy > 0) setDashboardView('timeBattlePregame');
                    else { setLockReason('energy'); setShowMissionLock(true); }
                  }}
                  className="group relative flex-1 overflow-hidden border border-white/8 border-t-0 transition-all duration-500 active:scale-[0.99]"
                  style={{ background: 'linear-gradient(135deg, #0f0005 0%, #1a0008 50%, #100005 100%)' }}
                >
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] transition-all duration-700 group-hover:bg-rose-500/20 group-hover:scale-110" />
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '128px' }} />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 gap-4">
                    <div className="w-20 h-20 bg-rose-500/15 border border-rose-500/25 rounded-3xl flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-500/25 group-hover:border-rose-500/50 transition-all duration-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                      <Clock size={40} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-5xl font-black text-white tracking-[-0.04em] uppercase leading-none font-outfit group-hover:text-rose-100 transition-colors">{t('time_battle')}</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 group-hover:text-slate-400 transition-colors max-w-[240px] mx-auto">{t('time_battle_desc')}</p>
                    </div>
                  </div>
                </button>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <button
                  onClick={() => {
                    if (!user) { setLockReason('auth'); setShowMissionLock(true); }
                    else if (energy <= 0) { setLockReason('energy'); setShowMissionLock(true); }
                    else onSelectZen();
                  }}
                  className="group relative flex-1 overflow-hidden rounded-b-[2rem] border border-white/8 border-t-0 transition-all duration-500 active:scale-[0.99]"
                  style={{ background: 'linear-gradient(135deg, #051a10 0%, #0a261a 50%, #051a10 100%)' }}
                >
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] transition-all duration-700 group-hover:bg-emerald-500/20 group-hover:scale-110" />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 gap-3">
                    <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/25 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                      <Sparkles size={32} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-3xl font-black text-white tracking-tight uppercase font-outfit leading-none mb-1">{t('zen_mode')}</h3>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest group-hover:text-slate-400 transition-colors">{t('zen_desc')}</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* ── DESKTOP SIDEBAR ── */}
              <div className="hidden lg:flex w-80 xl:w-96 shrink-0 flex-col gap-4">
                {/* Active Event Banner (Desktop) */}
                {activeEvent && (
                  <button
                    onClick={() => {
                      if (activeEvents.length > 1) {
                        setDashboardView('eventsList');
                      } else {
                        setSelectedEventId?.(activeEvent?.id);
                        setView?.('event');
                      }
                    }}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-orange-500/20 p-5 flex items-center justify-between gap-4 text-left transition-all duration-300 hover:border-orange-500/40 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #1a0f05 0%, #110904 100%)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 group-hover:border-orange-500/40 transition-all shrink-0">
                        <Trophy size={24} className="text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${activeEvent?.isActive ? 'text-amber-500' : 'text-blue-500'}`}>
                          {activeEvent?.isActive ? (language === 'tr' ? 'AKTİF ETKİNLİK' : 'ACTIVE EVENT') : (language === 'tr' ? 'YAKINDA' : 'COMING SOON')}
                        </div>
                        <div className="text-lg font-black text-white italic tracking-tighter uppercase truncate max-w-[150px] xl:max-w-none">
                          {activeEvent?.title?.[language] || activeEvent?.title}
                          {activeEvents.length > 1 && ` + ${activeEvents.length - 1} ${language === 'tr' ? 'DAHA' : 'MORE'}`}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-amber-500/50 group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                )}


                {/* RANK Kartı (full width, herkese açık) */}
                <button
                  onClick={() => setDashboardView('leaderboard')}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/8 p-5 flex items-center gap-4 text-left transition-all duration-300 hover:border-sky-500/30 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #0a1020 0%, #080e1a 100%)' }}
                >
                  <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-all shrink-0">
                    <BarChart3 size={20} className="text-sky-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-0.5">KÜRESEL</div>
                    <div className="text-lg font-black text-white uppercase tracking-tight leading-none">{t('leaderboard') || 'SIRALAMA'}</div>
                  </div>
                  <ChevronRight size={16} className="text-slate-700 group-hover:text-sky-400 group-hover:translate-x-1 transition-all shrink-0" />
                </button>

                {/* MARKET Kartı (full width) */}
                <button
                  onClick={() => { if (!user) setShowMissionLock(true); else setDashboardView('shop'); }}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/8 p-5 flex items-center gap-4 text-left transition-all duration-300 hover:border-emerald-500/30 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #061810 0%, #04100b 100%)' }}
                >
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all shrink-0">
                    <ShoppingBag size={20} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-0.5">MAĞAZA</div>
                    <div className="text-lg font-black text-white uppercase tracking-tight leading-none">{t('market') || 'MARKET'}</div>
                  </div>
                  <ChevronRight size={16} className="text-slate-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                </button>

                {/* GÖREVLER Kartı (full width) */}
                <button
                  onClick={() => { if (!user) { setLockReason('auth'); setShowMissionLock(true); } else setDashboardView('missions'); }}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/8 p-5 flex items-center gap-4 text-left transition-all duration-300 hover:border-sky-500/30 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #0a1820 0%, #041014 100%)' }}
                >
                  <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-all shrink-0">
                    <ListTodo size={20} className="text-sky-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-0.5">GÜNLÜK</div>
                    <div className="text-lg font-black text-white uppercase tracking-tight leading-none">{t('missions') || 'GÖREVLER'}</div>
                  </div>
                  {/* Progress Badge */}
                  <div className="bg-sky-500/20 px-3 py-1 rounded-full border border-sky-500/30">
                    <span className="text-[10px] font-black text-sky-400 tabular-nums">
                      {dailyMissions?.tasks?.filter(t => t.claimed).length || 0}/{dailyMissions?.tasks?.length || 0}
                    </span>
                  </div>
                </button>

                {/* ENVANTER + DAILY (2 col grid) */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { if (!user) setShowMissionLock(true); else setDashboardView('inventory'); }}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-white/8 p-5 flex flex-col items-center gap-3 transition-all duration-300 hover:border-purple-500/30 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #0d0a14 0%, #0a0810 100%)' }}
                  >
                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-all">
                      <Box size={20} className="text-purple-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black text-white uppercase tracking-tight leading-none">{t('inventory')}</div>
                      <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">{!user ? '🔒' : `${(tools?.bomb || 0) + (tools?.swap || 0)} ARAÇ`}</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { if (!user) { setLockReason('auth'); setShowMissionLock(true); } else setDashboardView('daily'); }}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-white/8 p-5 flex flex-col items-center gap-3 transition-all duration-300 hover:border-amber-500/30 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #12090a 0%, #0e0608 100%)' }}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-amber-500/10 border-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-all">
                        <Gift size={20} className="text-amber-400" />
                      </div>
                      {/* Note: The red dot / ping can be derived dynamically if we know user hasn't spun */}
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black text-white uppercase tracking-tight leading-none">{t('daily_reward_title') || 'ŞANS ÇARKI'}</div>
                      <div className="text-[9px] text-amber-500 font-black uppercase tracking-widest mt-1">SÜRPRİZ ÖDÜLLER</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* ── MOBİL: Alt İkon Barı (Premium Bottom Nav) ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 px-6 py-4 flex justify-between items-center shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">

              <button
                onClick={() => { if (!user) setShowMissionLock(true); else setDashboardView('inventory'); }}
                className={`flex flex-col items-center gap-1 transition-all ${dashboardView === 'inventory' ? 'text-purple-400 scale-110' : 'text-slate-500'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${dashboardView === 'inventory' ? 'bg-purple-500/20 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-white/5 border-transparent'}`}>
                  <Box size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t('tools') || 'Araçlar'}</span>
              </button>

              <button
                onClick={() => setDashboardView('leaderboard')}
                className={`flex flex-col items-center gap-1 -mt-8 transition-all ${dashboardView === 'leaderboard' ? 'scale-125' : 'scale-100 opacity-80'}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 border-2 border-slate-950 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  <Trophy size={28} className="relative z-10" />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${dashboardView === 'leaderboard' ? 'text-amber-400' : 'text-slate-500'}`}>{t('rank') || 'Sıra'}</span>
              </button>

              <button
                onClick={() => { if (!user) setShowMissionLock(true); else setDashboardView('shop'); }}
                className={`flex flex-col items-center gap-1 transition-all ${dashboardView === 'shop' ? 'text-emerald-400 scale-110' : 'text-slate-500'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${dashboardView === 'shop' ? 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-transparent'}`}>
                  <ShoppingBag size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t('market') || 'Shop'}</span>
              </button>

              <button
                onClick={() => { if (!user) { setLockReason('auth'); setShowMissionLock(true); } else setDashboardView('missions'); }}
                className={`flex flex-col items-center gap-1 transition-all ${dashboardView === 'missions' ? 'text-sky-400 scale-110' : 'text-slate-500'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${dashboardView === 'missions' ? 'bg-sky-500/20 border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'bg-white/5 border-transparent'}`}>
                  <ListTodo size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t('missions') || 'Görev'}</span>
              </button>

              <button
                onClick={() => { if (!user) { setLockReason('auth'); setShowMissionLock(true); } else setDashboardView('daily'); }}
                className={`flex flex-col items-center gap-1 transition-all ${dashboardView === 'daily' ? 'text-amber-400 scale-110' : 'text-slate-500'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${dashboardView === 'daily' ? 'bg-amber-500/20 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-transparent'} relative`}>
                  <Gift size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t('daily') || 'Hediye'}</span>
              </button>
            </div>

          </div >
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex flex-col bg-slate-950/95 backdrop-blur-xl overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {/* Falling Letters Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 select-none">
        {fallingLetters.map(item => {
          const getTileColors = (letter) => {
            const vowels = {
              'A': ['#f43f5e', '#fb7185'],
              'E': ['#0ea5e9', '#38bdf8'],
              'I': ['#8b5cf6', '#a78bfa'],
              'İ': ['#8b5cf6', '#a78bfa'],
              'O': ['#f59e0b', '#fbbf24'],
              'Ö': ['#f59e0b', '#fbbf24'],
              'U': ['#10b981', '#34d399'],
              'Ü': ['#10b981', '#34d399'],
            };
            return vowels[letter] || ['#475569', '#64748b'];
          };
          const [c1, c2] = getTileColors(item.char);

          return (
            <div
              key={item.id}
              className="absolute flex items-center justify-center border border-white/20 rounded-xl text-white font-black animate-fall shadow-xl overflow-hidden"
              style={{
                left: `${item.left}%`,
                width: `${item.size * 1.8}px`,
                height: `${item.size * 1.8}px`,
                fontSize: `${item.size}px`,
                animationDuration: `${item.duration}s`,
                animationDelay: `${item.delay}s`,
                top: '-100px',
                opacity: 0.5,
                background: `linear-gradient(135deg, ${c1}, ${c2})`
              }}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <span className="italic tracking-tighter drop-shadow-md">
                {item.char}
              </span>
              <span className="absolute bottom-1 right-1 text-[8px] font-black text-white/60 leading-none">
                {LETTER_POINTS[item.char] || 1}
              </span>
            </div>
          );
        })}
      </div>

      <header className="relative z-10 px-4 py-3 md:px-8 md:py-6 flex justify-between items-center bg-slate-950/20 backdrop-blur-md border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <div className="w-10 h-10 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center p-1.5 md:p-2 backdrop-blur-md border border-white/20 shrink-0">
            <img src="/logo.png" alt="WORDLENGE" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
          </div>
          <div className="hidden md:flex flex-col">
            <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent italic tracking-tighter leading-none font-outfit">
              WORDLENGE
            </h1>
            <div className="flex items-center gap-2 mt-0 md:mt-1">
              <span className="h-[1.5px] w-6 md:w-12 bg-gradient-to-r from-orange-500 to-blue-500"></span>
              <span className="text-[7px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] font-inter hidden sm:inline-block">Puzzle Edition v2.6</span>
            </div>
          </div>

          <div className="flex md:flex-col items-center gap-1.5 md:gap-2 ml-1 md:ml-4 font-inter shrink-0">
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className={`w-8 h-8 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center transition-all active:scale-95 border ${isMuted ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-900/40 border-white/5 text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setDashboardView('settings')}
                className="w-8 h-8 md:w-8 md:h-8 bg-slate-900/40 hover:bg-white/5 border border-white/5 rounded-lg md:rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all active:scale-95 group"
              >
                <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-1 md:gap-1.5 font-inter shrink-0 bg-slate-900/40 p-1 md:p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 py-0.5 text-[8px] md:text-[9px] font-black rounded-md transition-all ${language === 'tr' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-[8px] md:text-[9px] font-black rounded-md transition-all ${language === 'en' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Energy & Coins - Visible consistently on Desktop OR Landscape Mobile */}
          <div className="hidden lg:flex landscape:flex items-center gap-1.5 md:gap-3">
            {user && (
              <>
                <div className="bg-slate-900/60 border border-white/5 px-2 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-2xl flex items-center gap-1.5 md:gap-3 group transition-all hover:border-sky-500/50 relative overflow-hidden">
                  <div className={`w-5 h-5 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center ${isPro || energy > 0 ? 'bg-sky-500/20 text-sky-400' : 'bg-rose-500/20 text-rose-400'} shrink-0`}>
                    <Zap className="w-3 h-3 md:w-4 md:h-4" fill={isPro || energy > 0 ? "currentColor" : "none"} />
                  </div>
                  <div className="flex flex-col font-outfit min-w-[25px] md:min-w-[40px]">
                    <span className="text-[9px] md:text-xs font-black text-white leading-none whitespace-nowrap">{isPro ? '∞' : `${energy}/5`}</span>
                    {!isPro && energy < 5 && (
                      <span className="text-[7px] md:text-[8px] font-bold text-sky-400/80 mt-0.5 whitespace-nowrap animate-pulse">
                        {Math.floor(nextEnergyIn / 60)}:{(nextEnergyIn % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-white/5 px-2 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-2xl flex items-center gap-1 md:gap-2 group transition-all hover:border-amber-500/50">
                  <div className="w-5 h-5 md:w-8 md:h-8 bg-amber-500/20 rounded-md md:rounded-lg flex items-center justify-center text-amber-500 shrink-0">
                    <Coins className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                  <span className="text-[9px] md:text-xs font-black text-white leading-none">{coins}</span>
                </div>
              </>
            )}
          </div>

          {user ? (
            <button
              onClick={() => setDashboardView('profile')}
              className="flex items-center gap-2 md:gap-3 bg-slate-900/60 border border-white/5 p-1 pr-2 md:pr-4 rounded-xl md:rounded-2xl group transition-all hover:border-sky-500/50 font-outfit text-left shadow-lg shrink-0"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 md:w-11 md:h-11 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black italic text-xs md:text-base border border-white/20 overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-amber-400 to-orange-600 text-white text-[7px] md:text-[9px] font-black leading-none px-1.5 md:px-2 py-0.5 rounded-md border-2 border-slate-950 shadow-lg z-20">
                  {level}
                </div>
                {isPro && (
                  <div className="absolute -top-1 -right-1 bg-sky-500 text-white p-0.5 md:p-1 rounded-full border-2 border-slate-950 shadow-lg z-20 animate-pulse">
                    <Star size={isMobile ? 8 : 10} fill="currentColor" />
                  </div>
                )}
              </div>
              <div className="hidden sm:flex flex-col ml-1">
                <span className="text-[10px] md:text-xs font-black text-white leading-none truncate max-w-[100px]" title={profile?.username || user?.email?.split('@')[0]}>
                  {(() => {
                    const name = profile?.username || user?.email?.split('@')[0] || '';
                    return name.length > 12 ? name.substring(0, 12) + '...' : name;
                  })()}
                </span>
                {/* Minimalist XP Bar */}
                <div className="mt-1 w-full bg-white/10 h-[3px] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (xp / getNextLevelXp(level)) * 100)}%` }}
                  />
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-orange-500 to-rose-600 text-white border border-white/10 rounded-xl md:rounded-2xl flex items-center gap-2 transition-all font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl active:scale-95 font-inter"
            >
              <User className="w-3 h-3 md:w-4 md:h-4" />
              {t('login') || 'Giriş'}
            </button>
          )}
        </div>
      </header>

      {/* Mobile-Only Status Bar (Energy & Coins) - Hidden in Landscape to save space */}
      <div className="lg:hidden landscape:hidden relative z-10 flex border-b border-white/5 bg-slate-950/40 backdrop-blur-md px-4 py-2 justify-center gap-4 shrink-0">
        {user ? (
          <>
            <div className="flex items-center gap-2 bg-slate-900/60 rounded-full px-4 py-1.5 border border-white/5">
              <div className={`w-5 h-5 flex items-center justify-center ${isPro || isEnergyUnlimited || energy > 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                <Zap size={14} fill={isPro || isEnergyUnlimited || energy > 0 ? "currentColor" : "none"} />
              </div>
              <span className="text-[11px] font-black text-white tracking-widest leading-none">{(isPro || isEnergyUnlimited) ? '∞' : `${energy}/5`}</span>
              {!(isPro || isEnergyUnlimited) && energy < 5 && (
                <span className="text-[8px] font-bold text-slate-500 ml-1">
                  {Math.floor(nextEnergyIn / 60)}:{(nextEnergyIn % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 rounded-full px-4 py-1.5 border border-white/5">
              <Coins size={14} className="text-amber-500" />
              <span className="text-[11px] font-black text-white tracking-widest leading-none">{coins}</span>
              <span className="text-[8px] font-bold text-amber-500/60 ml-0.5 uppercase tracking-tighter">Gold</span>
            </div>
          </>
        ) : (
          <div className="py-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">BÜYÜK MACERA BAŞLIYOR!</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex items-center justify-center p-4 lg:p-8 min-h-0 relative z-10">
        {renderView()}
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 md:py-8 hidden lg:flex flex-col items-center gap-2 md:gap-3 border-t border-white/5 opacity-40 shrink-0">
        <div className="flex items-center gap-4 md:gap-6">
          <a href="https://wordlenge.com/kullanim-kosullari" target="_blank" rel="noopener noreferrer" className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-colors">{t('terms_of_service')}</a>
          <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-800 rounded-full" />
          <a href="https://wordlenge.com/gizlilik-politikasi" target="_blank" rel="noopener noreferrer" className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-colors">{t('privacy_policy')}</a>
        </div>
        <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">
          {t('copyright')}
        </p>
      </footer>

      {/* Mission Lock Modal */}
      {showMissionLock && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border ${lockReason === 'auth' ? 'bg-orange-500/20 border-orange-400/30' : 'bg-sky-500/20 border-sky-400/30'}`}>
                {lockReason === 'auth' ? <Lock size={40} className="text-orange-400" /> : <Clock size={40} className="text-sky-400" />}
              </div>
              <h2 className="text-xl font-black text-white italic tracking-tighter mb-2 uppercase leading-tight">
                {lockReason === 'auth' ? t('mission_lock_title') : (language === 'tr' ? 'Enerji Bitti!' : 'No Energy!')}
              </h2>
              <p className="text-slate-400 text-[11px] font-medium mb-8 leading-relaxed px-4">
                {lockReason === 'auth' ? t('mission_lock_desc') : (language === 'tr' ? `Oynamak için yeterli enerjin yok. Bir sonraki enerjiye ${Math.floor(nextEnergyIn / 60)} dakika kaldı.` : `You don't have enough energy. Next energy in ${Math.floor(nextEnergyIn / 60)} minutes.`)}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowMissionLock(false);
                    if (lockReason === 'auth') onOpenAuth();
                  }}
                  className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-slate-950 font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-orange-500/20 uppercase text-xs tracking-widest"
                >
                  {lockReason === 'auth' ? t('mission_lock_button') : (language === 'tr' ? 'ANLADIM' : 'UNDERSTOOD')}
                </button>
                <button
                  onClick={() => setShowMissionLock(false)}
                  className="w-full py-4 text-slate-500 font-bold hover:text-white transition-colors text-[10px] uppercase tracking-widest"
                >
                  {t('back')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for Leaderboard view to encapsulate its state
const EventLeaderboard = ({ eventId, t, profile }) => {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      setLoading(true);
      const data = await SupabaseService.getEventLeaderboard(eventId);
      setBoard(data || []);
      setLoading(false);
    };
    fetchBoard();
  }, [eventId]);

  if (loading) return (
    <div className="flex flex-col gap-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto no-scrollbar">
      {board.map((row, i) => (
        <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${row.user_id === profile?.id ? 'bg-sky-500/10 border-sky-500/30' : 'bg-slate-950/40 border-white/5'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-amber-500 text-slate-950' : i === 1 ? 'bg-slate-300 text-slate-950' : i === 2 ? 'bg-orange-400 text-slate-950' : 'bg-white/10 text-slate-500'}`}>
              {i + 1}
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase truncate max-w-[120px]">{row.profiles?.username || 'Gamer'}</div>
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{t('rank')} {i + 1}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-sky-400 tabular-nums">{row.score.toLocaleString()}</div>
            <div className="text-[8px] font-black text-slate-600 uppercase">{t('points')}</div>
          </div>
        </div>
      ))}
      {board.length === 0 && (
        <div className="text-center py-8 text-slate-600 text-[10px] font-black uppercase tracking-widest italic">{t('no_participants')}</div>
      )}
    </div>
  );
};

// Helper component for Event Rewards
const EventRewards = ({ eventId, t, language }) => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      try {
        const data = await SupabaseService.getEventRewards(eventId);
        console.log('--- EVENT REWARDS FETCHED ---', data);

        // Veriyi normalize et (Diziye çevir)
        let normalized = [];
        if (Array.isArray(data)) {
          normalized = data;
        } else if (data && typeof data === 'object') {
          // Eğer data bir nesne ise (rank anahtarlı), diziye çevir
          normalized = Object.entries(data).map(([key, value]) => ({
            rank_min: key,
            rank_max: key,
            items: value
          }));
        }
        setRewards(normalized || []);
      } catch (err) {
        console.error('Error fetching rewards:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, [eventId]);

  // Derin iç içe geçmiş dizileri ve nesneleri düz bir ödül listesine çevirir
  const flattenItems = (input) => {
    if (!input) return [];

    // Eğer girdi bir dizi ise, her elemanı kontrol et
    if (Array.isArray(input)) {
      let result = [];
      input.forEach(item => {
        // Eğer eleman bir dizi ise (nested), tekrar içeri gir
        if (Array.isArray(item)) {
          result = [...result, ...flattenItems(item)];
        }
        // Eğer eleman bir nesne ise
        else if (item && typeof item === 'object') {
          // Eğer bu zaten bir ödül objesi ise
          if (item.type && (item.amount !== undefined || item.count !== undefined || item.value !== undefined)) {
            result.push(item);
          } else {
            // Değilse, içindeki liste anahtarlarını kontrol et
            const subItems = item.items || item.rewards_config || item.rewards || item.prizes;
            if (subItems) result = [...result, ...flattenItems(subItems)];
            else {
              // Hala bir nesne ise ve tip içermiyorsa, key-value olabilir
              result = [...result, ...flattenItems(item)];
            }
          }
        } else {
          result.push(item);
        }
      });
      return result;
    }

    // Eğer girdi bir nesne ise
    if (input && typeof input === 'object') {
      // Eğer bu zaten bir ödül objesi ise
      if (input.type && (input.amount !== undefined || input.count !== undefined || input.value !== undefined)) {
        return [input];
      }

      // Değilse, alt anahtarları dolaş
      const rewardsKey = input.items || input.rewards_config || input.rewards || input.prizes;
      if (rewardsKey) return flattenItems(rewardsKey);

      // Klasik { "gold": 1000 } yapısı. Ama metadata anahtarlarını FİLTRELE!
      const metadataKeys = ['rank', 'rank_min', 'rank_max', 'min_rank', 'max_rank', 'id', 'event_id', 'created_at', 'updated_at', 'prizes', 'items', 'rewards', 'rewards_config'];
      return Object.entries(input)
        .filter(([key]) => !metadataKeys.includes(key))
        .map(([type, amount]) => ({ type, amount }));
    }

    return [];
  };

  const getIcon = (type) => {
    const lowerType = String(type || '').toLowerCase();
    if (lowerType.includes('gold') || lowerType.includes('coin')) return <span className="text-amber-400">🪙</span>;
    if (lowerType.includes('energy')) return <span className="text-rose-400">⚡</span>;
    if (lowerType.includes('bomb')) return <span className="text-orange-500">💣</span>;
    if (lowerType.includes('swap')) return <span className="text-blue-400">🔄</span>;
    if (lowerType.includes('row')) return <span className="text-emerald-400">↔️</span>;
    if (lowerType.includes('col')) return <span className="text-emerald-400">↕️</span>;
    if (lowerType.includes('cell')) return <span className="text-sky-400">🎯</span>;
    return <span className="text-slate-400">🎁</span>;
  };

  const getRankText = (reward) => {
    const min = reward.rank_min || reward.min_rank || reward.rank;
    const max = reward.rank_max || reward.max_rank;

    if (min && max && String(min) !== String(max)) return `${min}-${max}. ${t('rank')}`;
    if (min) return `${min}. ${t('rank')}`;
    return t('rewards') || 'REWARDS';
  };

  if (loading) return (
    <div className="flex flex-col gap-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto no-scrollbar">
      {rewards.map((reward, i) => {
        const itemList = flattenItems(reward.items || reward.rewards_config || reward.rewards || reward);

        // Eğer rank bilgisi objenin kendisindeyse ama items boşsa, sonsuz döngüyü engellemek için filtrele
        const finalItems = itemList.filter(item => item && typeof item === 'object' && item.type !== 'rank_min' && item.type !== 'rank_max');

        return (
          <div key={i} className="p-4 rounded-xl border bg-slate-950/40 border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">
                {getRankText(reward)}
              </div>
              <div className="px-2 py-0.5 rounded-full bg-slate-950 border border-white/10 text-[8px] font-black text-slate-500 uppercase leading-none">
                {t('rewards') || (language === 'tr' ? 'ÖDÜLLER' : 'REWARDS')}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {finalItems.map((item, idx) => {
                // Eğer item hala bir objeyse (hata koruması)
                if (!item || typeof item !== 'object') return null;

                const val = item.amount !== undefined ? item.amount : (item.count !== undefined ? item.count : item.value);
                const displayValue = val !== undefined ? (typeof val === 'number' ? val.toLocaleString() : (typeof val === 'object' ? '' : String(val))) : '';
                const displayType = item.type ? (t(item.type) || item.type) : '';

                // Eğer hem değer hem tip boşsa (temizlik sonrası) gösterme
                if (!displayValue && !displayType) return null;

                return (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm">{getIcon(item.type)}</span>
                    <span className="text-xs font-black text-white tabular-nums leading-none">{displayValue}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase leading-none">{displayType}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {rewards.length === 0 && (
        <div className="text-center py-8 text-slate-600 text-[10px] font-black uppercase tracking-widest italic">
          {t('no_rewards') || (language === 'tr' ? 'ÖDÜL TANIMLANMAMIŞ' : 'NO REWARDS DEFINED')}
        </div>
      )}
    </div>
  );
};

const LeaderboardView = ({ t = (s) => s, profile }) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [mode, setMode] = React.useState('global');

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const rankings = await SupabaseService.getLeaderboard(mode);
      if (rankings) setData(rankings);
      else setData([]);
      setLoading(false);
    };
    fetchLeaderboard();
  }, [mode]);

  return (
    <div className="flex flex-col h-full">
      {/* Mode Tabs */}
      <div className="flex gap-1 bg-slate-900/40 p-1 rounded-xl border border-white/5 mb-4 shrink-0 overflow-x-auto no-scrollbar">
        {[
          { id: 'global', label: t('rank_global') || 'Global', icon: <Trophy size={14} /> },
          { id: 'adventure', label: t('adventure') || 'Macera', icon: <LayoutGrid size={14} /> },
          { id: 'time_arena', label: t('time_arena') || 'Arena', icon: <Clock size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase transition-all whitespace-nowrap
              ${mode === tab.id ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-2 pb-20">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 animate-pulse">
            <RefreshCw size={48} className="animate-spin mb-4 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('loading')}</span>
          </div>
        ) : data.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-600">
            <Trophy size={48} className="mb-4 opacity-10" />
            <span className="text-xs font-black uppercase tracking-widest">{t('no_rankings') || 'Henüz sıralama yok'}</span>
          </div>
        ) : (
          data.map((item, index) => {
            const isMe = item.id === profile?.id;
            const rank = index + 1;
            return (
              <div
                key={item.id}
                className={`
                  flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-2xl transition-all border 
                  ${isMe ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'bg-slate-900/40 border-white/5'}
                  ${rank <= 3 ? 'scale-100' : 'scale-[0.98] opacity-80'}
                `}
              >
                <div className={`
                  w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black italic text-sm md:text-base shrink-0
                  ${rank === 1 ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20' :
                    rank === 2 ? 'bg-slate-300 text-slate-950 shadow-lg shadow-slate-300/20' :
                      rank === 3 ? 'bg-amber-700 text-white shadow-lg shadow-amber-700/20' : 'text-slate-500 bg-slate-800'}
                `}>
                  {rank}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white italic truncate uppercase text-xs md:text-base">{item.username}</span>
                    {isMe && <span className="text-[7px] md:text-[9px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-lg uppercase tracking-tighter">{t('you')}</span>}
                    {item.is_pro && (
                      <div className="bg-sky-500/20 p-1 rounded-full border border-sky-500/50">
                        <Star size={10} className="text-sky-400" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 mt-0.5">
                    <div className="flex items-center gap-1 text-slate-400">
                      {mode === 'global' ? <Coins size={9} className="text-amber-500 md:w-3 md:h-3" /> : <Star size={9} className="text-amber-500 md:w-3 md:h-3" />}
                      <span className="text-[9px] md:text-xs font-bold font-inter tracking-wider text-slate-500">
                        {mode === 'global' ? item.coins : (item.score || 0)}
                      </span>
                    </div>
                    {mode === 'global' && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Trophy size={9} className="text-sky-500 md:w-3 md:h-3" />
                        <span className="text-[9px] md:text-xs font-bold font-inter tracking-wider text-slate-500">{t('level_abbr')}{item.current_level_index + 1}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const MissionTracker = ({ goals = [], t = (s) => s, language = 'tr', isCompact = false }) => (
  <div className={isCompact ? "flex flex-row gap-2" : "flex flex-col gap-1.5"}>
    {!isCompact && (
      <div className="flex items-center gap-2 mb-1">
        <Target className="text-orange-400" size={14} />
        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{t('missions_title')}</h3>
      </div>
    )}
    {goals.map((goal, idx) => {
      const isDone = goal.current >= goal.count;
      return (
        <div key={idx} className={`relative overflow-hidden group bg-slate-950/60 border ${isDone ? 'border-green-500/40' : 'border-white/5'} rounded-xl transition-all ${isCompact ? 'px-2 py-1 shrink-0' : 'p-2'}`}>
          <div className="flex items-center gap-2 md:justify-between relative z-10">
            <span className={`text-[9px] font-bold tracking-wide break-keep whitespace-nowrap ${isDone ? 'text-green-400 line-through opacity-50' : 'text-slate-400'}`}>
              {typeof goal.text === 'object' ? (goal.text[language] || goal.text['tr']) : goal.text}
            </span>
            {isDone ? (
              <CheckCircle2 className="text-green-500" size={12} />
            ) : (
              <span className="text-[8px] font-black bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded text-sky-400 tabular-nums">
                {goal.current}/{goal.count}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-500 opacity-30" style={{ width: `${Math.min(100, (goal.current / (goal.count || 1)) * 100)}%` }} />
        </div>
      );
    })}
  </div>
);

const ShopView = ({ t = (s) => s, coins, tools, buyTool, language, user, profile, onOpenAuth }) => {
  const [activeTab, setActiveTab] = React.useState('tools');
  const [purchaseLoading, setPurchaseLoading] = React.useState(null);
  const [purchaseError, setPurchaseError] = React.useState(null);

  const isFirstPurchase = !profile?.first_purchase_used;
  const isPro = profile?.is_pro || false;

  // Altın paketleri
  const goldPackages = [
    { id: 'gold_starter', coins: 500, price: 0.99, priceTRY: 39.99, bonus: null, popular: false },
    { id: 'gold_popular', coins: 1200, price: 2.99, priceTRY: 109.99, bonus: '+20%', popular: true },
    { id: 'gold_super', coins: 3000, price: 4.99, priceTRY: 189.99, bonus: '+50%', popular: false },
    { id: 'gold_mega', coins: 7500, price: 9.99, priceTRY: 379.99, bonus: '+87%', popular: false },
    { id: 'gold_legendary', coins: 20000, price: 19.99, priceTRY: 749.99, bonus: '+140%', popular: false },
  ];

  const handlePurchase = async (productId, productType = 'coins') => {
    if (!user) { onOpenAuth?.(); return; }
    setPurchaseLoading(productId);
    setPurchaseError(null);
    try {
      const { PaymentService } = await import('./logic/PaymentService');
      const fn = productType === 'pro'
        ? PaymentService.createSubscriptionSession(user.id, productId, language)
        : PaymentService.createCheckoutSession(user.id, productId, productType, language);
      const { url, error } = await fn;
      if (error) { setPurchaseError(error); return; }
      PaymentService.openCheckoutUrl(url);
    } catch (err) {
      setPurchaseError(err.message);
    } finally {
      setPurchaseLoading(null);
    }
  };

  // Araç listesi (mevcut yapı aynen korundu)
  const toolItems = [
    { id: 'bomb', name: t('bomb'), desc: t('bomb_desc') || 'Seçili hücre ve etrafını patlatır', cost: 250, icon: <Zap size={20} className="text-amber-400 md:w-6 md:h-6" />, color: 'from-amber-500 to-orange-600' },
    { id: 'xbomb', name: language === 'tr' ? 'X Bombası' : 'X Bomb', desc: language === 'tr' ? 'Hücreyi çaprazlama patlatır' : 'Blasts cells diagonally', cost: 500, icon: <Bomb size={20} className="text-orange-400 md:w-6 md:h-6" />, color: 'from-orange-500 to-red-600' },
    { id: 'nuclear', name: language === 'tr' ? 'Nükleer Bomba' : 'Nuclear Bomb', desc: language === 'tr' ? 'Tüm ekranı temizler' : 'Clears the entire grid', cost: 1000, icon: <Radiation size={20} className="text-lime-400 md:w-6 md:h-6" />, color: 'from-lime-500 to-green-600' },
    { id: 'row', name: t('row'), desc: t('row_desc') || 'Tüm yatay satırı temizler', cost: 300, icon: <MoveHorizontal size={20} className="text-rose-400 md:w-6 md:h-6" />, color: 'from-rose-500 to-pink-600' },
    { id: 'col', name: t('col'), desc: t('col_desc') || 'Tüm dikey sütunu temizler', cost: 300, icon: <MoveVertical size={20} className="text-emerald-400 md:w-6 md:h-6" />, color: 'from-emerald-500 to-teal-600' },
    { id: 'swap', name: t('swap'), desc: t('swap_desc') || 'İki harfin yerini değiştirir', cost: 400, icon: <RefreshCw size={20} className="text-sky-400 md:w-6 md:h-6" />, color: 'from-sky-500 to-blue-600' },
    { id: 'cell', name: t('cell'), desc: t('cell_desc') || 'Tek bir harfi siler', cost: 100, icon: <Target size={20} className="text-purple-400 md:w-6 md:h-6" />, color: 'from-purple-500 to-violet-600' },
    { id: 'energy_24h', name: t('energy_unlimited_24h'), desc: t('energy_unlimited_24h_desc'), price: 0.99, priceTRY: 34.99, icon: <Zap size={20} className="text-rose-400 md:w-6 md:h-6" />, color: 'from-rose-500 to-pink-600', isStripe: true }
  ];

  const tabs = [
    { id: 'tools', label: t('shop_tab_tools') || 'ARAÇLAR', icon: <Zap size={14} /> },
    { id: 'gold', label: t('shop_tab_gold') || 'ALTIN', icon: <Coins size={14} /> },
    { id: 'pro', label: t('shop_tab_pro') || 'PRO', icon: <Star size={14} /> },
  ];

  const proFeatures = [
    { icon: <Zap size={16} className="text-amber-400" />, text: t('pro_unlimited_energy') },
    { icon: <Coins size={16} className="text-amber-400" />, text: t('pro_daily_gold') },
    { icon: <Bomb size={16} className="text-purple-400" />, text: t('pro_exclusive_tools') },
    { icon: <Star size={16} className="text-sky-400" />, text: t('pro_badge') },
    { icon: <BarChart3 size={16} className="text-emerald-400" />, text: t('pro_detailed_stats') },
    { icon: <Gift size={16} className="text-rose-400" />, text: t('pro_2x_daily') },
  ];

  return (
    <div className="flex-1 flex flex-col gap-3">
      {/* Hata mesajı */}
      {purchaseError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 text-center animate-in fade-in duration-300">
          <span className="text-red-400 text-[9px] md:text-[10px] font-black uppercase tracking-wider">{purchaseError}</span>
          <button onClick={() => setPurchaseError(null)} className="ml-2 text-red-500 hover:text-white"><X size={12} /></button>
        </div>
      )}

      {/* Sekme Başlıkları */}
      <div className="flex bg-slate-950/50 rounded-xl p-1 border border-white/5 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === tab.id
              ? tab.id === 'pro'
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                : 'bg-white/10 text-white border border-white/10 shadow-lg'
              : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* İlk alım bonusu banner */}
      {activeTab === 'gold' && isFirstPurchase && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-2.5 animate-in slide-in-from-top fade-in duration-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 bg-amber-500/30 rounded-lg flex items-center justify-center shrink-0">
              <Gift size={16} className="text-amber-400" />
            </div>
            <div>
              <div className="text-amber-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">{t('first_purchase_bonus')}</div>
              <div className="text-amber-300/60 text-[7px] md:text-[8px] font-bold">{language === 'tr' ? 'İlk altın paketinde 2 katı altın kazan!' : 'Earn double gold on your first pack!'}</div>
            </div>
          </div>
        </div>
      )}

      {/* === ARAÇLAR SEKMESİ (Mevcut market aynen korundu) === */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-5 lg:grid-cols-3 gap-2 md:gap-4 pb-6 animate-in fade-in duration-300">
          {toolItems.map(item => {
            const isStripeProd = item.isStripe;
            const canAfford = isStripeProd ? true : coins >= item.cost;
            const isLoading = purchaseLoading === item.id;

            return (
              <div key={item.id} className={`relative overflow-hidden ${isStripeProd ? 'bg-rose-500/5 border-rose-500/20' : 'bg-slate-900/40 border-white/5'} border rounded-2xl md:rounded-3xl p-2 landscape:p-2.5 md:p-4 flex items-center landscape:flex-col lg:flex-row gap-2 md:gap-4 transition-all group hover:border-white/10 shadow-lg`}>
                {isStripeProd && (
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-[6px] md:text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl-lg z-10">
                    PREMIUM
                  </div>
                )}
                <div className="flex items-center gap-3 landscape:flex-col landscape:w-full">
                  <div className="relative shrink-0">
                    <div className={`w-8 h-8 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-slate-950/60 shadow-inner group-hover:scale-110 transition-transform border border-white/5`}>
                      {React.cloneElement(item.icon, { size: 16, className: item.icon.props.className.replace('size={20}', '') })}
                    </div>
                    {!isStripeProd && (
                      <div className="absolute -top-1 -right-1 min-w-[16px] h-[16px] md:min-w-[20px] md:h-[20px] bg-amber-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                        <span className="text-[8px] md:text-[10px] font-black text-slate-950 leading-none">{tools?.[item.id] || 0}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 landscape:w-full landscape:text-center">
                    <h4 className="text-white font-black italic uppercase text-[10px] md:text-sm mb-0.5 truncate">{item.name}</h4>
                    <p className="text-[8px] md:text-[10px] text-slate-400 leading-tight pr-1 font-medium line-clamp-1 md:line-clamp-none landscape:block lg:block">{item.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 landscape:w-full landscape:mt-1">
                  <button
                    onClick={() => isStripeProd ? handlePurchase(item.id, 'energy') : buyTool(item.id, item.cost)}
                    disabled={!canAfford || isLoading}
                    className={`flex flex-col items-center justify-center w-full min-w-[60px] md:min-w-[80px] py-1 md:py-1.5 px-2 md:px-3 rounded-lg md:rounded-xl transition-all active:scale-95 border-2 ${isLoading
                      ? 'bg-slate-800 border-transparent text-slate-500'
                      : canAfford
                        ? isStripeProd
                          ? 'bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20 text-rose-500 shadow-lg'
                          : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-500 shadow-lg'
                        : 'bg-slate-800/50 border-transparent text-slate-500 cursor-not-allowed opacity-50'}`}
                  >
                    <div className="flex items-center gap-1">
                      {isLoading ? (
                        <span className="font-black text-[9px] md:text-xs tracking-widest">...</span>
                      ) : isStripeProd ? (
                        <span className="font-black text-[9px] md:text-xs italic">{language === 'tr' ? `₺${item.priceTRY}` : `$${item.price}`}</span>
                      ) : (
                        <>
                          <span className="font-black text-[9px] md:text-xs italic">{item.cost}</span>
                          <Coins size={8} className="text-amber-500" />
                        </>
                      )}
                    </div>
                    <span className="text-[5px] md:text-[7px] uppercase font-black tracking-tighter opacity-70 group-hover:opacity-100">{isLoading ? t('processing') : t('buy')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === ALTIN PAKETLERİ SEKMESİ === */}
      {activeTab === 'gold' && (
        <div className="grid grid-cols-1 gap-2.5 md:gap-3 pb-6 animate-in fade-in duration-300">
          {goldPackages.map(pkg => {
            const displayCoins = isFirstPurchase ? pkg.coins * 2 : pkg.coins;
            const isLoading = purchaseLoading === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => handlePurchase(pkg.id, 'coins')}
                disabled={isLoading}
                className={`relative overflow-hidden rounded-2xl md:rounded-3xl border p-3 md:p-4 flex items-center gap-3 md:gap-4 transition-all active:scale-[0.98] group ${pkg.popular
                  ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 hover:border-amber-400/50 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/40 border-white/5 hover:border-white/15'
                  }`}
              >
                {/* Popüler badge */}
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[6px] md:text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">
                    {t('most_popular')}
                  </div>
                )}

                {/* Altın ikonu */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${pkg.popular ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-slate-800/60 border border-white/5'
                  } group-hover:scale-110 transition-transform`}>
                  <Coins size={24} className={`md:w-7 md:h-7 ${pkg.popular ? 'text-amber-400' : 'text-amber-500/70'}`} />
                </div>

                {/* Paket bilgileri */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black italic text-sm md:text-base tracking-tight">{displayCoins.toLocaleString()} 🪙</span>
                    {isFirstPurchase && (
                      <span className="text-[7px] md:text-[8px] font-black text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded-md uppercase">{t('first_purchase_label')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-500">{t(pkg.id)}</span>
                    {pkg.bonus && (
                      <span className="text-[8px] md:text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">{pkg.bonus}</span>
                    )}
                  </div>
                </div>

                {/* Fiyat butonu */}
                <div className={`shrink-0 px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-black text-xs md:text-sm tracking-tight transition-all border-2 ${isLoading
                  ? 'bg-slate-800 border-slate-700 text-slate-500'
                  : pkg.popular
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 group-hover:bg-amber-400'
                    : 'bg-white/5 border-white/10 text-white group-hover:bg-white/10'
                  }`}>
                  {isLoading ? '...' : language === 'tr' ? `₺${pkg.priceTRY}` : `$${pkg.price}`}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* === PRO ABONELIK SEKMESİ === */}
      {activeTab === 'pro' && (
        <div className="pb-6 space-y-3 md:space-y-4 animate-in fade-in duration-300">
          {/* PRO Başlık */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Star size={16} className="text-white" fill="white" />
              </div>
              <h3 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 italic tracking-tighter uppercase">{t('pro_title')}</h3>
            </div>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('pro_subtitle')}</p>
          </div>

          {/* Zaten PRO ise */}
          {isPro && (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
              <span className="text-amber-400 text-sm font-black italic uppercase tracking-wider">{t('already_pro')}</span>
            </div>
          )}

          {/* Avantajlar */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-3 md:p-4 space-y-2">
            {proFeatures.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                  {feat.icon}
                </div>
                <span className="text-[10px] md:text-xs font-bold text-slate-300">{feat.text}</span>
              </div>
            ))}
          </div>

          {/* Plan seçimi */}
          {!isPro && (
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {/* Aylık */}
              <button
                onClick={() => handlePurchase('pro_monthly', 'pro')}
                disabled={purchaseLoading === 'pro_monthly'}
                className="relative overflow-hidden bg-slate-900/60 border border-white/10 hover:border-amber-500/30 rounded-2xl p-3 md:p-4 flex flex-col items-center gap-2 transition-all active:scale-[0.98] group"
              >
                <div className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('pro_monthly')}</div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">{language === 'tr' ? '₺109.99' : '$2.99'}</span>
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-500">{t('per_month')}</span>
                </div>
                <div className={`w-full py-2 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-wider text-center transition-all border ${purchaseLoading === 'pro_monthly'
                  ? 'bg-slate-800 border-slate-700 text-slate-500'
                  : 'bg-white/5 border-white/10 text-white group-hover:bg-white/10'
                  }`}>
                  {purchaseLoading === 'pro_monthly' ? t('payment_processing') : t('subscribe')}
                </div>
              </button>

              {/* Yıllık */}
              <button
                onClick={() => handlePurchase('pro_yearly', 'pro')}
                disabled={purchaseLoading === 'pro_yearly'}
                className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 to-orange-500/5 border border-amber-500/30 hover:border-amber-400/50 rounded-2xl p-3 md:p-4 flex flex-col items-center gap-2 transition-all active:scale-[0.98] group shadow-lg shadow-amber-500/5"
              >
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[6px] md:text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">
                  {t('pro_save')} 44%
                </div>
                <div className="text-[8px] md:text-[9px] font-black text-amber-500 uppercase tracking-widest">{t('pro_yearly')}</div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">{language === 'tr' ? '₺749.99' : '$19.99'}</span>
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-500">{t('per_year')}</span>
                </div>
                <div className="text-[7px] md:text-[8px] font-bold text-emerald-400">≈ {language === 'tr' ? '₺62.50' : '$1.67'}{t('per_month')}</div>
                <div className={`w-full py-2 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-wider text-center transition-all border ${purchaseLoading === 'pro_yearly'
                  ? 'bg-slate-800 border-slate-700 text-slate-500'
                  : 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 group-hover:bg-amber-400'
                  }`}>
                  {purchaseLoading === 'pro_yearly' ? t('payment_processing') : `${t('subscribe')} ⭐`}
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ZenGarden = ({ gardenState }) => {
  if (!gardenState) return null;
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden z-0">
      {/* Ripples (Bottom area) */}
      {Array.from({ length: Math.min(15, gardenState.ripples || 0) }).map((_, i) => (
        <div
          key={`ripple-${i}`}
          className="absolute border-2 border-emerald-400/20 rounded-full animate-ping"
          style={{
            width: `${60 + (i % 3) * 40}px`,
            height: `${20 + (i % 3) * 10}px`,
            left: `${(i * 17) % 80 + 10}%`,
            bottom: `${(i * 11) % 40 + 5}%`,
            animationDuration: '4s'
          }}
        />
      ))}
      {/* Stones */}
      {Array.from({ length: Math.min(12, gardenState.stones || 0) }).map((_, i) => (
        <div
          key={`stone-${i}`}
          className="absolute bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl border border-white/10 shadow-lg"
          style={{
            width: `${25 + (i % 4) * 8}px`,
            height: `${15 + (i % 3) * 6}px`,
            left: `${(i * 23) % 85 + 5}%`,
            top: `${(i * 31) % 85 + 5}%`,
            transform: `rotate(${(i * 55) % 360}deg)`
          }}
        />
      ))}
      {/* Flowers/Sparkles */}
      {Array.from({ length: Math.min(10, gardenState.flowers || 0) }).map((_, i) => (
        <div
          key={`flower-${i}`}
          className="absolute text-pink-300/60 animate-pulse"
          style={{
            left: `${(i * 37) % 90 + 5}%`,
            top: `${(i * 13) % 90 + 5}%`,
            animationDelay: `${i * 0.4}s`
          }}
        >
          <Sparkles size={20 + (i % 3) * 8} />
        </div>
      ))}
    </div>
  );
};

const SplashScreen = ({ onComplete }) => {
  const [fallingLetters, setFallingLetters] = useState([]);
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    // Generate falling letters
    const letters = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
    const newLetters = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      char: letters[Math.floor(Math.random() * letters.length)],
      left: Math.random() * 100,
      duration: 5 + Math.random() * 8, // Faster falling
      delay: Math.random() * -5,
      size: 14 + Math.random() * 40
    }));
    setFallingLetters(newLetters);

    // Show logo after a short delay
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 500);

    // Complete splash screen
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500); // 3.5 seconds total

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950 flex shadow-2xl items-center justify-center overflow-hidden animate-in fade-in duration-500 fade-out delay-3000">
      {/* Falling Letters Background */}
      <div className="absolute inset-0 opacity-40">
        {fallingLetters.map((letter) => (
          <div
            key={letter.id}
            className="absolute font-black text-rose-500/20 select-none animate-fall mix-blend-screen"
            style={{
              left: `${letter.left}%`,
              fontSize: `${letter.size}px`,
              animationDuration: `${letter.duration}s`,
              animationDelay: `${letter.delay}s`,
            }}
          >
            {letter.char}
          </div>
        ))}
      </div>

      {/* Main Logo Container */}
      <div className={`relative z-10 transition-all duration-1000 ${logoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] bg-gradient-to-br from-orange-400 to-red-600 p-1 shadow-2xl shadow-rose-500/50 flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-50"></div>

          <img
            src="/logo.png"
            alt="Wordlenge Logo"
            className="w-full h-full object-cover rounded-[2.8rem] relative z-10"
            onError={(e) => {
              // Fallback if logo.png doesn't exist
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML += '<h1 class="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase z-10 relative">WORDLENGE</h1>';
            }}
          />
        </div>
      </div>
    </div>
  );
};

function App() {
  const {
    grid, selectedPath, animatingCells, score, moves, difficulty,
    foundWords, gameState, resetGame, swapSelection, tools, activeTool,
    setActiveTool, changeDifficulty, selectCell, finishTurn, shuffle,
    gameMode, currentLevelIndex, levelGoals, startTimeBattle,
    coins, buyTool, addCoins, addTool, createdSpecial,
    cloudLevels, isLoadingLevels,
    user, profile, isLoadingProfile, fetchProfile, completedLevels,
    language, setLanguage, t,
    isDictionaryLoaded,
    energy, nextEnergyIn, setEnergy, setLastEnergyRefill,
    totalScore, wordsFoundCount, gamesPlayed, highScore,
    arcadeSubMode, arcadeValue, timeLeft, totalMovesMade, zenDuration,
    gardenState, setGameState,
    celebration,
    timeBattleElapsed, timeBattleToolRewards, pendingToolReward,
    timeBattleInitialDuration, calculateTimeBattleGold, getTimeBattleRank, nextToolRewardAt,
    xp, level, masteryPoints, sessionXP, getNextLevelXp,
    activeEvents, isLoadingEvents, currentEventId,
    unlimitedEnergyUntil,
    isMobile,
    isTutorial, tutorialHint,
    dailyMissions, claimMissionReward, updateMissionProgress
  } = useGame();

  const isEnergyUnlimited = unlimitedEnergyUntil ? new Date(unlimitedEnergyUntil) > new Date() : false;
  const isPro = profile?.is_pro || false;

  const [isMuted, setIsMuted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [showDashboard, setShowDashboard] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'settings', 'profile', 'event'
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventTab, setEventTab] = useState('leaderboard'); // 'leaderboard' or 'rewards'

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const actuallyActiveEvents = (activeEvents || []).filter(e => e.isActive);
  const activeEvent = actuallyActiveEvents.length > 0
    ? (actuallyActiveEvents.find(e => e.id === selectedEventId) || actuallyActiveEvents[0])
    : (activeEvents && activeEvents.length > 0 ? activeEvents[0] : null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCurrentWord(selectedPath.map(p => p.letter).join(''));
  }, [selectedPath]);

  // Auto-play background on first interaction
  useEffect(() => {
    const startAudio = () => {
      soundManager.play('background');
      window.removeEventListener('pointerdown', startAudio);
    };
    window.addEventListener('pointerdown', startAudio);
    return () => window.removeEventListener('pointerdown', startAudio);
  }, []);

  // StatusBar yapılandırması — Çentik / SafeArea düzeltmesi
  useEffect(() => {
    const setupStatusBar = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#00000000' });
      } catch (e) {
        console.log('[StatusBar] Plugin not available:', e);
      }
    };
    setupStatusBar();
  }, []);

  // Deep Link dinleyicisi — Ödeme sonrası uygulamaya geri dönüş
  useEffect(() => {
    let cleanup = null;
    const setupDeepLinks = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;

        const { App: CapApp } = await import('@capacitor/app');
        const { PaymentService } = await import('./logic/PaymentService');

        const listener = await CapApp.addListener('appUrlOpen', async (event) => {
          console.log('[DeepLink] URL:', event.url);
          // In-App Browser'ı kapat
          await PaymentService.closeCheckout();

          const url = new URL(event.url);
          const status = url.searchParams.get('status');
          const product = url.searchParams.get('product');

          if (status === 'success') {
            console.log('[DeepLink] Ödeme başarılı, ürün:', product);
            // Profili yenile (altın, enerji vb. güncellensin)
            if (fetchProfile) await fetchProfile();
            // Başarı bildirimi (opsiyonel bir toast veya alert)
            setTimeout(() => {
              alert(language === 'tr'
                ? '✅ Ödemeniz başarıyla tamamlandı! Ödülleriniz hesabınıza yüklendi.'
                : '✅ Payment successful! Your rewards have been added.');
            }, 500);
          } else if (status === 'cancelled') {
            console.log('[DeepLink] Ödeme iptal edildi');
          }
        });
        cleanup = () => listener.remove();
      } catch (e) {
        console.log('[DeepLink] Not on native platform, skipping');
      }
    };
    setupDeepLinks();
    return () => { if (cleanup) cleanup(); };
  }, [fetchProfile, language]);



  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleShare = async () => {
    const isArcade = gameMode === 'arcade';
    const messageTemplate = isArcade ? t('share_msg_arcade') : t('share_msg_mission');
    const text = messageTemplate
      .replace('{score}', score.toString())
      .replace('{level}', (currentLevelIndex + 1).toString());

    const shareData = {
      title: 'Wordlenge',
      text: text,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${text} ${shareData.url}`);
        alert(t('language') === 'tr' ? 'Sonuç panoya kopyalandı!' : 'Result copied to clipboard!');
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const renderAppView = () => {
    switch (view) {
      case 'event':
        return (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border bg-amber-500/20 border-amber-400 text-amber-400">
                  <Trophy size={40} />
                </div>
                <h2 className="text-xl font-black text-white italic tracking-tighter mb-2 uppercase leading-tight">
                  {activeEvent?.title?.[language] || activeEvent?.title}
                </h2>
                <p className="text-slate-400 text-[11px] font-medium mb-4 leading-relaxed px-4">
                  {activeEvent?.description?.[language] || activeEvent?.description}
                </p>
                {/* Tabs Header */}
                <div className="flex items-center justify-center p-1 bg-white/5 rounded-2xl mb-4 mt-6 mx-4">
                  <button
                    onClick={() => setEventTab('leaderboard')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${eventTab === 'leaderboard' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {t('leaderboard')}
                  </button>
                  <button
                    onClick={() => setEventTab('rewards')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${eventTab === 'rewards' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {t('rewards') || (language === 'tr' ? 'ÖDÜLLER' : 'REWARDS')}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="px-1 min-h-[300px]">
                  {eventTab === 'leaderboard' ? (
                    <EventLeaderboard eventId={selectedEventId} t={t} profile={profile} />
                  ) : (
                    <EventRewards eventId={selectedEventId} t={t} language={language} />
                  )}
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  <button
                    onClick={() => {
                      if (energy <= 0) return;
                      setView('dashboard');
                      setShowDashboard(false);
                      // Etkinlikteki modları ve limitleri kontrol et
                      const allowedModes = activeEvent.allowed_modes || ['arcade'];
                      const hasMovesLimit = (parseInt(activeEvent.moves_limit) || 0) > 0;
                      const hasTimeLimit = (parseInt(activeEvent.duration_limit) || 0) > 0;

                      // Mod seçimi: Eğer sadece moves_limit varsa arcade tercih et, yoksa duration_limit varsa timeBattle/arcade-time tercih et
                      const eventMode = (hasMovesLimit && !hasTimeLimit)
                        ? (allowedModes.find(m => m === 'arcade') || allowedModes[0])
                        : (allowedModes[0] || 'arcade');

                      const isTimeBased = eventMode === 'timeBattle' ||
                        (eventMode === 'arcade' && hasTimeLimit);

                      const subMode = isTimeBased ? 'time' : 'moves';
                      const subValue = isTimeBased
                        ? (parseInt(activeEvent.duration_limit) || 60)
                        : (parseInt(activeEvent.moves_limit) || 30);

                      // Enerji tüketimi ve Etkinlik kaydı
                      if (isPro || isEnergyUnlimited || energy > 0) {
                        if (user) {
                          SupabaseService.updateEventScore(activeEvent.id, user.id, 0);
                        }

                        if (!isPro && !isEnergyUnlimited) {
                          setEnergy(e => e - 1);
                          if (energy === 5) setLastEnergyRefill(Date.now());
                        }
                      } else {
                        return; // Enerji yoksa başlatma
                      }

                      resetGame({}, eventMode, subMode, subValue, difficulty, activeEvent.id);
                    }}
                    disabled={energy <= 0}
                    className={`w-full py-5 font-black rounded-2xl transition-all active:scale-95 shadow-xl uppercase text-xs tracking-widest ${energy > 0 ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-amber-500/20' : 'bg-slate-800 text-slate-500 shadow-none cursor-not-allowed'}`}
                  >
                    {energy > 0 ? t('join_event') : (language === 'tr' ? 'ENERJİ YETERSİZ' : 'NOT ENOUGH ENERGY')}
                  </button>

                  <button
                    onClick={() => setView('dashboard')}
                    className="w-full py-4 text-slate-500 font-bold hover:text-white transition-colors text-[10px] uppercase tracking-widest"
                  >
                    {t('back')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#020617] text-slate-100 font-outfit select-none overflow-hidden flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
      {/* Splash Screen Animation */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Auth Modal stays as utility */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => setIsAuthModalOpen(false)}
        t={t}
      />

      {/* Dictionary Loader Overlay */}
      {!isDictionaryLoaded && <DictionaryLoader language={language} t={t} />}

      {/* Premium Animated Background Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/5 font-black select-none pointer-events-none animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 20}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 20}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
          </div>
        ))}
      </div>

      {console.log('--- APP MAIN RENDER ---', { showDashboard })}
      {showDashboard ? (
        <>
          <Dashboard
            levels={cloudLevels}
            isLoading={isLoadingLevels}
            currentLevel={completedLevels}
            completedLevels={completedLevels}
            coins={coins}
            tools={tools}
            buyTool={buyTool}
            user={user}
            profile={profile}
            fetchProfile={fetchProfile}
            language={language}
            setLanguage={setLanguage}
            t={t}
            isMuted={isMuted}
            toggleMute={toggleMute}
            difficulty={difficulty}
            changeDifficulty={changeDifficulty}
            dailyMissions={dailyMissions}
            claimMissionReward={claimMissionReward}
            updateMissionProgress={updateMissionProgress}
            addCoins={addCoins}
            addTool={addTool}
            soundManager={soundManager}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            energy={energy}
            isEnergyUnlimited={isEnergyUnlimited}
            nextEnergyIn={nextEnergyIn}
            onSelectArcade={(boosters, subMode, subValue) => {
              if (isPro || isEnergyUnlimited || energy > 0) {
                if (!isPro && !isEnergyUnlimited) {
                  setEnergy(prev => prev - 1);
                  if (energy === 5) setLastEnergyRefill(Date.now());
                }
                setShowDashboard(false);
                resetGame(boosters, 'arcade', subMode, subValue, difficulty);
              }
            }}
            onSelectTimeBattle={(duration, boosters) => {
              if (isPro || isEnergyUnlimited || energy > 0) {
                if (!isPro && !isEnergyUnlimited) {
                  setEnergy(prev => prev - 1);
                  if (energy === 5) setLastEnergyRefill(Date.now());
                }
                startTimeBattle(duration, boosters);
                setShowDashboard(false);
              }
            }}
            onSelectZen={() => {
              if (isPro || isEnergyUnlimited || energy > 0) {
                if (!isPro && !isEnergyUnlimited) {
                  setEnergy(prev => prev - 1);
                  if (energy === 5) setLastEnergyRefill(Date.now());
                }
                setShowDashboard(false);
                resetGame({}, 'zen', 'moves', 999, difficulty);
              }
            }}
            totalScore={totalScore}
            wordsFoundCount={wordsFoundCount}
            gamesPlayed={gamesPlayed}
            highScore={highScore}
            activeEvents={activeEvents}
            activeEvent={activeEvent}
            setSelectedEventId={setSelectedEventId}
            xp={xp}
            level={level}
            masteryPoints={masteryPoints}
            sessionXP={sessionXP}
            getNextLevelXp={getNextLevelXp}
            setView={setView}
            isPro={isPro}
            isMobile={isMobile}
          />
          {renderAppView()}
        </>
      ) : (
        <>
          {/* Header */}
          {/* Premium Dashboard Header (Sleek & Visual) */}
          <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/20 backdrop-blur-md shrink-0 gap-4 landscape:gap-3 md:gap-8 pt-[env(safe-area-inset-top)]">
            <div className="flex items-center gap-4 shrink-0">
              <div className="p-1.5 landscape:p-1 md:p-2 bg-gradient-to-br from-sky-500 to-purple-600 rounded-lg landscape:rounded-md md:rounded-xl shadow-lg shadow-sky-500/20">
                <LayoutGrid size={18} className="landscape:w-4 landscape:h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-[100px] landscape:min-w-[80px] md:min-w-[140px]">
                <h1 className="text-lg landscape:text-base md:text-2xl font-black tracking-tight bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent italic uppercase leading-none mb-0.5 landscape:mb-0 md:mb-1">
                  {gameMode === 'timeBattle' ? t('time_battle') : gameMode === 'zen' ? t('zen_mode') : t('arcade')}
                </h1>
                <p className="text-[9px] landscape:text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate font-inter">
                  {gameMode === 'timeBattle' ? t('time_battle_desc') : gameMode === 'zen' ? t('zen_desc') : t('arcade')}
                </p>
              </div>
            </div>

            {/* Word Display Area - Moved to Header */}
            <div className={`
              flex-1 hidden md:flex items-center justify-center px-8 py-3 rounded-2xl backdrop-blur-3xl border-2 transition-all duration-500 max-w-xl mx-auto
              ${currentWord.length >= 3
                ? 'bg-sky-500/10 border-sky-400/50 shadow-[0_0_30px_rgba(56,189,248,0.05)]'
                : 'bg-slate-900/40 border-white/5'
              }
            `}>
              <span className={`
                text-2xl font-black tracking-[0.4em] transition-all
                ${currentWord.length >= 3 ? 'text-white drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'text-slate-800'}
              `}>
                {currentWord || '..........'}
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              {gameMode === 'zen' && (
                <button
                  onClick={() => setGameState('gameover')}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-emerald-500 text-white font-black text-[10px] md:text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all uppercase tracking-widest"
                >
                  {t('enough_button')}
                </button>
              )}
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-400 hover:text-white"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <button
                onClick={() => setShowDashboard(true)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-400 hover:text-white"
              >
                <Home size={20} />
              </button>

              <button
                onClick={() => resetGame({}, null, arcadeSubMode, arcadeValue)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-400 hover:text-white"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </header>

          {/* Mobile Gameplay Stats Bar */}
          <div className="md:hidden flex items-center justify-center gap-3 landscape:gap-2 px-3 landscape:px-2 py-1.5 landscape:py-1 border-b border-white/5 bg-slate-950/30 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('score')}:</span>
              <span className="text-xs landscape:text-[10px] md:text-sm font-black text-sky-400 tabular-nums">{score}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              {currentEventId ? (
                <>
                  {timeLeft > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('time_left')}:</span>
                      <span className={`text-xs landscape:text-[10px] md:text-sm font-black tabular-nums ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
                        {timeLeft}s
                      </span>
                    </div>
                  )}
                  {timeLeft > 0 && moves !== 999 && <div className="w-px h-3 bg-white/10" />}
                  {moves !== 999 && (
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('moves')}:</span>
                      <span className="text-xs landscape:text-[10px] md:text-sm font-black text-amber-400 tabular-nums">{moves}</span>
                    </div>
                  )}
                </>
              ) : gameMode === 'arcade' && arcadeSubMode === 'time' ? (
                <>
                  <span className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('time_left')}:</span>
                  <span className={`text-xs landscape:text-[10px] md:text-sm font-black tabular-nums ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
                    {timeLeft}s
                  </span>
                </>
              ) : gameMode === 'timeBattle' ? (
                <>
                  <span className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('time_left')}:</span>
                  <span className={`text-xs landscape:text-[10px] md:text-sm font-black tabular-nums ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-rose-400'}`}>
                    {timeLeft}s
                  </span>
                  <div className="w-px h-3 bg-white/10" />
                  <span className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('time_battle_survived')}:</span>
                  <span className="text-xs landscape:text-[10px] md:text-sm font-black text-amber-400 tabular-nums">
                    {Math.floor(timeBattleElapsed / 60)}:{String(timeBattleElapsed % 60).padStart(2, '0')}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('moves')}:</span>
                  <span className="text-xs landscape:text-[10px] md:text-sm font-black text-amber-400 tabular-nums">{moves}</span>
                </>
              )}
            </div>
          </div>

          {/* Mobile Time Battle Next Reward (replaces mission goals) */}
          {gameMode === 'timeBattle' && (
            <div className="md:hidden bg-rose-500/5 backdrop-blur-md px-4 py-1.5 flex items-center justify-center gap-3 border-b border-rose-500/10">
              <Clock size={12} className="text-rose-400" />
              <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">
                {t('time_battle_next_reward')}: {Math.max(0, nextToolRewardAt - timeBattleElapsed)}s
              </span>
            </div>
          )}

          <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 min-h-0 overflow-hidden relative z-10">
            {/* Left Side: Goals & Stats */}
            <aside className="w-56 flex flex-col gap-3 shrink-0 overflow-y-auto no-scrollbar hidden md:flex">
              <div className="bg-slate-900/40 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl space-y-3 shrink-0">
                {gameMode === 'timeBattle' && (
                  <div className="mb-3 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                    <div className="text-[8px] text-rose-400 uppercase tracking-widest font-black mb-1">{t('time_battle_next_reward')}</div>
                    <div className="text-sm font-black text-white tabular-nums">{Math.max(0, nextToolRewardAt - timeBattleElapsed)}s</div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{t('score')}</div>
                    <div className="text-xl font-black text-sky-400 tabular-nums">{score}</div>
                  </div>
                  <div className={`bg-slate-950/60 p-3 rounded-2xl border border-white/5 relative overflow-hidden group ${currentEventId && timeLeft > 0 && moves !== 999 ? 'flex flex-col gap-2' : ''}`}>
                    {currentEventId ? (
                      <>
                        {timeLeft > 0 && (
                          <div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{t('time_left')}</div>
                            <div className={`text-xl font-black tabular-nums ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
                              {timeLeft}s
                            </div>
                          </div>
                        )}
                        {moves !== 999 && (
                          <div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{t('moves')}</div>
                            <div className="text-xl font-black text-amber-400 tabular-nums">{moves}</div>
                          </div>
                        )}
                      </>
                    ) : gameMode === 'arcade' && arcadeSubMode === 'time' ? (
                      <>
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{t('time_left')}</div>
                        <div className={`text-xl font-black tabular-nums ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
                          {timeLeft}s
                        </div>
                      </>
                    ) : gameMode === 'timeBattle' ? (
                      <>
                        <div className="text-[8px] text-rose-400 uppercase tracking-widest font-black mb-0.5">{t('time_left')}</div>
                        <div className={`text-xl font-black tabular-nums ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-rose-400'}`}>
                          {timeLeft}s
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{t('moves')}</div>
                        <div className="text-xl font-black text-amber-400 tabular-nums">{moves}</div>
                      </>
                    )}
                  </div>
                  {gameMode === 'timeBattle' && (
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 relative overflow-hidden group col-span-2">
                      <div className="text-[8px] text-rose-400 uppercase tracking-widest font-black mb-0.5">{t('time_battle_survived')}</div>
                      <div className="text-xl font-black text-amber-400 tabular-nums">
                        {Math.floor(timeBattleElapsed / 60)}:{String(timeBattleElapsed % 60).padStart(2, '0')}
                      </div>
                    </div>
                  )}
                  {gameMode === 'arcade' && arcadeSubMode === 'time' && (
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 relative overflow-hidden group col-span-2">
                      <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">{t('total_moves')}</div>
                      <div className="text-xl font-black text-indigo-400 tabular-nums">{totalMovesMade}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 bg-slate-900/40 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl flex flex-col min-h-0">
                <>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 shrink-0">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('words')} <span className="text-sky-400 ml-1">({foundWords.length})</span></h2>
                    <AlignLeft className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-2">
                    {foundWords.map((word, idx) => (
                      <div key={idx} className="px-2 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-300 border border-white/5 truncate">
                        {word}
                      </div>
                    ))}
                  </div>
                </>
              </div>
            </aside>

            {/* Center: Grid Area */}
            <div className="flex-1 flex flex-col gap-2 md:gap-3 min-w-0 h-full">
              <div className="md:hidden flex flex-col gap-2 items-center w-full overflow-hidden">
                {/* Word Display Area - Mobile visible only */}
                <div className={`
                  flex items-center justify-center px-4 py-2 rounded-2xl backdrop-blur-3xl border-2 transition-all duration-500
                  ${currentWord.length >= 3 ? 'bg-sky-500/10 border-sky-400/50 scale-105 shadow-lg shadow-sky-500/10' : 'bg-slate-900/40 border-white/5'}
                `}>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-base landscape:text-sm font-black tracking-[0.3em] ${currentWord.length >= 3 ? 'text-white' : 'text-slate-500'}`}>
                        {currentWord || '..........'}
                      </span>
                      {foundWords.length > 0 && (
                        <div className="bg-sky-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[20px] shadow-lg shadow-sky-500/20">
                          {foundWords.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Found Words Horizontal Scroll - Mobile only */}
                {foundWords.length > 0 && (
                  <div className="w-full relative px-4 flex justify-center">
                    <div className="w-full max-w-full overflow-x-auto no-scrollbar flex items-center gap-2 py-1 scroll-smooth touch-pan-x active:cursor-grabbing" style={{ WebkitOverflowScrolling: 'touch' }}>
                      {foundWords.slice().reverse().map((word, idx) => (
                        <div key={idx} className="shrink-0 px-3 py-1 bg-slate-900/60 border border-white/10 rounded-full text-[9px] font-bold text-slate-300 shadow-sm whitespace-nowrap">
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 flex items-center justify-center min-h-0 relative">
                <div className={`
                  relative max-h-full w-full bg-slate-950/40 rounded-xl md:rounded-3xl border-2 shadow-2xl overflow-hidden transition-all duration-300
                  ${activeTool ? 'border-purple-500 ring-[8px] ring-purple-500/10' : 'border-white/5'}
                `}
                  style={{ aspectRatio: `${grid[0]?.length || 11} / ${grid?.length || 9}`, maxWidth: `min(100%, ${78 * (grid[0]?.length || 11) / (grid?.length || 9)}vh)` }}
                >
                  {gameMode === 'zen' && <ZenGarden gardenState={gardenState} />}
                  <PremiumCanvas
                    grid={grid}
                    selectedPath={selectedPath}
                    animatingCells={animatingCells}
                    swapSelection={swapSelection}
                    createdSpecial={createdSpecial}
                    onSelectCell={selectCell}
                    onFinishTurn={finishTurn}
                    gameMode={gameMode}
                    isTutorial={isTutorial}
                    tutorialHint={tutorialHint}
                  />

                  {/* Victory Overlay (Only for Victory) */}
                  {gameState === 'victory' && (() => {
                    let rewardItems = [];
                    let victoryTitle = t('victory');
                    let victorySubtitle = t('mission_success');

                    if (currentEventId) {
                      victoryTitle = t('event_completed') || 'ETKİNLİK TAMAMLANDI';
                      victorySubtitle = t('target_reached') || 'HEDEF PUANA ULAŞILDI';
                      rewardItems.push({ type: 'score', amount: score, icon: Trophy, color: 'from-amber-500/20 to-orange-500/20', borderColor: 'border-amber-500/40', textColor: 'text-amber-400' });
                    } else {
                      const levelRewards = cloudLevels?.[currentLevelIndex]?.rewards;
                      if (levelRewards?.coins) {
                        rewardItems.push({ type: 'coins', amount: levelRewards.coins, icon: Coins, color: 'from-amber-500/20 to-orange-500/20', borderColor: 'border-amber-500/40', textColor: 'text-amber-400' });
                      }
                      if (levelRewards?.tools) {
                        const toolMeta = { bomb: { icon: Zap, color: 'from-rose-500/20 to-pink-500/20', borderColor: 'border-rose-500/40', textColor: 'text-rose-400' }, swap: { icon: RefreshCw, color: 'from-sky-500/20 to-blue-500/20', borderColor: 'border-sky-500/40', textColor: 'text-sky-400' }, row: { icon: MoveHorizontal, color: 'from-emerald-500/20 to-teal-500/20', borderColor: 'border-emerald-500/40', textColor: 'text-emerald-400' }, col: { icon: MoveVertical, color: 'from-green-500/20 to-emerald-500/20', borderColor: 'border-green-500/40', textColor: 'text-green-400' }, cell: { icon: Target, color: 'from-purple-500/20 to-violet-500/20', borderColor: 'border-purple-500/40', textColor: 'text-purple-400' } };
                        Object.entries(levelRewards.tools).forEach(([id, amt]) => {
                          const meta = toolMeta[id] || toolMeta.bomb;
                          rewardItems.push({ type: 'tool', id, amount: amt, icon: meta.icon, color: meta.color, borderColor: meta.borderColor, textColor: meta.textColor });
                        });
                      }
                    }

                    // Add XP Reward (v8.0.0)
                    if (sessionXP > 0) {
                      rewardItems.push({ type: 'xp', amount: sessionXP + (gameMode === 'arcade' ? 100 : gameMode === 'timeBattle' ? 200 : 50), icon: Star, color: 'from-sky-500/20 to-indigo-500/20', borderColor: 'border-sky-500/40', textColor: 'text-sky-400' });
                    }

                    return (
                      <div className="absolute inset-0 z-[300] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 landscape:p-3 md:p-8 text-center animate-in fade-in slide-in-from-top-8 duration-700">
                        <div className="max-w-xs w-full">
                          <div className="w-14 h-14 landscape:w-12 landscape:h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 landscape:mb-2 md:mb-6 border bg-green-500/20 border-green-400 text-green-400">
                            <Award size={28} className="landscape:w-6 landscape:h-6 md:w-10 md:h-10" />
                          </div>
                          <h2 className="text-2xl landscape:text-xl md:text-4xl font-black text-white italic tracking-tighter mb-1 landscape:mb-0.5 md:mb-2 uppercase">{victoryTitle}</h2>
                          <p className="text-emerald-500 text-[9px] landscape:text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-3 landscape:mb-1.5 md:mb-4 italic">{victorySubtitle}</p>

                          {/* Reward Animations */}
                          {rewardItems.length > 0 && (
                            <div className="flex flex-col gap-2 landscape:gap-1.5 md:gap-2.5 mb-4 landscape:mb-2 md:mb-6">
                              {rewardItems.map((reward, idx) => {
                                const IconComponent = reward.icon;
                                return (
                                  <div
                                    key={idx}
                                    className={`reward-pop-in flex items-center gap-3 landscape:gap-2 bg-gradient-to-r ${reward.color} border ${reward.borderColor} rounded-xl landscape:rounded-lg md:rounded-2xl px-4 landscape:px-3 py-3 landscape:py-2 md:px-5 md:py-3.5 shadow-lg`}
                                    style={{ animationDelay: `${0.3 + idx * 0.25}s` }}
                                  >
                                    <div className="w-9 h-9 landscape:w-7 landscape:h-7 md:w-10 md:h-10 rounded-lg landscape:rounded-md md:rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center shrink-0 reward-icon-pulse">
                                      <IconComponent size={18} className={reward.textColor} />
                                    </div>
                                    <div className="flex-1 text-left">
                                      <span className={`text-sm landscape:text-xs md:text-base font-black ${reward.textColor}`}>
                                        +{reward.amount} {reward.type === 'coins' ? t('gold') : reward.type === 'score' ? (t('score') || 'Puan') : reward.type === 'xp' ? 'XP' : t(reward.id)}
                                      </span>
                                    </div>
                                    <Sparkles size={14} className={`${reward.textColor} animate-pulse opacity-60`} />
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Oyun İstatistikleri */}
                          <div className="grid grid-cols-3 gap-2 landscape:gap-1.5 mb-4 landscape:mb-2">
                            <div className="bg-slate-800/50 p-2.5 landscape:p-1.5 rounded-xl landscape:rounded-lg border border-white/5">
                              <div className="text-[8px] landscape:text-[7px] text-slate-500 font-black uppercase mb-0.5">{t('score')}</div>
                              <div className="text-base landscape:text-sm font-black text-white tabular-nums">{score}</div>
                            </div>
                            <div className="bg-slate-800/50 p-2.5 landscape:p-1.5 rounded-xl landscape:rounded-lg border border-white/5">
                              <div className="text-[8px] landscape:text-[7px] text-slate-500 font-black uppercase mb-0.5">{t('moves')}</div>
                              <div className="text-base landscape:text-sm font-black text-white tabular-nums">{totalMovesMade}</div>
                            </div>
                            <div className="bg-slate-800/50 p-2.5 landscape:p-1.5 rounded-xl landscape:rounded-lg border border-white/5">
                              <div className="text-[8px] landscape:text-[7px] text-slate-500 font-black uppercase mb-0.5">{t('words_found')}</div>
                              <div className="text-base landscape:text-sm font-black text-emerald-400 tabular-nums">{wordsFoundCount}</div>
                            </div>
                          </div>

                          <button onClick={() => {
                            setShowDashboard(true);
                          }} className="w-full py-3 landscape:py-2 md:py-4 bg-emerald-500 text-white font-black rounded-xl landscape:rounded-lg md:rounded-2xl mb-2 landscape:mb-1 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 text-sm landscape:text-xs md:text-base">{t('continue')}</button>
                          <button onClick={() => setShowDashboard(true)} className="w-full py-3 landscape:py-2 md:py-4 bg-white/5 text-slate-400 font-black rounded-xl landscape:rounded-lg md:rounded-2xl hover:bg-white/10 transition-all text-sm landscape:text-xs md:text-base">{t('main_menu')}</button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Bottom Tools (Mobile Only) */}
              <div className="md:hidden flex gap-1.5 landscape:gap-1 overflow-x-auto no-scrollbar pb-1.5 landscape:pb-1 pt-1.5 landscape:pt-1 shrink-0">
                <button onClick={shuffle} className="shrink-0 w-12 h-12 landscape:w-10 landscape:h-10 bg-slate-900 rounded-xl landscape:rounded-lg border border-white/5 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 landscape:w-4 landscape:h-4 text-amber-400" />
                </button>
                {['cell', 'bomb', 'row', 'col', 'swap'].map(id => {
                  const Icon = id === 'bomb' ? Zap : id === 'row' ? MoveHorizontal : id === 'col' ? MoveVertical : id === 'swap' ? RefreshCw : Target;
                  const colorClass = id === 'bomb' ? 'text-amber-400' : id === 'row' ? 'text-rose-400' : id === 'col' ? 'text-emerald-400' : id === 'swap' ? 'text-sky-400' : 'text-purple-400';

                  return (
                    <button key={id} disabled={tools[id] === 0} onClick={() => setActiveTool(activeTool === id ? null : id)} className={`shrink-0 w-12 h-12 landscape:w-10 landscape:h-10 rounded-xl landscape:rounded-lg border flex items-center justify-center relative ${activeTool === id ? 'bg-amber-400/10 border-amber-400' : 'bg-slate-900 border-white/5'}`}>
                      <span className={colorClass}>
                        <Icon className="w-5 h-5 landscape:w-4 landscape:h-4" />
                      </span>
                      {tools[id] > 0 && <span className="absolute -top-1 -right-1 landscape:-top-0.5 landscape:-right-0.5 bg-white text-slate-950 text-[9px] landscape:text-[8px] font-black w-4 h-4 landscape:w-3.5 landscape:h-3.5 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-lg">{tools[id]}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Tools (Desktop) */}
            <aside className="w-20 shrink-0 flex flex-col gap-2 py-1 hidden md:flex items-center">
              <button onClick={shuffle} className="p-3 bg-slate-950 rounded-xl border border-white/5 text-amber-400 hover:bg-slate-900 transition-all">
                <RefreshCw size={20} />
              </button>
              {['cell', 'bomb', 'row', 'col', 'swap'].map(id => {
                const Icon = id === 'bomb' ? Zap : id === 'row' ? MoveHorizontal : id === 'col' ? MoveVertical : id === 'swap' ? RefreshCw : Target;
                const colorClass = id === 'bomb' ? 'text-amber-400' : id === 'row' ? 'text-rose-400' : id === 'col' ? 'text-emerald-400' : id === 'swap' ? 'text-sky-400' : 'text-purple-400';

                return (
                  <button
                    key={id}
                    onClick={() => setActiveTool(activeTool === id ? null : id)}
                    className={`w-14 h-14 rounded-xl border flex items-center justify-center relative transition-all ${activeTool === id ? 'bg-amber-400/10 border-amber-400' : 'bg-slate-950 border-white/5'}`}
                  >
                    <span className={colorClass}><Icon size={20} /></span>
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-slate-950 text-[10px] font-black w-5 h-5 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-lg">{tools[id]}</span>
                  </button>
                );
              })}
            </aside>
          </main>

          {/* Game Over Modal (Failures for ARCADE/MISSION or Analysis for ZEN) */}
          {
            gameState === 'gameover' && (
              <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 landscape:p-3 md:p-6 bg-slate-950/90 backdrop-blur-xl">
                <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl landscape:rounded-xl md:rounded-[2.5rem] p-5 landscape:p-3 md:p-8 text-center animate-in fade-in slide-in-from-top-8 duration-700">
                  {gameMode === 'zen' ? (
                    <>
                      <Sparkles className="w-12 h-12 landscape:w-10 landscape:h-10 md:w-16 md:h-16 text-emerald-400 mx-auto mb-3 landscape:mb-2 md:mb-4" />
                      <h2 className="text-2xl landscape:text-xl md:text-3xl font-black text-white italic tracking-tighter mb-1 landscape:mb-0.5 md:mb-2 uppercase">{t('zen_analysis')}</h2>
                      <p className="text-slate-500 text-[9px] landscape:text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-4 landscape:mb-2 md:mb-6 italic">{t('zen_finished_desc')}</p>

                      <div className="grid grid-cols-2 gap-2 landscape:gap-1.5 md:gap-3 mb-4 landscape:mb-2 md:mb-8">
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-white/5 shadow-inner">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-slate-500 font-black uppercase mb-0.5">{t('session_duration')}</div>
                          <div className="text-lg landscape:text-base md:text-xl font-black text-white tabular-nums">
                            {Math.floor(zenDuration / 60)}:{String(zenDuration % 60).padStart(2, '0')}
                          </div>
                        </div>
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-white/5 shadow-inner">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-slate-500 font-black uppercase mb-0.5">{t('session_moves')}</div>
                          <div className="text-lg landscape:text-base md:text-xl font-black text-white tabular-nums">{totalMovesMade}</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-white/5 shadow-inner col-span-2">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-slate-500 font-black uppercase mb-0.5">{t('words_found')}</div>
                          <div className="text-lg landscape:text-base md:text-xl font-black text-emerald-400 tabular-nums">{wordsFoundCount}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isPro || isEnergyUnlimited || energy > 0) {
                            if (!isPro && !isEnergyUnlimited) {
                              setEnergy(prev => prev - 1);
                              if (energy === 5) setLastEnergyRefill(Date.now());
                            }
                            resetGame({}, 'zen');
                          } else {
                            alert(language === 'tr' ? 'Yetersiz Enerji!' : 'Not Enough Energy!');
                            setShowDashboard(true);
                          }
                        }}
                        className="w-full py-3 landscape:py-2 md:py-5 bg-emerald-500 text-white font-black rounded-xl landscape:rounded-lg md:rounded-2xl shadow-xl mb-2 landscape:mb-1 md:mb-3 uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-[0.98] text-sm landscape:text-xs md:text-base"
                      >
                        {t('new_session')}
                      </button>
                      <button onClick={() => setShowDashboard(true)} className="w-full py-3 landscape:py-2 md:py-4 bg-white/5 text-slate-400 font-black rounded-xl landscape:rounded-lg md:rounded-2xl hover:bg-white/10 transition-all underline decoration-emerald-500/30 underline-offset-4 text-sm landscape:text-xs md:text-base">{t('back_to_menu')}</button>
                    </>
                  ) : gameMode === 'timeBattle' ? (
                    <>
                      <div className="w-14 h-14 landscape:w-12 landscape:h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 landscape:mb-2 md:mb-6 border bg-rose-500/20 border-rose-400 text-rose-400">
                        <Clock size={28} className="landscape:w-6 landscape:h-6 md:w-10 md:h-10" />
                      </div>
                      <h2 className="text-2xl landscape:text-xl md:text-3xl font-black text-white italic tracking-tighter mb-1 landscape:mb-0.5 md:mb-2 uppercase">
                        {t('time_battle_result_title')}
                      </h2>
                      <p className="text-rose-400 text-[9px] landscape:text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-4 landscape:mb-2 md:mb-6 italic">
                        {t('time_battle_result_subtitle')}
                      </p>

                      <div className="grid grid-cols-2 gap-2 landscape:gap-1.5 md:gap-4 mb-4 landscape:mb-2 md:mb-8">
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-rose-500/20">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-rose-400 font-black uppercase mb-0.5">{t('time_battle_survived')}</div>
                          <div className="text-xl landscape:text-lg md:text-2xl font-black text-white italic tabular-nums">
                            {Math.floor(timeBattleElapsed / 60)}:{String(timeBattleElapsed % 60).padStart(2, '0')}
                          </div>
                        </div>
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-amber-500/20">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-amber-400 font-black uppercase mb-0.5">{t('time_battle_gold_earned')}</div>
                          <div className="text-xl landscape:text-lg md:text-2xl font-black text-amber-400 italic tabular-nums">+{calculateTimeBattleGold(timeBattleElapsed)}</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-white/5">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-slate-500 font-black uppercase mb-0.5">{t('score')}</div>
                          <div className="text-xl landscape:text-lg md:text-2xl font-black text-white italic tabular-nums">{score}</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-white/5">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-slate-500 font-black uppercase mb-0.5">{t('words_found')}</div>
                          <div className="text-xl landscape:text-lg md:text-2xl font-black text-white italic tabular-nums">{wordsFoundCount}</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-sky-500/20 col-span-2">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-sky-400 font-black uppercase mb-0.5">Kazanılan Tecrübe</div>
                          <div className="text-xl landscape:text-lg md:text-2xl font-black text-sky-400 italic tabular-nums">+{sessionXP + 200} XP</div>
                        </div>
                      </div>

                      {/* Rank display */}
                      {(() => {
                        const rank = getTimeBattleRank(timeBattleElapsed);
                        const rankColors = { bronze: 'text-orange-400', silver: 'text-slate-300', gold: 'text-amber-400' };
                        return (
                          <div className="mb-4 landscape:mb-2 md:mb-6 text-center">
                            <div className="text-[8px] landscape:text-[7px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{t('time_battle_rank')}</div>
                            <div className={`text-lg landscape:text-base md:text-2xl font-black italic uppercase ${rankColors[rank?.id] || 'text-white'}`}>
                              {rank ? t(`time_battle_rank_${rank.id}`) : '—'}
                            </div>
                          </div>
                        );
                      })()}

                      <button onClick={() => setShowDashboard(true)} className="w-full py-3 landscape:py-2 md:py-5 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl landscape:rounded-lg md:rounded-2xl shadow-xl mb-2 landscape:mb-1 md:mb-3 text-sm landscape:text-xs md:text-base shadow-rose-500/20">{t('main_menu')}</button>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 landscape:w-12 landscape:h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 landscape:mb-2 md:mb-6 border bg-sky-500/20 border-sky-400 text-sky-400">
                        <Trophy size={28} className="landscape:w-6 landscape:h-6 md:w-10 md:h-10" />
                      </div>
                      <h2 className="text-2xl landscape:text-xl md:text-3xl font-black text-white italic tracking-tighter mb-1 landscape:mb-0.5 md:mb-2 uppercase">
                        {t('game_over')}
                      </h2>
                      <p className="text-sky-500 text-[9px] landscape:text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-4 landscape:mb-2 md:mb-6 italic">
                        {timeLeft <= 0 ? (t('time_up') || 'SÜRE DOLDU') : t('moves_exhausted')}
                      </p>

                      <div className="grid grid-cols-2 gap-2 landscape:gap-1.5 md:gap-4 mb-4 landscape:mb-2 md:mb-8">
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-white/5">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-slate-500 font-black uppercase mb-0.5">{t('score')}</div>
                          <div className="text-xl landscape:text-lg md:text-2xl font-black text-white italic tabular-nums">{score}</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-white/5">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-slate-500 font-black uppercase mb-0.5">{t('moves')}</div>
                          <div className="text-xl landscape:text-lg md:text-2xl font-black text-white tabular-nums">{totalMovesMade}</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-white/5">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-slate-500 font-black uppercase mb-0.5">{t('words_found')}</div>
                          <div className="text-xl landscape:text-lg md:text-2xl font-black text-emerald-400 italic tabular-nums">{wordsFoundCount}</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 landscape:p-2 md:p-4 rounded-xl landscape:rounded-lg md:rounded-2xl border border-sky-500/20">
                          <div className="text-[9px] landscape:text-[8px] md:text-[10px] text-sky-400 font-black uppercase mb-0.5">{language === 'tr' ? 'Tecrübe' : 'XP'}</div>
                          <div className="text-xl landscape:text-lg md:text-2xl font-black text-sky-400 italic tabular-nums">+{sessionXP + 100} XP</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isPro || isEnergyUnlimited || energy > 0) {
                            if (!isPro && !isEnergyUnlimited) {
                              setEnergy(prev => prev - 1);
                              if (energy === 5) setLastEnergyRefill(Date.now());
                            }
                            resetGame({}, null, arcadeSubMode, arcadeValue);
                          } else {
                            // Enerji bittiyse Dashboard'a dön ve marketi aç veya uyarı ver
                            alert(language === 'tr' ? 'Yetersiz Enerji!' : 'Not Enough Energy!');
                            setShowDashboard(true);
                          }
                        }}
                        className="w-full py-3 landscape:py-2 md:py-5 text-white font-black rounded-xl landscape:rounded-lg md:rounded-2xl shadow-xl mb-2 landscape:mb-1 md:mb-3 text-sm landscape:text-xs md:text-base bg-sky-500 hover:bg-sky-400 shadow-sky-500/20"
                      >
                        {t('try_again')}
                      </button>
                      <button onClick={() => setShowDashboard(true)} className="w-full py-3 landscape:py-2 md:py-4 bg-white/5 text-slate-400 font-black rounded-xl landscape:rounded-lg md:rounded-2xl hover:bg-white/10 transition-all underline underline-offset-4 decoration-white/10 text-sm landscape:text-xs md:text-base">{t('back_to_menu')}</button>
                    </>
                  )}
                </div>
              </div>
            )
          }
        </>
      )
      }

      {/* Word Celebration Overlay */}
      {
        celebration && (() => {
          const config = {
            1: { key: 'cheer_4', color: 'from-sky-400 to-cyan-300', glow: 'shadow-sky-500/40', shake: '', sparkles: 3, size: 'text-5xl md:text-8xl' },
            2: { key: 'cheer_5', color: 'from-purple-400 to-fuchsia-400', glow: 'shadow-purple-500/40', shake: 'celebration-shake-sm', sparkles: 5, size: 'text-6xl md:text-9xl' },
            3: { key: 'cheer_6', color: 'from-amber-400 to-yellow-300', glow: 'shadow-amber-500/50', shake: 'celebration-shake', sparkles: 8, size: 'text-7xl md:text-[10rem]' },
            4: { key: 'cheer_7', color: 'from-orange-400 to-red-400', glow: 'shadow-orange-500/50', shake: 'celebration-shake', sparkles: 12, size: 'text-7xl md:text-[10rem]' },
            5: { key: 'cheer_8', sub: 'cheer_8_sub', color: 'from-rose-400 via-amber-400 to-emerald-400', glow: 'shadow-rose-500/60', shake: 'celebration-shake-lg', sparkles: 18, size: 'text-8xl md:text-[12rem]' },
          };
          const c = config[celebration.level] || config[1];
          return (
            <div className="fixed inset-0 z-[400] flex items-center justify-center pointer-events-none">
              {/* Sparkle particles */}
              {Array.from({ length: c.sparkles }).map((_, i) => (
                <div
                  key={i}
                  className="absolute celebration-sparkle"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${0.6 + Math.random() * 0.8}s`
                  }}
                >
                  <Sparkles size={16 + Math.random() * 24} className={`bg-gradient-to-r ${c.color} text-white opacity-80`} />
                </div>
              ))}
              {/* Main text */}
              <div className={`celebration-text ${c.shake} text-center px-6`}>
                <h2 className={`${c.size} font-black italic uppercase tracking-tight drop-shadow-2xl`}
                  style={{
                    color: 'white',
                    WebkitTextStroke: '3px rgba(255,255,255,0.9)',
                    textShadow: `0 0 40px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.6), 0 0 120px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.3), 0 6px 30px rgba(0,0,0,0.8)`,
                    paintOrder: 'stroke fill'
                  }}
                >
                  {t(c.key)}
                </h2>
                {c.sub && (
                  <p className="text-2xl md:text-5xl font-black italic text-white/90 mt-2 tracking-wider uppercase celebration-sub-text"
                    style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.6)', textShadow: '0 0 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.3)' }}
                  >
                    {t(c.sub)}
                  </p>
                )}
              </div>
            </div>
          );
        })()
      }

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { -webkit-tap-highlight-color: transparent; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes animate-fall {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: animate-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes reward-pop-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.8); }
          60% { transform: translateY(-4px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .reward-pop-in {
          opacity: 0;
          animation: reward-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes reward-icon-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.1); }
          50% { transform: scale(1.15); box-shadow: 0 0 12px 2px rgba(255,255,255,0.15); }
        }
        .reward-icon-pulse {
          animation: reward-icon-pulse 1.8s ease-in-out infinite;
          animation-delay: 0.8s;
        }
        @keyframes celebration-slide-in {
          0% { opacity: 0; transform: translateX(120vw) scale(0.8); }
          60% { opacity: 1; transform: translateX(-10px) scale(1.02); }
          80% { transform: translateX(5px) scale(0.98); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes celebration-exit {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.5); }
        }
        .celebration-text {
          animation: celebration-slide-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards,
                     celebration-exit 0.5s ease-out 1.0s forwards;
        }
        .celebration-sub-text {
          animation: celebration-slide-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
        }
        @keyframes celebration-shake-sm {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-3px) rotate(-0.5deg); }
          30% { transform: translateX(3px) rotate(0.5deg); }
          45% { transform: translateX(-2px); }
          60% { transform: translateX(1px); }
        }
        .celebration-shake-sm { animation: celebration-shake-sm 0.35s ease-in-out 0.5s; }
        @keyframes celebration-shake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-5px) rotate(-1.5deg); }
          20% { transform: translateX(5px) rotate(1.5deg); }
          30% { transform: translateX(-4px) rotate(-1deg); }
          40% { transform: translateX(4px) rotate(1deg); }
          50% { transform: translateX(-2px); }
          60% { transform: translateX(1px); }
        }
        .celebration-shake { animation: celebration-shake 0.5s ease-in-out 0.5s; }
        @keyframes celebration-shake-lg {
          0%, 100% { transform: translateX(0); }
          6% { transform: translateX(-8px) rotate(-2.5deg); }
          12% { transform: translateX(8px) rotate(2.5deg); }
          18% { transform: translateX(-7px) rotate(-2deg); }
          24% { transform: translateX(7px) rotate(2deg); }
          30% { transform: translateX(-5px) rotate(-1.5deg); }
          36% { transform: translateX(5px) rotate(1.5deg); }
          42% { transform: translateX(-3px) rotate(-0.5deg); }
          50% { transform: translateX(2px); }
          58% { transform: translateX(-1px); }
        }
        .celebration-shake-lg { animation: celebration-shake-lg 0.6s ease-in-out 0.5s; }
        @keyframes sparkle-float {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          30% { opacity: 1; transform: scale(1.2) translateY(-10px); }
          100% { opacity: 0; transform: scale(0) translateY(-50px) rotate(180deg); }
        }
        .celebration-sparkle {
          animation: sparkle-float 1s ease-out forwards;
        }
      `}</style>
    </div >
  );
}

export default App;
