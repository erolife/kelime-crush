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

    // Auth durumunu izle
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    },
};
