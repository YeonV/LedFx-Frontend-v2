const path = require('path')

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // CRITICAL: Ensure only ONE copy of React/ReactDOM exists
      // Remove ModuleScopePlugin to allow aliasing to node_modules
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        plugin => plugin.constructor.name !== 'ModuleScopePlugin'
      )
      
      // Force all React imports to use the same instance
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom')
      }
      
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
