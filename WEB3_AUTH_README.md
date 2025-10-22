# Web3 Wallet Authentication Implementation

This implementation adds Web3 wallet authentication to your docverse application, allowing users to sign in with their Ethereum (MetaMask) or Solana (Phantom) wallets.

## 🎯 What's Been Added

### 1. Dependencies Installed
- `ethers` - Ethereum wallet interaction and signature verification
- `@solana/web3.js` - Solana blockchain interaction
- `@solana/wallet-adapter-*` - Solana wallet adapter libraries

### 2. New Files Created

#### Components
- `components/auth/Web3AuthButton.tsx` - Reusable Web3 authentication button component

#### Types
- `types/web3.d.ts` - TypeScript definitions for Web3 window objects (MetaMask, Phantom)

#### API Routes
- `app/api/auth/web3/verify/route.ts` - Backend signature verification endpoint (optional)

#### Documentation
- `docs/WEB3_AUTH_SETUP.md` - Complete setup guide for Web3 authentication
- `WEB3_AUTH_README.md` - This file

### 3. Updated Files

#### Environment Configuration
- `.env.example` - Added `NEXT_PUBLIC_ENABLE_WEB3_AUTH` variable
- `.env.local.example` - Added Web3 configuration

#### Authentication Pages
- `app/auth/signin/page.tsx` - Added Web3 authentication buttons
- `app/auth/register/page.tsx` - Added Web3 authentication buttons

## 🚀 Quick Start

### 1. Enable Web3 Authentication in Supabase

Go to your Supabase Dashboard:
1. Navigate to **Authentication** → **Providers** → **Web3 Wallet**
2. Enable **Sign in with Ethereum** (toggle ON)
3. Enable **Sign in with Solana** (toggle ON)
4. Click **Save**

### 2. Update Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_ENABLE_WEB3_AUTH=true
```

### 3. Install Browser Wallets

For testing, install:
- [MetaMask](https://metamask.io/download/) - For Ethereum
- [Phantom](https://phantom.app/) - For Solana

### 4. Test the Integration

```bash
npm run dev
```

Visit `http://localhost:3000/auth/signin` and you'll see:
- ✅ Sign in with Ethereum button
- ✅ Sign in with Solana button

## 🔧 How It Works

### Ethereum Authentication (EIP-4361)

1. User clicks "Sign in with Ethereum"
2. MetaMask extension opens
3. User connects their wallet
4. A standardized message is generated (EIP-4361 format)
5. User signs the message with their private key
6. Signature is verified
7. User is authenticated and redirected

### Solana Authentication (SIWS)

1. User clicks "Sign in with Solana"
2. Phantom wallet opens
3. User connects their wallet
4. A standardized message is generated (SIWS format)
5. User signs the message with their private key
6. Signature is verified
7. User is authenticated and redirected

## 🎨 UI Features

The Web3 authentication buttons include:
- Beautiful wallet logos (Ethereum and Solana)
- Loading states with spinners
- Hover effects and animations
- Glass morphism design matching your app's style
- Responsive design for mobile and desktop
- Error handling with toast notifications

## 🔒 Security Features

### Current Implementation
- ✅ Cryptographic signature verification
- ✅ Unique nonce for each sign-in
- ✅ Timestamp validation
- ✅ Domain binding to prevent phishing
- ✅ Wallet address validation

### For Production (Recommended)
- 🔄 Backend signature verification (API route provided)
- 🔄 Nonce storage in Redis/database
- 🔄 Rate limiting on authentication endpoints
- 🔄 Session management with Supabase
- 🔄 User profile creation/linking

## 📝 Usage Example

### Using the Web3AuthButton Component

```tsx
import { Web3AuthButton } from "@/components/auth/Web3AuthButton";

// In your component
<Web3AuthButton
  provider="ethereum"  // or "solana"
  redirectTo="/dashboard"
  disabled={false}
/>
```

### Checking Web3 Authentication Status

```tsx
// Check if user authenticated with Web3
const web3Auth = localStorage.getItem("web3_auth");
const web3Provider = localStorage.getItem("web3_provider");

if (web3Auth) {
  const authData = JSON.parse(web3Auth);
  console.log("Wallet address:", authData.address);
  console.log("Provider:", web3Provider); // "ethereum" or "solana"
}
```

## 🛠️ Customization

### Disable Web3 Authentication

Set in `.env.local`:
```bash
NEXT_PUBLIC_ENABLE_WEB3_AUTH=false
```

### Customize Button Appearance

Edit `components/auth/Web3AuthButton.tsx`:
- Change button styles
- Modify wallet logos
- Update loading states
- Customize error messages

### Add More Wallet Providers

To add support for more wallets:
1. Install the wallet's SDK
2. Add wallet detection logic
3. Implement signature flow
4. Update the Web3AuthButton component

## 📚 Additional Resources

- [EIP-4361: Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361)
- [Sign-In with Solana](https://github.com/phantom/sign-in-with-solana)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [MetaMask Docs](https://docs.metamask.io/)
- [Phantom Docs](https://docs.phantom.app/)

## 🐛 Troubleshooting

### Wallet Not Detected
- Ensure browser extension is installed
- Refresh the page
- Check if extension is enabled
- Try a different browser

### Signature Failed
- Make sure wallet is unlocked
- Check network connection
- Verify correct network is selected
- Try disconnecting and reconnecting wallet

### Authentication Error
- Check Supabase configuration
- Verify Web3 providers are enabled in Supabase
- Check browser console for errors
- Review Supabase logs

## 🎯 Next Steps

1. **Test the implementation** with both MetaMask and Phantom
2. **Enable in production** by setting `NEXT_PUBLIC_ENABLE_WEB3_AUTH=true`
3. **Implement backend verification** using the provided API route
4. **Add user profile integration** to link wallets with user accounts
5. **Monitor usage** through Supabase analytics

## 💡 Tips

- Test on different networks (mainnet, testnet)
- Handle wallet disconnection gracefully
- Provide clear error messages to users
- Consider adding wallet balance display
- Implement wallet switching detection
- Add support for multiple wallets per user

## 🤝 Contributing

Found a bug or want to improve the Web3 authentication?
1. Open an issue on GitHub
2. Submit a pull request
3. Join our community Discord

---

**Note**: This implementation provides a solid foundation for Web3 authentication. For production use, ensure you implement proper backend verification and security measures as outlined in the documentation.
