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
      cleanupOutdatedCaches: true,
      navigateFallback: 'src/main/resources/static/templates/index.html',
      runtimeCaching: [
        {
          urlPattern: new RegExp('/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'app-frontend',
            plugins: [
              {
                cacheDidUpdate: {
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
              },
            ],
          },
        },
        {
            urlPattern: new RegExp('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-api',
              networkTimeoutSeconds: 10,
          },
        },
        {
          urlPattern: new RegExp('/site.webmanifest'),
          handler: 'NetworkOnly',
          options: {
            cacheName: 'app-manifest',
            networkTimeoutSeconds: 60,
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
