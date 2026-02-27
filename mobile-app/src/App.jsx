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
  ListTodo, Gift, ShoppingBag, BarChart3
} from 'lucide-react';
import { LEVELS } from './logic/Levels';
import { LETTER_POINTS } from './logic/Constants';
import { AuthService } from './logic/AuthService';
import {
  User, LogOut, Mail, Lock, UserPlus, LogIn
} from 'lucide-react';
import { SupabaseService } from './logic/SupabaseService';


const AuthModal = ({ isOpen, onClose, onAuthSuccess, t }) => {
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

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/20">
            {isLogin ? <LogIn className="text-white" size={32} /> : <UserPlus className="text-white" size={32} />}
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
            {isLogin ? t('login') : t('signup')}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
            {t('join_world')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text" required value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none font-bold"
                  placeholder="oyuncu_adi"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">E-Posta</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none font-bold"
                placeholder="ornek@mail.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-[10px] font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-slate-950 font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-orange-500/20 tracking-[0.2em] uppercase italic text-lg mt-4"
          >
            {loading ? t('processing') : (isLogin ? t('signin_button') : t('signup_button'))}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            {isLogin ? t('no_account') : t('have_account')}
          </button>
        </div>
      </div>
    </div>
  );
};


const Dashboard = ({
  onSelectMission, onSelectArcade, currentLevel, coins, tools, streakCount,
  levels, isLoading, user, profile, onOpenAuth, language, setLanguage, t,
  isMuted, toggleMute, difficulty, changeDifficulty, dailyReward, claimGift, STREAK_REWARDS,
  showDailyGift
}) => {
  const [view, setView] = React.useState('modes'); // 'modes' | 'levels' | 'inventory' | 'leaderboard' | 'daily' | 'settings'

  // Falling letters background logic
  const [fallingLetters, setFallingLetters] = React.useState([]);

  React.useEffect(() => {
    const letters = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
    const newLetters = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      char: letters[Math.floor(Math.random() * letters.length)],
      left: Math.random() * 100,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * -20,
      size: 14 + Math.random() * 30
    }));
    setFallingLetters(newLetters);
  }, []);

  // Auto-show daily reward screen on mount if needed
  React.useEffect(() => {
    if (showDailyGift && view === 'modes') {
      setView('daily');
    }
  }, [showDailyGift]);

  const renderView = () => {
    switch (view) {
      case 'levels':
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setView('modes')}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl"
              >
                <X size={24} />
              </button>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{t('level_selection')}</h2>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-2 max-h-[60vh] overflow-y-auto no-scrollbar pr-4">
              {isLoading ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 animate-pulse">
                  <RefreshCw size={48} className="animate-spin mb-4 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">{t('loading_levels')}</p>
                </div>
              ) : (
                levels.map((level, idx) => {
                  const isLocked = idx > currentLevel;
                  const isCompleted = idx < currentLevel;
                  const isActive = idx === currentLevel;
                  return (
                    <button
                      key={level.id}
                      onClick={() => onSelectMission(idx)}
                      disabled={isLocked}
                      className={`
                        relative group aspect-square rounded-xl border transition-all duration-500 p-2 flex flex-col justify-between overflow-hidden
                        ${isLocked ? 'bg-slate-900/20 border-white/5 opacity-40 cursor-not-allowed' :
                          isCompleted ? 'bg-green-500/5 border-green-500/30 hover:border-green-500 shadow-lg shadow-green-500/5' :
                            'bg-sky-500/5 border-sky-400/30 hover:border-sky-400 active:scale-95 shadow-xl shadow-sky-400/5'}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-lg font-black italic tracking-tighter ${isLocked ? 'text-slate-700' : isCompleted ? 'text-green-500' : 'text-sky-500'}`}>
                          {level.id}
                        </span>
                        {isCompleted ? <CheckCircle2 className="text-green-500" size={12} /> :
                          isLocked ? <div className="p-0.5 bg-slate-800 rounded-sm"><Sparkles size={8} className="text-slate-600" /></div> :
                            <div className="p-0.5 bg-sky-500/20 rounded-sm animate-pulse"><Play size={8} className="text-sky-400" /></div>}
                      </div>
                      <div className="relative z-10 text-left">
                        <h4 className={`font-bold text-[8px] leading-tight truncate ${isLocked ? 'text-slate-600' : 'text-white'}`}>{level.title}</h4>
                        <p className="text-[6px] text-slate-500 uppercase font-black tracking-widest mt-0.5">
                          {isLocked ? t('locked') : level.difficulty}
                        </p>
                      </div>
                      {isActive && <div className="absolute inset-0 border border-sky-400 rounded-xl animate-ping opacity-20 pointer-events-none" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setView('modes')}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl"
              >
                <X size={24} />
              </button>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{t('inventory')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
                  <Coins size={32} />
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('coins')}</div>
                <div className="text-4xl font-black text-white italic tracking-tighter leading-none">{coins}</div>
              </div>
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md grid grid-cols-2 gap-3">
                {Object.entries(tools || {}).map(([key, count]) => {
                  const Icon = key === 'bomb' ? Zap : key === 'swap' ? AlignLeft : key === 'row' ? MoveHorizontal : key === 'col' ? MoveVertical : Target;
                  const colorCls = key === 'bomb' ? 'text-orange-400' : key === 'swap' ? 'text-blue-400' : key === 'row' ? 'text-purple-400' : key === 'col' ? 'text-green-400' : 'text-red-400';
                  return (
                    <div key={key} className="bg-slate-950/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:border-white/10 transition-all">
                      <div className={`w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center ${colorCls} border border-white/5 group-hover:scale-110 transition-transform`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">{key}</div>
                        <div className="text-xl font-black text-white italic leading-none">{count}</div>
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
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => setView('modes')}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl"
              >
                <X size={24} />
              </button>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{t('global_rank')}</h2>
            </div>
            <div className="flex-1 min-h-0 py-4">
              {/* Reuse the logic from LeaderboardModal but as a full screen layout here if needed, or define a View wrapper */}
              <LeaderboardView t={t} profile={profile} />
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setView('modes')}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl"
              >
                <X size={24} />
              </button>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{t('settings')}</h2>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md space-y-8 shadow-2xl">
              <div className="space-y-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-inter">SES VE MÜZİK</div>
                <button
                  onClick={toggleMute}
                  className="w-full flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-white/5 hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-sky-500/20 text-sky-400'} group-hover:scale-110 transition-transform`}>
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </div>
                    <span className="text-lg font-bold text-white">{isMuted ? 'Sesler Kapalı' : 'Sesler Açık'}</span>
                  </div>
                  <div className={`w-14 h-7 rounded-full relative transition-colors ${isMuted ? 'bg-slate-700' : 'bg-sky-500'}`}>
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${isMuted ? 'left-1' : 'left-8'}`} />
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-inter">ZORLUK SEVİYESİ</div>
                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'normal', 'pro'].map(d => (
                    <button
                      key={d}
                      onClick={() => changeDifficulty(d)}
                      className={`
                        py-5 rounded-2xl text-xs font-black uppercase transition-all border
                        ${difficulty === d
                          ? 'bg-orange-500 border-orange-400 text-white shadow-xl shadow-orange-500/20'
                          : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'}
                      `}
                    >
                      {d === 'easy' ? 'Kolay' : d === 'normal' ? 'Normal' : 'Profesör'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'daily':
        return (
          <div className="animate-in slide-in-from-right fade-in duration-500 w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
            <div className="w-full text-center p-8 bg-slate-900/60 border border-amber-500/30 rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.1)] relative overflow-hidden">
              <button onClick={() => setView('modes')} className="absolute top-8 left-8 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                <X size={24} />
              </button>
              <h2 className="text-4xl font-black text-white italic tracking-tighter mb-10 bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent uppercase">{t('daily_reward_title')}</h2>

              <div className="flex justify-center flex-wrap gap-4 mb-12">
                {STREAK_REWARDS.map((reward, i) => {
                  const currentDayIndex = streakCount % 7;
                  const isDone = i < currentDayIndex;
                  const isToday = i === currentDayIndex;
                  return (
                    <div key={i} className={`
                        w-20 h-24 rounded-2xl border flex flex-col items-center justify-center transition-all duration-500 relative
                        ${isDone ? 'bg-green-500/10 border-green-500/40 text-green-500' :
                        isToday ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-110 z-10 text-amber-500' :
                          'bg-slate-800/40 border-white/5 text-slate-600'}
                      `}>
                      <span className="text-[10px] font-black opacity-60 mb-2 uppercase tracking-widest">{t('language') === 'tr' ? 'GÜN' : 'DAY'} {i + 1}</span>
                      {isDone ? <CheckCircle2 size={24} /> : reward.icon}
                      {isToday && <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-ping" />}
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-[2.5rem] p-10 mb-10 inline-block min-w-[320px]">
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mb-4">{t('today_reward')}</p>
                <div className="text-5xl font-black text-white italic tracking-tighter mb-3 animate-pulse">{dailyReward?.text}</div>
                <div className="text-amber-500 font-bold text-sm tracking-widest uppercase opacity-80">{t('streak_day', { day: streakCount + 1 })}</div>
              </div>

              <button
                onClick={() => { claimGift(); setView('modes'); }}
                className="w-full max-w-md py-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-2xl transition-all active:scale-95 shadow-2xl shadow-amber-500/30 tracking-[0.3em] uppercase italic text-xl"
              >
                {t('claim_reward')}
              </button>
            </div>
          </div>
        );

      default: // 'modes'
        return (
          <div className="flex flex-row gap-2 lg:gap-6 items-start animate-in fade-in zoom-in duration-700 max-w-6xl mx-auto w-full px-2 lg:px-4 h-full min-h-0">
            {/* MODES COLUMN - Gapless stack */}
            <div className="flex-1 grid grid-cols-1 gap-0 h-full overflow-y-auto no-scrollbar pb-20 lg:pb-0">
              {/* ARCADE MODE */}
              <button
                onClick={onSelectArcade}
                className="group relative h-28 lg:h-56 bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 hover:border-blue-500/50 rounded-t-[1rem] lg:rounded-t-[2.5rem] p-3 lg:p-8 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-blue-500/10 blur-[40px] lg:blur-[60px] -mr-12 -mt-12 lg:-mr-16 lg:-mt-16 rounded-full transition-all group-hover:bg-blue-500/20" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 lg:w-16 lg:h-16 bg-blue-500/20 rounded-lg lg:rounded-[1.25rem] flex items-center justify-center text-blue-400 mb-1 lg:mb-5 group-hover:scale-110 group-hover:bg-blue-500 transition-all group-hover:text-white shadow-xl shadow-blue-500/20">
                    <History size={18} className="lg:hidden" />
                    <History size={32} className="hidden lg:block" />
                  </div>
                  <h3 className="text-sm lg:text-3xl font-black text-white italic tracking-tighter uppercase leading-none font-outfit">{t('arcade')}</h3>
                  <p className="hidden lg:block text-slate-400 text-[10px] font-medium max-w-[200px] leading-relaxed uppercase tracking-widest opacity-80 font-inter mt-2">{t('arcade_desc')}</p>
                </div>
              </button>

              {/* MISSION MODE */}
              <button
                onClick={() => setView('levels')}
                className="group relative h-28 lg:h-56 bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 border-t-0 hover:border-orange-500/50 rounded-b-[1rem] lg:rounded-b-[2.5rem] p-3 lg:p-8 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-orange-500/10 blur-[40px] lg:blur-[60px] -mr-12 -mt-12 lg:-mr-16 lg:-mt-16 rounded-full transition-all group-hover:bg-orange-500/20" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 lg:w-16 lg:h-16 bg-orange-500/20 rounded-lg lg:rounded-[1.25rem] flex items-center justify-center text-orange-400 mb-1 lg:mb-5 group-hover:scale-110 group-hover:bg-orange-500 transition-all group-hover:text-white shadow-xl shadow-orange-500/20">
                    <Trophy size={18} className="lg:hidden" />
                    <Trophy size={32} className="hidden lg:block" />
                  </div>
                  <h3 className="text-sm lg:text-3xl font-black text-white italic tracking-tighter uppercase leading-none font-outfit">{t('mission')}</h3>
                  <p className="hidden lg:block text-slate-400 text-[10px] font-medium max-w-[200px] leading-relaxed uppercase tracking-widest opacity-80 font-inter mt-2">{t('mission_desc')}</p>
                </div>
              </button>
            </div>

            {/* SIDEBAR COLUMN - Fixed on the right */}
            <div className="w-[140px] lg:w-80 shrink-0 space-y-2 lg:space-y-4 h-full overflow-y-auto no-scrollbar pb-20 lg:pb-0">
              {/* RANK & INVENTORY ROW */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setView('leaderboard')}
                  className="bg-slate-900/40 hover:bg-white/5 border border-white/5 rounded-[1rem] lg:rounded-[1.5rem] p-2 lg:p-4 backdrop-blur-md flex flex-col items-center justify-center group active:scale-95 transition-all"
                >
                  <div className="text-[6px] lg:text-[8px] font-black text-slate-500 uppercase leading-none mb-1 group-hover:text-sky-400 transition-colors">RANK</div>
                  <div className="text-base lg:text-xl font-black text-white italic leading-none">#--</div>
                </button>

                <button
                  onClick={() => setView('inventory')}
                  className="bg-slate-900/40 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 rounded-[1rem] lg:rounded-[1.5rem] p-2 lg:p-4 backdrop-blur-md flex flex-col items-center justify-center transition-all group active:scale-95"
                >
                  <Box size={14} className="text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-[6px] lg:text-[8px] font-black text-white uppercase leading-none italic">{t('inventory')}</div>
                </button>
              </div>

              {/* DAILY REWARD & MISSIONS ROW */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setView('daily')}
                  className="group bg-slate-900/40 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 rounded-[1rem] lg:rounded-[2rem] p-2 lg:p-4 backdrop-blur-md transition-all text-center flex flex-col items-center justify-center active:scale-95"
                >
                  <Gift size={14} className="text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-[6px] lg:text-[8px] font-black text-slate-500 uppercase leading-none mb-0.5">DAILY</div>
                  <div className="text-[8px] lg:text-xs font-black text-white italic uppercase leading-none">Day {streakCount + 1}</div>
                </button>

                <button className="group bg-slate-900/40 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-[1rem] lg:rounded-[2rem] p-2 lg:p-4 backdrop-blur-md transition-all text-center flex flex-col items-center justify-center opacity-70 cursor-not-allowed">
                  <ListTodo size={14} className="text-emerald-500 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-[6px] lg:text-[8px] font-black text-slate-500 uppercase leading-none mb-0.5">MISSION</div>
                  <div className="text-[8px] lg:text-xs font-black text-white italic uppercase leading-none opacity-50">Locked</div>
                </button>
              </div>
            </div>
          </div>
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

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center bg-slate-950/20 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center p-2 backdrop-blur-md border border-white/20">
            <img src="/logo.png" alt="WORDLENGE" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            <Gamepad2 className="text-orange-500" size={32} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent italic tracking-tighter leading-none font-outfit">
              WORDLENGE
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-[1.5px] w-12 bg-gradient-to-r from-orange-500 to-blue-500"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] font-inter">Puzzle Edition v2.6</span>
              <div className="flex items-center gap-1.5 ml-4 bg-slate-900/40 p-1 rounded-lg border border-white/5 font-inter">
                <button
                  onClick={() => setLanguage('tr')}
                  className={`px-2 py-0.5 text-[9px] font-black rounded transition-all ${language === 'tr' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  TR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 text-[9px] font-black rounded transition-all ${language === 'en' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => setView('settings')}
                className="ml-2 w-8 h-8 bg-slate-900/40 hover:bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all active:scale-95 group"
              >
                <Settings size={16} className="group-hover:rotate-45 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-900/60 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-2 group transition-all hover:border-amber-500/50">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <Coins size={18} />
            </div>
            <div className="flex flex-col font-outfit">
              <span className="text-xs font-black text-white leading-none">{coins}</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Altın</span>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-3 bg-slate-900/60 border border-white/5 p-1 pr-4 rounded-2xl group transition-all hover:border-sky-500/50 font-outfit">
              <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 font-black italic">
                {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white leading-none truncate max-w-[80px]">
                  {profile?.username || user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => AuthService.signOut()}
                  className="text-[8px] font-bold text-slate-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1 font-inter"
                >
                  <LogOut size={8} /> {t('logout')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center gap-2 text-slate-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 font-inter"
            >
              <User size={16} className="text-orange-500" />
              Giriş Yap
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 flex flex-col items-center overflow-y-auto no-scrollbar p-4 lg:p-8">
        <div className="w-full h-full flex items-center justify-center">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

// Helper component for Leaderboard view to encapsulate its state
const LeaderboardView = ({ t, profile }) => {
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
    <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-2 max-h-[70vh]">
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
                flex items-center gap-4 p-5 rounded-[2rem] transition-all border 
                ${isMe ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'bg-slate-900/40 border-white/5'}
                ${rank <= 3 ? 'scale-100' : 'scale-[0.98] opacity-80'}
              `}
            >
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center font-black italic text-xl
                ${rank === 1 ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20' :
                  rank === 2 ? 'bg-slate-300 text-slate-950 shadow-lg shadow-slate-300/20' :
                    rank === 3 ? 'bg-amber-700 text-white shadow-lg shadow-amber-700/20' : 'text-slate-500 bg-slate-800'}
              `}>
                {rank}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white italic truncate uppercase text-lg">{item.username}</span>
                  {isMe && <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg uppercase tracking-tighter">{t('you')}</span>}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Coins size={12} className="text-amber-500" />
                    <span className="text-xs font-bold font-inter tracking-wider">{item.coins}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Trophy size={12} className="text-sky-500" />
                    <span className="text-xs font-bold font-inter tracking-wider">{t('level_abbr')}{item.current_level_index + 1}</span>
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

const MissionTracker = ({ goals, t }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-2 mb-1">
      <Target className="text-orange-400" size={14} />
      <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{t('missions_title')}</h3>
    </div>
    {goals.map((goal, idx) => {
      const isDone = goal.current >= goal.count;
      return (
        <div key={idx} className={`relative overflow-hidden group bg-slate-950/60 border ${isDone ? 'border-green-500/40' : 'border-white/5'} rounded-xl p-2 transition-all`}>
          <div className="flex items-center justify-between relative z-10">
            <span className={`text-[9px] font-bold tracking-wide ${isDone ? 'text-green-400 line-through opacity-50' : 'text-slate-400'}`}>
              {goal.text}
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

function App() {
  const {
    grid, selectedPath, animatingCells, score, moves, level, difficulty,
    foundWords, gameState, resetGame, swapSelection, tools, activeTool,
    setActiveTool, changeDifficulty, selectCell, finishTurn, shuffle,
    isDictionaryLoaded, gameMode, currentLevelIndex, levelGoals, startMission,
    coins, buyTool, addCoins, addTool,
    cloudLevels, isLoadingLevels,
    user, profile, isLoadingProfile, completedLevels,
    language, setLanguage, t
  } = useGame();

  const [isMuted, setIsMuted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [showDashboard, setShowDashboard] = useState(true);

  useEffect(() => {
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
    setShowDailyGift(false);
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-outfit select-none overflow-hidden flex flex-col">
      {/* Auth Modal stays as utility */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => setIsAuthModalOpen(false)}
        t={t}
      />

      {showDashboard && (
        <Dashboard
          levels={cloudLevels}
          isLoading={isLoadingLevels}
          currentLevel={completedLevels}
          coins={coins}
          tools={tools}
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
          onSelectArcade={() => {
            changeDifficulty('normal');
            setShowDashboard(false);
            resetGame();
          }}
          onSelectMission={(idx) => {
            startMission(idx);
            setShowDashboard(false);
          }}
        />
      )}

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-md shrink-0 gap-8">
        <div className="flex items-center gap-4 shrink-0">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-purple-600 rounded-xl shadow-lg shadow-sky-500/20">
            <LayoutGrid size={24} className="text-white" />
          </div>
          <div className="min-w-[140px]">
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent italic uppercase leading-none mb-1">
              {gameMode === 'mission' ? `${t('mission')} ${cloudLevels[currentLevelIndex].id}` : 'WORDLENGE'}
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate font-inter">
              {gameMode === 'mission' ? cloudLevels[currentLevelIndex].title : t('arcade')}
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

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowDashboard(true)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-400 hover:text-white"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={resetGame}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-400 hover:text-white"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 min-h-0 overflow-hidden relative z-10">
        {/* Left Side: Goals & Stats */}
        <aside className="w-56 flex flex-col gap-3 shrink-0 overflow-y-auto no-scrollbar hidden md:flex">
          <div className="bg-slate-900/40 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl space-y-3 shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Skor</div>
                <div className="text-xl font-black text-sky-400 tabular-nums">{score}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Hamle</div>
                <div className="text-xl font-black text-amber-400 tabular-nums">{moves}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-slate-900/40 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl flex flex-col min-h-0">
            {gameMode === 'mission' ? (
              <MissionTracker goals={levelGoals} />
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 shrink-0">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kelimeler</h2>
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
            )}
          </div>
        </aside>

        {/* Center: Grid Area */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 h-full">
          <div className="flex-1 flex items-center justify-center min-h-0 relative">
            <div className={`
                relative max-h-full w-full max-w-[min(100%,(72vh*11/9))] md:aspect-[11/9] bg-slate-950/40 rounded-xl md:rounded-3xl border-2 shadow-2xl overflow-hidden transition-all duration-300
                ${activeTool ? 'border-purple-500 ring-[8px] ring-purple-500/10' : 'border-white/5'}
            `}>
              <PremiumCanvas
                grid={grid}
                selectedPath={selectedPath}
                animatingCells={animatingCells}
                swapSelection={swapSelection}
                onSelectCell={selectCell}
                onFinishTurn={finishTurn}
              />

              {/* Overlay: Victory / GameOver / Tool Active */}
              {gameState !== 'playing' && (
                <div className="absolute inset-0 z-[300] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                  <div className="max-w-xs w-full">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border ${gameState === 'victory' ? 'bg-green-500/20 border-green-400 text-green-400' : 'bg-rose-500/20 border-rose-400 text-rose-400'}`}>
                      {gameState === 'victory' ? <Award size={40} /> : <Zap size={40} />}
                    </div>
                    <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase">
                      {gameState === 'victory' ? 'TEBRİKLER!' : 'MAALESEF'}
                    </h2>
                    <p className="text-slate-400 text-sm font-medium mb-8">
                      {gameState === 'victory' ? 'Seviyeyi başarıyla tamamladın! Ödüllerin envanterine eklendi.' : 'Hamlelerin bitti ama pes etme. Tekrar deneyebilirsin.'}
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowDashboard(true)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl transition-all active:scale-95 uppercase text-xs">ANA MENÜ</button>
                      <button onClick={resetGame} className={`flex-1 py-4 ${gameState === 'victory' ? 'bg-green-500 hover:bg-green-400 shadow-green-500/30' : 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/30'} text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 uppercase text-xs`}>
                        {gameState === 'victory' ? 'DEVAM ET' : 'TEKRAR DENE'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeTool && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-6 py-2 rounded-full animate-bounce shadow-2xl uppercase tracking-[0.2em] z-20 pointer-events-none">
                  Aktif: {activeTool === 'bomb' ? 'BOMBA' : activeTool === 'swap' ? 'TAKAS' : activeTool === 'row' ? 'SATIR' : activeTool === 'col' ? 'SÜTUN' : 'HÜCRE'}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Tools (Mobile Only) */}
          <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar pb-2 pt-2 shrink-0">
            <button onClick={shuffle} className="shrink-0 w-14 h-14 bg-slate-900 rounded-2xl border border-white/5 flex items-center justify-center active:scale-95 transition-all">
              <RefreshCw className="w-6 h-6 text-amber-400" />
            </button>
            {['cell', 'bomb', 'row', 'col', 'swap'].map(id => (
              <button key={id} disabled={tools[id] === 0} onClick={() => setActiveTool(activeTool === id ? null : id)} className={`shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center relative active:scale-95 transition-all ${activeTool === id ? 'bg-amber-400/10 border-amber-400' : 'bg-slate-900 border-white/5'} ${tools[id] === 0 ? 'opacity-20' : ''}`}>
                <span className={`${id === 'cell' ? 'text-purple-400' : id === 'bomb' ? 'text-amber-400' : id === 'row' ? 'text-rose-400' : id === 'col' ? 'text-emerald-400' : 'text-sky-400'}`}>
                  {id === 'cell' ? <Target className="w-6 h-6" /> : id === 'bomb' ? <Sparkles className="w-6 h-6" /> : id === 'row' ? <MoveHorizontal className="w-6 h-6" /> : id === 'col' ? <MoveVertical className="w-6 h-6" /> : <AlignLeft className="w-6 h-6" />}
                </span>
                {tools[id] > 0 && <span className="absolute -top-1.5 -right-1.5 bg-white text-slate-950 text-[9px] font-black w-5 h-5 rounded-full border-2 border-slate-950 flex shadow-lg items-center justify-center">{tools[id]}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Tools & Powers */}
        <aside className="w-20 shrink-0 flex flex-col gap-1 py-1 hidden md:flex overflow-y-auto no-scrollbar items-center justify-center">

          <button
            onClick={shuffle}
            className="group flex flex-col items-center p-2 bg-slate-900/40 hover:bg-slate-800/60 rounded-xl border border-white/5 transition-all active:scale-95 shadow-xl"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-950 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </div>
          </button>

          <div className="h-px bg-white/5 w-full mx-2 my-0.5" />

          {[
            { id: 'cell', icon: <Target className="w-5 h-5" />, color: 'text-purple-400', count: tools.cell },
            { id: 'bomb', icon: <Sparkles className="w-5 h-5" />, color: 'text-amber-400', count: tools.bomb },
            { id: 'row', icon: <MoveHorizontal className="w-5 h-5" />, color: 'text-rose-400', count: tools.row },
            { id: 'col', icon: <MoveVertical className="w-5 h-5" />, color: 'text-emerald-400', count: tools.col },
            { id: 'swap', icon: <AlignLeft className="w-5 h-5" />, color: 'text-sky-400', count: tools.swap },
          ].map((tool) => {
            const price = 100;
            const canBuy = coins >= price;
            const isOutOfStock = tool.count === 0;

            return (
              <button
                key={tool.id}
                onClick={() => {
                  if (isOutOfStock) {
                    buyTool(tool.id, price);
                  } else {
                    setActiveTool(activeTool === tool.id ? null : tool.id);
                  }
                }}
                className={`
                  group flex flex-col items-center p-2 rounded-xl border transition-all active:scale-95 shadow-xl relative
                  ${activeTool === tool.id ? 'bg-amber-400/10 border-amber-400 scale-105' : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60'}
                  ${isOutOfStock && !canBuy ? 'opacity-20 grayscale cursor-not-allowed' : 'opacity-100'}
                `}
              >
                <div className={`w-9 h-9 rounded-lg bg-slate-950 flex items-center justify-center ${tool.color} ${isOutOfStock ? 'opacity-40' : ''}`}>
                  {tool.icon}
                </div>
                {tool.count > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-white text-slate-950 text-[7px] font-black w-4 h-4 rounded-full border border-slate-950 flex shadow-lg items-center justify-center z-10">
                    {tool.count}
                  </span>
                ) : (
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[6px] font-black px-1 rounded-full border border-slate-950 flex items-center gap-0.5 shadow-lg z-10">
                    <Coins size={6} />
                    {price}
                  </div>
                )}
              </button>
            );
          })}
        </aside>

      </main>

      {/* Game Over Modal */}
      {
        gameState === 'gameover' && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(56,189,248,0.2)] animate-in fade-in zoom-in duration-500 flex flex-col">
              <div className="p-8 pb-4 text-center">
                <div className="w-20 h-20 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-400/30">
                  <Trophy className="w-10 h-10 text-sky-400" />
                </div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter mb-1">OYUN BİTTİ</h2>
                <p className="text-slate-400 text-sm font-medium">Harika bir performans!</p>
              </div>

              <div className="flex-1 px-8 py-4 space-y-4 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Skor</div>
                    <div className="text-2xl font-black text-sky-400">{score}</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Kelimeler</div>
                    <div className="text-2xl font-black text-amber-400">{foundWords.length}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex justify-between">
                    <span>Bulunan Kelimeler</span>
                    <span>{foundWords.length} Adet</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto no-scrollbar space-y-1">
                    {foundWords.length > 0 ? (
                      foundWords.map((word, i) => (
                        <div key={i} className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-300 flex justify-between items-center border border-white/5">
                          <span>{word}</span>
                          <span className="text-[10px] text-sky-500 uppercase">{word.length} Harf</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-slate-600 italic text-xs">Hiç kelime bulunamadı</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 pt-4">
                <button
                  onClick={resetGame}
                  className="w-full py-5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(56,189,248,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  YENİDEN BAŞLA
                </button>
              </div>
            </div>
          </div>
        )
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
      `}</style>
    </div>
  );
}

export default App;
