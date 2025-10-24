# Mobile Navigation - Visual Guide

## Design System

### Color Palette

```
Primary Gradient:
├─ Yellow-500: #eab308
└─ Orange-500: #f97316

Active States:
├─ Background: from-yellow-500/10 to-orange-500/10
├─ Border: bg-gradient-to-b from-yellow-500 to-orange-500
└─ Icon Badge: from-yellow-500 to-orange-500

Hover States:
├─ Background: bg-accent/50
└─ Text: text-foreground

Muted States:
├─ Text: text-muted-foreground
└─ Icons: text-muted-foreground/50
```

### Typography

```
Section Headers:
├─ Size: text-xs
├─ Weight: font-semibold
├─ Transform: uppercase
├─ Tracking: tracking-wider
└─ Color: text-muted-foreground

Nav Item Labels:
├─ Size: text-sm
├─ Weight: font-semibold
└─ Color: text-foreground (active) / text-muted-foreground

Nav Item Descriptions:
├─ Size: text-xs
├─ Color: text-muted-foreground
└─ Truncate: truncate
```

### Spacing System

```
Container Padding:
├─ Horizontal: px-4 (16px)
└─ Vertical: py-4 (16px)

Item Padding:
├─ Main Items: px-3 py-3 (12px)
└─ Secondary Items: px-3 py-2.5 (12px, 10px)

Gaps:
├─ Between Items: space-y-1 (4px)
├─ Between Sections: space-y-6 (24px)
└─ Icon to Text: gap-3 (12px)
```

### Component Anatomy

#### Main Navigation Item (Create Documents)

```
┌────────────────────────────────────────┐
│ [●] │ Resume                        [>] │
│     │ Create professional resumes...    │
└────────────────────────────────────────┘
 │     │                               │
 │     └─ Label + Description          └─ Chevron
 └─ Icon Badge (36x36px, gradient bg)

Active State:
┌────────────────────────────────────────┐
│█[●] │ Resume                        [>] │
││    │ Create professional resumes...    │
│└────────────────────────────────────────┘
│└─ Left border accent (4px, gradient)
└─ Gradient background (10% opacity)
```

#### Secondary Navigation Item (More/Account)

```
┌────────────────────────────────────────┐
│ [●] Templates                      [>] │
└────────────────────────────────────────┘
 │                                    │
 └─ Icon (16x16px)                   └─ Chevron
```

#### User Profile Card

```
┌────────────────────────────────────────┐
│  ╭───╮  John Doe                       │
│  │ JD │  john@example.com              │
│  ╰───╯                                 │
└────────────────────────────────────────┘
   │      │
   │      └─ Name + Email
   └─ Avatar (48x48px, ring effect)

Background: Gradient from yellow-50/50 to orange-50/50
```

### Animation Specifications

#### Menu Button
```css
Hover:
- Background: gradient overlay (0% → 10% opacity)
- Icon: scale(1 → 1.1)
- Duration: 300ms
- Easing: ease-in-out
```

#### Navigation Items
```css
Hover:
- Background: transparent → accent/50
- Chevron: translateX(-4px → 0), opacity(0 → 1)
- Icon Badge: scale(1 → 1.1)
- Duration: 200ms
- Easing: ease-in-out

Active:
- Background: gradient (10% opacity)
- Left Border: 4px gradient
- Icon Badge: gradient background
- Chevron: visible, yellow-600 color
```

#### Drawer
```css
Open/Close:
- Transform: translateX(-100% → 0)
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### Responsive Breakpoints

```
Mobile (< 768px):
├─ Show: Mobile nav button
├─ Hide: Desktop nav
└─ Drawer: Full width (sm:380px max)

Tablet/Desktop (≥ 768px):
├─ Hide: Mobile nav button
├─ Show: Desktop nav
└─ Drawer: Not accessible
```

### Accessibility Features

```
ARIA Labels:
├─ Menu Button: "Open navigation menu"
├─ Close Button: Implicit from X icon
└─ Nav Items: Implicit from link text

Keyboard Navigation:
├─ Tab: Navigate through items
├─ Enter/Space: Activate links
├─ Escape: Close drawer
└─ Focus Visible: Ring outline

Touch Targets:
├─ Minimum: 44px (iOS) / 48px (Android)
├─ Main Items: 48px+ height
└─ Secondary Items: 40px+ height

Color Contrast:
├─ Text: 4.5:1 minimum
├─ Active State: 3:1 minimum
└─ Icons: 3:1 minimum
```

### Dark Mode Adjustments

```
User Profile Card:
├─ Light: from-yellow-50/50 to-orange-50/50
└─ Dark: from-yellow-950/20 to-orange-950/20

Sign Out Button:
├─ Light: hover:bg-red-50 hover:text-red-600
└─ Dark: hover:bg-red-950/20 hover:text-red-400

Borders:
├─ Light: border-border/50
└─ Dark: border-border/50 (auto-adjusts)
```

## Implementation Notes

### Performance Optimizations

1. **CSS Transforms**: Use transform instead of position changes
2. **Will-Change**: Applied to animated elements
3. **Lazy Rendering**: SheetClose prevents unnecessary renders
4. **Memoization**: Icons and static content memoized

### Browser Compatibility

- **Backdrop Blur**: Fallback to solid background
- **Gradients**: Fallback to solid colors
- **Animations**: Reduced motion support via prefers-reduced-motion

### Testing Scenarios

1. **Navigation**: All links work correctly
2. **Active State**: Highlights current page
3. **User State**: Shows/hides based on auth
4. **Scrolling**: Long lists scroll smoothly
5. **Touch**: All targets are tappable
6. **Animations**: Smooth 60fps
7. **Dark Mode**: Proper contrast
8. **Accessibility**: Screen reader compatible
