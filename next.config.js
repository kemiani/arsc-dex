/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  generateBuildId: () => 'build',
  // External packages for server components
  serverExternalPackages: [],
  // Disable output file tracing
  output: undefined,
  images: {
    domains: ['assets.coingecko.com', 'raw.githubusercontent.com'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config, { isServer }) => {
    // Ignore optional dependencies that cause warnings
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    };
    
    config.externals = config.externals || [];
    config.externals.push({
      'pino-pretty': 'commonjs pino-pretty'
    });
    
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
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
    ];
  },
};

module.exports = nextConfig;