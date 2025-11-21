module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Add rule to ignore source maps from node_modules
      webpackConfig.module.rules.push({
        test: /\.(js|ts|mjs|cjs|tsx|jsx|mts|cts)$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/
      })
      
      // Set source maps based on environment
      if (env === 'production') {
        webpackConfig.devtool = false  // No source maps in production
      } else {
        webpackConfig.devtool = 'source-map'  // Full source maps in dev
      }
      
      // Ignore warnings from source-map-loader for node_modules
      webpackConfig.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          )
        },
      ]

      return webpackConfig
    }
  }
}
