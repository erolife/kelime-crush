import React, { useState } from 'react';
import { X, Target, Zap, ScrollText, CheckCircle2, Gift, Coins, Trophy, Sparkles } from 'lucide-react';

export default function DailyMissions({ onClose, dailyMissions, claimMissionReward, language, t, profile, soundManager }) {
    const [claimingId, setClaimingId] = useState(null);

    const handleClaim = async (taskId) => {
        if (claimingId) return;
        setClaimingId(taskId);
        soundManager?.play('pop');

        const success = await claimMissionReward(taskId);

        if (success) {
            soundManager?.play('powerup');
            // Animasyon için kısa bir süre bekleyebiliriz
        }
        setClaimingId(null);
    };

    const getIcon = (id) => {
        switch (id) {
            case 'use_tool': return Zap;
            case 'find_word': return Target;
            case 'play_game': return Trophy;
            default: return ScrollText;
        }
    };

    const getColor = (id) => {
        switch (id) {
            case 'use_tool': return 'text-amber-400';
            case 'find_word': return 'text-sky-400';
            case 'play_game': return 'text-emerald-400';
            default: return 'text-white';
        }
    };

    const getBgColor = (id) => {
        switch (id) {
            case 'use_tool': return 'bg-amber-400/20';
            case 'find_word': return 'bg-sky-400/20';
            case 'play_game': return 'bg-emerald-400/20';
            default: return 'bg-white/20';
        }
    };

    return (
        <div className="relative w-full h-full z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col pt-4 animate-in fade-in duration-300">
            <div className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8 flex flex-col min-h-0 pb-20">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onClose}
                        className="w-12 h-12 bg-slate-800/50 border border-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex-1 px-4 text-center">
                        <h2 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">
                            {t('daily_missions_title') || (language === 'tr' ? 'GÜNLÜK GÖREVLER' : 'DAILY MISSIONS')}
                        </h2>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                            {language === 'tr' ? 'HER GÜN YENİ ÖDÜLLER' : 'NEW REWARDS EVERY DAY'}
                        </div>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
                            <Sparkles size={20} />
                        </div>
                    </div>
                </div>

                {/* Mission List */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                    {dailyMissions?.tasks?.map((task) => {
                        const Icon = getIcon(task.id);
                        const isCompleted = task.current >= task.target;
                        const isClaimed = task.claimed;
                        const progress = Math.min(100, (task.current / task.target) * 100);

                        return (
                            <div
                                key={task.id}
                                className={`relative group bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 transition-all duration-300 ${isCompleted && !isClaimed ? 'ring-2 ring-emerald-500/50 bg-emerald-500/5' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getBgColor(task.id)} ${getColor(task.id)} shadow-lg shadow-black/20`}>
                                        <Icon size={28} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-tight truncate">
                                                {language === 'tr' ? task.label_tr : task.label_en}
                                            </h3>
                                            <span className={`text-xs font-black tabular-nums ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                                                {task.current} / {task.target}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full h-3 bg-slate-800/50 rounded-full overflow-hidden mb-4 border border-white/5 p-[2px]">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-gradient-to-r from-sky-400 to-indigo-500'}`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        {/* Footer: Rewards & Action */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-xl border border-white/5">
                                                    {task.type === 'coins' ? (
                                                        <Coins size={14} className="text-amber-400" />
                                                    ) : (
                                                        <Trophy size={14} className="text-sky-400" />
                                                    )}
                                                    <span className="text-xs font-black text-white">+{task.reward}</span>
                                                </div>
                                            </div>

                                            {isClaimed ? (
                                                <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                                                    <CheckCircle2 size={14} />
                                                    {language === 'tr' ? 'ALINDI' : 'CLAIMED'}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleClaim(task.id)}
                                                    disabled={!isCompleted || claimingId === task.id}
                                                    className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-xl
                                                        ${isCompleted
                                                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 shadow-emerald-500/20 hover:brightness-110'
                                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                                                        }
                                                    `}
                                                >
                                                    {claimingId === task.id ? (
                                                        <div className="w-3 h-3 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                                                    ) : (
                                                        <Gift size={14} />
                                                    )}
                                                    {language === 'tr' ? 'ÖDÜLÜ AL' : 'CLAIM'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Text */}
                <div className="mt-8 text-center p-6 bg-slate-900/40 border border-white/5 rounded-3xl">
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-relaxed">
                        {language === 'tr'
                            ? 'GÖREVLER GECE YARISI (00:00) SIFIRLANIR'
                            : 'MISSIONS RESET AT MIDNIGHT (00:00)'}
                    </div>
                </div>
            </div>
        </div>
    );
}
