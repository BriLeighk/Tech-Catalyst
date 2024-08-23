module.exports = {
  // Other Next.js configuration options...
  images: {
    domains: ['firebasestorage.googleapis.com', 'logo.clearbit.com'],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    return config;
  },
};