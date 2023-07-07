// webpack.base.js
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { getDotEnvObject } = require('../scripts/get_dotenv')
const swcLoader = 'swc-loader'
const swcConfig = require('../../.swcrc.js')

const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式
const env = process.env.APP_ENV
module.exports = {
  entry: path.resolve(__dirname, '/src/render/index.tsx'), // 入口文件
  // 打包文件出
  output: {
    filename: '[name].js', // 每个输出js的名称
    path: path.resolve(__dirname, '/dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/', // 打包后文件的公共前缀路径
  },
  module: {
    rules: [
      // {
      //   test: /.(ts|tsx)$/,
      //   use: ['thread-loader', 'babel-loader'],
      //   include: [path.resolve(__dirname, '../src')], // 只对项目src文件的ts,tsx进行loader解析
      // },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: swcLoader,
        options: swcConfig(isDev),
        exclude: /node_modules/,
      },
      {
        test: /.(css|less)$/,
        exclude: /\.module\.less$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // style-loader是通过一个JS脚本创建一个style标签，需要先css-loader解析 css 之前的依赖关系
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.module\.less$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // style-loader是通过一个JS脚本创建一个style标签，需要先css-loader解析 css 之前的依赖关系
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '/public/index.html'), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    new webpack.DefinePlugin({
      APP_ENV: JSON.stringify(process.env.APP_ENV),
      env: getDotEnvObject(env),
    }),
  ],
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
    modules: ['node_modules', './node_modules', './node_modules/.pnpm'],
    alias: {
      src: path.join(__dirname, '../../', 'src'),
      render: path.join(__dirname, '../../', 'src/render'),
      main: path.join(__dirname, '../../', 'src/main'),
    },
    // modules: [path.resolve(__dirname, '../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
  },
  cache: {
    type: 'filesystem', // 使用文件缓存，提升开发、构建速度，新增了持久化缓存（改进缓存算法等优化,持久化缓存,来缓存生成的 webpack 模块和 chunk），缓存的存储位置在node_modules/.cache/webpack,里面又区分了development和production缓存
  },
  // stats: {
  //   exclude: ['./node_modules/.pnpm/**'],
  // },
  stats: {
    modules: false,
  },
}
