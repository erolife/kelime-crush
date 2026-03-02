import { Howl, Howler } from 'howler';

class SoundManager {
    constructor() {
        this.muted = false;
        this.sounds = {
            select: new Howl({ src: ['./sesler/snake.mp3'], volume: 0.1 }),
            match: new Howl({ src: ['./sesler/tek-patlama.mp3'], volume: 0.5 }),
            confetti: new Howl({ src: ['./sesler/buyuk-patlama.mp3'], volume: 0.6 }),
            error: new Howl({ src: ['./sesler/hatali.mp3'], volume: 0.3 }),
            powerup: new Howl({ src: ['./sesler/row-colun.mp3'], volume: 0.6 }),
            swap: new Howl({ src: ['./sesler/switch.mp3'], volume: 0.5 }),
            bomb_created: new Howl({ src: ['./sesler/levelup.mp3'], volume: 0.5 }),
            bomb_blast: new Howl({ src: ['./sesler/buyuk-patlama.mp3'], volume: 0.8 }),
            background: new Howl({ src: ['./sesler/background.mp3'], volume: 0.2, loop: true }),
            // Tebrik sesleri — ses dosyaları eklendiğinde path güncellenecek
            cheer_small: new Howl({ src: ['./sesler/7harf.mp3'], volume: 0.5 }),   // 4-5 harf
            cheer_big: new Howl({ src: ['./sesler/7harf.mp3'], volume: 0.7 })      // 6+ harf (alkış/ıslık)
        };

        // Handle background/foreground state to stop music when app is inactive
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    Howler.mute(true); // Sekme / uygulama arka plana atıldığında tamamen sustur
                } else {
                    Howler.mute(this.muted); // Öne geldiğinde kullanıcının son mute ayarına dön
                }
            });
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        Howler.mute(this.muted);
        return this.muted;
    }

    play(name) {
        if (this.sounds[name]) {
            // Unlock audio on first interaction if needed
            if (Howler.ctx && Howler.ctx.state === 'suspended') {
                Howler.ctx.resume();
            }
            this.sounds[name].play();
        }
    }

    stop(name) {
        if (this.sounds[name]) {
            this.sounds[name].stop();
        }
    }
}

export const soundManager = new SoundManager();
