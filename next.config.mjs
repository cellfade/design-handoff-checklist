/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['your-allowed-domain.com', 'api.urlmeta.org'],
    },
  };

export default nextConfig;