import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../logic/SoundManager';
import { LETTER_POINTS } from '../../logic/Constants';

const PremiumCanvas = ({ grid, selectedPath, animatingCells, swapSelection, onSelectCell, onFinishTurn }) => {
    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const particlesRef = useRef([]);

    const COLORS = {
        bg: '#020617',
        grid: 'rgba(255, 255, 255, 0.03)',
        selection: 'rgba(56, 189, 248, 0.4)',
        line: '#38bdf8',
        text: '#ffffff',
        letters: {
            A: ['#f43f5e', '#fb7185'],
            E: ['#0ea5e9', '#38bdf8'],
            I: ['#8b5cf6', '#a78bfa'],
            O: ['#f59e0b', '#fbbf24'],
            U: ['#10b981', '#34d399'],
            default: ['#475569', '#64748b']
        }
    };

    const getLetterColors = (letter) => {
        const v = ['A', 'E', 'İ', 'I', 'O', 'Ö', 'U', 'Ü'];
        if (v.includes(letter)) {
            const key = letter === 'İ' ? 'I' : letter;
            return COLORS.letters[key] || COLORS.letters.E;
        }
        return COLORS.letters.default;
    };

    // Watch for animatingCells to spawn particles (Matches and Blasts)
    useEffect(() => {
        if (animatingCells && animatingCells.length > 0 && dimensions.width > 0) {
            const cols = grid[0]?.length || 10;
            const cellSize = dimensions.width / cols;

            animatingCells.forEach(cell => {
                const centerX = cell.c * cellSize + cellSize / 2;
                const centerY = cell.r * cellSize + cellSize / 2;

                let color = '#38bdf8';
                if (cell.type === 'bomb') color = '#a855f7';
                else if (cell.type?.includes('blast')) color = '#f59e0b';
                else if (cell.type === 'match') color = '#ffffff';

                // Spawn particles for a visual "poof"
                const count = cell.type === 'match' ? 10 : 25;
                for (let i = 0; i < count; i++) {
                    particlesRef.current.push({
                        x: centerX,
                        y: centerY,
                        vx: (Math.random() - 0.5) * (cell.type === 'match' ? 8 : 15),
                        vy: (Math.random() - 0.5) * (cell.type === 'match' ? 8 : 15),
                        life: 1.0,
                        decay: 0.02 + Math.random() * 0.03,
                        size: 2 + Math.random() * 4,
                        color: color
                    });
                }
            });
        }
    }, [animatingCells, dimensions.width, grid]);

    useEffect(() => {
        const parent = canvasRef.current?.parentElement;
        if (!parent) return;

        const updateSize = () => {
            const rect = parent.getBoundingClientRect();
            const size = Math.floor(Math.min(rect.width, rect.height));
            if (size > 0 && Math.abs(dimensions.width - size) > 1) {
                setDimensions({ width: size, height: size });
            }
        };

        const observer = new ResizeObserver(updateSize);
        observer.observe(parent);
        updateSize();
        return () => observer.disconnect();
    }, [dimensions.width]);

    const draw = useCallback((ctx, time) => {
        const { width, height } = dimensions;
        if (width <= 0 || !grid || grid.length === 0) return;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, width, height);

        const rows = grid.length;
        const cols = grid[0]?.length || 10;
        const cellSize = width / cols;
        const padding = cellSize * 0.18;

        // Draw Selection Path Line
        if (selectedPath.length > 1) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = COLORS.line;
            ctx.lineWidth = cellSize * 0.18;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowBlur = 15;
            ctx.shadowColor = COLORS.line;
            const first = selectedPath[0];
            ctx.moveTo(first.c * cellSize + cellSize / 2, first.r * cellSize + cellSize / 2);
            for (let i = 1; i < selectedPath.length; i++) {
                const p = selectedPath[i];
                ctx.lineTo(p.c * cellSize + cellSize / 2, p.r * cellSize + cellSize / 2);
            }
            ctx.stroke();
            ctx.restore();
        }

        // Draw Cells
        grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (!cell) return;

                const isSelected = selectedPath.some(p => p.r === r && p.c === c);
                const isSwapTarget = swapSelection && swapSelection.r === r && swapSelection.c === c;
                // If it's in animatingCells, show it shrinking (or just hidden if it's already nulled in grid)
                // Note: The grid updates instantly in useGame, but animatingCells allows us to ghost them if we kept them.
                // For now, we use animatingCells to decide shrinkage for existing cells that might be getting blasted.
                const isAnimating = (animatingCells || []).some(b => b.r === r && b.c === c);

                const x = c * cellSize + padding;
                const y = r * cellSize + padding;
                const size = cellSize - padding * 2;
                const radius = size * 0.15;
                const centerX = x + size / 2;
                const centerY = y + size / 2;

                let scale = isSelected ? 1.08 + Math.sin(time / 150) * 0.04 : 1.0;

                // Pulsing animation for special cells (bombs/blasts)
                if (cell.type !== 'normal' && !isSelected) {
                    scale = 1.0 + Math.sin(time / 200) * 0.05;
                }

                if (isAnimating) scale *= 0.4; // Instant feedback

                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.scale(scale, scale);
                ctx.translate(-centerX, -centerY);

                // Shadow/Glow
                const pulse = Math.sin(time / 200) * 5;
                ctx.shadowBlur = (isSelected || isSwapTarget) ? 30 : (cell.type !== 'normal' ? 20 + pulse : 10);
                if (isSelected) ctx.shadowColor = COLORS.line;
                else if (isSwapTarget) ctx.shadowColor = '#fbbf24';
                else if (cell.type === 'bomb') ctx.shadowColor = '#a855f7';
                else if (cell.type?.includes('blast')) ctx.shadowColor = '#f59e0b';
                else ctx.shadowColor = 'rgba(0,0,0,0.5)';

                // Gradient
                const [c1, c2] = getLetterColors(cell.letter);
                const grad = ctx.createLinearGradient(x, y, x + size, y + size);
                if (isSelected) {
                    grad.addColorStop(0, '#ffffff');
                    grad.addColorStop(1, '#f1f5f9');
                } else if (isSwapTarget) {
                    grad.addColorStop(0, '#fbbf24');
                    grad.addColorStop(1, '#f59e0b');
                } else if (cell.type === 'bomb') {
                    grad.addColorStop(0, '#a855f7');
                    grad.addColorStop(1, '#6b21a8');
                } else if (cell.type?.includes('blast')) {
                    grad.addColorStop(0, '#f59e0b');
                    grad.addColorStop(1, '#b45309');
                } else {
                    grad.addColorStop(0, c1);
                    grad.addColorStop(1, c2);
                }

                ctx.fillStyle = grad;
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, size, size, radius);
                else ctx.rect(x, y, size, size);
                ctx.fill();

                // Border
                ctx.strokeStyle = (isSelected || isSwapTarget) ? '#ffffff' : 'rgba(255,255,255,0.2)';
                ctx.lineWidth = (isSelected || isSwapTarget) ? 2 : 1;
                ctx.stroke();

                // Letter Text
                ctx.fillStyle = (isSelected || isSwapTarget) ? COLORS.bg : (cell.type !== 'normal' ? '#ffffff' : COLORS.text);
                ctx.font = `900 ${size * 0.55}px Outfit, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowBlur = 0;
                ctx.fillText(cell.letter, centerX, centerY + (size * 0.03));

                // Letter Points
                const points = LETTER_POINTS[cell.letter] || 1;
                ctx.font = `bold ${size * 0.18}px Outfit`;
                ctx.textAlign = 'right';
                ctx.fillText(points, x + size - size * 0.1, y + size - size * 0.1);

                // Indicator for Specials
                if (cell.type !== 'normal') {
                    ctx.font = `bold ${size * 0.22}px Outfit`;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = 'rgba(255,255,255,0.9)';
                    const indicator = cell.type === 'bomb' ? '●' : (cell.type === 'row_blast' ? '↔' : '↕');
                    ctx.fillText(indicator, centerX, centerY + size * 0.35);
                }
                ctx.restore();
            });
        });

        // Draw and Update Particles (For matches and blasts)
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
        particlesRef.current.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0, p.size * p.life), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }, [dimensions, grid, selectedPath, animatingCells]);

    useEffect(() => {
        let frameId;
        const animate = (time) => {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) draw(ctx, time);
            }
            frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [draw]);

    const handlePointer = (e) => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = (e.clientX || (e.touches && e.touches[0]?.clientX));
        const clientY = (e.clientY || (e.touches && e.touches[0]?.clientY));
        if (clientX === undefined) return;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const cols = grid[0]?.length || 10;
        const cellSize = dimensions.width / cols;

        const c = Math.floor(x / cellSize);
        const r = Math.floor(y / cellSize);

        if (r >= 0 && r < grid.length && c >= 0 && c < cols) {
            // Hit Detection Optimization:
            // Calculate distance to cell center to avoid "accidental" selection of corner cells
            const centerX = c * cellSize + cellSize / 2;
            const centerY = r * cellSize + cellSize / 2;
            const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

            // Only select if pointer is within a reasonable radius of cell center
            // This leaves a safe "corridor" between cells for cleaner diagonal movement.
            if (dist < cellSize * 0.38) {
                onSelectCell(r, c);
            }
        }
    };

    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            onPointerDown={handlePointer}
            onPointerMove={(e) => { if (e.buttons === 1 || (e.touches && e.touches.length > 0)) handlePointer(e); }}
            onPointerUp={() => {
                const wordLen = selectedPath.length;
                const success = onFinishTurn();
                if (success) {
                    if (wordLen === 4) soundManager.play('powerup');
                    else if (wordLen >= 5) soundManager.play('bomb_created');
                    if (wordLen >= 6) {
                        soundManager.play('confetti');
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.7 },
                            colors: ['#0ea5e9', '#38bdf8', '#ffffff', '#fbbf24']
                        });
                    } else soundManager.play('match');
                }
            }}
            className="touch-none cursor-pointer block"
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    );
};

export default PremiumCanvas;
