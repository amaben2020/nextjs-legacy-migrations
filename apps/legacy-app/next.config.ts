import { NextConfig } from 'next';

const { NEXT_PUBLIC_NEW_APP_URL } = process.env;

if (NEXT_PUBLIC_NEW_APP_URL) {
  console.log(`Redirecting all requests to ${NEXT_PUBLIC_NEW_APP_URL}`);
}

if (!NEXT_PUBLIC_NEW_APP_URL) {
  console.log('No redirect URL specified. Skipping redirect.');
}

const nextConfig: NextConfig = {
  transpilePackages: ['mobile'],
  async redirects() {
    if (!NEXT_PUBLIC_NEW_APP_URL) {
      return [];
    }
    return [
      // {
      //   source: '/',
      //   destination: NEXT_PUBLIC_NEW_APP_URL,
      //   permanent: false,
      // },
      // {
      //   source: '/:path*',
      //   destination: `${NEXT_PUBLIC_NEW_APP_URL}/:path*`,
      //   permanent: false,
      // },
    ];
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/',
  //       destination: `${NEXT_PUBLIC_NEW_APP_URL}`,
  //     },
  //   ];
  // },
};
module.exports = nextConfig;
