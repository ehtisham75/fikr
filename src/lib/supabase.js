import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import { createMMKV } from 'react-native-mmkv'
import Config from "react-native-config";


const getConfigValue = key => {
    const value = Config?.[key];

    return typeof value === 'string' ? value.trim() : '';
};

const normalizeSupabaseUrl = url => (
    url
        .replace(/\/rest\/v1\/?$/, '')
        .replace(/\/+$/, '')
);

const supabaseUrl = normalizeSupabaseUrl(getConfigValue('SUPABASE_URL'));
const supabaseAnonKey = getConfigValue('SUPABASE_ANON_KEY') || getConfigValue('SUPABASE_PUBLISHABLE_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase config. Check SUPABASE_URL and SUPABASE_ANON_KEY in .env, then rebuild the native app.');
}

const supabaseStorage = createMMKV({
    id: 'supabase-auth-storage',
});

const mmkvSupabaseStorage = {
    getItem: key => supabaseStorage.getString(key) ?? null,
    setItem: (key, value) => supabaseStorage.set(key, value),
    removeItem: key => supabaseStorage.delete(key),
};

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            storage: mmkvSupabaseStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
)
