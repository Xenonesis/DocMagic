# Web3 Wallet Authentication - Visual Setup Guide

This guide shows you exactly what you should see in your Supabase dashboard when setting up Web3 wallet authentication.

## 📍 Step-by-Step Visual Guide

### Step 1: Navigate to Authentication Providers

**Path**: Dashboard → Authentication → Providers

You should see a list of authentication providers including:
- Email
- Phone
- Google
- GitHub
- ... and more

Scroll down to find the **Web3 Wallet** section.

---

### Step 2: Locate Web3 Wallet Section

Look for a section titled **"Web3 Wallet"** with two subsections:

```
┌─────────────────────────────────────────────┐
│  Web3 Wallet                                │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Enable Sign in with Ethereum       │   │
│  │  [Toggle Switch: OFF → ON]          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Enable Sign in with Solana         │   │
│  │  [Toggle Switch: OFF → ON]          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

### Step 3: Enable Ethereum Authentication

**What you'll see**:

```
┌──────────────────────────────────────────────────┐
│  Enable Sign in with Ethereum                    │
│  ┌──────────────────────────────────────────┐   │
│  │  [●] Enabled                              │   │
│  │                                           │   │
│  │  Allow Ethereum wallets to sign in       │   │
│  │  using EIP-4361 (Sign-In with Ethereum)  │   │
│  │                                           │   │
│  │  Rate Limits:                             │   │
│  │  • Requests per hour: [100]               │   │
│  │  • Requests per minute: [10]              │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**Actions**:
1. Click the toggle switch to turn it **ON** (it will turn green/blue)
2. The toggle should show: `[●]` (enabled state)
3. Default rate limits are fine for most applications

---

### Step 4: Enable Solana Authentication

**What you'll see**:

```
┌──────────────────────────────────────────────────┐
│  Enable Sign in with Solana                      │
│  ┌──────────────────────────────────────────┐   │
│  │  [●] Enabled                              │   │
│  │                                           │   │
│  │  Allow Solana wallets to sign in         │   │
│  │  using SIWS (Sign-In with Solana)        │   │
│  │                                           │   │
│  │  Rate Limits:                             │   │
│  │  • Requests per hour: [100]               │   │
│  │  • Requests per minute: [10]              │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**Actions**:
1. Click the toggle switch to turn it **ON** (it will turn green/blue)
2. The toggle should show: `[●]` (enabled state)
3. Default rate limits are fine for most applications

---

### Step 5: Save Configuration

**What you'll see at the bottom of the page**:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [Cancel]              [Save]                    │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Actions**:
1. Click the **[Save]** button
2. Wait for confirmation message: "Settings saved successfully" ✅
3. The page may refresh automatically

---

### Step 6: Verify Configuration

After saving, both toggles should show as **enabled**:

```
✅ Enable Sign in with Ethereum    [●] ON
✅ Enable Sign in with Solana      [●] ON
```

---

## 🎨 Visual Indicators

### Toggle States

**Disabled (OFF)**:
```
[ ] OFF  (gray/inactive)
```

**Enabled (ON)**:
```
[●] ON  (green/blue/active)
```

### Success Messages

After saving, you should see:
```
┌──────────────────────────────────────────┐
│  ✅ Settings saved successfully          │
└──────────────────────────────────────────┘
```

---

## 📊 What Your Dashboard Should Look Like

### Before Configuration
```
Authentication → Providers → Web3 Wallet

┌─────────────────────────────────────┐
│  Web3 Wallet                        │
│                                     │
│  [ ] Enable Sign in with Ethereum   │
│  [ ] Enable Sign in with Solana     │
│                                     │
│  Status: Disabled                   │
└─────────────────────────────────────┘
```

### After Configuration
```
Authentication → Providers → Web3 Wallet

┌─────────────────────────────────────┐
│  Web3 Wallet                        │
│                                     │
│  [●] Enable Sign in with Ethereum   │
│  [●] Enable Sign in with Solana     │
│                                     │
│  Status: Active ✅                  │
└─────────────────────────────────────┘
```

---

## 🔍 Verification Checklist

After configuration, verify these visual indicators:

- [ ] **Ethereum toggle** shows as **ON** (green/blue)
- [ ] **Solana toggle** shows as **ON** (green/blue)
- [ ] **Success message** appeared after clicking Save
- [ ] **Status** shows as "Active" or "Enabled"
- [ ] **Rate limits** are configured (default: 100/hour, 10/minute)
- [ ] **No error messages** are displayed

---

## 🎯 Expected User Experience

### On Your Sign-In Page

After configuration, users should see:

```
┌────────────────────────────────────────────┐
│         Sign In to docverse                │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [G] Continue with Google            │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [Ξ] Sign in with Ethereum           │ │ ← NEW
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [◎] Sign in with Solana             │ │ ← NEW
│  └──────────────────────────────────────┘ │
│                                            │
│  ─────── Or continue with email ────────  │
│                                            │
│  Email: [________________]                 │
│  Password: [________________]              │
│                                            │
│  [Sign In]                                 │
└────────────────────────────────────────────┘
```

---

## 🚨 Common Visual Issues

### Issue 1: Web3 Wallet Section Not Visible

**What you might see**:
- No "Web3 Wallet" section in the providers list
- Only traditional providers (Email, Google, etc.)

**Solution**:
- Ensure you're on the latest Supabase version
- Check if your project supports Web3 authentication
- Contact Supabase support

---

### Issue 2: Toggles Won't Stay Enabled

**What you might see**:
- Toggle switches back to OFF after clicking
- Error message appears

**Solution**:
- Check browser console for errors
- Verify you have admin permissions
- Try refreshing the page
- Clear browser cache

---

### Issue 3: Save Button Disabled

**What you might see**:
- Save button is grayed out
- Can't click Save

**Solution**:
- Make sure you've made changes
- Check if there are validation errors
- Verify all required fields are filled

---

## 📸 Screenshot Reference

Your Supabase dashboard should look similar to the image you provided, with:

1. **Left sidebar**: Authentication section highlighted
2. **Main panel**: Providers tab selected
3. **Web3 Wallet section**: 
   - "Enable Sign in with Ethereum" toggle: **ON** ✅
   - "Enable Sign in with Solana" toggle: **ON** ✅
4. **Bottom**: Save button visible

---

## 🎓 Next Steps After Visual Confirmation

Once you see the correct visual indicators:

1. ✅ Both toggles are ON
2. ✅ Settings saved successfully
3. ✅ No error messages

Proceed to:
- Set `NEXT_PUBLIC_ENABLE_WEB3_AUTH=true` in `.env.local`
- Restart your development server
- Test authentication with MetaMask and Phantom
- Verify users appear in Authentication → Users

---

## 💡 Pro Tips

1. **Take a screenshot** of your configuration for reference
2. **Test immediately** after enabling to catch issues early
3. **Monitor logs** in Authentication → Logs for sign-in attempts
4. **Check user list** in Authentication → Users to see Web3 users
5. **Review rate limits** if you expect high traffic

---

## 📞 Need Help?

If your dashboard doesn't match these visuals:

1. **Check Supabase version**: Ensure you're on a recent version
2. **Review documentation**: [supabase.com/docs](https://supabase.com/docs)
3. **Contact support**: support@supabase.io
4. **Community help**: [discord.supabase.com](https://discord.supabase.com)

---

**Last Updated**: Based on Supabase Dashboard UI as of 2024

**Note**: Exact UI may vary slightly based on Supabase version, but core functionality remains the same.
