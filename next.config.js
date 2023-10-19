/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'tm-web.effisoftsolutions.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

module.exports = nextConfig;
