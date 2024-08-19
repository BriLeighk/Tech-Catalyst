module.exports = {
    // Other Next.js configuration options...
    experiments: {
      asyncWebAssembly: true,
      // or syncWebAssembly: true, if you prefer synchronous WebAssembly
    },
    webpack: (config, { isServer }) => {
      config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
      });
  
      return config;
    },
  };