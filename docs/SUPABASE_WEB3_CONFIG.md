# Supabase Web3 Wallet Configuration

Quick reference for configuring Web3 wallet authentication in your Supabase dashboard.

## 📍 Location in Supabase Dashboard

```
Dashboard → Authentication → Providers → Web3 Wallet
```

## ⚙️ Configuration Steps

### 1. Navigate to Web3 Wallet Settings

1. Open your Supabase project dashboard
2. Click on **Authentication** in the left sidebar
3. Click on **Providers** tab
4. Scroll down to find **Web3 Wallet** section

### 2. Enable Ethereum (Sign-In with Ethereum)

**Toggle**: Enable Sign in with Ethereum ✅

**Settings**:

- **Enabled**: ON
- **Rate Limits**:
  - Requests per hour: 100 (default, adjust as needed)
  - Requests per minute: 10 (default, adjust as needed)

**What it does**:

- Allows users to sign in using MetaMask and other Ethereum wallets
- Implements EIP-4361 (Sign-In with Ethereum) standard
- Verifies wallet ownership through cryptographic signatures

### 3. Enable Solana (Sign-In with Solana)

**Toggle**: Enable Sign in with Solana ✅

**Settings**:

- **Enabled**: ON
- **Rate Limits**:
  - Requests per hour: 100 (default, adjust as needed)
  - Requests per minute: 10 (default, adjust as needed)

**What it does**:

- Allows users to sign in using Phantom and other Solana wallets
- Implements SIWS (Sign-In with Solana) standard
- Verifies wallet ownership through cryptographic signatures

### 4. Save Configuration

Click the **Save** button at the bottom of the page.

## 🔐 Security Settings (Optional)

### Rate Limiting

Adjust rate limits based on your application needs:

**Low Traffic** (Default):

- 100 requests/hour
- 10 requests/minute

**Medium Traffic**:

- 500 requests/hour
- 50 requests/minute

**High Traffic**:

- 1000 requests/hour
- 100 requests/minute

### Additional Security

Consider enabling:

- **Email confirmation** for new accounts
- **Multi-factor authentication** (MFA)
- **Session timeout** settings
- **IP allowlisting** for API access

## 📊 Monitoring

After enabling Web3 authentication, monitor:

1. **Authentication Logs**:
   - Dashboard → Authentication → Logs
   - Check for successful/failed sign-ins

2. **User Management**:
   - Dashboard → Authentication → Users
   - View users who signed in with Web3 wallets

3. **API Usage**:
   - Dashboard → Settings → API
   - Monitor authentication API calls

## 🧪 Testing

### Test Ethereum Authentication

1. Install MetaMask browser extension
2. Create or import a test wallet
3. Visit your app's sign-in page
4. Click "Sign in with Ethereum"
5. Approve the connection in MetaMask
6. Sign the authentication message
7. Verify successful sign-in

### Test Solana Authentication

1. Install Phantom browser extension
2. Create or import a test wallet
3. Visit your app's sign-in page
4. Click "Sign in with Solana"
5. Approve the connection in Phantom
6. Sign the authentication message
7. Verify successful sign-in

## 🔍 Verification

After configuration, verify:

✅ Web3 Wallet section shows "Enabled" status
✅ Both Ethereum and Solana toggles are ON
✅ Rate limits are configured
✅ Changes are saved (check for success message)

## 📝 Configuration Checklist

- [ ] Opened Supabase Dashboard
- [ ] Navigated to Authentication → Providers
- [ ] Found Web3 Wallet section
- [ ] Enabled Sign in with Ethereum
- [ ] Enabled Sign in with Solana
- [ ] Configured rate limits
- [ ] Clicked Save
- [ ] Tested Ethereum authentication
- [ ] Tested Solana authentication
- [ ] Verified users in dashboard

## 🚨 Troubleshooting

### "Web3 Wallet option not visible"

**Solution**:

- Ensure you're on a recent Supabase version
- Check if your project supports Web3 authentication
- Contact Supabase support if needed

### "Configuration not saving"

**Solution**:

- Check for error messages
- Verify you have admin permissions
- Try refreshing the page
- Clear browser cache

### "Authentication failing after enabling"

**Solution**:

- Verify environment variables are set correctly
- Check that `NEXT_PUBLIC_ENABLE_WEB3_AUTH=true`
- Ensure Supabase URL and keys are correct
- Review browser console for errors

## 📞 Support

If you encounter issues:

1. **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
2. **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)
3. **GitHub Issues**: Open an issue in your project repository
4. **Supabase Support**: support@supabase.io

## 🎯 Next Steps

After configuration:

1. ✅ Set `NEXT_PUBLIC_ENABLE_WEB3_AUTH=true` in your `.env.local`
2. ✅ Test authentication with both wallets
3. ✅ Implement backend verification (optional)
4. ✅ Monitor authentication logs
5. ✅ Deploy to production

---

**Last Updated**: Based on Supabase Dashboard as of 2024

**Note**: UI may vary slightly based on Supabase version. The core functionality remains the same.
