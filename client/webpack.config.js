const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = {
  mode: 'development',
  entry: {
    main: './src/js/index.js',
    install: './src/js/install.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      title: 'Just Another Test Editor'
    }),
    new MiniCssExtractPlugin(),
    new WorkboxPlugin.GenerateSW({
      swDest: path.resolve('dist/service-worker.js'),
      exclude: [/\.(?:png|jpg|jpeg|svg)$/],
      // Run-time caching:
      runtimeCaching: [{
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
        handler: 'CacheFirst',

        options: {
          // Use a custom cache name.
          cacheName: 'images-and-such',

          // Only cache 2 images.
          expiration: {
            maxEntries: 210,
          },
        }
      }]
    }),
    // new InjectManifest({
    //   swSrc: './src-sw.js',
    //   swDest: 'service-worker.js'
    // }),
    new WebpackPwaManifest({
      name: 'Just Another Text Editor',
      short_name: 'jite',
      description: 'It\'s seriously just another text editor.',
      background_color: '#7eb4e2',
      theme_color: '#7eb4e2',
      start_url: '/',
      publicPath: '/',
      fingerprints: false,
      icons: [
        {
          src: path.resolve('src/images/logo.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join('assets', 'icons'),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpeg|jpg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      },
    ],
  },
};
