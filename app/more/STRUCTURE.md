# More Page - File Structure

## Directory Tree

```
app/more/
│
├── page.tsx                          # Main landing page with all 12 document types
├── README.md                         # Documentation
├── STRUCTURE.md                      # This file
│
├── business-card/
│   └── page.tsx                      # Business card page
│
├── flyer/
│   └── page.tsx                      # Flyer & poster page
│
├── contract/
│   └── page.tsx                      # Contract & agreements page
│
├── report/
│   └── page.tsx                      # Reports & proposals page
│
├── newsletter/
│   └── page.tsx                      # Newsletter page
│
├── social-media/
│   └── page.tsx                      # Social media graphics page
│
├── form/
│   └── page.tsx                      # Forms & surveys page
│
├── calendar/
│   └── page.tsx                      # Calendars & planners page
│
├── brochure/
│   └── page.tsx                      # Brochures & pamphlets page
│
├── menu/
│   └── page.tsx                      # Menus & price lists page
│
├── invitation/
│   └── page.tsx                      # Event invitations page
│
└── id-card/
    └── page.tsx                      # ID cards & badges page

components/more/
│
├── business-card-generator.tsx       # Business card generator component
├── flyer-generator.tsx               # Flyer generator component
├── contract-generator.tsx            # Contract generator component
├── report-generator.tsx              # Report generator component
├── newsletter-generator.tsx          # Newsletter generator component
├── social-media-generator.tsx        # Social media generator component
├── form-generator.tsx                # Form generator component
├── calendar-generator.tsx            # Calendar generator component
├── brochure-generator.tsx            # Brochure generator component
├── menu-generator.tsx                # Menu generator component
├── invitation-generator.tsx          # Invitation generator component
└── id-card-generator.tsx             # ID card generator component
```

## Page Structure Pattern

Each document type page follows this pattern:

```tsx
'use client';

import { SiteHeader } from '@/components/site-header';
import { [Type]Generator } from '@/components/more/[type]-generator';
import { Sparkles, [Icon], Wand2 } from 'lucide-react';

export default function [Type]Page() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 mesh-gradient opacity-20"></div>
      <div className="floating-orb ..."></div>
      
      <SiteHeader />
      
      <main className="flex-1 relative z-10 ...">
        <div className="container ...">
          {/* Header section with title and description */}
          <div className="text-center mb-8 sm:mb-12">
            {/* Badge */}
            {/* Title with gradient */}
            {/* Description */}
            {/* Stats bar */}
          </div>
          
          {/* Generator container */}
          <div className="glass-effect ...">
            <[Type]Generator />
          </div>
        </div>
      </main>
    </div>
  );
}
```

## Generator Component Pattern

Each generator component follows this pattern:

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';

export function [Type]Generator() {
  const [data, setData] = useState({
    // State for form fields
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6 mt-6">
          {/* Form inputs */}
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          {/* Live preview */}
          {/* Download button */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## URL Structure

```
/more                                 → Main landing page
/more/business-card                   → Business card generator
/more/flyer                           → Flyer generator
/more/contract                        → Contract generator
/more/report                          → Report generator
/more/newsletter                      → Newsletter generator
/more/social-media                    → Social media graphics generator
/more/form                            → Form generator
/more/calendar                        → Calendar generator
/more/brochure                        → Brochure generator
/more/menu                            → Menu generator
/more/invitation                      → Invitation generator
/more/id-card                         → ID card generator
```

## Component Hierarchy

```
Page Component
└── SiteHeader (from @/components/site-header)
└── Main Container
    ├── Header Section
    │   ├── Badge
    │   ├── Title with Gradient
    │   ├── Description
    │   └── Stats Bar
    │
    └── Generator Container (glass-effect)
        └── Generator Component
            └── Tabs
                ├── Design Tab
                │   └── Form Inputs
                │       ├── Basic Info
                │       ├── Content
                │       ├── Design Options
                │       └── Actions
                │
                └── Preview Tab
                    ├── Preview Display
                    └── Download Button
```

## Shared Components Used

### UI Components (from shadcn/ui)
- `Button`
- `Input`
- `Label`
- `Textarea`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`

### Icons (from lucide-react)
- `Sparkles` - For badges and accents
- `Wand2` - Animated icon in titles
- `Download` - Export buttons
- `Plus` - Add buttons
- `X` - Remove buttons
- Document-specific icons for each type

### Custom Components
- `SiteHeader` - Main navigation header
- Various generator components in `/components/more/`

## Styling Approach

### Utility Classes Used
- `glass-effect` - Frosted glass background
- `bolt-gradient` - Blue-to-yellow gradient background
- `bolt-gradient-text` - Gradient text effect
- `shimmer` - Animated shimmer effect
- `floating-orb` - Animated floating elements
- `mesh-gradient` - Background mesh pattern

### Color Scheme
- Primary: `#3b82f6` (blue-500)
- Accent: `#eab308` (yellow-500)
- Gradients: Various from blue to yellow
- Backgrounds: White/gray with opacity

### Responsive Breakpoints
- Mobile: Default
- Tablet: `sm:` (640px)
- Desktop: `md:` (768px), `lg:` (1024px)

## Data Flow

```
User Input (Form)
    ↓
State Update (useState)
    ↓
Live Preview Update
    ↓
Export/Download
```

## Key Features Per Document Type

1. **Business Card**: QR codes, layouts, social media
2. **Flyer**: Templates, sizes, colors
3. **Contract**: Clauses, parties, signatures
4. **Report**: Sections, executive summary
5. **Newsletter**: Articles, content blocks
6. **Social Media**: Platform presets, dimensions
7. **Form**: Dynamic fields, field types
8. **Calendar**: Month/year selection, grid
9. **Brochure**: Fold types, sections
10. **Menu**: Categories, items, prices
11. **Invitation**: Event types, RSVP
12. **ID Card**: Photo, organization, validity

## Integration Points

### Navigation
- Added to `components/nav/nav-items.ts`
- Icon: `Plus` from lucide-react
- Position: Between Templates and Documentation

### Homepage
- Link in `components/document-types-section.tsx`
- "Explore More Types" button added
- Positioned after main document types

## Maintenance Guide

### Adding a New Document Type

1. Create page: `app/more/[type]/page.tsx`
2. Create generator: `components/more/[type]-generator.tsx`
3. Update main page: Add card to `app/more/page.tsx`
4. Add icon: Import from lucide-react
5. Follow existing patterns for consistency
6. Update README documentation

### Modifying Existing Types

1. Locate generator in `components/more/`
2. Update state interface if needed
3. Modify form fields in Design tab
4. Update preview rendering in Preview tab
5. Test in both light and dark modes
6. Verify mobile responsiveness
