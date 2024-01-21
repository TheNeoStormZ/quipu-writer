const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/main/js/App.js',
  devtool: 'sourcemaps',
  cache: true,
  mode: 'development',
  output: {
    path: __dirname,
    filename: './src/main/resources/static/built/bundle.js',
  },
  plugins: [
    new WorkboxPlugin.GenerateSW({
      swDest: 'src/main/resources/static/sw.js',
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: 'src/main/resources/static/templates/index.html',
      runtimeCaching: [
        {
          urlPattern: new RegExp('.*'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'all-requests-cache',
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: path.join(__dirname, '.'),
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
    ],
  },
};
