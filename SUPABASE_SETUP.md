# 🚀 Supabase Database Setup Guide

This guide will help you set up Supabase as the database for docverse. Supabase provides a PostgreSQL database with real-time capabilities, authentication, and storage.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ A Supabase account (free tier available at [supabase.com](https://supabase.com))
- ✅ Git (for version control)

## Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in the project details:
   - **Name**: docverse (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to your users
4. Click "Create new project" and wait for setup to complete (~2 minutes)

### 2. Get Your Supabase Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon in sidebar)
2. Navigate to **API** section
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   # SUPABASE CONFIGURATION
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

### 4. Run Database Setup

Install dependencies and set up the database:

```bash
# Install dependencies
npm install

# Run the database setup script
npm run setup-db
```

This script will:
- ✅ Create all necessary tables (users, documents, templates, etc.)
- ✅ Set up Row Level Security (RLS) policies
- ✅ Create indexes for performance
- ✅ Insert default template data

### 5. Start the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and start using docverse! 🎉

## Detailed Setup

### Database Schema Overview

docverse uses the following tables:

#### 1. **users** table
Stores user account information:
- `id` (uuid, primary key)
- `email` (text, unique)
- `name` (text)
- `password` (text, hashed)
- `stripe_customer_id` (text, optional)
- `created_at`, `updated_at` (timestamps)

#### 2. **subscriptions** table
Manages Stripe subscription data:
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `stripe_subscription_id` (text)
- `stripe_price_id` (text)
- `stripe_current_period_end` (timestamp)
- `status` (text)

#### 3. **documents** table
Stores generated documents:
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `title` (text)
- `type` (text: resume, presentation, letter, cv, diagram)
- `content` (jsonb)
- `prompt` (text)
- `created_at`, `updated_at` (timestamps)

#### 4. **templates** table
Stores document templates:
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `title` (text)
- `description` (text)
- `type` (text)
- `content` (jsonb)
- `is_public` (boolean)
- `is_default` (boolean)

#### 5. **template_shares** table
Manages template sharing:
- `id` (uuid, primary key)
- `template_id` (uuid, foreign key)
- `shared_by` (uuid, foreign key)
- `shared_with` (uuid, foreign key)
- `can_edit` (boolean)

### Manual Migration (Alternative Method)

If the automated setup script doesn't work, you can manually run migrations:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order from `supabase/migrations/`:
   - `20250628163807_curly_boat.sql` (users table)
   - `20250628163813_black_canyon.sql` (subscriptions table)
   - `20250628163818_ancient_flame.sql` (documents table)
   - `20250628163825_add_public_presentation_access.sql` (public access)
   - `20250725130000_add_template_tables.sql` (templates)
   - `20250727102329_lingering_wind.sql` (diagram support)

## Local Development

### Using Supabase CLI (Recommended)

For local development, you can use the Supabase CLI to run a local instance:

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase** (if not already done):
   ```bash
   supabase init
   ```

3. **Start local Supabase**:
   ```bash
   npm run supabase:start
   ```

   This will start:
   - PostgreSQL database on `localhost:54322`
   - Supabase Studio on `http://localhost:54323`
   - API server on `http://localhost:54321`

4. **Check status**:
   ```bash
   npm run supabase:status
   ```

5. **Stop local Supabase**:
   ```bash
   npm run supabase:stop
   ```

### Local Environment Variables

When using local Supabase, update your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
```

Get the local keys by running:
```bash
npm run supabase:status
```

## Production Deployment

### Vercel Deployment

1. **Push your code to GitHub**

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. **Add Environment Variables** in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Make sure to use your production Supabase credentials

4. **Deploy**:
   - Vercel will automatically deploy your app
   - Your app will be live at `https://your-project.vercel.app`

### Netlify Deployment

1. **Push your code to GitHub**

2. **Import to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your repository

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Add Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add all variables from `.env.local`

5. **Deploy**:
   - Click "Deploy site"

## Database Schema

### Row Level Security (RLS)

All tables have Row Level Security enabled to ensure users can only access their own data:

- **Users**: Can read/update their own profile
- **Documents**: Can CRUD their own documents
- **Templates**: Can CRUD their own templates, read public/default templates
- **Subscriptions**: Can read/update their own subscription

### Indexes

The following indexes are created for optimal performance:

- `users`: email (unique)
- `documents`: user_id, type, created_at
- `templates`: user_id, type, is_public
- `subscriptions`: user_id, stripe_subscription_id

## Troubleshooting

### Common Issues

#### 1. "Missing Supabase environment variables"

**Solution**: Ensure `.env.local` exists and contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### 2. "Policy already exists" error

**Solution**: The policies are already created. This is safe to ignore, or you can drop and recreate them:

```sql
-- Run in Supabase SQL Editor
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

Then run the setup script again.

#### 3. "Table does not exist"

**Solution**: Run migrations manually in Supabase SQL Editor:
1. Go to SQL Editor
2. Copy content from each migration file in `supabase/migrations/`
3. Execute them in order

#### 4. "Authentication failed"

**Solution**: 
- Verify your Supabase credentials are correct
- Check that your service role key has proper permissions
- Ensure your Supabase project is active (not paused)

#### 5. "Cannot connect to database"

**Solution**:
- Check your internet connection
- Verify the Supabase URL is correct
- Check Supabase status page: [status.supabase.com](https://status.supabase.com)

### Getting Help

If you encounter issues:

1. **Check the logs**: 
   - Supabase Dashboard → Logs
   - Browser console (F12)
   - Terminal output

2. **Review documentation**:
   - [Supabase Docs](https://supabase.com/docs)
   - [docverse README](./README.md)

3. **Community support**:
   - [Supabase Discord](https://discord.supabase.com)
   - [GitHub Issues](https://github.com/docmagic-ai/docmagic/issues)

## Advanced Configuration

### Custom Domain

To use a custom domain with Supabase:

1. Go to Project Settings → Custom Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SUPABASE_URL` in your environment variables

### Database Backups

Supabase automatically backs up your database:
- **Free tier**: Daily backups, 7-day retention
- **Pro tier**: Daily backups, 30-day retention
- **Point-in-time recovery**: Available on Pro tier

To restore a backup:
1. Go to Database → Backups
2. Select a backup
3. Click "Restore"

### Performance Optimization

1. **Enable connection pooling** (recommended for production):
   - Go to Project Settings → Database
   - Enable connection pooling
   - Use the pooler connection string in production

2. **Monitor query performance**:
   - Use Supabase Dashboard → Database → Query Performance
   - Identify slow queries
   - Add indexes as needed

3. **Use Edge Functions** for complex operations:
   - Create functions in `supabase/functions/`
   - Deploy with `supabase functions deploy`

## Security Best Practices

1. ✅ **Never commit** `.env.local` to version control
2. ✅ **Use service role key** only in server-side code
3. ✅ **Enable RLS** on all tables
4. ✅ **Validate user input** before database operations
5. ✅ **Use prepared statements** to prevent SQL injection
6. ✅ **Rotate keys** periodically
7. ✅ **Monitor access logs** in Supabase Dashboard

## Next Steps

After setting up Supabase:

1. ✅ Configure authentication (email, OAuth providers)
2. ✅ Set up Stripe for payments (if needed)
3. ✅ Configure email templates
4. ✅ Add custom domain
5. ✅ Set up monitoring and alerts
6. ✅ Configure backups

---

**Need help?** Check out our [Contributing Guide](./CONTRIBUTING.md) or open an issue on [GitHub](https://github.com/docmagic-ai/docmagic/issues).

**Happy coding!** 🪄✨
