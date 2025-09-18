/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/carga-termica-saas' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/carga-termica-saas' : '',
}

module.exports = nextConfig