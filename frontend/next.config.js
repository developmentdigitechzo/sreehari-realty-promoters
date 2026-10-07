/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
      {
        source: '/login',
        destination: '/admin/login',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/admin/dashboard',
        permanent: false,
      },
      {
        source: '/leads',
        destination: '/admin/leads',
        permanent: false,
      },
      {
        source: '/plots',
        destination: '/projects',
        permanent: false,
      },
      {
        source: '/properties',
        destination: '/projects',
        permanent: false,
      },
      {
        source: '/admin/plots',
        destination: '/admin/properties',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
