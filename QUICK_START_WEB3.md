# 🚀 Web3 Authentication - Quick Start

Get Web3 wallet authentication running in 5 minutes!

## ⚡ 3-Step Setup

### 1️⃣ Enable in Supabase (2 minutes)

```
Dashboard → Authentication → Providers → Web3 Wallet
```

Toggle **ON**:
- ✅ Enable Sign in with Ethereum
- ✅ Enable Sign in with Solana

Click **Save**

### 2️⃣ Configure Environment (30 seconds)

Add to `.env.local`:
```bash
NEXT_PUBLIC_ENABLE_WEB3_AUTH=true
```

### 3️⃣ Test (2 minutes)

```bash
npm run dev
```

Visit: `http://localhost:3000/auth/signin`

Install wallets:
- [MetaMask](https://metamask.io/download/) (Ethereum)
- [Phantom](https://phantom.app/) (Solana)

Click the Web3 buttons and sign in!

---

## 🎯 What You Get

### Sign-In Page
```
┌─────────────────────────────┐
│  [G] Continue with Google   │
│  [Ξ] Sign in with Ethereum  │ ← NEW
│  [◎] Sign in with Solana    │ ← NEW
│  ─── Or use email ───       │
│  Email: [___________]       │
│  Password: [___________]    │
│  [Sign In]                  │
└─────────────────────────────┘
```

### Features
- ✅ Ethereum wallet support (MetaMask)
- ✅ Solana wallet support (Phantom)
- ✅ Beautiful UI with animations
- ✅ Secure cryptographic signatures
- ✅ Toast notifications
- ✅ Error handling

---

## 📚 Documentation

- **Setup Guide**: `docs/WEB3_AUTH_SETUP.md`
- **Supabase Config**: `docs/SUPABASE_WEB3_CONFIG.md`
- **Visual Guide**: `docs/WEB3_VISUAL_GUIDE.md`
- **Full README**: `WEB3_AUTH_README.md`

---

## 🐛 Troubleshooting

**Wallet not detected?**
→ Install browser extension and refresh

**Authentication failed?**
→ Check Supabase configuration

**Buttons not showing?**
→ Verify `NEXT_PUBLIC_ENABLE_WEB3_AUTH=true`

---

## 🎉 That's It!

You now have Web3 authentication! 

Need help? Check the docs or open an issue.

Happy coding! 🚀
