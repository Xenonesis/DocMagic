import {
  File as FileIcon,
  FileText,
  Presentation as LayoutPresentation,
  Mail as MailIcon,
  DollarSign,
  Workflow,
  Palette,
  QrCode,
  Code,
  Award,
  Receipt,
  BookOpen,
  Plus,
} from 'lucide-react';

export const navItems = [
  {
    href: '/resume',
    label: 'Resume',
    icon: FileIcon,
    tooltip: 'Create professional resumes with AI assistance',
  },
  {
    href: '/presentation',
    label: 'Presentation',
    icon: LayoutPresentation,
    tooltip: 'Generate stunning slide presentations instantly',
  },
  {
    href: '/cv',
    label: 'CV',
    icon: FileText,
    tooltip: 'Build comprehensive curriculum vitae for academic positions',
  },
  {
    href: '/letter',
    label: 'Letter',
    icon: MailIcon,
    tooltip: 'Write professional letters and cover letters',
  },
  {
    href: '/certificate',
    label: 'Certificate',
    icon: Award,
    tooltip: 'Design awards and achievement certificates',
  },
  {
    href: '/invoice',
    label: 'Invoice',
    icon: Receipt,
    tooltip: 'Create invoices with tax, discounts, and export',
  },
  {
    href: '/diagram',
    label: 'Diagram',
    icon: Workflow,
    tooltip: 'Create flowcharts, architectures, and Mermaid diagrams',
  },
  {
    href: '/icon',
    label: 'Icon',
    icon: Palette,
    tooltip: 'Generate custom AI-powered icons and graphics',
  },
  {
    href: '/qr',
    label: 'QR Code',
    icon: QrCode,
    tooltip: 'Create custom QR codes with styling options',
  },
  {
    href: '/formatter',
    label: 'Formatter',
    icon: Code,
    tooltip: 'Format and validate text and JSON data',
  },
  {
    href: '/templates',
    label: 'Templates',
    icon: FileText,
    tooltip: 'Browse and manage document templates',
  },
  {
    href: '/more',
    label: 'More',
    icon: Plus,
    tooltip: 'Explore more document types and tools',
  },
  {
    href: '/documentation',
    label: 'Docs',
    icon: BookOpen,
    tooltip: 'Documentation and guides',
  },
  {
    href: '/pricing',
    label: 'Pricing',
    icon: DollarSign,
    tooltip: 'View pricing plans and upgrade options',
  },
];

export type NavItem = (typeof navItems)[number];
