const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = 'https://juuvcdodojyzaogftvzm.supabase.co';
const supabaseKey = 'sb_publishable_lhN95JqIoV-fuQnFhyOq5w_R8HDEAdx';

if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL ou SUPABASE_KEY not found in .env')
}

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;
