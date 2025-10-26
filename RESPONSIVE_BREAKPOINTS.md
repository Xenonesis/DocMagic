# Responsive Breakpoints Guide

## Visual Breakdown

### 📱 Mobile (< 475px)

```
┌─────────────────────────┐
│ ⚡ Powered by Team⚡Blitz│ ← 32px height
│ and opensource community│   10px font
├─────────────────────────┤
│ [Logo] [Menu] [Nav]     │ ← 56px height
├─────────────────────────┤
│                         │
│ Content starts at 88px  │
│                         │
```

### 📱 Extra Small (475px - 639px)

```
┌──────────────────────────────┐
│ ⚡ Powered by Team⚡Blitz and │ ← 36px height
│ opensource community ⭐      │   12px font
├──────────────────────────────┤
│ [Logo] [Menu] [Navigation]   │ ← 56px height
├──────────────────────────────┤
│                              │
│ Content starts at 92px       │
│                              │
```

### 💻 Small (640px - 767px)

```
┌────────────────────────────────────────┐
│ ⚡ Powered by Team⚡Blitz and the      │ ← 40px height
│ opensource community ⭐                │   14px font
├────────────────────────────────────────┤
│ [Logo] [Resume] [CV] [Letter] [...]   │ ← 64px height
├────────────────────────────────────────┤
│                                        │
│ Content starts at 104px                │
│                                        │
```

### 🖥️ Medium+ (768px+)

```
┌──────────────────────────────────────────────────┐
│ ⚡ Powered by Team⚡Blitz and the opensource     │ ← 48px height
│ community ⭐                                     │   14px font
├──────────────────────────────────────────────────┤
│ [Logo] [Resume] [Presentation] [CV] [Letter]... │ ← 64px height
├──────────────────────────────────────────────────┤
│                                                  │
│ Content starts at 112px                          │
│                                                  │
```

## Breakpoint Summary Table

| Breakpoint | Width  | Banner | Navbar | Total | Font | Icons |
| ---------- | ------ | ------ | ------ | ----- | ---- | ----- |
| Mobile     | <475px | 32px   | 56px   | 88px  | 10px | 10px  |
| XS         | 475px  | 36px   | 56px   | 92px  | 12px | 12px  |
| SM         | 640px  | 40px   | 64px   | 104px | 14px | 14px  |
| MD+        | 768px+ | 48px   | 64px   | 112px | 14px | 16px  |

## Tailwind Breakpoints Used

```css
/* Default (Mobile) */
< 475px

/* xs (Extra Small) */
@media (min-width: 475px) {
}

/* sm (Small) */
@media (min-width: 640px) {
}

/* md (Medium) */
@media (min-width: 768px) {
}

/* lg (Large) */
@media (min-width: 1024px) {
}

/* xl (Extra Large) */
@media (min-width: 1280px) {
}

/* 2xl (2X Large) */
@media (min-width: 1536px) {
}
```

## Component Classes

### Sponsor Banner

```tsx
// Padding (vertical)
py-1.5    // Mobile: 6px
xs:py-2   // XS: 8px
sm:py-2.5 // SM: 10px
md:py-3   // MD+: 12px

// Padding (horizontal)
px-2      // Mobile: 8px
xs:px-3   // XS: 12px
sm:px-4   // SM: 16px
md:px-6   // MD+: 24px

// Font size
text-[10px]  // Mobile: 10px
xs:text-xs   // XS: 12px
sm:text-sm   // SM+: 14px

// Icon size
h-2.5 w-2.5      // Mobile: 10px
xs:h-3 xs:w-3    // XS: 12px
sm:h-3.5 sm:w-3.5 // SM: 14px
md:h-4 md:w-4    // MD+: 16px
```

### Navbar Position

```tsx
top-[32px]      // Mobile
xs:top-[36px]   // XS
sm:top-[40px]   // SM
md:top-[48px]   // MD+
```

### Page Content

```css
.page-with-header {
  padding-top: 88px; /* Mobile */
}

@media (min-width: 475px) {
  padding-top: 92px; /* XS */
}

@media (min-width: 640px) {
  padding-top: 104px; /* SM */
}

@media (min-width: 768px) {
  padding-top: 112px; /* MD+ */
}
```

## Testing Devices

### Mobile Phones

- iPhone SE (375px) ✅
- iPhone 12/13/14 (390px) ✅
- iPhone 14 Pro Max (430px) ✅
- Samsung Galaxy S21 (360px) ✅
- Pixel 5 (393px) ✅

### Tablets

- iPad Mini (768px) ✅
- iPad (810px) ✅
- iPad Pro (1024px) ✅

### Desktop

- Laptop (1366px) ✅
- Desktop (1920px) ✅
- 4K (3840px) ✅

## Responsive Behavior

### Text Wrapping

- **Mobile**: May wrap to 2 lines if needed
- **XS+**: Usually single line
- **SM+**: Always single line

### Icon Visibility

- **Mobile**: Decorative background orbs hidden
- **SM+**: Decorative elements visible

### Spacing

- **Mobile**: Compact (gap-0.5)
- **XS**: Comfortable (gap-1)
- **SM**: Spacious (gap-1.5)
- **MD+**: Generous (gap-2)

## Performance Notes

- All transitions use `transform` for GPU acceleration
- Fixed positioning prevents layout reflow
- Backdrop blur has fallback for older browsers
- Animations respect `prefers-reduced-motion`

## Accessibility

- Minimum touch target: 44px (iOS) / 48px (Android) ✅
- Text contrast: WCAG AA compliant ✅
- Keyboard navigation: Full support ✅
- Screen readers: Proper semantic HTML ✅
