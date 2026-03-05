import { supabase } from './supabaseClient';
import { Capacitor } from '@capacitor/core';

const getRedirectUrl = () => {
    if (Capacitor.isNativePlatform()) {
        return 'wordlenge://auth-callback';
    }
    return window.location.origin;
};

export const AuthService = {
    // Kayıt ol
    async signUp(email, password, username) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username
                    },
                    emailRedirectTo: getRedirectUrl()
                }
            });

            if (error) throw error;

            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    },

    // Giriş yap
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    },

    // Google ile giriş yap
    async signInWithGoogle() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: getRedirectUrl()
                }
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    },

    // Çıkış yap
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            return { error: error.message };
        }
    }
};
