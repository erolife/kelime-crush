import React, { useEffect, useState } from 'react';
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
  User, LogOut, Mail, Lock, UserPlus, LogIn, Clock, Home
} from 'lucide-react';
import { LETTER_POINTS, TIME_BATTLE_OPTIONS } from './logic/Constants';
import { AuthService } from './logic/AuthService';
import { SupabaseService } from './logic/SupabaseService';


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
  onSelectTimeBattle, onSelectArcade, onSelectZen, currentLevel, coins, tools, streakCount,
  levels = [], isLoading, user, profile, onOpenAuth, language, setLanguage, t = (s) => s,
  isMuted, toggleMute, difficulty, changeDifficulty, dailyReward, claimGift, STREAK_REWARDS = [],
  showDailyGift, energy, nextEnergyIn, buyTool,
  totalScore, wordsFoundCount, gamesPlayed, highScore, avatarId, setAvatarId, completedLevels
}) => {
  const [view, setView] = React.useState('modes');
  const [selectedLevelIdx, setSelectedLevelIdx] = React.useState(null);
  const [selectedBoosters, setSelectedBoosters] = React.useState({ bomb: false, row: false, col: false });
  const [arcadeSubMode, setArcadeSubMode] = React.useState('moves'); // 'moves' | 'time'
  const [arcadeValue, setArcadeValue] = React.useState(15);
  const [tbDuration, setTbDuration] = React.useState(TIME_BATTLE_OPTIONS[1]); // default 3dk
  const [showMemberOnlyModal, setShowMemberOnlyModal] = React.useState(false);
  const [showMissionLock, setShowMissionLock] = React.useState(false);
  const [lockReason, setLockReason] = React.useState('auth'); // 'auth' | 'energy'

  console.log('--- DASHBOARD RENDER ---');
  console.log('Current View:', view);
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

  // Auto-show daily reward screen on mount if needed
  React.useEffect(() => {
    if (showDailyGift && view === 'modes') {
      setView('daily');
    }
  }, [showDailyGift]);

  const renderView = () => {
    console.log('--- DASHBOARD RENDERVIEW CALLED ---', view);
    switch (view) {
      case 'timeBattlePregame': {
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-2xl mx-auto flex flex-col h-full max-h-screen">
            <div className="flex items-center justify-between gap-2 md:gap-4 mb-2 landscape:mb-1 md:mb-6 shrink-0 pt-2 md:pt-0">
              <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <button onClick={() => setView('modes')} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition-all shadow-xl shrink-0">
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
                <button onClick={() => setView(isArcade ? 'modes' : 'levels')} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition-all shadow-xl shrink-0">
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
                onClick={() => setView('modes')}
                className="p-1.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition-all shadow-xl"
              >
                <X size={18} className="md:w-6 md:h-6" />
              </button>
              <h2 className="text-base md:text-2xl font-black text-white italic tracking-tighter uppercase leading-none mr-auto">{t('inventory')}</h2>

              <button
                onClick={() => setView('shop')}
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
                  const Icon = key === 'bomb' ? Zap : key === 'swap' ? AlignLeft : key === 'row' ? MoveHorizontal : key === 'col' ? MoveVertical : Target;
                  const colorCls = key === 'bomb' ? 'text-orange-400' : key === 'swap' ? 'text-blue-400' : key === 'row' ? 'text-purple-400' : key === 'col' ? 'text-green-400' : 'text-red-400';
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
                onClick={() => setView('modes')}
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
                onClick={() => setView('modes')}
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
                <button onClick={() => setView('modes')} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition-all shadow-xl shrink-0">
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
              <ShopView t={t} coins={coins} tools={tools} buyTool={buyTool} />
            </div>
          </div>
        );

      case 'daily': {
        console.log('--- RENDERING DAILY VIEW ---');
        const lastGift = parseInt(localStorage.getItem('crush_last_gift') || '0');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const canClaim = lastGift === 0 || (now - lastGift) >= oneDay;

        const timeUntilNext = (lastGift + oneDay) - now;
        const hLeft = Math.max(0, Math.floor(timeUntilNext / (1000 * 60 * 60)));
        const mLeft = Math.max(0, Math.floor((timeUntilNext % (1000 * 60 * 60)) / (1000 * 60)));

        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center p-2">
            <div className="w-full text-center p-4 md:p-8 landscape:p-3 bg-slate-900/60 border border-amber-500/30 rounded-2xl md:rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.1)] relative overflow-hidden max-h-full overflow-y-auto no-scrollbar">
              <button onClick={() => setView('modes')} className="absolute top-4 left-4 md:top-8 md:left-8 p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition-all shadow-xl">
                <X size={20} className="md:w-6 md:h-6" />
              </button>
              <h2 className="text-lg landscape:text-base md:text-4xl font-black text-white italic tracking-tighter mb-3 landscape:mb-2 md:mb-10 bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent uppercase leading-tight">{t('daily_reward_title')}</h2>

              <div className="flex justify-center flex-wrap gap-1.5 md:gap-4 landscape:gap-1 mb-3 landscape:mb-2 md:mb-12">
                {STREAK_REWARDS.map((reward, i) => {
                  const currentDayIndex = streakCount % 7;
                  const isDone = canClaim ? (i < currentDayIndex) : (i <= currentDayIndex);
                  const isToday = canClaim ? (i === currentDayIndex) : false;
                  return (
                    <div key={i} className={`
                        w-10 h-14 landscape:w-9 landscape:h-10 md:w-20 md:h-24 rounded-lg md:rounded-2xl border flex flex-col items-center justify-center transition-all duration-500 relative
                        ${isDone ? 'bg-green-500/10 border-green-500/40 text-green-500' :
                        isToday ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-110 z-10 text-amber-500' :
                          'bg-slate-800/40 border-white/5 text-slate-600'}
                      `}>
                      <span className="text-[6px] landscape:text-[5px] md:text-[10px] font-black opacity-60 mb-0.5 landscape:mb-0 md:mb-2 uppercase tracking-widest leading-none">{language === 'tr' ? 'GÜN' : 'DAY'} {i + 1}</span>
                      {isDone ? <CheckCircle2 size={12} className="landscape:w-3 landscape:h-3 md:w-6 md:h-6" /> : React.cloneElement(reward.icon, { size: 12, className: 'landscape:w-3 landscape:h-3 md:w-6 md:h-6' })}
                      {isToday && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 md:w-4 md:h-4 bg-amber-500 rounded-full animate-ping" />}
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-xl md:rounded-[2.5rem] p-3 landscape:p-2 md:p-10 mb-3 landscape:mb-2 md:mb-10 inline-block min-w-full md:min-w-[320px]">
                <p className="text-slate-500 text-[8px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1 md:mb-4 leading-none">{t('today_reward')}</p>
                <div className="text-lg landscape:text-base md:text-5xl font-black text-white italic tracking-tighter mb-1 md:mb-3 animate-pulse leading-none">{dailyReward?.text}</div>
                <div className="text-amber-500 font-bold text-[8px] md:text-sm tracking-widest uppercase opacity-80 leading-none">{t('streak_day', { day: (canClaim ? streakCount + 1 : streakCount) })}</div>
              </div>

              <div className="w-full flex justify-center px-4">
                <button
                  onClick={() => { if (canClaim) { claimGift(); setView('modes'); } }}
                  disabled={!canClaim}
                  className={`w-full max-w-md py-2.5 landscape:py-2 md:py-6 font-black rounded-xl md:rounded-2xl transition-all shadow-2xl tracking-widest uppercase italic text-xs landscape:text-xs md:text-xl
                    ${canClaim
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-amber-500/30 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-80'}`}
                >
                  {canClaim ? t('claim_reward') : (language === 'tr' ? `${hLeft} SAAT ${mLeft} DAKİKA SONRA GEL` : `COME BACK IN ${hLeft}h ${mLeft}m`)}
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'profile':
        console.log('--- RENDERING PROFILE VIEW ---');
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-4xl mx-auto h-full overflow-y-auto no-scrollbar pb-20 landscape:pb-16 px-4 landscape:px-3">
            <div className="flex items-center gap-4 mb-4 landscape:mb-3 md:mb-8">
              <button onClick={() => setView('modes')} className="p-2 landscape:p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl">
                <X size={20} className="md:w-6 md:h-6" />
              </button>
              <h2 className="text-xl landscape:text-lg md:text-3xl font-black text-white italic tracking-tighter uppercase">{t('profile')}</h2>
            </div>

            <div className="grid grid-cols-1 landscape:grid-cols-[auto_1fr] lg:grid-cols-3 gap-4 landscape:gap-3 md:gap-6">
              <div className="lg:col-span-1 space-y-3 landscape:space-y-2 md:space-y-6">
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl landscape:rounded-xl md:rounded-[2.5rem] p-4 landscape:p-3 md:p-8 backdrop-blur-md flex flex-col landscape:flex-row items-center text-center landscape:text-left landscape:gap-3">
                  <div className="relative mb-3 landscape:mb-0 group shrink-0">
                    <div className="w-20 h-20 landscape:w-14 landscape:h-14 md:w-32 md:h-32 bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl landscape:rounded-xl md:rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl overflow-hidden">
                      <User size={36} className="landscape:w-7 landscape:h-7 md:w-16 md:h-16" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg landscape:text-sm md:text-2xl font-black text-white italic tracking-tighter uppercase mb-0.5 truncate">{user?.user_metadata?.username || user?.email?.split('@')[0] || t('player')}</h3>
                    <p className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 landscape:mb-2 md:mb-6">{user?.created_at ? `${t('member_since')}: ${new Date(user.created_at).toLocaleDateString()}` : t('member_since_guest')}</p>

                    {user ? (
                      <button onClick={() => AuthService.signOut()} className="w-full py-2.5 landscape:py-1.5 md:py-4 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 border border-white/5 rounded-xl landscape:rounded-lg md:rounded-2xl text-[10px] landscape:text-[9px] md:text-xs font-black text-slate-400 hover:text-red-400 transition-all uppercase tracking-widest italic">
                        {t('logout')}
                      </button>
                    ) : (
                      <button onClick={onOpenAuth} className="w-full py-2.5 landscape:py-1.5 md:py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl landscape:rounded-lg md:rounded-2xl transition-all uppercase tracking-widest italic text-[10px] landscape:text-[9px] md:text-sm">
                        {t('signin_button')}
                      </button>
                    )}
                  </div>
                </div>

              </div>

              <div className="lg:col-span-2 space-y-3 landscape:space-y-2 md:space-y-6">
                <div className="grid grid-cols-2 landscape:grid-cols-4 gap-2 landscape:gap-1.5 md:gap-4">
                  {[
                    { label: t('total_score'), value: totalScore, icon: <Trophy size={16} className="landscape:w-4 landscape:h-4 md:w-5 md:h-5" />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: t('high_score'), value: highScore, icon: <Zap size={16} className="landscape:w-4 landscape:h-4 md:w-5 md:h-5" />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { label: t('words_found'), value: wordsFoundCount, icon: <AlignLeft size={16} className="landscape:w-4 landscape:h-4 md:w-5 md:h-5" />, color: 'text-sky-500', bg: 'bg-sky-500/10' },
                    { label: t('games_played'), value: gamesPlayed, icon: <Gamepad2 size={16} className="landscape:w-4 landscape:h-4 md:w-5 md:h-5" />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/60 border border-white/5 rounded-xl landscape:rounded-lg md:rounded-[2rem] p-3 landscape:p-2 md:p-6 backdrop-blur-md flex flex-col items-center justify-center text-center group hover:border-white/20 transition-all">
                      <div className={`w-8 h-8 landscape:w-7 landscape:h-7 md:w-12 md:h-12 ${stat.bg} ${stat.color} rounded-lg landscape:rounded-md md:rounded-2xl flex items-center justify-center mb-2 landscape:mb-1 md:mb-4 group-hover:scale-110 transition-transform`}>
                        {stat.icon}
                      </div>
                      <div className="text-[8px] landscape:text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{stat.label}</div>
                      <div className="text-lg landscape:text-base md:text-3xl font-black text-white italic tracking-tighter leading-none">{stat.value?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-2xl landscape:rounded-xl md:rounded-[2.5rem] p-4 landscape:p-2.5 md:p-8 backdrop-blur-md">
                  <div className="text-[9px] landscape:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 landscape:mb-2 md:mb-6 font-inter">{t('achievements')}</div>
                  <div className="flex flex-wrap gap-2 landscape:gap-1.5 md:gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-10 h-10 landscape:w-8 landscape:h-8 md:w-16 md:h-16 bg-slate-950/50 border border-white/5 rounded-xl landscape:rounded-lg md:rounded-2xl flex items-center justify-center text-slate-700 opacity-40 grayscale group hover:opacity-100 transition-all">
                        <Award size={20} className="landscape:w-4 landscape:h-4 md:w-8 md:h-8" />
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

            {/* ── MOBILE MODES VIEW (Horizontal Carousel) ── */}
            <div className="lg:hidden flex-1 overflow-x-auto no-scrollbar px-6 flex flex-row gap-4 lg:gap-6 snap-x snap-mandatory items-center min-h-0 landscape:pb-16">
              {/* Arcade Mode Card */}
              <button
                onClick={() => {
                  if (energy > 0) { setSelectedLevelIdx(null); setView('pregame'); }
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
                  if (energy > 0) setView('timeBattlePregame');
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
                    if (energy > 0) { setSelectedLevelIdx(null); setView('pregame'); }
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
                    if (energy > 0) setView('timeBattlePregame');
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

                {/* Profil Kartı */}
                <button
                  onClick={() => { if (!user) setShowMissionLock(true); else setView('profile'); }}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/8 p-6 text-left transition-all duration-300 hover:border-white/15 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #111827 0%, #0f172a 100%)' }}
                >
                  {/* Top shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                        {user ? (profile?.username?.[0] || user?.email?.[0])?.toUpperCase() : '?'}
                      </div>
                      {user && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-lg border-2 border-slate-950 flex items-center justify-center shadow-lg">
                          <Gamepad2 size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] leading-none mb-1">PROFIL</div>
                      <div className="text-lg font-black text-white uppercase tracking-tight truncate leading-none">
                        {user ? (profile?.username || user?.email?.split('@')[0]) : t('player')}
                      </div>
                      <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-1">
                        {user ? (profile?.username || user?.email?.split('@')[0]) : '— Misafir —'}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                  </div>



                  {!user && (
                    <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2.5">
                      <Lock size={12} className="text-orange-400 shrink-0" />
                      <span className="text-[10px] font-black text-orange-300 leading-tight">İlerleme kaydetmek için giriş yapın</span>
                    </div>
                  )}
                </button>

                {/* RANK Kartı (full width, herkese açık) */}
                <button
                  onClick={() => setView('leaderboard')}
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
                  onClick={() => { if (!user) setShowMissionLock(true); else setView('shop'); }}
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

                {/* ENVANTER + DAILY (2 col grid) */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { if (!user) setShowMissionLock(true); else setView('inventory'); }}
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
                    onClick={() => setView('daily')}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-white/8 p-5 flex flex-col items-center gap-3 transition-all duration-300 hover:border-amber-500/30 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #12090a 0%, #0e0608 100%)' }}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-all">
                        <Gift size={20} className="text-amber-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-950 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black text-white uppercase tracking-tight leading-none">DAILY</div>
                      <div className="text-[9px] text-amber-500 font-black uppercase tracking-widest mt-1">GÜN {streakCount + 1}</div>
                    </div>
                  </button>
                </div>
              </div>
            </div >

            {/* ── MOBİL: Alt İkon Barı (Premium Bottom Nav) ── */}
            < div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 px-6 py-4 flex justify-between items-center shadow-[0_-15px_40px_rgba(0,0,0,0.5)]" >
              <button
                onClick={() => setView('leaderboard')}
                className={`flex flex-col items-center gap-1 transition-all ${view === 'leaderboard' ? 'text-sky-400 scale-110' : 'text-slate-500'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${view === 'leaderboard' ? 'bg-sky-500/20 border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'bg-white/5 border-transparent'}`}>
                  <BarChart3 size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t('rank') || 'Rank'}</span>
              </button>

              <button
                onClick={() => { if (!user) setShowMissionLock(true); else setView('inventory'); }}
                className={`flex flex-col items-center gap-1 transition-all ${view === 'inventory' ? 'text-purple-400 scale-110' : 'text-slate-500'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${view === 'inventory' ? 'bg-purple-500/20 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-white/5 border-transparent'}`}>
                  <Box size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t('tools') || 'Araçlar'}</span>
              </button>

              <button
                onClick={() => setView('modes')}
                className={`flex flex-col items-center gap-1 -mt-8 transition-all ${view === 'modes' ? 'scale-125' : 'scale-100 opacity-80'}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-white border-2 border-slate-950 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  <Gamepad2 size={28} className="relative z-10" />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${view === 'modes' ? 'text-orange-400' : 'text-slate-500'}`}>{t('play') || 'Başla'}</span>
              </button>

              <button
                onClick={() => { if (!user) setShowMissionLock(true); else setView('shop'); }}
                className={`flex flex-col items-center gap-1 transition-all ${view === 'shop' ? 'text-emerald-400 scale-110' : 'text-slate-500'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${view === 'shop' ? 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-transparent'}`}>
                  <ShoppingBag size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t('market') || 'Shop'}</span>
              </button>

              <button
                onClick={() => setView('daily')}
                className={`flex flex-col items-center gap-1 transition-all ${view === 'daily' ? 'text-amber-400 scale-110' : 'text-slate-500'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${view === 'daily' ? 'bg-amber-500/20 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-transparent'} relative`}>
                  <Gift size={20} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-950 animate-pulse" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t('daily') || 'Hediye'}</span>
              </button>
            </div >

          </div >
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex flex-col bg-slate-950/95 backdrop-blur-xl overflow-hidden">
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
                onClick={() => setView('settings')}
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
                  <div className={`w-5 h-5 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center ${energy > 0 ? 'bg-sky-500/20 text-sky-400' : 'bg-rose-500/20 text-rose-400'} shrink-0`}>
                    <Zap className="w-3 h-3 md:w-4 md:h-4" fill={energy > 0 ? "currentColor" : "none"} />
                  </div>
                  <div className="flex flex-col font-outfit min-w-[25px] md:min-w-[40px]">
                    <span className="text-[9px] md:text-xs font-black text-white leading-none whitespace-nowrap">{energy}/5</span>
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
              onClick={() => setView('profile')}
              className="flex items-center gap-2 md:gap-3 bg-slate-900/60 border border-white/5 p-1 pr-2 md:pr-4 rounded-xl md:rounded-2xl group transition-all hover:border-sky-500/50 font-outfit text-left shadow-lg shrink-0"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 md:w-11 md:h-11 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black italic text-xs md:text-base border border-white/20">
                  {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[6px] md:text-[8px] font-black leading-none px-1.5 md:px-2 py-0.5 rounded-md border-2 border-slate-950 shadow-lg">
                  {completedLevels + 1}
                </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] md:text-xs font-black text-white leading-none truncate max-w-[80px]">
                  {profile?.username || user?.email?.split('@')[0]}
                </span>
                <span className="text-[6px] md:text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-tight mt-0.5">{t('profile')}</span>
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
              <div className={`w-5 h-5 flex items-center justify-center ${energy > 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                <Zap size={14} fill={energy > 0 ? "currentColor" : "none"} />
              </div>
              <span className="text-[11px] font-black text-white tracking-widest leading-none">{energy}/5</span>
              {energy < 5 && (
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
          <button className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-colors">{t('terms_of_service')}</button>
          <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-800 rounded-full" />
          <button className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-colors">{t('privacy_policy')}</button>
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
const LeaderboardView = ({ t = (s) => s, profile }) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const rankings = await SupabaseService.getLeaderboard();
      if (rankings) setData(rankings);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-2 h-full max-h-[60vh] landscape:max-h-[55vh] lg:max-h-[70vh]">
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500 animate-pulse">
          <RefreshCw size={48} className="animate-spin mb-4 opacity-20" />
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
                w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black italic text-sm md:text-base
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
                </div>
                <div className="flex items-center gap-3 md:gap-4 mt-0.5">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Coins size={9} className="text-amber-500 md:w-3 md:h-3" />
                    <span className="text-[9px] md:text-xs font-bold font-inter tracking-wider text-slate-500">{item.coins}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Trophy size={9} className="text-sky-500 md:w-3 md:h-3" />
                    <span className="text-[9px] md:text-xs font-bold font-inter tracking-wider text-slate-500">{t('level_abbr')}{item.current_level_index + 1}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
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

const ShopView = ({ t = (s) => s, coins, tools, buyTool }) => {
  const items = [
    { id: 'bomb', name: t('bomb'), desc: t('bomb_desc') || 'Seçili hücre ve etrafını patlatır', cost: 100, icon: <Zap size={20} className="text-amber-400 md:w-6 md:h-6" />, color: 'from-amber-500 to-orange-600' },
    { id: 'row', name: t('row'), desc: t('row_desc') || 'Tüm yatay satırı temizler', cost: 150, icon: <MoveHorizontal size={20} className="text-rose-400 md:w-6 md:h-6" />, color: 'from-rose-500 to-pink-600' },
    { id: 'col', name: t('col'), desc: t('col_desc') || 'Tüm dikey sütunu temizler', cost: 150, icon: <MoveVertical size={20} className="text-emerald-400 md:w-6 md:h-6" />, color: 'from-emerald-500 to-teal-600' },
    { id: 'swap', name: t('swap'), desc: t('swap_desc') || 'İki harfin yerini değiştirir', cost: 200, icon: <RefreshCw size={20} className="text-sky-400 md:w-6 md:h-6" />, color: 'from-sky-500 to-blue-600' },
    { id: 'cell', name: t('cell'), desc: t('cell_desc') || 'Tek bir harfi siler', cost: 50, icon: <Target size={20} className="text-purple-400 md:w-6 md:h-6" />, color: 'from-purple-500 to-violet-600' }
  ];

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-5 lg:grid-cols-3 gap-2 md:gap-4 pb-6">
        {items.map(item => {
          const canAfford = coins >= item.cost;
          return (
            <div key={item.id} className="relative overflow-hidden bg-slate-900/40 border border-white/5 rounded-2xl md:rounded-3xl p-2 landscape:p-2.5 md:p-4 flex items-center landscape:flex-col lg:flex-row gap-2 md:gap-4 transition-all group hover:border-white/10 shadow-lg">
              <div className="flex items-center gap-3 landscape:flex-col landscape:w-full">
                <div className="relative shrink-0">
                  <div className={`w-8 h-8 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-slate-950/60 shadow-inner group-hover:scale-110 transition-transform border border-white/5`}>
                    {React.cloneElement(item.icon, { size: 16, className: item.icon.props.className.replace('size={20}', '') })}
                  </div>
                  <div className="absolute -top-1 -right-1 min-w-[16px] h-[16px] md:min-w-[20px] md:h-[20px] bg-amber-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                    <span className="text-[8px] md:text-[10px] font-black text-slate-950 leading-none">{tools?.[item.id] || 0}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0 landscape:w-full landscape:text-center">
                  <h4 className="text-white font-black italic uppercase text-[10px] md:text-sm mb-0.5 truncate">{item.name}</h4>
                  <p className="text-[8px] md:text-[10px] text-slate-400 leading-tight pr-1 font-medium line-clamp-1 md:line-clamp-none landscape:block lg:block">{item.desc}</p>
                </div>
              </div>

              <div className="shrink-0 landscape:w-full landscape:mt-1">
                <button
                  onClick={() => buyTool(item.id, item.cost)}
                  disabled={!canAfford}
                  className={`flex flex-col items-center justify-center w-full min-w-[60px] md:min-w-[80px] py-1 md:py-1.5 px-2 md:px-3 rounded-lg md:rounded-xl transition-all active:scale-95 border-2 ${canAfford ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-500 shadow-lg' : 'bg-slate-800/50 border-transparent text-slate-500 cursor-not-allowed opacity-50'}`}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-black text-[9px] md:text-xs italic">{item.cost}</span>
                    <Coins size={8} className="text-amber-500" />
                  </div>
                  <span className="text-[5px] md:text-[7px] uppercase font-black tracking-tighter opacity-70 group-hover:opacity-100">{t('buy')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
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

function App() {
  const {
    grid, selectedPath, animatingCells, score, moves, difficulty,
    foundWords, gameState, resetGame, swapSelection, tools, activeTool,
    setActiveTool, changeDifficulty, selectCell, finishTurn, shuffle,
    gameMode, currentLevelIndex, levelGoals, startTimeBattle,
    coins, buyTool, addCoins, addTool, createdSpecial,
    cloudLevels, isLoadingLevels,
    user, profile, completedLevels,
    language, setLanguage, t,
    isDictionaryLoaded,
    energy, nextEnergyIn, setEnergy, setLastEnergyRefill,
    totalScore, wordsFoundCount, gamesPlayed, highScore,
    arcadeSubMode, arcadeValue, timeLeft, totalMovesMade, zenDuration,
    gardenState, setGameState,
    celebration,
    timeBattleElapsed, timeBattleToolRewards, pendingToolReward,
    timeBattleInitialDuration, calculateTimeBattleGold, getTimeBattleRank, nextToolRewardAt
  } = useGame();

  const [isMuted, setIsMuted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [showDashboard, setShowDashboard] = useState(true);

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

  const STREAK_REWARDS = [
    { type: 'coins', amount: 100, text: '100 Altın', icon: <Coins size={24} /> },
    { type: 'coins', amount: 200, text: '200 Altın', icon: <Coins size={24} /> },
    { type: 'tool', id: 'bomb', amount: 1, text: '1 Bomba', icon: <Zap size={24} /> },
    { type: 'coins', amount: 300, text: '300 Altın', icon: <Coins size={24} /> },
    { type: 'tool', id: 'swap', amount: 1, text: '1 Yer Değiştirme', icon: <RefreshCw size={24} /> },
    { type: 'coins', amount: 400, text: '400 Altın', icon: <Coins size={24} /> },
    { type: 'tool', id: 'bomb', amount: 2, text: '2 Bomba + 500 Altın', extraCoins: 500, icon: <Sparkles size={24} /> },
  ];

  const [showDailyGift, setShowDailyGift] = useState(false);
  const [dailyReward, setDailyReward] = useState(null);
  const [streakCount, setStreakCount] = useState(() => parseInt(localStorage.getItem('crush_streak_count') || "0"));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const lastGift = localStorage.getItem('crush_last_gift');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const twoDays = 48 * 60 * 60 * 1000;

    if (!lastGift) {
      // İlk defa hediye alıyor
      setDailyReward(STREAK_REWARDS[0]);
      setShowDailyGift(true);
    } else {
      const timeDiff = now - parseInt(lastGift);
      if (timeDiff > twoDays) {
        // Seri bozuldu, sıfırla
        setStreakCount(0);
        localStorage.setItem('crush_streak_count', "0");
        setDailyReward(STREAK_REWARDS[0]);
        setShowDailyGift(true);
      } else if (timeDiff > oneDay) {
        // Yeni gün ödülü aktif
        const nextStreak = streakCount % 7;
        setDailyReward(STREAK_REWARDS[nextStreak]);
        setShowDailyGift(true);
      }
    }
  }, []);

  const claimGift = () => {
    const lastGift = parseInt(localStorage.getItem('crush_last_gift') || '0');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastGift !== 0 && (now - lastGift) < oneDay) {
      setShowDailyGift(false);
      return;
    }

    if (dailyReward?.type === 'coins') {
      addCoins(dailyReward.amount);
    } else if (dailyReward?.type === 'tool') {
      addTool(dailyReward.id, dailyReward.amount);
      if (dailyReward.extraCoins) addCoins(dailyReward.extraCoins);
    }

    soundManager.play('powerup');
    const newStreak = (streakCount + 1);
    setStreakCount(newStreak);
    localStorage.setItem('crush_streak_count', newStreak.toString());
    localStorage.setItem('crush_last_gift', Date.now().toString());

    // Sonraki günün ödülünü hazırla
    const nextStreak = newStreak % 7;
    setDailyReward(STREAK_REWARDS[nextStreak]);

    setShowDailyGift(false);
  };

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

  return (
    <div className="relative h-screen w-screen bg-[#020617] text-slate-100 font-outfit select-none overflow-hidden flex flex-col">
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
        <Dashboard
          levels={cloudLevels}
          isLoading={isLoadingLevels}
          currentLevel={completedLevels}
          completedLevels={completedLevels}
          coins={coins}
          tools={tools}
          buyTool={buyTool}
          streakCount={streakCount}
          user={user}
          profile={profile}
          language={language}
          setLanguage={setLanguage}
          t={t}
          isMuted={isMuted}
          toggleMute={toggleMute}
          difficulty={difficulty}
          changeDifficulty={changeDifficulty}
          dailyReward={dailyReward}
          claimGift={claimGift}
          showDailyGift={showDailyGift}
          STREAK_REWARDS={STREAK_REWARDS}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          energy={energy}
          nextEnergyIn={nextEnergyIn}
          onSelectArcade={(boosters, subMode, subValue) => {
            if (energy > 0) {
              setEnergy(prev => prev - 1);
              if (energy === 5) setLastEnergyRefill(Date.now());
              setShowDashboard(false);
              resetGame(boosters, 'arcade', subMode, subValue, 'normal');
            }
          }}
          onSelectTimeBattle={(duration, boosters) => {
            if (energy > 0) {
              setEnergy(prev => prev - 1);
              if (energy === 5) setLastEnergyRefill(Date.now());
              startTimeBattle(duration, boosters);
              setShowDashboard(false);
            }
          }}
          onSelectZen={() => {
            if (energy > 0) {
              setEnergy(prev => prev - 1);
              if (energy === 5) setLastEnergyRefill(Date.now());
              setShowDashboard(false);
              resetGame({}, 'zen', 'moves', 999, 'normal');
            }
          }}
          totalScore={totalScore}
          wordsFoundCount={wordsFoundCount}
          gamesPlayed={gamesPlayed}
          highScore={highScore}
        />
      ) : (
        <>
          {/* Header */}
          <header className="px-4 landscape:px-3 md:px-6 py-2 landscape:py-1.5 md:py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-md shrink-0 gap-4 landscape:gap-3 md:gap-8">
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
              {gameMode === 'arcade' && arcadeSubMode === 'time' ? (
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
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 relative overflow-hidden group">
                    {gameMode === 'arcade' && arcadeSubMode === 'time' ? (
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
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('words')}</h2>
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
              {/* Word Display Area - Mobile visible only */}
              <div className={`
                md:hidden flex items-center justify-center px-3 landscape:px-2 py-1.5 landscape:py-1 rounded-lg landscape:rounded-md md:rounded-xl backdrop-blur-3xl border-2 transition-all duration-500 mx-auto
                ${currentWord.length >= 3 ? 'bg-sky-500/10 border-sky-400/50' : 'bg-slate-900/40 border-white/5'}
              `}>
                <span className={`text-base landscape:text-sm md:text-lg font-black tracking-[0.3em] ${currentWord.length >= 3 ? 'text-white' : 'text-slate-500'}`}>
                  {currentWord || '..........'}
                </span>
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
                  />

                  {/* Victory Overlay (Only for Victory) */}
                  {gameState === 'victory' && (() => {
                    const levelRewards = cloudLevels?.[currentLevelIndex]?.rewards;
                    const rewardItems = [];
                    if (levelRewards?.coins) {
                      rewardItems.push({ type: 'coins', amount: levelRewards.coins, icon: <Coins size={18} className="text-amber-400" />, color: 'from-amber-500/20 to-orange-500/20', borderColor: 'border-amber-500/40', textColor: 'text-amber-400' });
                    }
                    if (levelRewards?.tools) {
                      const toolMeta = { bomb: { icon: <Zap size={18} className="text-rose-400" />, color: 'from-rose-500/20 to-pink-500/20', borderColor: 'border-rose-500/40', textColor: 'text-rose-400' }, swap: { icon: <RefreshCw size={18} className="text-sky-400" />, color: 'from-sky-500/20 to-blue-500/20', borderColor: 'border-sky-500/40', textColor: 'text-sky-400' }, row: { icon: <MoveHorizontal size={18} className="text-emerald-400" />, color: 'from-emerald-500/20 to-teal-500/20', borderColor: 'border-emerald-500/40', textColor: 'text-emerald-400' }, col: { icon: <MoveVertical size={18} className="text-green-400" />, color: 'from-green-500/20 to-emerald-500/20', borderColor: 'border-green-500/40', textColor: 'text-green-400' }, cell: { icon: <Target size={18} className="text-purple-400" />, color: 'from-purple-500/20 to-violet-500/20', borderColor: 'border-purple-500/40', textColor: 'text-purple-400' } };
                      Object.entries(levelRewards.tools).forEach(([id, amt]) => {
                        const meta = toolMeta[id] || toolMeta.bomb;
                        rewardItems.push({ type: 'tool', id, amount: amt, icon: meta.icon, color: meta.color, borderColor: meta.borderColor, textColor: meta.textColor });
                      });
                    }
                    return (
                      <div className="absolute inset-0 z-[300] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 landscape:p-3 md:p-8 text-center animate-in fade-in zoom-in duration-500">
                        <div className="max-w-xs w-full">
                          <div className="w-14 h-14 landscape:w-12 landscape:h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 landscape:mb-2 md:mb-6 border bg-green-500/20 border-green-400 text-green-400">
                            <Award size={28} className="landscape:w-6 landscape:h-6 md:w-10 md:h-10" />
                          </div>
                          <h2 className="text-2xl landscape:text-xl md:text-4xl font-black text-white italic tracking-tighter mb-1 landscape:mb-0.5 md:mb-2 uppercase">{t('victory')}</h2>
                          <p className="text-emerald-500 text-[9px] landscape:text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-3 landscape:mb-1.5 md:mb-4 italic">{t('mission_success')}</p>

                          {/* Reward Animations */}
                          {rewardItems.length > 0 && (
                            <div className="flex flex-col gap-2 landscape:gap-1.5 md:gap-2.5 mb-4 landscape:mb-2 md:mb-6">
                              {rewardItems.map((reward, idx) => (
                                <div
                                  key={idx}
                                  className={`reward-pop-in flex items-center gap-3 landscape:gap-2 bg-gradient-to-r ${reward.color} border ${reward.borderColor} rounded-xl landscape:rounded-lg md:rounded-2xl px-4 landscape:px-3 py-3 landscape:py-2 md:px-5 md:py-3.5 shadow-lg`}
                                  style={{ animationDelay: `${0.3 + idx * 0.25}s` }}
                                >
                                  <div className="w-9 h-9 landscape:w-7 landscape:h-7 md:w-10 md:h-10 rounded-lg landscape:rounded-md md:rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center shrink-0 reward-icon-pulse">
                                    {reward.icon}
                                  </div>
                                  <div className="flex-1 text-left">
                                    <span className={`text-sm landscape:text-xs md:text-base font-black ${reward.textColor}`}>
                                      +{reward.amount} {reward.type === 'coins' ? t('gold') : t(reward.id)}
                                    </span>
                                  </div>
                                  <Sparkles size={14} className={`${reward.textColor} animate-pulse opacity-60`} />
                                </div>
                              ))}
                            </div>
                          )}

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
                <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl landscape:rounded-xl md:rounded-[2.5rem] p-5 landscape:p-3 md:p-8 text-center animate-in fade-in zoom-in duration-500">
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

                      <button onClick={() => resetGame({}, 'zen')} className="w-full py-3 landscape:py-2 md:py-5 bg-emerald-500 text-white font-black rounded-xl landscape:rounded-lg md:rounded-2xl shadow-xl mb-2 landscape:mb-1 md:mb-3 uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-[0.98] text-sm landscape:text-xs md:text-base">{t('new_session')}</button>
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
                          <div className="text-xl landscape:text-lg md:text-2xl font-black text-white tabular-nums">{wordsFoundCount}</div>
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
                        {t('moves_exhausted')}
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
                      </div>

                      <button onClick={() => resetGame({}, null, arcadeSubMode, arcadeValue)} className="w-full py-3 landscape:py-2 md:py-5 text-white font-black rounded-xl landscape:rounded-lg md:rounded-2xl shadow-xl mb-2 landscape:mb-1 md:mb-3 text-sm landscape:text-xs md:text-base bg-sky-500 hover:bg-sky-400 shadow-sky-500/20">{t('try_again')}</button>
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
