import React, { useState } from 'react';
import { X, Share2, Heart, Instagram, Twitter, Download, Sparkles, Feather } from 'lucide-react';

export const StoryDisplayModal = ({
    isOpen,
    onClose,
    story,
    onLike,
    isLiked: initialIsLiked,
    language
}) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);

    if (!isOpen || !story) return null;

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike(story.id, isLiked);
    };

    const handleShare = (platform) => {
        const text = `"${story.title}"\n\n${story.content}\n\n${story.hashtag}`;
        const url = `https://wordlenge.com/story/${story.id}`;

        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        } else if (platform === 'instagram') {
            // Instagram usually requires app interaction, but we can copy to clipboard
            navigator.clipboard.writeText(text);
            alert(language === 'tr' ? "Metin kopyalandı! Instagram'da paylaşabilirsiniz." : "Text copied! You can share it on Instagram.");
        }
    };

    return (
        <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="w-full max-w-sm flex flex-col items-center">

                {/* Close Button Above */}
                <button onClick={onClose} className="self-end mb-4 text-white/50 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur-md transition-all">
                    <X size={24} />
                </button>

                {/* Polaroid Frame */}
                <div className="bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-1 transform-gpu hover:rotate-0 transition-transform duration-500 w-full aspect-[4/5] flex flex-col rounded-sm relative overflow-hidden">

                    {/* Retro Filter Overlay */}
                    <div className="absolute inset-0 bg-amber-500/5 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-20 pointer-events-none"></div>

                    {/* Image Area (Story Theme Header) */}
                    <div className="w-full h-48 bg-slate-900 flex flex-col items-center justify-center text-center p-6 relative group overflow-hidden border border-slate-800">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-50"></div>

                        <div className="relative z-10 scale-125 mb-3">
                            <span className="text-5xl drop-shadow-lg">{story.emoji || '📖'}</span>
                        </div>

                        <h4 className="relative z-10 text-white font-black italic uppercase tracking-tighter text-xl drop-shadow-md leading-tight px-2">
                            {story.title}
                        </h4>

                        <div className="absolute bottom-2 left-2 text-[8px] font-bold text-white/30 tracking-widest uppercase">
                            Writer Mode AI
                        </div>
                    </div>

                    {/* Content Area (Handwriting style) */}
                    <div className="flex-1 pt-6 pb-12 px-2 flex flex-col justify-center items-center text-center">
                        <p className="text-slate-800 font-medium text-lg leading-relaxed italic" style={{ fontFamily: 'serif' }}>
                            {story.content}
                        </p>

                        <div className="mt-4 text-sky-600 font-bold text-xs tracking-tight">
                            {story.hashtag || '#wordlenge #story'}
                        </div>
                    </div>

                    {/* Polaroid Bottom Label */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center border-t border-slate-100 pt-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Author</span>
                            <span className="text-sm font-black text-slate-900 leading-none mt-1">{story.user_name}</span>
                        </div>
                        <div className="text-[10px] text-slate-300 font-mono">
                            {new Date(story.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Social Actions Group */}
                <div className="mt-8 flex items-center gap-4 animate-in slide-in-from-bottom duration-700 delay-300">
                    <button
                        onClick={handleLike}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 ${isLiked ? 'bg-rose-500 text-white shadow-rose-500/30' : 'bg-white/10 text-white border border-white/20'
                            }`}
                    >
                        <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'animate-pulse' : ''} />
                    </button>

                    <button
                        onClick={() => handleShare('twitter')}
                        className="w-14 h-14 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-90 transition-all"
                    >
                        <Twitter size={24} fill="currentColor" />
                    </button>

                    <button
                        onClick={() => handleShare('instagram')}
                        className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-90 transition-all"
                    >
                        <Instagram size={24} />
                    </button>

                    <button
                        className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-90 transition-all"
                    >
                        <Download size={24} />
                    </button>
                </div>

                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-6 bg-white/5 py-1 px-3 rounded-full border border-white/5">
                    {language === 'tr' ? 'Hikayen Veritabanına Kaydedildi' : 'Your Story is Saved to Database'}
                </p>
            </div>
        </div>
    );
};

export default StoryDisplayModal;
