import React, { useEffect, useState } from 'react';
import PremiumCanvas from './components/Game/PremiumCanvas';
import { useGame } from './hooks/useGame';
import { soundManager } from './logic/SoundManager';
import {
  Trophy, Zap, Sparkles, RefreshCw,
  Gamepad2, AlignLeft, Settings2, Volume2, VolumeX,
  Target, MoveHorizontal, MoveVertical, X,
  ChevronRight, Play, CheckCircle2, Award, History,
  LayoutGrid, RotateCcw, Coins
} from 'lucide-react';
import { LEVELS } from './logic/Levels';

const Dashboard = ({ onSelectMission, onSelectArcade, currentLevel }) => {
  const [view, setView] = React.useState('modes'); // 'modes' | 'levels'

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

  return (
    <div className="fixed inset-0 z-[400] flex flex-col bg-slate-950/95 backdrop-blur-xl overflow-hidden">
      {/* Falling Letters Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 select-none">
        {fallingLetters.map(item => (
          <div
            key={item.id}
            className="absolute flex items-center justify-center bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-xl text-slate-500 font-black animate-fall shadow-lg"
            style={{
              left: `${item.left}%`,
              width: `${item.size * 1.8}px`,
              height: `${item.size * 1.8}px`,
              fontSize: `${item.size}px`,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
              top: '-100px'
            }}
          >
            {item.char}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent italic tracking-tighter">
            KELİME CRUSH
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-[1px] w-8 bg-sky-500/50"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Pro Edition v2.0</span>
          </div>
        </div>

        {/* Currency / Inventory Summary (New) */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-900/60 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-2 group transition-all hover:border-amber-500/50">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <Coins size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white leading-none">500</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Altın</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          {view === 'modes' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-500">
              <button
                onClick={onSelectArcade}
                className="group relative h-80 bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 hover:border-sky-500/50 rounded-[2.5rem] p-10 transition-all duration-500 flex flex-col justify-end overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] -mr-32 -mt-32 rounded-full transition-all group-hover:bg-sky-500/20" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-sky-500/20 rounded-2xl flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 group-hover:bg-sky-500 transition-all group-hover:text-white">
                    <History size={32} />
                  </div>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-3">ARCADE</h3>
                  <p className="text-slate-400 font-medium max-w-[240px]">Sınırsız oyun, yüksek skor ve sonsuz kelime avı.</p>
                </div>
              </button>

              <button
                onClick={() => setView('levels')}
                className="group relative h-80 bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 hover:border-purple-500/50 rounded-[2.5rem] p-10 transition-all duration-500 flex flex-col justify-end overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -mr-32 -mt-32 rounded-full transition-all group-hover:bg-purple-500/20" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 group-hover:bg-purple-500 transition-all group-hover:text-white">
                    <Trophy size={32} />
                  </div>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-3">SEVİYE</h3>
                  <p className="text-slate-400 font-medium max-w-[240px]">Hedef odaklı görevler ve aşamalı hikaye modu.</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right fade-in duration-500">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setView('modes')}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
                <h2 className="text-3xl font-black text-white italic tracking-tighter">BÖLÜM SEÇİMİ</h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto no-scrollbar pr-4">
                {LEVELS.map((level, idx) => {
                  const isLocked = idx > currentLevel;
                  const isCompleted = idx < currentLevel;
                  const isActive = idx === currentLevel;

                  return (
                    <button
                      key={level.id}
                      onClick={() => onSelectMission(idx)}
                      disabled={isLocked}
                      className={`
                        relative group aspect-square rounded-[2rem] border transition-all duration-500 p-6 flex flex-col justify-between overflow-hidden
                        ${isLocked ? 'bg-slate-900/20 border-white/5 opacity-40 cursor-not-allowed' :
                          isCompleted ? 'bg-green-500/5 border-green-500/30 hover:border-green-500' :
                            'bg-sky-500/5 border-sky-400/30 hover:border-sky-400 active:scale-95 shadow-xl'}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-4xl font-black italic tracking-tighter ${isLocked ? 'text-slate-700' : isCompleted ? 'text-green-500' : 'text-sky-500'}`}>
                          {level.id}
                        </span>
                        {isCompleted ? <CheckCircle2 className="text-green-500" size={24} /> :
                          isLocked ? <div className="p-2 bg-slate-800 rounded-lg"><Sparkles size={16} className="text-slate-600" /></div> :
                            <div className="p-2 bg-sky-500/20 rounded-lg animate-pulse"><Play size={16} className="text-sky-400" /></div>}
                      </div>

                      <div className="relative z-10">
                        <h4 className={`font-bold text-sm truncate ${isLocked ? 'text-slate-600' : 'text-white'}`}>{level.title}</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
                          {isLocked ? 'KİLİTLİ' : level.difficulty}
                        </p>
                      </div>

                      {isActive && <div className="absolute inset-0 border-2 border-sky-400 rounded-[2rem] animate-ping opacity-20 pointer-events-none" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MissionTracker = ({ goals }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2 mb-2">
      <Target className="text-purple-400" size={16} />
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">GÖREVLER</h3>
    </div>
    {goals.map((goal, idx) => {
      const isDone = goal.current >= goal.count;
      return (
        <div key={idx} className={`relative overflow-hidden group bg-slate-950/60 border ${isDone ? 'border-green-500/40' : 'border-white/5'} rounded-2xl p-3.5 transition-all`}>
          <div className="flex items-center justify-between relative z-10">
            <span className={`text-[10px] font-bold tracking-wide ${isDone ? 'text-green-400 line-through opacity-50' : 'text-slate-400'}`}>
              {goal.text}
            </span>
            {isDone ? (
              <CheckCircle2 className="text-green-500" size={14} />
            ) : (
              <span className="text-[9px] font-black bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-sky-400 tabular-nums">
                {goal.current}/{goal.count}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 bg-sky-500 transition-all duration-500 opacity-30" style={{ width: `${Math.min(100, (goal.current / (goal.count || 1)) * 100)}%` }} />
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
    isDictionaryLoaded, gameMode, currentLevelIndex, levelGoals, startMission
  } = useGame('normal');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [showDashboard, setShowDashboard] = useState(true);

  const [completedLevels, setCompletedLevels] = useState(() => {
    return parseInt(localStorage.getItem('crush_level_prog') || "0");
  });

  useEffect(() => {
    if (gameState === 'victory') {
      const nextLevel = Math.max(completedLevels, currentLevelIndex + 1);
      setCompletedLevels(nextLevel);
      localStorage.setItem('crush_level_prog', nextLevel.toString());
    }
  }, [gameState, currentLevelIndex, completedLevels]);

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
      {showDashboard && (
        <Dashboard
          currentLevel={completedLevels}
          onSelectArcade={() => {
            changeDifficulty('normal');
            setShowDashboard(false);
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
          <div className="min-w-[120px]">
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent italic uppercase leading-none mb-1">
              {gameMode === 'mission' ? `Seviye ${LEVELS[currentLevelIndex].id}` : 'Arcade Modu'}
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
              {gameMode === 'mission' ? LEVELS[currentLevelIndex].title : difficulty.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Word Display Area - Moved to Header */}
        <div className={`
              flex-1 hidden md:flex items-center justify-center px-8 py-3 rounded-2xl backdrop-blur-3xl border-2 transition-all duration-500 max-w-xl mx-auto
              ${currentWord.length >= 3
            ? 'bg-sky-500/10 border-sky-400/50 shadow-[0_0_30px_rgba(56,189,248,0.05)]'
            : 'bg-slate-900/40 border-white/5'}
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
            <Settings2 size={20} />
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
                  {id === 'cell' ? <Target className="w-6 h-6" /> : id === 'bomb' ? <Sparkles className="w-6 h-6" /> : id === 'row' ? <MoveHorizontal className="w-6 h-6" /> : id === 'col' ? <MoveVertical className="w-6 h-6" /> : <Settings2 className="w-6 h-6" />}
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
            { id: 'swap', icon: <Settings2 className="w-5 h-5" />, color: 'text-sky-400', count: tools.swap },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
              disabled={tool.count === 0}
              className={`
                group flex flex-col items-center p-2.5 rounded-xl border transition-all active:scale-95 shadow-xl relative
                ${activeTool === tool.id ? 'bg-amber-400/10 border-amber-400 scale-105' : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60'}
                ${tool.count === 0 ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}
              `}
            >
              <div className={`w-9 h-9 rounded-lg bg-slate-950 flex items-center justify-center ${tool.color}`}>
                {tool.icon}
              </div>
              {tool.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-slate-950 text-[7px] font-black w-4 h-4 rounded-full border border-slate-950 flex shadow-lg items-center justify-center z-10">
                  {tool.count}
                </span>
              )}
            </button>
          ))}
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

      {/* Settings Modal */}
      {
        isSettingsOpen && (
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
