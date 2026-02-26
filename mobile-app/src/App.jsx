import React, { useEffect, useState } from 'react';
import PremiumCanvas from './components/Game/PremiumCanvas';
import { useGame } from './hooks/useGame';
import { soundManager } from './logic/SoundManager';
import {
  Trophy, Zap, Sparkles, RefreshCw,
  Gamepad2, AlignLeft, Settings2, Volume2, VolumeX,
  Target, MoveHorizontal, MoveVertical, X
} from 'lucide-react';

function App() {
  const {
    grid,
    selectedPath,
    animatingCells,
    score,
    moves,
    level,
    difficulty,
    foundWords,
    tools,
    activeTool,
    setActiveTool,
    changeDifficulty,
    selectCell,
    finishTurn,
    shuffle,
    isDictionaryLoaded,
    gameState,
    resetGame,
    swapSelection
  } = useGame('normal');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

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

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-['Outfit'] select-none overflow-hidden flex flex-col">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header / Stats */}
      <header className="p-4 pt-6 flex justify-between items-center z-10 shrink-0">
        <div className="flex gap-2">
          <div className="bg-slate-900/40 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/5 shadow-xl">
            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Skor</div>
            <div className="text-lg font-black text-sky-400 tabular-nums">{score}</div>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/5 shadow-xl">
            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">Hamle</div>
            <div className="text-lg font-black text-amber-400 tabular-nums">{moves}</div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-base font-black tracking-tighter text-white">
            KELİME <span className="text-sky-500">CRUSH</span>
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="bg-slate-900/40 backdrop-blur-xl p-2.5 rounded-xl border border-white/5 shadow-xl hover:bg-slate-800 transition-colors"
          >
            <Settings2 className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 relative px-4 py-2 flex flex-col gap-3 min-h-0 overflow-hidden">
        {/* Current Word & Word Analysis */}
        <div className="grid grid-cols-[1fr_auto] gap-2 items-center z-20">
          <div className={`
                flex-1 px-6 py-3 rounded-2xl backdrop-blur-3xl border-2 transition-all duration-500 flex items-center justify-center min-h-[56px]
                ${currentWord.length >= 3
              ? 'bg-sky-500/20 border-sky-400 scale-[1.02] shadow-[0_0_40px_rgba(56,189,248,0.1)]'
              : 'bg-slate-900/40 border-white/5'}
            `}>
            <span className={`
                text-xl font-black tracking-[0.3em] transition-all
                ${currentWord.length >= 3 ? 'text-white' : 'text-slate-700'}
                `}>
              {currentWord || '.......'}
            </span>
          </div>

          {/* Word History Trigger (Analiz) */}
          <div className="relative group z-30">
            <div className="bg-slate-900/60 backdrop-blur-2xl p-3.5 rounded-2xl border border-white/10 shadow-2xl cursor-pointer">
              <AlignLeft className="w-5 h-5 text-sky-400" />
              {/* Tooltip Menu for Found Words - Using FIXED to ensure it's on top */}
              <div className="fixed right-4 top-24 w-48 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100]">
                <div className="text-[10px] font-black p-2 border-b border-white/5 text-slate-400 uppercase tracking-widest">Kelime Analizi</div>
                <div className="max-h-64 overflow-y-auto no-scrollbar py-1">
                  {foundWords.length > 0 ? (
                    (() => {
                      const grouped = foundWords.reduce((acc, word) => {
                        const len = word.length;
                        if (!acc[len]) acc[len] = [];
                        acc[len].push(word);
                        return acc;
                      }, {});
                      return Object.keys(grouped).sort((a, b) => b - a).map(len => (
                        <div key={len} className="mb-2 last:mb-0">
                          <div className="px-3 py-1 bg-white/5 text-[9px] font-black text-sky-400 uppercase tracking-widest flex justify-between items-center">
                            <span>{len} Harfliler</span>
                            <span className="opacity-50">{grouped[len].length}</span>
                          </div>
                          {grouped[len].map((w, idx) => (
                            <div key={idx} className="px-3 py-1.5 text-[11px] font-bold text-slate-200 border-b border-white/5 last:border-0">
                              {w}
                            </div>
                          ))}
                        </div>
                      ));
                    })()
                  ) : (
                    <div className="px-3 py-3 text-[10px] text-slate-500 italic text-center">Henüz kelime bulunmadı</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-2 min-h-0">
          <div className={`
              relative w-full aspect-square max-w-[min(100%,60vh)] bg-slate-950/40 rounded-[1.5rem] border-2 shadow-2xl overflow-hidden transition-all duration-300 z-10
              ${activeTool ? 'border-amber-400 ring-4 ring-amber-400/20' : 'border-white/5'}
          `}>
            <PremiumCanvas
              grid={grid}
              selectedPath={selectedPath}
              animatingCells={animatingCells}
              swapSelection={swapSelection}
              onSelectCell={selectCell}
              onFinishTurn={finishTurn}
            />
            {activeTool && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full animate-bounce shadow-xl uppercase tracking-widest z-20">
                Aracı Seç: {activeTool === 'bomb' ? 'BOMBA' : activeTool === 'swap' ? 'TAKAS' : activeTool === 'row' ? 'SATIR' : activeTool === 'col' ? 'SÜTUN' : 'HÜCRE'}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer / Tools */}
      <footer className="px-3 py-4 bg-slate-950/90 backdrop-blur-3xl border-t border-white/5 flex justify-center gap-2 z-10 mb-2 shrink-0 overflow-x-auto no-scrollbar">
        <button
          onClick={shuffle}
          className="flex flex-col items-center gap-1 group shrink-0"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-active:scale-90 transition-all shadow-xl hover:bg-slate-800">
            <RefreshCw className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <span className="text-[7px] font-black text-slate-500 tracking-widest uppercase">Karıştır</span>
        </button>

        {[
          { id: 'cell', icon: <Target className="w-5 h-5" />, label: 'Hedef', color: 'text-purple-400', count: tools.cell },
          { id: 'bomb', icon: <Sparkles className="w-5 h-5" />, label: 'Bomba', color: 'text-amber-400', count: tools.bomb },
          { id: 'row', icon: <MoveHorizontal className="w-5 h-5" />, label: 'Satır', color: 'text-rose-400', count: tools.row },
          { id: 'col', icon: <MoveVertical className="w-5 h-5" />, label: 'Sütun', color: 'text-emerald-400', count: tools.col },
          { id: 'swap', icon: <Settings2 className="w-5 h-5" />, label: 'Takas', color: 'text-sky-400', count: tools.swap },
        ].map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
            disabled={tool.count === 0}
            className={`flex flex-col items-center gap-1 group shrink-0 transition-all ${tool.count === 0 ? 'opacity-20 grayscale' : 'opacity-100'}`}
          >
            <div className={`
                w-12 h-12 rounded-xl bg-slate-900 border flex items-center justify-center transition-all shadow-xl relative
                ${activeTool === tool.id ? 'border-amber-400 scale-105 bg-amber-400/10' : 'border-white/5 hover:bg-slate-800'}
            `}>
              <div className={tool.color}>{tool.icon}</div>
              {tool.count > 0 && <span className="absolute -top-1.5 -right-1.5 bg-slate-100 text-[#020617] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#020617]">{tool.count}</span>}
            </div>
            <span className={`text-[7px] font-black tracking-widest uppercase ${activeTool === tool.id ? 'text-amber-400' : 'text-slate-500'}`}>
              {tool.label}
            </span>
          </button>
        ))}
      </footer>

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
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
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-black tracking-widest uppercase text-white">Ayarlar</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Sound Controls */}
              <div className="space-y-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ses ve Müzik</div>
                <button
                  onClick={toggleMute}
                  className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isMuted ? <VolumeX className="text-rose-400" /> : <Volume2 className="text-sky-400" />}
                    <span className="font-bold">{isMuted ? 'Sesler Kapalı' : 'Sesler Açık'}</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${isMuted ? 'bg-slate-700' : 'bg-sky-500'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isMuted ? 'left-1' : 'left-7'}`} />
                  </div>
                </button>
              </div>

              {/* Difficulty Controls */}
              <div className="space-y-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Zorluk Seviyesi</div>
                <div className="grid grid-cols-3 gap-2">
                  {['easy', 'normal', 'pro'].map(d => (
                    <button
                      key={d}
                      onClick={() => {
                        changeDifficulty(d);
                        setIsSettingsOpen(false);
                      }}
                      className={`
                        py-3 rounded-xl text-[10px] font-black uppercase transition-all border
                        ${difficulty === d
                          ? 'bg-sky-500 border-sky-400 text-white shadow-xl'
                          : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'}
                      `}
                    >
                      {d === 'easy' ? 'Kolay' : d === 'normal' ? 'Zor' : 'Profesör'}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 text-center italic">
                  Zorluk değiştiğinde oyun alanı yeniden oluşturulur.
                </p>
              </div>

              {/* Languages / Profile (Coming Soon) */}
              <div className="space-y-4 opacity-30 grayscale pointer-events-none">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Gelecek Özellikler</div>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-slate-800/50 rounded-xl border border-white/5 text-center text-[10px] font-bold">Dil: Türkçe</div>
                  <div className="flex-1 p-3 bg-slate-800/50 rounded-xl border border-white/5 text-center text-[10px] font-bold">Profil Senkranı</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-950/40 text-center">
              <span className="text-[9px] font-black text-slate-600 tracking-widest uppercase">KELİME CRUSH v2.0 - PREMIUM</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { -webkit-tap-highlight-color: transparent; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default App;
