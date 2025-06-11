module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Add rule to ignore source maps from node_modules
      webpackConfig.module.rules.push({
        // js and ts files
        test: /\.(js|ts|mjs|cjs|tsx|jsx|mts|cts)$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/
      })
      // Tell Webpack to still generate source maps for your own code
      webpackConfig.devtool = 'source-map'
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
