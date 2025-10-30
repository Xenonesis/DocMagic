# More Document Types

This directory contains additional document creation tools beyond the core offerings (Resume, CV, Letter, Presentation).

## Available Document Types

### 1. Business Cards (`/more/business-card`)
Create professional contact cards with customizable layouts.

**Features:**
- Multiple layout styles (Modern, Classic, Minimal, Creative)
- QR code integration for vCard data
- Custom color schemes
- Social media integration (LinkedIn, Twitter)
- Print-ready output

### 2. Flyers & Posters (`/more/flyer`)
Design eye-catching marketing materials with drag-and-drop elements.

**Features:**
- Multiple templates (Event, Sale, Announcement, Business)
- Size options (Letter, A4, Poster)
- Custom color schemes
- High-resolution export
- Responsive layouts

### 3. Contracts & Agreements (`/more/contract`)
Generate legal document templates with clause libraries.

**Features:**
- Multiple contract types (Service, Employment, NDA, Freelance, Rental)
- Standard clause library
- Custom clause support
- Multi-party contracts
- E-signature ready format

### 4. Reports & Proposals (`/more/report`)
Create structured business documents with professional formatting.

**Features:**
- Multiple report types (Business, Proposal, Analysis, Financial)
- Executive summary section
- Multi-section support
- Professional formatting
- Export to PDF

### 5. Newsletters (`/more/newsletter`)
Design email and newsletter templates with content blocks.

**Features:**
- Content block system
- Responsive design
- Multiple article support
- Custom branding colors
- HTML export

### 6. Social Media Graphics (`/more/social-media`)
Create platform-specific image templates optimized for each social network.

**Features:**
- Platform presets (Instagram, Facebook, Twitter, LinkedIn, Pinterest)
- Optimized dimensions for each platform
- Custom text layouts
- Brand color integration
- Multiple layout options

### 7. Forms & Surveys (`/more/form`)
Build customizable forms with response collection capabilities.

**Features:**
- Multiple field types (Text, Email, Textarea, Select)
- Drag-and-drop field builder
- Form validation support
- Custom styling
- Preview mode

### 8. Calendars & Planners (`/more/calendar`)
Create monthly and yearly calendars with event integration.

**Features:**
- Monthly/yearly views
- Custom themes and colors
- Event integration support
- Print and digital formats
- Multiple year support

### 9. Brochures & Pamphlets (`/more/brochure`)
Design multi-page marketing materials with professional layouts.

**Features:**
- Multiple fold types (Tri-fold, Bi-fold, Z-fold)
- Multi-section support
- Image gallery integration
- Professional templates
- Print-ready output

### 10. Menus & Price Lists (`/more/menu`)
Create restaurant and hotel menu templates with pricing.

**Features:**
- Category organization
- Item descriptions and pricing
- Photo menu support
- Multiple categories
- Professional formatting

### 11. Event Invitations (`/more/invitation`)
Design customizable invitation cards for various events.

**Features:**
- Multiple event types (Wedding, Birthday, Corporate, Graduation, Baby Shower)
- RSVP information
- Custom color schemes
- Date and venue details
- Digital and print formats

### 12. ID Cards & Badges (`/more/id-card`)
Create employee and student ID templates with photo integration.

**Features:**
- Multiple card types (Employee, Student, Visitor, Contractor)
- Photo upload support
- Barcode/QR code integration
- Security features
- Organization branding

## Architecture

Each document type follows a consistent structure:

```
app/more/[document-type]/
  page.tsx                 # Main page component
components/more/
  [document-type]-generator.tsx  # Generator component
```

### Common Patterns

1. **Tabs Interface**: All generators use a tabbed interface with "Design" and "Preview" tabs
2. **Form-based Input**: Design tab contains form inputs for document content
3. **Live Preview**: Preview tab shows real-time rendering of the document
4. **Export Functionality**: Download/export buttons for saving the created document
5. **Consistent Styling**: All pages match the main website's UI/UX with glass effects, gradients, and animations

## UI/UX Features

- **Glass Effect Panels**: Translucent background with blur effects
- **Bolt Gradient Text**: Yellow-to-blue gradient for important text
- **Animated Elements**: Floating orbs, shimmer effects, and hover animations
- **Responsive Design**: Mobile-first approach with breakpoints for tablets and desktops
- **Dark Mode Support**: Full dark mode compatibility
- **Loading States**: Skeleton loaders for better perceived performance

## Future Enhancements

- AI-powered content generation for each document type
- Template library for quick starts
- Collaboration features for multi-user editing
- Cloud storage integration
- Advanced export options (multiple formats)
- Print optimization tools
- Mobile app versions

## Contributing

When adding new document types:

1. Create the page component in `app/more/[type]/page.tsx`
2. Create the generator component in `components/more/[type]-generator.tsx`
3. Follow the existing UI/UX patterns
4. Update the main `/more` page to include the new type
5. Add appropriate icons from lucide-react
6. Test in both light and dark modes
7. Ensure mobile responsiveness

## License

MIT License - See LICENSE file for details
