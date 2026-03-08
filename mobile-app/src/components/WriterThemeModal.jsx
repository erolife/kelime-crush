import React, { useState } from 'react';
import { X, Feather, Star, Sparkles, BookOpen, Skull, Heart, Zap, Gem } from 'lucide-react';

export const WriterThemeModal = ({
    isOpen,
    onClose,
    onGenerate,
    words,
    isPro,
    coins,
    language
}) => {
    const [selectedTheme, setSelectedTheme] = useState('fantasy');
    const [storyLength, setStoryLength] = useState('short'); // 'short' | 'long'
    const [selectedWords, setSelectedWords] = useState([]); // Kullanıcının seçtiği kelimeler
    const [letAIPick, setLetAIPick] = useState(false); // Kelimeleri AI seçsin mi?

    // Tema Tanımları
    const themes = [
        { id: 'fantasy', icon: Sparkles, name_tr: 'Fantastik', name_en: 'Fantasy', color: 'from-purple-500 to-fuchsia-600', ring: 'ring-purple-500', bg: 'bg-purple-500/10' },
        { id: 'comedy', icon: Zap, name_tr: 'Komedi', name_en: 'Comedy', color: 'from-amber-400 to-orange-500', ring: 'ring-amber-500', bg: 'bg-amber-500/10' },
        { id: 'horror', icon: Skull, name_tr: 'Gerilim', name_en: 'Thriller', color: 'from-rose-500 to-red-600', ring: 'ring-rose-500', bg: 'bg-rose-500/10' },
        { id: 'romance', icon: Heart, name_tr: 'Romantik', name_en: 'Romance', color: 'from-pink-400 to-rose-400', ring: 'ring-pink-400', bg: 'bg-pink-500/10' },
        { id: 'scifi', icon: Star, name_tr: 'Bilim Kurgu', name_en: 'Sci-Fi', color: 'from-cyan-400 to-blue-500', ring: 'ring-cyan-500', bg: 'bg-cyan-500/10' },
    ];

    if (!isOpen) return null;

    const t = (key) => {
        // Simple translation stub for Modal (actual translation handled via useGame normally)
        const dict = {
            'modal_title': { tr: 'Yazar Modu', en: 'Writer Mode' },
            'modal_desc': { tr: 'Bulduğun kelimelerle sana özel bir hikaye oluşturalım!', en: 'Let\'s create a unique story with your words!' },
            'found_words': { tr: 'Bulunan Kelimeler', en: 'Found Words' },
            'choose_theme': { tr: 'Hikaye Teması', en: 'Story Theme' },
            'story_length': { tr: 'Hikaye Uzunluğu', en: 'Story Length' },
            'short_desc': { tr: '1-2 Cümle Özeti', en: '1-2 Sentence Summary' },
            'long_desc': { tr: 'Mini bir Masal', en: 'A Mini Tale' },
            'free': { tr: 'ÜCRETSİZ', en: 'FREE' },
            'generate': { tr: 'HİKAYEYİ OLUŞTUR!', en: 'GENERATE STORY!' },
            'not_enough_coins': { tr: 'Yetersiz Altın!', en: 'Not Enough Coins!' }
        };
        return dict[key]?.[language] || dict[key]?.['tr'] || key;
    };

    const longStoryCost = 50;
    const canAffordLong = isPro || coins >= longStoryCost;

    const handleGenerate = () => {
        if (storyLength === 'long' && !canAffordLong) return; // Cannot afford

        onGenerate({
            theme: selectedTheme,
            length: storyLength,
            words: letAIPick ? 'auto' : (selectedWords.length > 0 ? selectedWords : words.slice(0, 5)), // Eğer hiç seçilmediyse ilk 5'i al
            cost: (storyLength === 'long' && !isPro) ? longStoryCost : 0
        });
    };

    const toggleWordSelection = (word) => {
        if (letAIPick) setLetAIPick(false); // Kullanıcı kendi seçmeye başlarsa AI seçimini iptal et

        setSelectedWords(prev => {
            if (prev.includes(word)) return prev.filter(w => w !== word);
            if (prev.length >= 5) return prev; // Maksimum 5 kelime seçilsin
            return [...prev, word];
        });
    };

    return (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">

                {/* Background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10 p-2 bg-slate-950/50 rounded-full">
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-6 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/20 rotate-3">
                        <Feather size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase">{t('modal_title')}</h2>
                    <p className="text-slate-400 text-xs font-bold mt-1">{t('modal_desc')}</p>
                </div>

                {/* Words Showcase & Selection */}
                <div className="mb-6 relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{t('found_words')}</div>
                        <div className="text-[9px] font-bold text-slate-400">{selectedWords.length}/5 Seçildi</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3 max-h-[80px] overflow-y-auto no-scrollbar pb-1">
                        {[...new Set(words)].map((word, idx) => {
                            const isSelected = selectedWords.includes(word);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => toggleWordSelection(word)}
                                    className={`font-black text-xs px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${isSelected
                                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                                            : 'bg-slate-800/80 text-slate-300 border-white/5 hover:bg-slate-700'
                                        } ${letAIPick ? 'opacity-50 grayscale' : ''}`}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => {
                            setLetAIPick(!letAIPick);
                            if (!letAIPick) setSelectedWords([]);
                        }}
                        className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${letAIPick
                                ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                                : 'bg-slate-800/50 text-slate-400 border-white/5 hover:bg-slate-800'
                            }`}
                    >
                        <Sparkles size={12} className="inline mr-1.5 -mt-0.5" />
                        Seçimi Yapay Zekaya Bırak
                    </button>
                </div>

                {/* Theme Selection */}
                <div className="mb-6 relative z-10">
                    <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">{t('choose_theme')}</div>
                    <div className="grid grid-cols-2 gap-2">
                        {themes.map(theme => {
                            const Icon = theme.icon;
                            const isSelected = selectedTheme === theme.id;
                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => setSelectedTheme(theme.id)}
                                    className={`relative p-3 rounded-xl border flex items-center gap-3 transition-all ${isSelected
                                        ? `${theme.bg} ${theme.ring} border-transparent shadow-lg`
                                        : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${theme.color}`}>
                                        <Icon size={16} className="text-white" />
                                    </div>
                                    <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                        {language === 'tr' ? theme.name_tr : theme.name_en}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Length & Economy */}
                <div className="mb-8 relative z-10">
                    <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">{t('story_length')}</div>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Short Story */}
                        <button
                            onClick={() => setStoryLength('short')}
                            className={`p-4 rounded-xl border text-left transition-all relative ${storyLength === 'short' ? 'bg-sky-500/10 border-sky-500/50 ring-1 ring-sky-500' : 'bg-slate-800/50 border-white/5'
                                }`}
                        >
                            <div className={`text-sm font-black mb-1 ${storyLength === 'short' ? 'text-sky-400' : 'text-slate-300'}`}>Hızlı Özet</div>
                            <div className="text-[10px] text-slate-500">{t('short_desc')}</div>
                            <div className="absolute top-3 right-3 text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">
                                {t('free')}
                            </div>
                        </button>

                        {/* Long Story */}
                        <button
                            onClick={() => setStoryLength('long')}
                            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${storyLength === 'long' ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500' : 'bg-slate-800/50 border-white/5'
                                }`}
                        >
                            {isPro && <div className="absolute top-0 right-0 w-8 h-8 bg-purple-500 flex items-center justify-center rounded-bl-xl"><Gem size={14} className="text-white" /></div>}
                            <div className={`text-sm font-black mb-1 ${storyLength === 'long' ? 'text-amber-400' : 'text-slate-300'}`}>Detaylı Hikaye</div>
                            <div className="text-[10px] text-slate-500">{t('long_desc')}</div>
                            <div className="mt-2 flex items-center gap-1 font-black">
                                {isPro ? (
                                    <span className="text-[10px] text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-md">PRO ÜCRETSİZ</span>
                                ) : (
                                    <>
                                        <span className={`text-[12px] ${!canAffordLong && storyLength === 'long' ? 'text-red-400' : 'text-amber-400'}`}>{longStoryCost}</span>
                                        <span className={`text-[10px] ${!canAffordLong && storyLength === 'long' ? 'text-red-400/70' : 'text-amber-400/70'}`}>Altın</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={storyLength === 'long' && !canAffordLong}
                    className={`w-full py-4 rounded-2xl font-black italic uppercase tracking-widest text-lg transition-all flex items-center justify-center gap-2 ${(storyLength === 'long' && !canAffordLong)
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95'
                        }`}
                >
                    {(storyLength === 'long' && !canAffordLong) ? t('not_enough_coins') : (
                        <>
                            <BookOpen size={20} />
                            {t('generate')}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default WriterThemeModal;
