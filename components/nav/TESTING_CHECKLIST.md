# Mobile Navigation Testing Checklist

## Functional Testing

### Navigation

- [ ] Menu button opens the drawer
- [ ] Close button (X) closes the drawer
- [ ] Clicking outside closes the drawer
- [ ] All navigation links work correctly
- [ ] Active page is highlighted correctly
- [ ] Clicking a nav item closes the drawer
- [ ] Logo link returns to homepage

### User Authentication

- [ ] Sign In button shows when logged out
- [ ] User profile card shows when logged in
- [ ] Profile link works
- [ ] Settings link works
- [ ] Sign Out button works
- [ ] User avatar displays correctly
- [ ] User initials fallback works

### Scrolling

- [ ] Content scrolls smoothly
- [ ] Header stays fixed at top
- [ ] Footer stays fixed at bottom
- [ ] Scroll indicator appears when needed
- [ ] No layout shift during scroll

## Visual Testing

### Layout

- [ ] Drawer width is correct (full width on mobile, 380px on larger)
- [ ] All sections are properly aligned
- [ ] Spacing is consistent
- [ ] No content overflow
- [ ] No horizontal scroll

### Active States

- [ ] Active item has gradient background
- [ ] Active item has left border accent
- [ ] Active item icon badge is colored
- [ ] Active chevron is visible and colored
- [ ] Only one item is active at a time

### Hover States

- [ ] Menu button shows gradient on hover
- [ ] Nav items change background on hover
- [ ] Chevrons slide in on hover
- [ ] Icon badges scale up on hover (main items)
- [ ] Cursor changes to pointer

### Colors & Gradients

- [ ] Brand gradient (yellow → orange) displays correctly
- [ ] User profile card has gradient background
- [ ] Active state gradient is subtle (10% opacity)
- [ ] Icon badges have gradient backgrounds
- [ ] Left border accent is gradient

### Typography

- [ ] Section headers are uppercase and small
- [ ] Nav item labels are bold
- [ ] Descriptions are smaller and muted
- [ ] Text truncates properly when too long
- [ ] Font weights are correct

### Icons

- [ ] All icons display correctly
- [ ] Icon sizes are consistent
- [ ] Icon badges are circular
- [ ] Sparkle animation on logo works
- [ ] Chevron icons point right

## Responsive Testing

### Mobile Devices

- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] Pixel 5 (393px)

### Tablet Devices

- [ ] iPad Mini (768px) - Should hide mobile nav
- [ ] iPad (810px) - Should hide mobile nav
- [ ] iPad Pro (1024px) - Should hide mobile nav

### Orientations

- [ ] Portrait mode
- [ ] Landscape mode
- [ ] Rotation transition is smooth

## Animation Testing

### Drawer

- [ ] Opens smoothly from left
- [ ] Closes smoothly to left
- [ ] No jank or stuttering
- [ ] Backdrop fades in/out
- [ ] Duration feels right (~300ms)

### Nav Items

- [ ] Hover transitions are smooth
- [ ] Chevrons slide in smoothly
- [ ] Icon badges scale smoothly
- [ ] Background changes are smooth
- [ ] No layout shift during animations

### Performance

- [ ] Animations run at 60fps
- [ ] No dropped frames
- [ ] CPU usage is reasonable
- [ ] Memory usage is stable

## Accessibility Testing

### Keyboard Navigation

- [ ] Tab key navigates through items
- [ ] Enter/Space activates links
- [ ] Escape closes drawer
- [ ] Focus visible on all items
- [ ] Focus order is logical
- [ ] No keyboard traps

### Screen Readers

- [ ] Menu button has proper label
- [ ] Nav items are announced correctly
- [ ] Active state is announced
- [ ] User info is announced
- [ ] Sections are properly structured
- [ ] Links are distinguishable

### Touch Targets

- [ ] All targets are at least 44px (iOS)
- [ ] All targets are at least 48px (Android)
- [ ] Adequate spacing between targets
- [ ] No accidental taps
- [ ] Easy to tap with thumb

### Color Contrast

- [ ] Text meets WCAG AA (4.5:1)
- [ ] Icons meet WCAG AA (3:1)
- [ ] Active states are distinguishable
- [ ] Hover states are visible
- [ ] Focus indicators are clear

### Motion

- [ ] Respects prefers-reduced-motion
- [ ] Animations can be disabled
- [ ] No motion sickness triggers

## Dark Mode Testing

### Colors

- [ ] All text is readable
- [ ] Gradients work in dark mode
- [ ] Borders are visible
- [ ] Hover states are visible
- [ ] Active states are distinguishable

### User Profile Card

- [ ] Gradient background is subtle
- [ ] Text is readable
- [ ] Avatar ring is visible

### Sign Out Button

- [ ] Red hover state works
- [ ] Text is readable
- [ ] Border is visible

## Edge Cases

### Long Content

- [ ] Long user names truncate
- [ ] Long email addresses truncate
- [ ] Long nav labels don't break layout
- [ ] Descriptions truncate properly

### No User

- [ ] Sign In button displays
- [ ] No user sections are hidden
- [ ] Layout doesn't break

### Slow Network

- [ ] Avatar loads gracefully
- [ ] Fallback initials show
- [ ] No layout shift on load

### Errors

- [ ] Sign out errors are handled
- [ ] Navigation errors are handled
- [ ] No console errors

## Browser Testing

### iOS

- [ ] Safari 14+
- [ ] Chrome iOS
- [ ] Firefox iOS

### Android

- [ ] Chrome 90+
- [ ] Firefox 90+
- [ ] Samsung Internet 14+

### Desktop (for reference)

- [ ] Mobile nav is hidden on desktop
- [ ] Desktop nav shows instead

## Performance Metrics

### Load Time

- [ ] Initial render < 100ms
- [ ] Drawer opens < 300ms
- [ ] No blocking operations

### Memory

- [ ] No memory leaks
- [ ] Stable memory usage
- [ ] Proper cleanup on unmount

### Bundle Size

- [ ] Component size is reasonable
- [ ] No unnecessary dependencies
- [ ] Tree-shaking works

## User Experience

### First Impression

- [ ] Looks modern and professional
- [ ] Brand identity is clear
- [ ] Purpose is obvious

### Usability

- [ ] Easy to find items
- [ ] Categories make sense
- [ ] Navigation is intuitive
- [ ] Feedback is clear

### Delight

- [ ] Animations feel smooth
- [ ] Interactions feel responsive
- [ ] Design feels polished
- [ ] Experience feels premium

## Sign-Off

- [ ] All critical issues resolved
- [ ] All major issues resolved
- [ ] Minor issues documented
- [ ] Performance is acceptable
- [ ] Accessibility is compliant
- [ ] Design is approved
- [ ] Code is reviewed
- [ ] Documentation is complete

**Tested By:** ******\_\_\_******
**Date:** ******\_\_\_******
**Version:** ******\_\_\_******
**Notes:** ******\_\_\_******
