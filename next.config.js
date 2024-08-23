const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  // Other Next.js configuration options...
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // Ensure NodePolyfillPlugin is applied correctly
    config.plugins = [
      ...config.plugins,
      new NodePolyfillPlugin(),
    ];

    // Add fallback for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      assert: require.resolve('assert/'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      url: require.resolve('url/'),
    };

    return config;
  },
};