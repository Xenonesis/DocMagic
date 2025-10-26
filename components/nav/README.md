# Navigation Components

This directory contains the refactored navigation components for the site header.

## Structure

### Components

- **nav-items.ts** - Navigation items configuration (routes, labels, icons, tooltips)
- **nav-logo.tsx** - Logo component with link to homepage
- **desktop-nav.tsx** - Desktop navigation menu with tooltips
- **mobile-nav.tsx** - 🎨 **Redesigned** mobile navigation with modern UI/UX
- **user-menu.tsx** - User dropdown menu for desktop (profile, settings, sign out)
- **nav-actions.tsx** - Right-side actions (PWA install, theme toggle, auth)
- **index.ts** - Barrel export for clean imports

### Documentation

- **MOBILE_NAV_DESIGN.md** - Detailed mobile nav redesign documentation
- **VISUAL_GUIDE.md** - Design system and visual specifications
- **README.md** - This file

## Mobile Navigation Redesign ✨

The mobile navigation has been completely redesigned with:

### Key Features

- 📱 **Full-width drawer** with organized sections
- 🎨 **Gradient accents** and icon badges
- 🎯 **Categorized navigation** (Create Documents, More, Account)
- ✨ **Rich animations** and micro-interactions
- 👤 **User profile card** with gradient background
- ♿ **Enhanced accessibility** with proper ARIA labels
- 📏 **Large touch targets** (48px+) for better mobile UX

### Visual Highlights

- Active state with left border gradient accent
- Icon badges with colored backgrounds for main items
- Smooth hover states with chevron indicators
- Scrollable content area with fixed header/footer
- Dark mode optimized

See [MOBILE_NAV_DESIGN.md](./MOBILE_NAV_DESIGN.md) for complete details.

## Usage

The main `SiteHeader` component imports and composes these smaller components:

```tsx
import { NavLogo, DesktopNav, MobileNav, NavActions } from '@/components/nav';

export function SiteHeader() {
  return (
    <header>
      <NavLogo />
      <MobileNav />
      <DesktopNav />
      <NavActions />
    </header>
  );
}
```

## Benefits

- **Separation of Concerns**: Each component has a single, focused responsibility
- **Reusability**: Components can be reused or tested independently
- **Maintainability**: Easier to locate and modify specific features
- **Readability**: Smaller files are easier to understand and navigate
- **Modern UX**: Enhanced mobile experience with intuitive navigation
