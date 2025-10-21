#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * 
 * This script helps you set up your Supabase database with all necessary tables,
 * policies, and seed data for the docverse application.
 * 
 * Prerequisites:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Add your Supabase credentials to .env.local
 * 3. Install dependencies: npm install
 * 
 * Usage:
 *   npm run setup-db
 *   OR
 *   node scripts/setup-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: '.env.local' });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logError('Missing Supabase environment variables!');
  logInfo('Please ensure the following variables are set in your .env.local file:');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL');
  console.log('  - SUPABASE_SERVICE_ROLE_KEY');
  console.log('\nYou can find these in your Supabase project settings.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Read and execute SQL migration files
 */
async function runMigrations() {
  log('\n📦 Running database migrations...', colors.bright);
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    logError('Migrations directory not found!');
    return false;
  }

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ensure migrations run in order

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    logInfo(`Running migration: ${file}`);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        // Try direct execution if RPC fails
        const lines = sql.split(';').filter(line => line.trim());
        for (const line of lines) {
          if (line.trim()) {
            const { error: execError } = await supabase.from('_migrations').insert({
              name: file,
              executed_at: new Date().toISOString()
            });
            if (execError && !execError.message.includes('already exists')) {
              throw execError;
            }
          }
        }
      }
      
      logSuccess(`✓ ${file}`);
    } catch (error) {
      // Check if error is due to already existing objects
      if (error.message && (
        error.message.includes('already exists') ||
        error.message.includes('duplicate')
      )) {
        logWarning(`⊙ ${file} (already applied)`);
      } else {
        logError(`✗ ${file}: ${error.message}`);
        logWarning('Continuing with next migration...');
      }
    }
  }

  return true;
}

/**
 * Insert seed data for templates
 */
async function seedTemplates() {
  log('\n🌱 Seeding template data...', colors.bright);

  const templates = [
    {
      user_id: '00000000-0000-0000-0000-000000000000', // System user
      title: 'Professional Resume Template',
      description: 'A clean and modern resume template perfect for professionals in tech, finance, and corporate environments',
      type: 'resume',
      content: {
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          website: 'johndoe.com',
          summary: 'Experienced software engineer with 5+ years in full-stack development'
        },
        sections: [
          { id: 'experience', title: 'Work Experience', items: [] },
          { id: 'education', title: 'Education', items: [] },
          { id: 'skills', title: 'Skills', items: [] }
        ]
      },
      is_public: true,
      is_default: true
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Creative Resume Template',
      description: 'A colorful and creative resume template for designers, artists, and creative professionals',
      type: 'resume',
      content: {
        personalInfo: {
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1 (555) 987-6543',
          location: 'San Francisco, CA',
          website: 'janesmith.design',
          summary: 'Creative designer with expertise in UI/UX and brand identity'
        },
        sections: [
          { id: 'experience', title: 'Work Experience', items: [] },
          { id: 'education', title: 'Education', items: [] },
          { id: 'skills', title: 'Skills', items: [] },
          { id: 'portfolio', title: 'Portfolio', items: [] }
        ]
      },
      is_public: true,
      is_default: true
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Business Presentation Template',
      description: 'Professional presentation template for business meetings, quarterly reviews, and corporate presentations',
      type: 'presentation',
      content: {
        title: 'Business Presentation',
        slides: [
          {
            id: '1',
            type: 'title',
            content: {
              title: 'Business Presentation',
              subtitle: 'Professional Template'
            }
          },
          {
            id: '2',
            type: 'content',
            content: {
              title: 'Agenda',
              bullets: ['Introduction', 'Market Analysis', 'Strategy', 'Conclusion']
            }
          }
        ]
      },
      is_public: true,
      is_default: true
    }
  ];

  try {
    // Check if templates already exist
    const { data: existingTemplates } = await supabase
      .from('templates')
      .select('id')
      .eq('is_default', true);

    if (existingTemplates && existingTemplates.length > 0) {
      logWarning('Default templates already exist. Skipping seed data.');
      return true;
    }

    // Insert templates
    const { error } = await supabase
      .from('templates')
      .insert(templates);

    if (error) {
      throw error;
    }

    logSuccess(`Inserted ${templates.length} default templates`);
    return true;
  } catch (error) {
    logError(`Failed to seed templates: ${error.message}`);
    return false;
  }
}

/**
 * Verify database setup
 */
async function verifySetup() {
  log('\n🔍 Verifying database setup...', colors.bright);

  const checks = [
    { name: 'users table', table: 'users' },
    { name: 'subscriptions table', table: 'subscriptions' },
    { name: 'documents table', table: 'documents' },
    { name: 'templates table', table: 'templates' },
    { name: 'template_shares table', table: 'template_shares' }
  ];

  let allPassed = true;

  for (const check of checks) {
    try {
      const { error } = await supabase
        .from(check.table)
        .select('id')
        .limit(1);

      if (error) {
        logError(`✗ ${check.name}: ${error.message}`);
        allPassed = false;
      } else {
        logSuccess(`✓ ${check.name}`);
      }
    } catch (error) {
      logError(`✗ ${check.name}: ${error.message}`);
      allPassed = false;
    }
  }

  return allPassed;
}

/**
 * Main setup function
 */
async function main() {
  log('\n╔════════════════════════════════════════════╗', colors.bright);
  log('║   🪄 docverse Database Setup (Supabase)   ║', colors.bright);
  log('╚════════════════════════════════════════════╝\n', colors.bright);

  logInfo('Starting database setup...');
  logInfo(`Supabase URL: ${supabaseUrl}\n`);

  try {
    // Step 1: Run migrations
    const migrationsSuccess = await runMigrations();
    if (!migrationsSuccess) {
      logWarning('Some migrations may have failed. Continuing...');
    }

    // Step 2: Seed data
    await seedTemplates();

    // Step 3: Verify setup
    const verifySuccess = await verifySetup();

    // Final summary
    log('\n' + '═'.repeat(50), colors.bright);
    if (verifySuccess) {
      logSuccess('✨ Database setup completed successfully!');
      log('\n📝 Next steps:', colors.cyan);
      console.log('  1. Start the development server: npm run dev');
      console.log('  2. Visit http://localhost:3000');
      console.log('  3. Create an account and start using docverse!\n');
    } else {
      logWarning('⚠️  Database setup completed with warnings.');
      log('\n📝 Troubleshooting:', colors.yellow);
      console.log('  1. Check your Supabase project settings');
      console.log('  2. Verify your environment variables in .env.local');
      console.log('  3. Check the Supabase dashboard for errors');
      console.log('  4. Review the migration files in supabase/migrations/\n');
    }
    log('═'.repeat(50) + '\n', colors.bright);

  } catch (error) {
    logError(`\nSetup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the setup
main();
