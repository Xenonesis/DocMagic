# 🚀 Supabase Quick Start

Get docverse running with Supabase in 5 minutes!

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign up/Login
2. Click **"New Project"**
3. Fill in:
   - Name: `docverse`
   - Password: (choose a strong password)
   - Region: (closest to you)
4. Click **"Create new project"** (wait ~2 min)

## Step 2: Get Your Keys

1. Go to **Project Settings** (⚙️ icon)
2. Click **API** in sidebar
3. Copy these values:
   - **URL**: `https://xxxxx.supabase.co`
   - **anon public** key
   - **service_role** key ⚠️ (keep secret!)

## Step 3: Configure Environment

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Install & Setup

```bash
# Install dependencies
npm install

# Setup database (creates tables, policies, seed data)
npm run setup-db
```

## Step 5: Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## What Just Happened?

The setup script created:

✅ **5 tables**: users, subscriptions, documents, templates, template_shares  
✅ **Row Level Security** policies for data protection  
✅ **Indexes** for fast queries  
✅ **Default templates** to get you started  

## Next Steps

- 📖 Read the [Full Setup Guide](./SUPABASE_SETUP.md)
- 🔐 Configure [Authentication](./AUTHENTICATION_FLOW.md)
- 💳 Set up [Stripe](./README.md#stripe-configuration) (optional)
- 🚀 Deploy to [Vercel/Netlify](./SUPABASE_SETUP.md#production-deployment)

## Troubleshooting

**"Missing environment variables"**  
→ Check that `.env.local` exists and has all 3 Supabase variables

**"Setup failed"**  
→ Run migrations manually in Supabase SQL Editor (see [Full Guide](./SUPABASE_SETUP.md#manual-migration))

**"Cannot connect"**  
→ Verify your Supabase URL and keys are correct

---

**Need help?** Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) or [open an issue](https://github.com/docmagic-ai/docmagic/issues).
