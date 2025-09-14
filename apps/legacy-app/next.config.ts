const { NEXT_PUBLIC_NEW_APP_URL } = process.env;

if (NEXT_PUBLIC_NEW_APP_URL) {
  console.log(`Redirecting all requests to ${NEXT_PUBLIC_NEW_APP_URL}`);
}

if (!NEXT_PUBLIC_NEW_APP_URL) {
  console.log('No redirect URL specified. Skipping redirect.');
}

module.exports = {
  async redirects() {
    if (!NEXT_PUBLIC_NEW_APP_URL) {
      return [];
    }

    return [
      {
        source: '/',
        destination: NEXT_PUBLIC_NEW_APP_URL,
        permanent: false,
      },
      {
        source: '/:path*',
        destination: `${NEXT_PUBLIC_NEW_APP_URL}/:path*`,
        permanent: false,
      },
    ];
  },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:3000/api/:path*',
  //     },
  //   ];
  // },
};
