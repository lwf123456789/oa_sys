/** @type {import('next').NextConfig} */
const nextConfig = {
    // i18n: {
    //     locales: ['zh', 'en'],
    //     defaultLocale: 'zh',
    // },
    images: {
        unoptimized: true,
    },
    reactStrictMode: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    compress: true
    // images: {
    //     domains: ['www.yaozs.com'],
    // }
}
module.exports = nextConfig
