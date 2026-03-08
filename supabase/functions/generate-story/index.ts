import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || '';

        if (!geminiApiKey) {
            return new Response(JSON.stringify({ error: 'GEMINI_API_KEY bulunamadı. Lütfen Supabase secrets üzerinden tanımlayın.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            });
        }

        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

        // Get request body
        const { theme, length, words, cost } = await req.json();

        // Auth Check (Get user from JWT)
        const authHeader = req.headers.get('Authorization')!;
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Yetkisiz erişim' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            });
        }

        // 1. Ekonomi Kontrolü & Altın Düşümü
        if (cost > 0) {
            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('coins, is_pro')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            // PRO kullanıcılar için maliyet 0 olmalı (Önlem)
            const finalCost = profile.is_pro ? 0 : cost;

            if (!profile.is_pro && profile.coins < finalCost) {
                return new Response(JSON.stringify({ error: 'Yetersiz altın' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                });
            }

            if (finalCost > 0) {
                await supabaseClient.rpc('update_profile_secure', {
                    p_user_id: user.id,
                    p_updates: { coins: profile.coins - finalCost }
                });
            }
        }

        // 2. AI Hazırlığı (Gemini 1.5 Flash)
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const wordList = Array.isArray(words) ? words.join(', ') : 'AI Seçimi';
        const lengthPrompt = length === 'short'
            ? 'Maksimum 2 cümlelik, çarpıcı ve çok kısa bir özet'
            : '4-5 cümlelik, sürükleyici ve detaylı mini bir masal';

        const prompt = `
      GÖREV: Bir kelime oyunu hikaye yazarısın. Oyuncunun oyun sırasında bulduğu kelimeleri kullanarak yaratıcı bir hikaye kurgula.
      TEMA: ${theme}
      KELİMELER: ${wordList}
      UZUNLUK: ${lengthPrompt}
      DİL: Türkçe
      FORMAT: SADECE JSON.

      JSON Yapısı:
      {
        "title": "Hikaye Başlığı",
        "content": "Hikaye içeriği...",
        "emoji": "Hikayeye uygun 1 emoji",
        "hashtag": "#kelimecrush #yazarmodu"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // JSON temizleme (AI bazen ```json ... ``` ekleyebiliyor)
        const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const storyJson = JSON.parse(jsonStr);

        // 3. Veritabanına Kaydet (Service Role yetkisiyle)
        const { data: savedStory, error: insertError } = await supabaseClient
            .from('stories')
            .insert({
                user_id: user.id,
                user_name: user.user_metadata?.username || user.email?.split('@')[0] || 'Oyuncu',
                title: storyJson.title,
                content: storyJson.content,
                theme: theme,
                words: Array.isArray(words) ? words : [],
                length: length,
                emoji: storyJson.emoji,
                hashtag: storyJson.hashtag,
                is_public: true
            })
            .select()
            .single();

        if (insertError) throw insertError;

        return new Response(JSON.stringify(savedStory), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";
        console.error("Story Generation Error:", error);

        return new Response(JSON.stringify({
            error: errorMsg,
            details: error.stack || null
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
