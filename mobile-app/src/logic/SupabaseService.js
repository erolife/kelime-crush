import { supabase } from './supabaseClient';

export const SupabaseService = {
    // Seviyeleri getir
    async getLevels() {
        try {
            const { data, error } = await supabase
                .from('levels')
                .select('*')
                .eq('active', true)
                .order('id', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Seviyeler çekilirken hata oluştu:', error.message);
            return null;
        }
    },

    // Profil verilerini getir (Auth gerektirir)
    async getProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Profil çekilirken hata oluştu:', error.message);
            return null;
        }
    },

    // Profil verilerini güncelle (Auth gerektirir)
    async updateProfile(userId, updates) {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Profil güncellenirken hata oluştu:', error.message);
            return false;
        }
    },

    // Mevcut kullanıcıyı al
    async getUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Liderlik tablosunu getir (Mod bazlı view'lardan)
    async getLeaderboard(mode = 'global') {
        try {
            const tableMap = {
                'global': 'leaderboard',
                'adventure': 'leaderboard_adventure',
                'time_arena': 'leaderboard_time_arena',
                'zen': 'leaderboard_zen'
            };
            const tableName = tableMap[mode] || 'leaderboard';

            const { data, error } = await supabase
                .from(tableName)
                .select('*');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Liderlik tablosu (${mode}) çekilirken hata oluştu:`, error.message);
            return null;
        }
    },

    // Mod bazlı istatistikleri güncelle (Zen, Arcade, Mission)
    async updateModeStats(userId, mode, sessionStats) {
        try {
            // Mevcut profil verisini al
            const { data: profile, error: getError } = await supabase
                .from('profiles')
                .select('mode_stats')
                .eq('id', userId)
                .single();

            if (getError) throw getError;

            const modeStats = profile.mode_stats || {};
            const currentModeData = modeStats[mode] || { words: 0, moves: 0, duration: 0, game_count: 0 };

            // İstatistikleri kümülatif olarak güncelle
            modeStats[mode] = {
                words: currentModeData.words + (sessionStats.words || 0),
                moves: currentModeData.moves + (sessionStats.moves || 0),
                duration: currentModeData.duration + (sessionStats.duration || 0),
                game_count: (currentModeData.game_count || 0) + 1
            };

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    mode_stats: modeStats,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (updateError) throw updateError;
            return true;
        } catch (error) {
            console.error('Mod istatistikleri güncellenirken hata oluştu:', error.message);
            return false;
        }
    },

    // Aktif etkinlikleri getir
    async getActiveEvents() {
        try {
            const now = new Date();
            const nowISO = now.toISOString();

            // 1. Manuel etkinlikleri çek (Bitişi gelecekte olan herkesi al, başlangıcı sonra olanlar "yakında" olacak)
            const { data: manualEvents, error: manualError } = await supabase
                .from('events')
                .select('*')
                .eq('type', 'manual')
                .gt('end_at', nowISO);

            if (manualError) throw manualError;

            // Manuel olanlar için aktiflik durumunu belirle
            const processedManual = manualEvents.map(event => ({
                ...event,
                isActive: new Date(event.start_at) <= now
            }));

            // 2. Periyodik etkinlikleri çek
            const { data: periodicEvents, error: periodicError } = await supabase
                .from('events')
                .select('*')
                .eq('type', 'periodic');

            if (periodicError) throw periodicError;

            const activePeriodic = periodicEvents.filter(event => {
                const config = event.periodic_config;
                if (!config || config.start_day === undefined) return false;

                const currentDay = now.getDay();
                const currentTime = now.getHours() * 60 + now.getMinutes();

                const [sH, sM] = (config.start_time || "00:00").split(':').map(Number);
                const [eH, eM] = (config.end_time || "23:59").split(':').map(Number);
                const startTimeMinutes = sH * 60 + sM;
                const endTimeMinutes = eH * 60 + eM;

                const isWithinDays = currentDay >= config.start_day && currentDay <= config.end_day;
                if (!isWithinDays) return false;

                if (currentDay === config.start_day && currentTime < startTimeMinutes) return false;
                if (currentDay === config.end_day && currentTime > endTimeMinutes) return false;

                return true;
            }).map(e => {
                const config = e.periodic_config;
                const endAt = new Date(now);
                const currentDay = now.getDay();
                const daysUntilEnd = (config.end_day - currentDay + 7) % 7;

                endAt.setDate(now.getDate() + daysUntilEnd);
                const [eH, eM] = (config.end_time || "23:59").split(':').map(Number);
                endAt.setHours(eH, eM, 59, 999); // Gün sonunu tam yakala

                return {
                    ...e,
                    isActive: true,
                    end_at: endAt.toISOString()
                };
            });

            return [...processedManual, ...activePeriodic];
        } catch (error) {
            console.error('Aktif etkinlikler çekilirken hata oluştu:', error.message);
            return [];
        }
    },

    // Etkinlik ödüllerini getir
    async getEventRewards(eventId) {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('rewards')
                .eq('id', eventId)
                .single();

            if (error) throw error;
            return data?.rewards || [];
        } catch (error) {
            console.error('Etkinlik ödülleri çekilirken hata oluştu:', error.message);
            return [];
        }
    },

    // Etkinlik liderlik tablosunu getir
    async getEventLeaderboard(eventId) {
        try {
            const { data, error } = await supabase
                .from('event_participants')
                .select(`
score,
    user_id,
    profiles: user_id(
        username,
        avatar_url
    )
        `)
                .eq('event_id', eventId)
                .order('score', { ascending: false })
                .limit(100);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Etkinlik liderlik tablosu çekilirken hata oluştu:', error.message);
            return [];
        }
    },

    // Etkinlik puanını güncelle (RPC çağrısı)
    async updateEventScore(eventId, userId, scoreToAdd) {
        try {
            const { error } = await supabase.rpc('update_event_score', {
                p_event_id: eventId,
                p_user_id: userId,
                p_score_to_add: scoreToAdd
            });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Etkinlik puanı güncellenirken hata oluştu:', error.message);
            return false;
        }
    },

    // Profil fotoğrafı yükle
    async uploadAvatar(userId, fileOrBase64) {
        try {
            let fileToUpload = fileOrBase64;
            let fileExt = 'png';

            // Eğer Base64 verisi gönderildiyse bunu File nesnesine çevir (avatarPreview)
            if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:image')) {
                const match = fileOrBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                if (match) {
                    fileExt = match[1] === 'jpeg' ? 'jpg' : match[1];
                    const byteCharacters = atob(match[2]);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    fileToUpload = new Blob([byteArray], { type: `image/${fileExt}` });
                }
            } else if (fileOrBase64 instanceof File || fileOrBase64 instanceof Blob) {
                fileExt = fileOrBase64.name ? fileOrBase64.name.split('.').pop() : 'png';
            }

            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // RLS kuralları için mevcut oturumu onayla
            const session = await supabase.auth.getSession();
            if (!session.data.session) {
                throw new Error("Yükleme için oturum gerekli.");
            }

            // Dosyayı yükle
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('game-assets')
                .upload(filePath, fileToUpload, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error("Supabase storage upload error:", uploadError);
                throw uploadError;
            }

            // Public URL al
            const { data: { publicUrl } } = supabase.storage
                .from('game-assets')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Fotoğraf yüklenirken hata oluştu:', error.message);
            return null;
        }
    },

    // Auth durumunu izle
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    },

    // Hesabı sil (Profil verilerini temizle ve oturumu kapat)
    async deleteUserAccount(userId) {
        try {
            // 1. Profili sil (RLS izin vermelidir veya cascade silme olmalıdır)
            const { error: profileError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (profileError) throw profileError;

            // 2. Oturumu kapat
            await supabase.auth.signOut();
            return true;
        } catch (error) {
            console.error('Hesap silinirken hata oluştu:', error.message);
            return false;
        }
    }
};
