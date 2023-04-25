import legacyPlugin from 'vite-plugin-legacy';

export default {
  rollupOutputOptions: {
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    assetFileNames: '[name].[ext]',
  },
  plugins: [
    // The default options are listed below. Pass nothing to use them.
    legacyPlugin({
      // The browsers that must be supported by your legacy bundle.
      // https://babeljs.io/docs/en/babel-preset-env#targets
      targets: [
        '> 0.5%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
      ],
      // Define which polyfills your legacy bundle needs. They will be loaded
      // from the Polyfill.io server. See the "Polyfills" section for more info.
      polyfills: [
        // Empty by default
      ],
      // Toggles whether or not browserslist config sources are used.
      // https://babeljs.io/docs/en/babel-preset-env#ignorebrowserslistconfig
      ignoreBrowserslistConfig: false,
      // When true, core-js@3 modules are inlined based on usage.
      // When false, global namespace APIs (eg: Object.entries) are loaded
      // from the Polyfill.io server.
      corejs: false,
    }),
  ],
};
