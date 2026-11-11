const path = require("path");
const allowedImageWordPressDomain = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false, // Remove X-Powered-By header
  
  // Configure webpack for development and to handle module resolution
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    // Ensure proper resolution of moment.js and other problematic imports
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    // Add bundle analyzer in production when needed
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      );
    }
    
    // Tree shake unused CSS
    if (!dev && !isServer) {
      // Find the TerserPlugin in the webpack config
      const terserPluginIndex = config.optimization.minimizer.findIndex(
        (plugin) => plugin.constructor.name === 'TerserPlugin'
      );
      
      if (terserPluginIndex > -1) {
        // Get the TerserPlugin instance
        const terserPlugin = config.optimization.minimizer[terserPluginIndex];
        
        // Update the terserOptions to remove console.log and debugger statements
        terserPlugin.options.terserOptions = {
          ...terserPlugin.options.terserOptions,
          compress: {
            ...terserPlugin.options.terserOptions.compress,
            drop_console: true,
            drop_debugger: true,
          },
        };
      }
      
      // Enable module concatenation for better tree shaking
      config.optimization.concatenateModules = true;
    }
    
    return config;
  },
  
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  /**
   * We specify which domains are allowed to be optimized.
   * This is needed to ensure that external urls can't be abused.
   * @see https://nextjs.org/docs/basic-features/image-optimization#domains
   */
  images: {
    domains: [allowedImageWordPressDomain, 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year for static images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loaderFile: './src/image/index.js', // Custom image loader to optimize LCP
  },
  // Add security headers and caching policies
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Add caching headers for static assets
      {
        source: '/img/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
    ];
  },
  // Enable SWC minification
  swcMinify: true,
  // Ignore ESLint errors during production build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Transpile modules - using a more targeted list for Ant Design v4
  transpilePackages: [
    'antd',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-table',
    'rc-tree',
    'rc-select',
    'rc-field-form',
    'rc-dropdown',
    'rc-menu',
    'rc-virtual-list'
  ],
};

module.exports = nextConfig;
