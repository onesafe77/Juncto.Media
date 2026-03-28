import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase Connection...');
    const tables = ['articles', 'reports', 'journalists', 'investigations', 'ai_chat_logs', 'profiles'];

    for (const table of tables) {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (error) {
            console.error(`❌ Table ${table}: ${error.message}`);
        } else {
            console.log(`✅ Table ${table}: Accessible`);
        }
    }
}

testConnection();
