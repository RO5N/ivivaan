const webpack = require('webpack');
// Initialize doteenv library
require('dotenv').config();

module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));
    return config;
  },
};