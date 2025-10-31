# 🎤 Microphone Troubleshooting Guide

## Issue: "Microphone permission was denied" but browser didn't ask for permission

This usually means the permission was previously denied or blocked.

---

## ✅ Solution 1: Reset Microphone Permissions

### Chrome/Edge (Recommended)

1. **Copy this and paste in address bar:**
   ```
   chrome://settings/content/microphone
   ```

2. **Look for `localhost:3000` in the "Blocked" section**

3. **Click the trash icon** 🗑️ to remove it

4. **Refresh the page** and try again - it will ask for permission

### Alternative Chrome/Edge Method:

1. Click the **lock icon** 🔒 (or "Not secure") in address bar
2. Click **"Site settings"**
3. Find **"Microphone"** 
4. Change to **"Ask (default)"** or **"Allow"**
5. **Refresh the page** (F5)
6. Click microphone button again

---

## ✅ Solution 2: Check System Permissions

### Windows:

1. **Windows Settings** → **Privacy** → **Microphone**
2. Ensure **"Allow apps to access your microphone"** is ON
3. Scroll down and ensure **Chrome/Edge** is allowed
4. Restart browser

### Mac:

1. **System Preferences** → **Security & Privacy** → **Microphone**
2. Check the box next to **Chrome/Safari**
3. May need to restart browser

---

## ✅ Solution 3: Test if Microphone Works

### Quick Test:

1. Open a new tab
2. Go to: `https://www.google.com`
3. Click the microphone icon in the search bar
4. If Google asks for permission → your mic works
5. Come back to localhost:3000 and try again

---

## ✅ Solution 4: Check Browser Console

1. Open browser console (F12 or Right-click → Inspect)
2. Click **Console** tab
3. Click the microphone button
4. Look for errors
5. Share the error message if you see one

Common errors:
- `NotAllowedError` → Permission denied (use Solution 1)
- `NotFoundError` → No microphone detected
- `NotSupportedError` → Browser doesn't support it

---

## ✅ Solution 5: Use Different Browser

If nothing works, try:

1. **Chrome** - Best support for Web Speech API
2. **Edge** - Also excellent support
3. **Safari** - Works but requires webkit prefix (already handled)

**Firefox** - Does NOT support Web Speech API (won't work)

---

## 🔍 How to Force Permission Prompt

### Method 1: Clear Site Data

1. Press **F12** to open DevTools
2. Click **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Right-click **localhost:3000** under "Cookies"
4. Click **"Clear"**
5. Refresh page
6. Try microphone again

### Method 2: Incognito/Private Mode

1. Open an **Incognito/Private window**
2. Go to `http://localhost:3000/resume`
3. Click microphone button
4. Browser WILL ask for permission in new incognito window

---

## 🧪 Test Voice Recognition Directly

Open browser console (F12) and paste this:

```javascript
// Check if supported
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  console.log('✅ Voice recognition is supported');
  
  // Try to start
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.onstart = () => {
    console.log('✅ Started! Speak now...');
  };
  
  recognition.onresult = (event) => {
    console.log('✅ You said:', event.results[0][0].transcript);
  };
  
  recognition.onerror = (event) => {
    console.log('❌ Error:', event.error);
  };
  
  recognition.start();
} else {
  console.log('❌ Voice recognition NOT supported');
}
```

This will:
- Tell you if it's supported
- Try to start recognition
- Show any errors
- Display what you said if it works

---

## 🎯 Expected Behavior

When working correctly:

1. You click microphone button
2. **First time**: Browser shows popup: "localhost:3000 wants to use your microphone" → Click "Allow"
3. Button turns red and pulses
4. You speak
5. Text appears in real-time
6. Click stop when done

---

## 💡 Quick Fixes

### Fix 1: Use HTTPS
```bash
# Voice API works better with HTTPS
# For local dev, http://localhost works fine
# But if deployed, ensure HTTPS is enabled
```

### Fix 2: Check URL
```
✅ Works: http://localhost:3000
✅ Works: https://yourdomain.com
❌ May not work: http://192.168.x.x
❌ May not work: http://yourdomain.com (without HTTPS)
```

### Fix 3: Try Another Port
```bash
# If localhost:3000 is blocked, try different port
npm run dev -- -p 3001

# Then visit: http://localhost:3001/resume
```

---

## 🔄 Reset Everything

If nothing works, nuclear option:

### Chrome:
```
1. chrome://settings/content/siteDetails?site=http%3A%2F%2Flocalhost%3A3000
2. Click "Clear data" at bottom
3. Restart browser
4. Try again
```

### Or manually:
```
1. Close all browser windows
2. Reopen browser
3. Visit localhost:3000/resume
4. Click microphone
5. Should ask for permission
```

---

## 📞 Still Not Working?

### Check these:

1. **Browser:** Are you using Chrome or Edge? (Firefox doesn't support it)
2. **Microphone:** Does your computer have a working microphone?
3. **System:** Is microphone enabled in system settings?
4. **Permissions:** Check chrome://settings/content/microphone
5. **Console errors:** Press F12 → Console tab → Look for errors

### Alternative Features to Test:

While troubleshooting microphone, try these features that work without permissions:

- ✅ **Translation** - Click "Translate" button (works immediately)
- ✅ **Personalization** - Click "Personalize" button (works immediately)  
- ✅ **Comparison** - Click "Save Version" then "Compare" (works immediately)

---

## 🎤 Microphone Requirements

✅ Required:
- Chrome, Edge, or Safari browser
- Working microphone (built-in or external)
- Microphone enabled in system settings
- Permission granted to browser
- Internet connection (for speech recognition API)

❌ Won't Work:
- Firefox (no Web Speech API support)
- Microphone disabled in system
- Permission denied in browser
- No microphone connected

---

## 🐛 Debug Steps

Run these in order:

1. **Check browser:** Type `chrome://version` in address bar → Is it Chrome/Edge?
2. **Check API:** Open console → Type: `'webkitSpeechRecognition' in window` → Should be `true`
3. **Check permissions:** `chrome://settings/content/microphone` → Is localhost blocked?
4. **Check system:** Windows → Settings → Privacy → Microphone → Is it on?
5. **Test mic:** Open Windows "Voice Recorder" app → Can you record audio?

If ALL above pass, microphone should work!

---

## ✅ Success Indicators

When working:
- ✅ Button turns red when recording
- ✅ Button pulses/animates
- ✅ Text appears as you speak
- ✅ "Listening..." message shows

Not working:
- ❌ Error message appears immediately
- ❌ Button stays gray
- ❌ No animation
- ❌ No text appears

---

## 💬 Get Help

If still stuck, tell me:
1. Which browser and version?
2. What error message do you see?
3. What happens in browser console (F12)?
4. Does it work in Incognito mode?
5. Does Google Voice Search work?

I'll help you debug further!
