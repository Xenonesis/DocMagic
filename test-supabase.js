import { createClient } from '@supabase/supabase-js';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  
  // Environment variables from .env.local
  const supabaseUrl = 'https://dheiucdatrgrkozkssrp.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWl1Y2RhdHJncmtvemtzc3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTI0NDMsImV4cCI6MjA3NjU2ODQ0M30.YNK_84VRGyVdQtAqW9a716K5mUmLcaeYFzsg3YKwh8E';
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
    return;
  }
  
  console.log('✅ Environment variables found');
  console.log('📍 Supabase URL:', supabaseUrl);
  console.log('🔑 Anon Key:', supabaseKey.substring(0, 20) + '...\n');
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test 1: Basic connection
    console.log('🧪 Test 1: Basic connection test...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('⚠️  Connection test result:', error.message);
      if (error.message.includes('relation "users" does not exist')) {
        console.log('ℹ️  This is normal if the users table hasn\'t been created yet');
      }
    } else {
      console.log('✅ Connection successful!');
    }
    
    // Test 2: Auth test
    console.log('\n🧪 Test 2: Auth service test...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Auth test failed:', authError.message);
    } else {
      console.log('✅ Auth service is working');
      console.log('📊 Current session:', authData.session ? 'Active session found' : 'No active session');
    }
    
    // Test 3: Database schema check
    console.log('\n🧪 Test 3: Database schema check...');
    const { data: tables, error: schemaError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (schemaError) {
      console.log('⚠️  Schema check failed:', schemaError.message);
    } else {
      console.log('✅ Database accessible');
      console.log('📋 Available tables:', tables?.map(t => t.table_name).join(', ') || 'None found');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testSupabaseConnection().then(() => {
  console.log('\n🏁 Test completed');
}).catch(console.error);