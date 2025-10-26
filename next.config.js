import withPWACore from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: false,
    domains: ['bxiieunzrcdbxqadapcl.supabase.co'],
  },
  trailingSlash: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: https://image.pollinations.ai https://pollinations.ai; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://api.stripe.com https://generativelanguage.googleapis.com https://image.pollinations.ai https://pollinations.ai https://api.openrouter.ai https://openrouter.ai https://vercel.live; frame-src https://js.stripe.com; worker-src 'self' blob:;",
          },
          {
            key: 'Permissions-Policy',
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=(), accelerometer=(), autoplay=(), clipboard-read=(), clipboard-write=(), fullscreen=*, magnetometer=(), payment=(), usb=()",
          }
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    tsconfigPath: './tsconfig.build.json',
    ignoreBuildErrors: true,
  },
};

const withPWA = withPWACore({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA(nextConfig);
