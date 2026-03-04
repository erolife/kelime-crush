import React, { useState, useEffect } from 'react';
import { Coins, Zap, RefreshCw, MoveHorizontal, MoveVertical, Target, Sparkles, X, Gift } from 'lucide-react';

const SPIN_WHEEL_SLICES = [
    { id: 0, type: 'coins', amount: 50, label: '50', icon: Coins, color: '#f59e0b', weight: 40 }, // amber-500
    { id: 1, type: 'tool', toolId: 'swap', amount: 1, label: 'TAKAS', icon: RefreshCw, color: '#0ea5e9', weight: 10 }, // sky-500
    { id: 2, type: 'coins', amount: 100, label: '100', icon: Coins, color: '#f97316', weight: 20 }, // orange-500
    { id: 3, type: 'tool', toolId: 'bomb', amount: 1, label: 'BOMBA', icon: Zap, color: '#fbbf24', weight: 10 }, // amber-400
    { id: 4, type: 'coins', amount: 200, label: '200', icon: Coins, color: '#ef4444', weight: 10 }, // red-500
    { id: 5, type: 'tool', toolId: 'row', amount: 1, label: 'SATIR', icon: MoveHorizontal, color: '#10b981', weight: 5 }, // emerald-500
    { id: 6, type: 'tool', toolId: 'col', amount: 1, label: 'SÜTUN', icon: MoveVertical, color: '#22c55e', weight: 4 }, // green-500
    { id: 7, type: 'tool', toolId: 'cell', amount: 1, label: 'NİŞAN', icon: Target, color: '#a855f7', weight: 1 }  // purple-500
];

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default function DailySpin({ onClose, user, profile, updateProfile, addCoins, addTool, t, soundManager }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [reward, setReward] = useState(null);
    const [canSpin, setCanSpin] = useState(false);
    const [timeLeftStr, setTimeLeftStr] = useState('');
    const [flyingReward, setFlyingReward] = useState(null);

    useEffect(() => {
        if (!user) return;

        const checkSpinAvailability = () => {
            // Önce Supabase profilinden al, yoksa localStorage'den
            const lastSpinTimeStr = profile?.crush_last_spin || localStorage.getItem(`crush_last_spin_${user.id}`);

            if (!lastSpinTimeStr) {
                setCanSpin(true);
                return;
            }

            const now = Date.now();
            const timeDiff = now - parseInt(lastSpinTimeStr, 10);

            if (timeDiff >= ONE_DAY_MS) {
                setCanSpin(true);
                setTimeLeftStr('');
            } else {
                setCanSpin(false);
                const remaining = ONE_DAY_MS - timeDiff;
                const hours = Math.floor(remaining / (1000 * 60 * 60));
                const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

                const h = hours.toString().padStart(2, '0');
                const m = minutes.toString().padStart(2, '0');
                const s = seconds.toString().padStart(2, '0');

                setTimeLeftStr(`${h}:${m}:${s}`);
            }
        };

        checkSpinAvailability();
        const interval = setInterval(checkSpinAvailability, 1000); // Check every second
        return () => clearInterval(interval);
    }, [user]);

    const getWeightedRandomSlice = () => {
        const totalWeight = SPIN_WHEEL_SLICES.reduce((acc, slice) => acc + slice.weight, 0);
        let randomNum = Math.random() * totalWeight;

        for (let slice of SPIN_WHEEL_SLICES) {
            if (randomNum < slice.weight) {
                return slice;
            }
            randomNum -= slice.weight;
        }
        return SPIN_WHEEL_SLICES[0];
    };

    const handleSpin = () => {
        if (!canSpin || isSpinning || !user) return;

        soundManager?.play('pop'); // Or some spin tick sound
        setIsSpinning(true);
        setReward(null);

        const selectedSlice = getWeightedRandomSlice();
        const sliceAngle = 360 / SPIN_WHEEL_SLICES.length; // 45 derecelik dilim açıları

        // Conic gradient indexe göre 0 dereceden saat yönünde diziliyor.
        // Slice 0 (0 deg), Slice 1 (45 deg) vb. 
        // Okumuz üstte olduğundan hedeflenen dilimi tepeye (0'a) getirmeliyiz.
        // O yüzden çevrilmesi gereken açı: 360 - (index * 45)
        const targetRotation = 360 - (selectedSlice.id * sliceAngle);

        // Rastgele bir ofset ekleyerek (okun dilimin tam ortasında veya kenarında durması için +- 15 derece esneklik)
        const randomOffset = Math.floor(Math.random() * 30) - 15;

        // Çoklu tam dönüşler (8 tur dönme efekti)
        const totalRotation = rotation + (360 * 8) + targetRotation + randomOffset - (rotation % 360);

        setRotation(totalRotation);

        setTimeout(async () => {
            soundManager?.play('powerup');
            setReward(selectedSlice);
            setIsSpinning(false);
            setCanSpin(false);

            const nowStr = Date.now().toString();
            // Yedek olarak local'e kaydet
            localStorage.setItem(`crush_last_spin_${user.id}`, nowStr);

            // Eğer updateProfile prop'u geçildiyse veritabanına kaydet
            if (updateProfile) {
                await updateProfile({ crush_last_spin: nowStr });
            }
        }, 5000); // 5 seconds transition duration
    };

    const handleClaimReward = () => {
        if (!reward) return;

        const isPro = profile?.is_pro || false;
        const multiplier = isPro ? 2 : 1;
        const finalAmount = reward.amount * multiplier;

        // Apply rewards to user account
        if (reward.type === 'coins') {
            addCoins(finalAmount);
        } else if (reward.type === 'tool') {
            addTool(reward.toolId, finalAmount);
        }

        // Trigger flying animation with final amount
        setFlyingReward({ ...reward, amount: finalAmount });
        setReward(null);

        // Clear animation after it finishes
        setTimeout(() => {
            setFlyingReward(null);
        }, 1200);
    };

    // SLICE_DEGREE artık render kısmında kullanılmasa da tutulabilir
    const SLICE_DEGREE = 360 / SPIN_WHEEL_SLICES.length;

    return (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md overflow-y-auto w-full h-full flex flex-col pt-[max(env(safe-area-inset-top),16px)]">
            <style>{`
                @keyframes flyToCorner {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    20% {
                        transform: translate(-50%, -50%) scale(1.5);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(35vw, -45vh) scale(0.1);
                        opacity: 0;
                    }
                }
            `}</style>
            <div className="flex-1 max-w-2xl w-full mx-auto p-4 landscape:p-2 md:p-8 flex flex-col items-center justify-center">

                {/* Header */}
                <div className="w-full flex items-center justify-between mb-8">
                    <button
                        onClick={onClose}
                        className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex-1 px-4 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-2 shadow-lg shadow-orange-500/20 text-white">
                            <Gift size={28} />
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
                            {t('daily_spin_title') || 'GÜNLÜK ŞANS ÇARKI'}
                        </h2>
                    </div>
                    <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full flex flex-col items-center justify-center">

                    {/* The Wheel */}
                    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                        {/* Shadow/Glow under wheel */}
                        <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-3xl" />

                        {/* Outer Border */}
                        <div className="absolute inset-0 rounded-full border-[12px] border-slate-800 shadow-2xl overflow-hidden bg-slate-800">
                            {/* Inner Spinning Content */}
                            <div
                                className="relative w-full h-full rounded-full transition-transform ease-[cubic-bezier(0.15,0.85,0.15,1)]"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    transitionDuration: isSpinning ? '5s' : '0s',
                                    // 8 Dilimli renkli Pizza katmanını CSS conic-gradient ile oluşturuyoruz:
                                    // İlk dilim ortada (0 deg) olsun diye -22.5 dereceden başlatıyoruz.
                                    background: `conic-gradient(from -22.5deg,
                                        ${SPIN_WHEEL_SLICES[0].color} 0deg 45deg,
                                        ${SPIN_WHEEL_SLICES[1].color} 45deg 90deg,
                                        ${SPIN_WHEEL_SLICES[2].color} 90deg 135deg,
                                        ${SPIN_WHEEL_SLICES[3].color} 135deg 180deg,
                                        ${SPIN_WHEEL_SLICES[4].color} 180deg 225deg,
                                        ${SPIN_WHEEL_SLICES[5].color} 225deg 270deg,
                                        ${SPIN_WHEEL_SLICES[6].color} 270deg 315deg,
                                        ${SPIN_WHEEL_SLICES[7].color} 315deg 360deg
                                    )`
                                }}
                            >
                                {/* Çark içi sınırları yumuşatmak için CSS gölgesi */}
                                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />

                                {SPIN_WHEEL_SLICES.map((slice, index) => {
                                    // Yazı eksenini dilimin PİŞMİŞ ORTASI (her biri 45 derece) kabul et.
                                    const sliceCenterAngle = index * 45;

                                    return (
                                        <div
                                            key={slice.id}
                                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                            style={{
                                                transform: `rotate(${sliceCenterAngle}deg)`
                                            }}
                                        >
                                            <div
                                                className="absolute top-0 left-1/2 -ml-[15%] w-[30%] h-[50%] flex flex-col items-center justify-start pt-[12%] z-10"
                                            >
                                                <div className="text-white text-center flex flex-col items-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                                                    <span className="font-black text-xs sm:text-2xl italic tracking-tighter leading-none mb-1">{slice.label}</span>
                                                    <slice.icon size={20} className="mt-0 opacity-90 sm:w-6 sm:h-6" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Center Hub */}
                        <div className="absolute inset-0 m-auto w-16 h-16 bg-slate-900 border-4 border-slate-700 rounded-full shadow-inner flex items-center justify-center z-10">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                        </div>

                        {/* Top Indicator Arrow */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-12 z-20" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
                            <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[24px] border-l-transparent border-r-transparent border-t-white relative" />
                        </div>
                    </div>

                    {/* Action Button & Status */}
                    <div className="mt-12 w-full max-w-xs text-center">
                        <button
                            onClick={handleSpin}
                            disabled={!canSpin || isSpinning}
                            className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest italic transition-all shadow-xl
                                ${canSpin && !isSpinning
                                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 hover:scale-[1.02] shadow-orange-500/20'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                                }
                            `}
                        >
                            {isSpinning
                                ? (t('spinning') || 'ÇEVRİLİYOR...')
                                : canSpin
                                    ? (t('spin_wheel') || 'ÇARKI ÇEVİR')
                                    : (t('wait_tomorrow') || 'YARIN TEKRAR GEL')
                            }
                        </button>

                        {!canSpin && !isSpinning && !reward && (
                            <div className="mt-4 text-slate-400 text-sm font-black uppercase tracking-widest">
                                {t('next_spin_in') || 'SONRAKİ HAKKINA KALAN SÜRE:'} <span className="text-amber-400">{timeLeftStr}</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Reward Modal Overlays */}
            {reward && (
                <div className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center border border-white/10 shadow-2xl relative overflow-hidden transform animate-in zoom-in duration-500 scale-100">
                        {/* Celebrate Glow bg */}
                        <div className="absolute inset-0 bg-gradient-to-b opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom, ${reward.color}, transparent)` }} />

                        <div className="relative">
                            <Sparkles className="w-16 h-16 mx-auto mb-4 animate-pulse" style={{ color: reward.color }} />
                            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
                                {t('you_won') || 'KAZANDIN!'}
                            </h3>

                            <div className="bg-slate-800/80 rounded-2xl p-6 border border-white/5 inline-flex flex-col items-center justify-center my-4 min-w-[160px] shadow-inner relative group">
                                {profile?.is_pro && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg brightness-110">
                                        PRO 2x BONUS
                                    </div>
                                )}
                                <reward.icon size={48} className="mb-3" style={{ color: reward.color }} />
                                <span className="text-2xl font-black" style={{ color: reward.color }}>
                                    {reward.amount * (profile?.is_pro ? 2 : 1)} {reward.type === 'coins' ? (t('gold') || 'Altın') : (t(reward.toolId) || reward.label)}
                                </span>
                            </div>

                            <button
                                onClick={handleClaimReward}
                                className="w-full mt-4 py-4 rounded-xl text-white font-black uppercase tracking-widest transition-opacity hover:opacity-90 shadow-xl"
                                style={{ backgroundColor: reward.color }}
                            >
                                {t('claim_reward') || 'ÖDÜLÜ AL'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Uçan Ödül Animasyon Overlay */}
            {flyingReward && (
                <div
                    className="fixed z-[999] pointer-events-none drop-shadow-2xl"
                    style={{
                        left: '50%',
                        top: '50%',
                        // Use inline animation injection
                        animation: 'flyToCorner 1.2s cubic-bezier(0.15, -0.2, 0.25, 1) forwards'
                    }}
                >
                    <div className="bg-slate-800/80 rounded-full p-4 border border-white/20 shadow-inner flex flex-col items-center justify-center">
                        <flyingReward.icon size={48} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{ color: flyingReward.color }} />
                        <span className="text-xl font-black mt-1" style={{ color: flyingReward.color }}>
                            +{flyingReward.amount}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
