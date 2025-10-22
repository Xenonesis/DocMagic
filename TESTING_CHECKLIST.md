# 🧪 Diagram Export Authentication - Testing Checklist

## Quick Test Guide

Use this checklist to verify the implementation works correctly.

---

## 🔍 Pre-Test Setup

### Start Development Server
```bash
npm run dev
```

### Test URLs
- Main app: `http://localhost:3000`
- Diagram page: `http://localhost:3000/diagram`
- Login page: `http://localhost:3000/auth/signin`

---

## ✅ Test Scenario 1: Non-Authenticated User

### Setup
- [ ] Open browser in incognito/private mode
- [ ] Clear all cookies and local storage
- [ ] Navigate to `/diagram` page

### Test Steps

#### 1. Page Access
- [ ] Page loads without login prompt
- [ ] No authentication redirect occurs
- [ ] All UI elements are visible

#### 2. Diagram Creation Features
- [ ] Code editor is visible and functional
- [ ] Can type Mermaid code in editor
- [ ] Quick template buttons work
- [ ] Can select different templates (flowchart, sequence, etc.)
- [ ] Live preview updates in real-time
- [ ] Preview renders correctly

#### 3. AI Generation (if configured)
- [ ] "AI Generate" button is visible
- [ ] Dialog opens when clicked
- [ ] Can select diagram type
- [ ] Can enter prompt
- [ ] AI generation works (if API keys configured)

#### 4. Non-Protected Actions
- [ ] "Copy Code" button works
- [ ] Code is copied to clipboard
- [ ] Toast notification appears
- [ ] "Share" button works
- [ ] Can switch between tabs (Editor, Templates, Preview)

#### 5. Export Attempt (PNG)
- [ ] Click "Export PNG" button
- [ ] 🔒 Lock icon is visible on button
- [ ] Authentication dialog appears
- [ ] Dialog shows:
  - [ ] Lock icon with gradient background
  - [ ] "Sign in to Export Diagrams" title
  - [ ] Benefits list with 4 items
  - [ ] Social proof badges (10K+ users, AI-powered, Free plan)
  - [ ] "Continue Creating" button
  - [ ] "Sign In to Export" button

#### 6. Dialog Actions
- [ ] Click "Continue Creating" - Dialog closes
- [ ] Diagram page remains accessible
- [ ] Can continue working without login
- [ ] Click export again - Dialog reappears
- [ ] Click "Sign In to Export" - Redirects to login page
- [ ] Return URL is preserved in query params

#### 7. Export Attempt (SVG)
- [ ] Click "Export SVG" button
- [ ] 🔒 Lock icon is visible on button
- [ ] Same authentication dialog appears
- [ ] All dialog features work identically

#### 8. Visual Indicators
- [ ] Lock icons visible on export buttons
- [ ] "Login required" text in export section header
- [ ] In Preview tab: Yellow info banner visible
- [ ] Info banner explains auth requirement clearly

---

## ✅ Test Scenario 2: Authenticated User

### Setup
- [ ] Login to the application
- [ ] Verify login is successful (check header/navbar)
- [ ] Navigate to `/diagram` page

### Test Steps

#### 1. Page Access
- [ ] Page loads immediately
- [ ] User remains logged in
- [ ] All features visible

#### 2. Diagram Creation
- [ ] All creation features work as before
- [ ] Code editor functional
- [ ] Templates work
- [ ] AI generation works
- [ ] Preview updates

#### 3. Export PNG
- [ ] Click "Export PNG" button
- [ ] 🚫 No authentication dialog appears
- [ ] ✅ Export happens immediately
- [ ] PNG file downloads
- [ ] File opens correctly
- [ ] Diagram is rendered properly in PNG

#### 4. Export SVG
- [ ] Click "Export SVG" button
- [ ] 🚫 No authentication dialog appears
- [ ] ✅ Export happens immediately
- [ ] SVG file downloads
- [ ] File opens correctly
- [ ] Diagram is rendered properly in SVG

#### 5. Visual Indicators
- [ ] 🚫 No lock icons on export buttons
- [ ] 🚫 No "Login required" text
- [ ] 🚫 No auth warning banners
- [ ] Export buttons look normal

---

## ✅ Test Scenario 3: Login Flow

### Setup
- [ ] Start as non-authenticated user
- [ ] Create a diagram
- [ ] Try to export

### Test Steps

#### 1. Export & Login
- [ ] Click export button
- [ ] Auth dialog appears
- [ ] Click "Sign In to Export"
- [ ] Redirects to `/auth/signin`
- [ ] Return URL includes `/diagram` path
- [ ] Activity parameter is present

#### 2. Complete Login
- [ ] Login with credentials
- [ ] After successful login:
  - [ ] Redirects back to `/diagram` page
  - [ ] Previous diagram is still there (if state preserved)
  - [ ] Now logged in

#### 3. Export After Login
- [ ] Try export again
- [ ] Export works immediately
- [ ] File downloads successfully
- [ ] No auth prompts appear

---

## ✅ Test Scenario 4: Edge Cases

### Browser Compatibility
- [ ] Chrome/Edge: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Mobile browsers: Responsive and functional

### Responsive Design
- [ ] Desktop (1920x1080): Dialog fits properly
- [ ] Tablet (768x1024): Dialog is readable
- [ ] Mobile (375x667): Dialog is usable
- [ ] Small mobile (320x568): No overflow

### Network Conditions
- [ ] Fast connection: All features work
- [ ] Slow connection: Loading states appear
- [ ] Offline: Graceful degradation

### Session Management
- [ ] Login, export works
- [ ] Logout, export shows dialog
- [ ] Login again, export works
- [ ] Session persists across page refresh

---

## 🐛 Common Issues & Solutions

### Issue: Auth dialog doesn't appear
**Check:**
- [ ] `useAuthGuard` imported correctly
- [ ] `isAuthenticated` state is working
- [ ] User is actually logged out

### Issue: Export doesn't work after login
**Check:**
- [ ] Session is properly authenticated
- [ ] `isAuthenticated` returns true
- [ ] Export function completes without errors

### Issue: Lock icons not showing
**Check:**
- [ ] User is logged out
- [ ] Component state is correct
- [ ] Conditional rendering logic is correct

### Issue: Dialog styling broken
**Check:**
- [ ] CSS classes are loaded
- [ ] Tailwind is configured
- [ ] No conflicting styles

---

## 📊 Test Results Template

```
Date: _______________
Tester: _______________
Browser: _______________
Device: _______________

Scenario 1 (Non-Auth): ☐ Pass ☐ Fail
Scenario 2 (Auth): ☐ Pass ☐ Fail
Scenario 3 (Login Flow): ☐ Pass ☐ Fail
Scenario 4 (Edge Cases): ☐ Pass ☐ Fail

Notes:
_________________________________
_________________________________
_________________________________

Overall Status: ☐ PASS ☐ FAIL
```

---

## 🎯 Success Criteria

All tests should pass for production deployment:

- ✅ Non-auth users can create diagrams
- ✅ Non-auth users see auth dialog on export
- ✅ Dialog is beautiful and informative
- ✅ Auth users can export immediately
- ✅ No visual indicators for auth users
- ✅ Login flow redirects properly
- ✅ Responsive on all devices
- ✅ Works in all major browsers

---

## 🚀 Sign-Off

When all tests pass:
- [ ] Feature is production ready
- [ ] Documentation is complete
- [ ] Code is committed
- [ ] Ready for deployment

**Tested By:** _______________
**Date:** _______________
**Signature:** _______________

