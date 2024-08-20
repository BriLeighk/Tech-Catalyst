module.exports = {
    // Other Next.js configuration options...
    webpack: (config, { isServer }) => {
      config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
      });
  
      return config;
    },
  };