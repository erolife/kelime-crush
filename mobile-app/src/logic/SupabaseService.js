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

    // Liderlik tablosunu getir (View üzerinden)
    async getLeaderboard() {
        try {
            const { data, error } = await supabase
                .from('leaderboard')
                .select('*');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Liderlik tablosu çekilirken hata oluştu:', error.message);
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

    // Auth durumunu izle
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    },
};
