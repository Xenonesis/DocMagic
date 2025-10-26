import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'https://docverse-psi.vercel.app';
  const baseUrl = base.startsWith('http') ? base : `https://${base}`;
  const now = new Date();

  const staticRoutes = [
    '',
    'about',
    'contact',
    'pricing',
    'documentation',
    'templates',
    'resume',
    'presentation',
    'cv',
    'letter',
    'icon',
    'diagram',
    'invoice',
    'qr',
  ];

  return staticRoutes.map((path) => ({
    url: `${baseUrl}/${path}`.replace(/\/$/, ''),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}
