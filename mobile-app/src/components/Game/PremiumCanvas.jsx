import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../logic/SoundManager';
import { LETTER_POINTS } from '../../logic/Constants';

const PremiumCanvas = ({ grid, selectedPath, animatingCells, swapSelection, createdSpecial, onSelectCell, onFinishTurn, gameMode, isTutorial, tutorialHint, lowPerformance }) => {
    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const particlesRef = useRef([]);
    const pulsesRef = useRef([]); // v4.0.3: Pulse animations

    // Performance and Visual Toggles
    const VISUAL_CONFIG = {
        electricTrail: !lowPerformance,
        springPhysics: true, // Fizik kalsın, görsel değil mantıksal
        squashStretch: !lowPerformance,
        specialTileEffects: !lowPerformance,
        particleGlow: !lowPerformance,
        jellyEffect: !lowPerformance,
        shadows: !lowPerformance
    };

    const COLORS = {
        bg: '#020617',
        grid: 'rgba(255, 255, 255, 0.03)',
        selection: 'rgba(56, 189, 248, 0.4)',
        line: '#38bdf8',
        electric: '#e0f2fe',
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
                else if (cell.type === 'dynamite') color = '#f43f5e';
                else if (cell.type === 'nuclear') color = '#10b981';
                else if (cell.type?.includes('blast')) color = '#f59e0b';
                else if (cell.type === 'match') color = '#ffffff';

                // Spawn particles for a visual "poof"
                const count = lowPerformance ? (cell.type === 'match' ? 4 : 8) : (cell.type === 'match' ? 12 : 30);
                const isZen = gameMode === 'zen';

                for (let i = 0; i < count; i++) {
                    particlesRef.current.push({
                        x: centerX,
                        y: centerY,
                        vx: isZen ? (Math.random() - 0.5) * 4 : (Math.random() - 0.5) * (cell.type === 'match' ? 10 : 20),
                        vy: isZen ? -Math.random() * 5 - 2 : (Math.random() - 0.5) * (cell.type === 'match' ? 10 : 20),
                        life: 1.0,
                        decay: isZen ? 0.01 + Math.random() * 0.01 : 0.02 + Math.random() * 0.03,
                        size: 2 + Math.random() * 5,
                        color: isZen ? (Math.random() > 0.5 ? '#f472b6' : '#ffffff') : color,
                        angle: Math.random() * Math.PI * 2,
                        spin: (Math.random() - 0.5) * 0.2,
                        glow: VISUAL_CONFIG.particleGlow
                    });
                }
            });
        }
    }, [animatingCells, dimensions.width, grid]);

    // v4.0.3: Watch for newly created special cells to trigger pulse
    useEffect(() => {
        if (createdSpecial && dimensions.width > 0) {
            const cols = grid[0]?.length || 10;
            const cellSize = dimensions.width / cols;
            const centerX = createdSpecial.c * cellSize + cellSize / 2;
            const centerY = createdSpecial.r * cellSize + cellSize / 2;

            let color = '#a855f7'; // Default bomb color
            if (createdSpecial.type === 'dynamite') color = '#f43f5e';
            else if (createdSpecial.type === 'nuclear') color = '#10b981';
            else if (createdSpecial.type?.includes('blast')) color = '#f59e0b';

            // Add pulses
            pulsesRef.current.push({ x: centerX, y: centerY, progress: 0, color });
            setTimeout(() => {
                pulsesRef.current.push({ x: centerX, y: centerY, progress: 0, color });
            }, 100);
        }
    }, [createdSpecial, dimensions.width, grid]);

    useEffect(() => {
        const parent = canvasRef.current?.parentElement;
        if (!parent || !grid || grid.length === 0) return;

        const rows = grid.length;
        const cols = grid[0]?.length || 11;

        const updateSize = () => {
            const rect = parent.getBoundingClientRect();
            const cellSize = Math.floor(Math.min(rect.width / cols, rect.height / rows));
            const newWidth = cellSize * cols;
            const newHeight = cellSize * rows;

            if (cellSize > 0 && (Math.abs(dimensions.width - newWidth) > 1 || Math.abs(dimensions.height - newHeight) > 1)) {
                setDimensions({ width: newWidth, height: newHeight });
            }
        };

        const observer = new ResizeObserver(updateSize);
        observer.observe(parent);
        updateSize();
        return () => observer.disconnect();
    }, [grid]);

    const posMapRef = useRef(new Map());
    const lastGridSizeRef = useRef(0);

    const draw = useCallback((ctx, time) => {
        const { width, height } = dimensions;
        if (width <= 0 || !grid || grid.length === 0) return;

        const rows = grid.length;
        const cols = grid[0]?.length || 10;
        const cellSize = width / cols;
        const padding = cellSize * 0.18;

        const currentGridSize = rows * cols;
        if (lastGridSizeRef.current !== currentGridSize) {
            posMapRef.current.clear();
            lastGridSizeRef.current = currentGridSize;
        }

        let missingCount = 0;
        let totalCells = 0;
        grid.forEach(row => row.forEach(cell => {
            if (cell) {
                totalCells++;
                if (!posMapRef.current.has(cell.id)) missingCount++;
            }
        }));

        const isInitialState = posMapRef.current.size === 0 || (missingCount > totalCells * 0.5);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, width, height);

        // Physics Constants
        const gravity = 4.5; // Faster fall for better "snap"
        const friction = 0.3; // Less bounce for quicker settling
        const initialOffset = cellSize * 2.5;

        // Draw Selection Path Line (Enhanced Electric Trail)
        if (selectedPath.length > 1) {
            ctx.save();
            const jitter = Math.sin(time / 20) * 2;

            // Base Glow
            ctx.beginPath();
            ctx.strokeStyle = COLORS.line;
            ctx.lineWidth = cellSize * 0.22;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            if (VISUAL_CONFIG.shadows) {
                ctx.shadowBlur = 25;
                ctx.shadowColor = COLORS.line;
            }
            ctx.globalAlpha = 0.4;
            selectedPath.forEach((p, i) => {
                const x = p.c * cellSize + cellSize / 2;
                const y = p.r * cellSize + cellSize / 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Electric Core (Flickering)
            if (VISUAL_CONFIG.electricTrail) {
                ctx.globalAlpha = 0.8 + Math.random() * 0.2;
                ctx.strokeStyle = COLORS.electric;
                ctx.lineWidth = cellSize * 0.08;
                if (VISUAL_CONFIG.shadows) {
                    ctx.shadowBlur = 10;
                }
                ctx.beginPath();
                selectedPath.forEach((p, i) => {
                    // Add subtle jitter to simulate electric current
                    const noiseX = (Math.random() - 0.5) * 3;
                    const noiseY = (Math.random() - 0.5) * 3;
                    const x = p.c * cellSize + cellSize / 2 + noiseX;
                    const y = p.r * cellSize + cellSize / 2 + noiseY;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.stroke();
            }
            ctx.restore();
        }

        // Draw Cells
        grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (!cell) return;

                const targetX = c * cellSize;
                const targetY = r * cellSize;
                let state = posMapRef.current.get(cell.id);

                if (!state) {
                    if (isInitialState) {
                        state = { currentX: targetX, currentY: targetY, vx: 0, vy: 0, opacity: 1, squash: 1, stretch: 1 };
                    } else {
                        state = {
                            currentX: targetX,
                            currentY: targetY - initialOffset,
                            vx: 0,
                            vy: 0,
                            opacity: 0,
                            squash: 1,
                            stretch: 1
                        };
                    }
                    posMapRef.current.set(cell.id, state);
                }

                // Physics (With Spring/Bounce)
                if (state.currentY !== targetY || Math.abs(state.vy) > 0.1) {
                    state.vy += gravity;
                    state.currentY += state.vy;

                    if (state.opacity < 1) state.opacity = Math.min(1, state.opacity + 0.15);

                    if (state.currentY >= targetY) {
                        state.currentY = targetY;

                        // Squash & Stretch on impact
                        if (VISUAL_CONFIG.squashStretch && Math.abs(state.vy) > 8) {
                            state.squash = 1.25;
                            state.stretch = 0.8;
                        }

                        state.vy *= -friction;
                        if (Math.abs(state.vy) < 1.0) state.vy = 0;
                    }
                } else {
                    state.currentY = targetY;
                    state.vy = 0;
                    state.opacity = 1;
                }

                // Smooth scale return (Spring interpolation)
                if (VISUAL_CONFIG.squashStretch) {
                    state.squash += (1.0 - state.squash) * 0.15;
                    state.stretch += (1.0 - state.stretch) * 0.15;
                }

                // Smooth Slide
                if (state.currentX !== targetX) {
                    const dx = targetX - state.currentX;
                    state.currentX += dx * 0.15;
                    if (Math.abs(dx) < 0.5) state.currentX = targetX;
                }

                const isSelected = selectedPath.some(p => p.r === r && p.c === c);
                const isSwapTarget = swapSelection && swapSelection.r === r && swapSelection.c === c;

                const x = state.currentX + padding;
                const y = state.currentY + padding;
                const size = cellSize - padding * 2;
                const radius = size * 0.25; // Rounder, more candy-like corners
                const centerX = x + size / 2;
                const centerY = y + size / 2;

                let baseScale = isSelected ? 1.08 + Math.sin(time / 150) * 0.04 : 1.0;

                // Breathing effect for specials
                if (cell.type !== 'normal' && !isSelected && VISUAL_CONFIG.specialTileEffects) {
                    const breathe = 1.0 + Math.sin(time / 200) * 0.05;
                    baseScale *= breathe;
                }

                ctx.save();
                ctx.globalAlpha = state.opacity || 1;
                ctx.translate(centerX, centerY);

                // Apply physics scales
                if (VISUAL_CONFIG.squashStretch) {
                    ctx.scale(baseScale * state.squash, baseScale * state.stretch);
                } else {
                    ctx.scale(baseScale, baseScale);
                }

                ctx.translate(-centerX, -centerY);

                // Glow/Shadow
                // Glow/Shadow (ONLY for selected/special to save performance)
                if (VISUAL_CONFIG.shadows && (isSelected || isSwapTarget || cell.type !== 'normal')) {
                    const extraGlow = cell.type !== 'normal' ? Math.sin(time / 150) * 10 : 0;
                    ctx.shadowBlur = (isSelected || isSwapTarget) ? 35 : 25 + extraGlow;

                    if (isSelected) ctx.shadowColor = COLORS.line;
                    else if (isSwapTarget) ctx.shadowColor = '#fbbf24';
                    else if (cell.type === 'nuclear') ctx.shadowColor = '#10b981';
                    else if (cell.type === 'dynamite') ctx.shadowColor = '#f43f5e';
                    else if (cell.type === 'bomb') ctx.shadowColor = '#a855f7';
                    else if (cell.type?.includes('blast')) ctx.shadowColor = '#f59e0b';
                } else {
                    ctx.shadowBlur = 0; // Huge performance gain
                }

                // Gradient
                const [c1, c2] = getLetterColors(cell.letter);
                const grad = ctx.createLinearGradient(x, y, x + size, y + size);
                if (isSelected) {
                    grad.addColorStop(0, '#ffffff'); grad.addColorStop(1, '#e2e8f0');
                } else if (isSwapTarget) {
                    grad.addColorStop(0, '#fbbf24'); grad.addColorStop(1, '#f59e0b');
                } else if (cell.type === 'nuclear') {
                    grad.addColorStop(0, '#10b981'); grad.addColorStop(1, '#059669');
                } else if (cell.type === 'dynamite') {
                    grad.addColorStop(0, '#f43f5e'); grad.addColorStop(1, '#e11d48');
                } else if (cell.type === 'bomb') {
                    grad.addColorStop(0, '#a855f7'); grad.addColorStop(1, '#7c3aed');
                } else if (cell.type?.includes('blast')) {
                    grad.addColorStop(0, '#f59e0b'); grad.addColorStop(1, '#ea580c');
                } else {
                    grad.addColorStop(0, c1); grad.addColorStop(1, c2);
                }

                ctx.fillStyle = grad;
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, size, size, radius);
                else ctx.rect(x, y, size, size);
                ctx.fill();

                // Hyper-Realistic Jelly/Candy Effect (Optimized: No Clipping)
                if (VISUAL_CONFIG.jellyEffect) {
                    ctx.save();
                    ctx.shadowBlur = 0; // Disable shadows for reflections

                    // 1. Subtle Inner Rim (Fixed width stroke for depth)
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // 2. Main Glossy Highlight (Stay within tile bounds to avoid clip)
                    const glossGrad = ctx.createLinearGradient(x, y, x, y + size * 0.4);
                    glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
                    glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.fillStyle = glossGrad;

                    ctx.beginPath();
                    const hOffset = size * 0.1;
                    const hRadius = radius * 0.8;
                    ctx.moveTo(x + hOffset, y + size * 0.45);
                    ctx.bezierCurveTo(x + size * 0.3, y + hOffset, x + size * 0.7, y + hOffset, x + size - hOffset, y + size * 0.45);
                    ctx.lineTo(x + size - hOffset, y + hOffset + hRadius);
                    ctx.quadraticCurveTo(x + size - hOffset, y + hOffset, x + size - hOffset - hRadius, y + hOffset);
                    ctx.lineTo(x + hOffset + hRadius, y + hOffset);
                    ctx.quadraticCurveTo(x + hOffset, y + hOffset, x + hOffset, y + hOffset + hRadius);
                    ctx.closePath();
                    ctx.fill();

                    // 3. Small Sharp "Glint" (Hotspot)
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    const glintSize = size * 0.1;
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(x + size * 0.22, y + size * 0.15, size * 0.2, glintSize, glintSize / 2);
                    ctx.fill();

                    // 4. Bottom Rim Light
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(x + size * 0.25, y + size * 0.82, size * 0.5, size * 0.08, 2);
                    ctx.fill();

                    ctx.restore();
                }

                // Advanced Special Visuals (Scanning Lines)
                if (cell.type !== 'normal' && VISUAL_CONFIG.specialTileEffects) {
                    ctx.save();
                    ctx.clip();
                    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                    ctx.lineWidth = 2;

                    if (cell.type === 'row_blast') {
                        const scanX = (time / 4) % (size * 2) - size;
                        ctx.beginPath();
                        ctx.moveTo(x + scanX, y);
                        ctx.lineTo(x + scanX, y + size);
                        ctx.stroke();
                    } else if (cell.type === 'col_blast') {
                        const scanY = (time / 4) % (size * 2) - size;
                        ctx.beginPath();
                        ctx.moveTo(x, y + scanY);
                        ctx.lineTo(x + size, y + scanY);
                        ctx.stroke();
                    } else {
                        // Pulse ring for bomb/nuclear
                        const ring = (time / 5) % size;
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, ring, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    ctx.restore();
                }

                // Border
                ctx.strokeStyle = (isSelected || isSwapTarget) ? '#ffffff' : 'rgba(255,255,255,0.15)';
                ctx.lineWidth = (isSelected || isSwapTarget) ? 3 : 1;
                ctx.stroke();

                // Text
                ctx.fillStyle = (isSelected || isSwapTarget) ? COLORS.bg : '#ffffff';
                ctx.font = `900 ${size * 0.55}px Outfit, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowBlur = 0;
                ctx.fillText(cell.letter, centerX, centerY + (size * 0.04));

                // Points
                const pts = LETTER_POINTS[cell.letter] || 1;
                ctx.font = `bold ${size * 0.18}px Outfit`;
                ctx.textAlign = 'right';
                ctx.fillText(pts, x + size - size * 0.12, y + size - size * 0.12);

                // Indicator
                if (cell.type !== 'normal') {
                    ctx.font = `bold ${size * 0.25}px Outfit`;
                    ctx.textAlign = 'center';
                    const icon = cell.type === 'nuclear' ? '☢' : cell.type === 'dynamite' ? '✕' : cell.type === 'bomb' ? '●' : (cell.type === 'row_blast' ? '↔' : '↕');
                    ctx.fillText(icon, centerX, centerY + size * 0.35);
                }
                ctx.restore();
            });
        });

        // Cleanup
        const currentIds = new Set();
        grid.forEach(row => row.forEach(cell => cell && currentIds.add(cell.id)));
        for (let id of posMapRef.current.keys()) {
            if (!currentIds.has(id)) posMapRef.current.delete(id);
        }

        // Particles
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
        particlesRef.current.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            p.life -= p.decay;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            if (p.glow) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
            }
            ctx.translate(p.x, p.y);
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(0, p.size * p.life), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Pulses
        pulsesRef.current = pulsesRef.current.filter(p => p.progress < 1);
        pulsesRef.current.forEach(p => {
            p.progress += 0.025;
            const radius = cellSize * 0.5 + (cellSize * 2.0 * p.progress);
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 4 * (1 - p.progress);
            ctx.globalAlpha = (1 - p.progress) * 0.8;
            ctx.stroke();
            ctx.restore();
        });
        // Tutorial Hints (Moving hand/pointer)
        if (isTutorial && tutorialHint && tutorialHint.length > 0 && selectedPath.length === 0) {
            const cycleTime = 2000; // time for one full path sweep
            const progress = (time % cycleTime) / cycleTime;
            const pathIndex = Math.floor(progress * (tutorialHint.length - 1));
            const pathProgress = (progress * (tutorialHint.length - 1)) % 1;

            const current = tutorialHint[pathIndex];
            const next = tutorialHint[pathIndex + 1] || current;

            const hX = (current.c + (next.c - current.c) * pathProgress) * cellSize + cellSize / 2;
            const hY = (current.r + (next.r - current.r) * pathProgress) * cellSize + cellSize / 2;

            ctx.save();
            const pulse = 1 + Math.sin(time / 150) * 0.1;

            // Draw Glow
            ctx.beginPath();
            ctx.arc(hX, hY, cellSize * 0.4 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#38bdf8';
            ctx.fill();

            // Draw Hand Emoji
            ctx.font = `${cellSize * 0.8}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Slight tilt and offset to look like it's pointing
            ctx.translate(hX + cellSize * 0.1, hY + cellSize * 0.1);
            ctx.rotate(-Math.PI / 8);
            ctx.fillText('👇', 0, 0);

            ctx.restore();
        }
    }, [dimensions, grid, selectedPath, animatingCells, isTutorial, tutorialHint]);

    useEffect(() => {
        let frameId;
        const animate = (time) => {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d', { alpha: false }); // Optimization
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
                    else if (wordLen >= 7) { soundManager.play('bomb_created'); soundManager.play('confetti'); }
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
