module.exports = {
    basePath: '/attendance',
    trailingSlash: true,
    // assetPrefix: "/attendance",
    reactStrictMode: false,
    serverRuntimeConfig: {
        secret: 'a'
    },
    publicRuntimeConfig: {
        baseUrl: process.env.NODE_ENV === 'development'
            ? 'https://webdev.cse.buffalo.edu/attendance'
            : 'https://webdev.cse.buffalo.edu/attendance'
            //    ? 'http://stark.cse.buffalo.edu:23200/api/v1'
            //    : 'http://stark.cse.buffalo.edu:23200/api/v1'
            // ? 'http://52.86.41.7:3000/api/v1'
            // : 'http://52.86.41.7:3000/api/v1'
    },
    images : {
        "unoptimized":true,
        remotePatterns : [{
            protocol: 'https',
            hostname: 'stark.cse.buffalo.edu',
            port: '',
            pathname: '**',
        },{
            protocol: 'https',
            hostname: 'webdev.cse.buffalo.edu',
            port: '',
            pathname: '**',
        }],
    },
    // async redirects() {
    //     return [
    //       {
    //         source: '/',
    //         destination: '/myProfile',
    //         permanent: true,
    //       },
    //     ]
    //   },
}
