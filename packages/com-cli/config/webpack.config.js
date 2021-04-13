const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const webpackHotMiddlewareClient = require.resolve('webpack-hot-middleware/client')
const { paths } = require('@touchds/com-utils/node')
const { resolve } = require('./utils')

module.exports = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    entry: [`${webpackHotMiddlewareClient}?reload=true`, resolve('src/preview.js')],
    output: {
        path: resolve('dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            cacheDirectory: true,
                            configFile: resolve('babel.config.js')
                        }
                    }
                ],
                include: [resolve('src'), paths.resolve('')]
            },
            {
                test: /\.(tsx|ts)$/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            cacheDirectory: true
                        }
                    },
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            configFile: resolve('tsconfig.json')
                        }
                    }
                ],
                include: [resolve('src'), paths.resolve('')]
            },
            {
                test: /\.css$/,
                use: [require.resolve('style-loader'), require.resolve('css-loader')],
                include: [resolve('node_modules/monaco-editor'), resolve('node_modules/@touchds/com-field/dist')]
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]'
                            }
                        }
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            config: {
                                path: resolve('postcss.config.js')
                            }
                        }
                    }
                ],
                include: [resolve('src'), paths.resolve('')]
            },
            {
                test: /\.less$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]'
                            }
                        }
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            config: {
                                path: resolve('postcss.config.js')
                            }
                        }
                    },
                    require.resolve('less-loader')
                ],
                include: [resolve('src'), paths.resolve('')]
            },
            {
                test: /\.(jpe?g|png|ico|gif|woff|woff2|eot|ttf|otf|svg|swf)$/,
                use: [
                    {
                        loader: require.resolve('file-loader'),
                        options: {
                            limit: 4000,
                            name: 'images/[name][hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@babel/runtime': resolve('node_modules/@babel/runtime'),
            '@component-entry': paths.resolve('index.js') // 让cli可以使用当前目录的入口文件
        }
    },
    plugins: [
        // webpack热更新组件
        new webpack.HotModuleReplacementPlugin(),

        new MonacoWebpackPlugin({
            languages: ['json']
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('src/index.html'), // 模板路径
            inject: true, // js插入位置
            chunksSortMode: 'none',
            chunks: ['manifest', 'vendor', resolve('src/preview.js')],
            hash: true
        })
    ]
}
